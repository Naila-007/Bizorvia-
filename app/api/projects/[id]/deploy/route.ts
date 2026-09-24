import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

// Deploy a ZIP file to Supabase Storage for a user's project
// POST /api/projects/[id]/deploy
// Body: multipart/form-data with a "file" field containing a .zip
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check — must be logged in
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Create admin client for storage operations
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify project belongs to this user
    const { data: project, error: projectError } = await adminSupabase
      .from("projects")
      .select("id, slug, user_id, name")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse the uploaded ZIP
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "File must be a .zip" }, { status: 400 });
    }

    // 50MB limit
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "ZIP exceeds 50MB limit" }, { status: 413 });
    }

    const zipBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipBuffer);

    const slug = project.slug;
    const uploaded: string[] = [];
    const errors: string[] = [];

    // First, delete existing files for this site
    const { data: existingFiles } = await adminSupabase.storage
      .from("bizorvia-sites")
      .list(`sites/${slug}`);

    if (existingFiles && existingFiles.length > 0) {
      const toDelete = existingFiles.map((f) => `sites/${slug}/${f.name}`);
      await adminSupabase.storage.from("bizorvia-sites").remove(toDelete);
    }

    // Upload each file from the ZIP
    const uploadPromises: Promise<void>[] = [];

    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return; // skip directories

      // Sanitize path
      const cleanPath = relativePath.replace(/^\/+/, "").replace(/\.\.\//g, "");
      if (!cleanPath) return;

      const promise = zipEntry
        .async("arraybuffer")
        .then(async (content) => {
          const ext = cleanPath.split(".").pop()?.toLowerCase() ?? "";
          const mimeMap: Record<string, string> = {
            html: "text/html",
            css:  "text/css",
            js:   "application/javascript",
            json: "application/json",
            svg:  "image/svg+xml",
            png:  "image/png",
            jpg:  "image/jpeg",
            jpeg: "image/jpeg",
            gif:  "image/gif",
            webp: "image/webp",
            ico:  "image/x-icon",
            woff: "font/woff",
            woff2:"font/woff2",
            ttf:  "font/ttf",
            txt:  "text/plain",
          };
          const contentType = mimeMap[ext] ?? "application/octet-stream";
          const storagePath = `sites/${slug}/${cleanPath}`;

          const { error } = await adminSupabase.storage
            .from("bizorvia-sites")
            .upload(storagePath, content, {
              contentType,
              upsert: true,
            });

          if (error) {
            errors.push(`${cleanPath}: ${error.message}`);
          } else {
            uploaded.push(cleanPath);
          }
        });

      uploadPromises.push(promise);
    });

    await Promise.all(uploadPromises);

    // Update project record with deploy timestamp
    await adminSupabase
      .from("projects")
      .update({
        last_deployed_at: new Date().toISOString(),
        file_count: uploaded.length,
        status: errors.length === 0 ? "deployed" : "partial",
      })
      .eq("id", params.id);

    const siteUrl = `https://bizorvia.com/api/site/${slug}`;

    return NextResponse.json({
      success: true,
      slug,
      siteUrl,
      filesUploaded: uploaded.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[deploy] Error:", err);
    return NextResponse.json({ error: "Deploy failed" }, { status: 500 });
  }
}
