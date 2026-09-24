import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// MIME type map for common web file types
function getMimeType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    html: "text/html; charset=utf-8",
    htm:  "text/html; charset=utf-8",
    css:  "text/css; charset=utf-8",
    js:   "application/javascript; charset=utf-8",
    mjs:  "application/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    ts:   "application/typescript",
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
    otf:  "font/otf",
    pdf:  "application/pdf",
    xml:  "application/xml",
    txt:  "text/plain; charset=utf-8",
    md:   "text/markdown; charset=utf-8",
    mp4:  "video/mp4",
    webm: "video/webm",
    mp3:  "audio/mpeg",
    wav:  "audio/wav",
  };
  return map[ext] ?? "application/octet-stream";
}

// Serve files from Supabase Storage for user-hosted sites
// URL pattern: /api/site/[slug]/[...path]
// e.g. /api/site/my-store/products/index.html
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; path?: string[] } }
) {
  try {
    const { slug, path } = params;

    // Sanitize slug — only allow alphanumeric, hyphens, underscores
    if (!/^[a-z0-9_-]+$/i.test(slug)) {
      return NextResponse.json({ error: "Invalid site name" }, { status: 400 });
    }

    // Build file path, defaulting to index.html
    const filePath = path?.length ? path.join("/") : "index.html";

    // Prevent directory traversal
    if (filePath.includes("..")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for storage access
    );

    const storagePath = `sites/${slug}/${filePath}`;

    const { data, error } = await supabase.storage
      .from("bizorvia-sites")
      .download(storagePath);

    if (error || !data) {
      // If file not found, try index.html in that directory (SPA fallback)
      if (!filePath.includes(".") || filePath.endsWith("/")) {
        const fallback = filePath.replace(/\/?$/, "/index.html");
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from("bizorvia-sites")
          .download(`sites/${slug}/${fallback}`);

        if (!fallbackError && fallbackData) {
          const bytes = await fallbackData.arrayBuffer();
          return new NextResponse(bytes, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=60",
              "X-Powered-By": "Bizorvia",
            },
          });
        }
      }

      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const bytes = await data.arrayBuffer();
    const mimeType = getMimeType(filePath);

    // Cache HTML for 60s, assets for 1 hour
    const isAsset = /\.(css|js|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|svg)$/i.test(filePath);
    const cacheControl = isAsset
      ? "public, max-age=3600, stale-while-revalidate=86400"
      : "public, max-age=60, stale-while-revalidate=300";

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": cacheControl,
        "X-Powered-By": "Bizorvia",
      },
    });
  } catch (err) {
    console.error("[site-server] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
