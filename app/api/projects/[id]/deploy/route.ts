import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';

function getAnonClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
async function getAuthUser(token: string) {
  const { data: { user }, error } = await getAnonClient().auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Splitting on "/" and dropping ".." / "." / empty segments closes path
// traversal completely, unlike a single `.replace(/\.\.\//g, '')` pass —
// that older approach left a classic bypass: "....//....//x" becomes
// "../../x" after one pass, because the removal isn't re-scanned.
function sanitizeZipEntryPath(relativePath: string): string {
  return relativePath
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .join('/');
}

// GET — deploy history for a project
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getAuthUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: project } = await admin
    .from('projects')
    .select('id, slug, status, last_deployed_at, file_count, url, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const deploys = project.last_deployed_at
    ? [{
        id: project.id,
        state: project.status === 'deployed' ? 'ready' : project.status,
        created_at: project.last_deployed_at,
        ssl_url: project.url,
        file_count: project.file_count,
      }]
    : [];

  return NextResponse.json({ deploys });
}

// POST — deploy a ZIP file
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getAuthUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    const admin = getAdminClient();

    const { data: project, error: projectError } = await admin
      .from('projects')
      .select('id, slug, user_id, name')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!file.name.endsWith('.zip')) return NextResponse.json({ error: 'File must be a .zip' }, { status: 400 });

    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'ZIP exceeds 50MB limit' }, { status: 413 });

    const zipBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipBuffer);

    const slug = project.slug;
    const uploaded: string[] = [];
    const errors: string[] = [];

    const { data: existingFiles } = await admin.storage.from('bizorvia-sites').list(`sites/${slug}`);
    if (existingFiles && existingFiles.length > 0) {
      const toDelete = existingFiles.map((f) => `sites/${slug}/${f.name}`);
      await admin.storage.from('bizorvia-sites').remove(toDelete);
    }

    const mimeMap: Record<string, string> = {
      html: 'text/html', css: 'text/css', js: 'application/javascript',
      json: 'application/json', svg: 'image/svg+xml', png: 'image/png',
      jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
      webp: 'image/webp', ico: 'image/x-icon', woff: 'font/woff',
      woff2: 'font/woff2', ttf: 'font/ttf', txt: 'text/plain',
    };

    const uploadPromises: Promise<void>[] = [];
    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return;
      const cleanPath = sanitizeZipEntryPath(relativePath);
      if (!cleanPath) return;

      const promise = zipEntry.async('arraybuffer').then(async (content) => {
        const ext = cleanPath.split('.').pop()?.toLowerCase() ?? '';
        const contentType = mimeMap[ext] ?? 'application/octet-stream';
        const storagePath = `sites/${slug}/${cleanPath}`;
        const { error } = await admin.storage.from('bizorvia-sites').upload(storagePath, content, { contentType, upsert: true });
        if (error) errors.push(`${cleanPath}: ${error.message}`);
        else uploaded.push(cleanPath);
      });
      uploadPromises.push(promise);
    });

    await Promise.all(uploadPromises);

    const siteUrl = `https://sites.bizorvia.com/${slug}`;

    await admin.from('projects').update({
      last_deployed_at: new Date().toISOString(),
      file_count: uploaded.length,
      status: errors.length === 0 ? 'deployed' : 'partial',
      url: siteUrl,
    }).eq('id', id);

    return NextResponse.json({ success: true, slug, siteUrl, filesUploaded: uploaded.length, errors: errors.length > 0 ? errors : undefined });
  } catch (err) {
    console.error('[deploy] Error:', err);
    return NextResponse.json({ error: 'Deploy failed' }, { status: 500 });
  }
}
