'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type FileItem = { name: string; size: number; type: string; createdAt: string; path: string };
type StorageState = { files: FileItem[]; totalBytes: number; limitBytes: number };

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function fileIcon(type: string, name: string) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('spreadsheet') || name.endsWith('.xlsx') || name.endsWith('.csv')) return '📊';
  if (type.includes('zip') || type.includes('compressed')) return '🗜️';
  if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.py') || name.endsWith('.tsx')) return '💻';
  if (name.endsWith('.md') || name.endsWith('.txt')) return '📝';
  return '📁';
}

export default function StoragePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [storage, setStorage] = useState<StorageState>({ files: [], totalBytes: 0, limitBytes: 500 * 1024 * 1024 });
  const [dataLoading, setDataLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!loading && !user) router.push('/login'); }, [loading, user]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadFiles = useCallback(async () => {
    if (!user) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/storage', { headers: { 'Authorization': `Bearer ${session.access_token}` } });
    if (res.ok) { const data = await res.json(); setStorage(data); }
    setDataLoading(false);
  }, [user]);

  useEffect(() => { if (user) loadFiles(); }, [user, loadFiles]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      setUploadProgress(`Uploading ${file.name}…`);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/storage/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${session.access_token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) { notify(`✗ ${data.error}`); }
      else { notify(`✓ ${file.name} uploaded`); }
    }
    setUploading(false);
    setUploadProgress('');
    await loadFiles();
  }

  async function handleDelete(filename: string) {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setDeleting(filename);
    const res = await fetch('/api/storage', { method: 'DELETE', headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ filename }) });
    if (res.ok) { notify(`✓ Deleted "${filename}"`); await loadFiles(); }
    else { notify('✗ Delete failed'); }
    setDeleting(null);
  }

  async function handleDownload(filename: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/storage/download', { method: 'POST', headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ filename }) });
    const data = await res.json();
    if (data.url) { window.open(data.url, '_blank'); }
    else { notify('✗ Could not generate download link'); }
  }

  const usedPct = Math.min(100, (storage.totalBytes / storage.limitBytes) * 100);
  const barColor = usedPct > 90 ? '#ff4444' : usedPct > 70 ? '#fb923c' : '#d8ff72';

  const filteredFiles = storage.files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'images') return f.type.startsWith('image/');
    if (filter === 'documents') return f.type.includes('pdf') || f.name.endsWith('.doc') || f.name.endsWith('.txt') || f.name.endsWith('.md');
    if (filter === 'code') return f.name.match(/\.(js|ts|tsx|jsx|py|go|rs|java|css|html|json|sql)$/);
    if (filter === 'video') return f.type.startsWith('video/');
    return true;
  });

  if (loading || dataLoading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#555', fontFamily: 'Inter,sans-serif' }}>Loading storage…</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter,sans-serif' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a2a1a', border: '1px solid #2a4a2a', color: '#d8ff72', padding: '12px 20px', borderRadius: 10, zIndex: 999, fontSize: 14 }}>{toast}</div>
      )}

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href='/' style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#fff' }}>Bizorvia</a>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href='/profile' style={{ color: '#666', textDecoration: 'none', fontSize: 13 }}>Account</a>
          <a href='/pricing' style={{ background: '#d8ff72', color: '#0a0a0a', padding: '7px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Upgrade</a>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>☁️ Storage</h1>
            <p style={{ color: '#666', fontSize: 14 }}>Securely store and access your business files, anywhere.</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ background: '#d8ff72', color: '#0a0a0a', border: 'none', padding: '11px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
          >
            {uploading ? uploadProgress || 'Uploading…' : '+ Upload files'}
          </button>
        </div>

        {/* Storage bar */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Storage used</span>
            <span style={{ fontSize: 13, color: '#888' }}>{formatBytes(storage.totalBytes)} / {formatBytes(storage.limitBytes)} free</span>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: barColor, width: `${usedPct}%`, height: '100%', borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ fontSize: 12, color: '#555' }}>{storage.files.length} file{storage.files.length !== 1 ? 's' : ''}</span>
            <span style={{ fontSize: 12, color: '#555' }}>{formatBytes(storage.limitBytes - storage.totalBytes)} remaining</span>
            {usedPct > 80 && <a href='/pricing' style={{ fontSize: 12, color: '#fb923c', textDecoration: 'none' }}>⚠ Running low — upgrade for more</a>}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#d8ff72' : '#2a2a2a'}`,
            borderRadius: 14,
            padding: '28px 24px',
            textAlign: 'center',
            marginBottom: 28,
            cursor: 'pointer',
            background: dragOver ? '#d8ff7208' : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
          <div style={{ color: '#888', fontSize: 14 }}>Drop files here or <span style={{ color: '#d8ff72' }}>click to upload</span></div>
          <div style={{ color: '#555', fontSize: 12, marginTop: 4 }}>Max 50MB per file · Any file type</div>
        </div>

        <input ref={fileRef} type='file' multiple style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />

        {/* Search + filter */}
        {storage.files.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input
              placeholder='Search files…'
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, background: '#111', border: '1px solid #222', borderRadius: 8, padding: '9px 14px', color: '#fff', fontSize: 13, outline: 'none' }}
            />
            {['all', 'images', 'documents', 'code', 'video'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ background: filter === f ? '#d8ff72' : '#111', color: filter === f ? '#0a0a0a' : '#888', border: `1px solid ${filter === f ? '#d8ff72' : '#222'}`, borderRadius: 8, padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontWeight: filter === f ? 700 : 400, textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* File list */}
        {filteredFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>
            {storage.files.length === 0
              ? <><div style={{ fontSize: 48, marginBottom: 12 }}>☁️</div><div>No files yet. Upload your first file above.</div></>
              : <><div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div><div>No files match your search.</div></>
            }
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredFiles.map(file => (
              <div key={file.name} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '14px 20px' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{fileIcon(file.type, file.name)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
                    {formatBytes(file.size)} · {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleDownload(file.name)}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#d8ff72', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                  >
                    ↓ Download
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    disabled={deleting === file.name}
                    style={{ background: '#1a0a0a', border: '1px solid #2a1a1a', color: '#ff6b6b', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}
                  >
                    {deleting === file.name ? '…' : '🗑'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plans teaser */}
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { plan: 'Free', storage: '500 MB', color: '#555', current: true },
            { plan: 'Builder', storage: '10 GB', color: '#d8ff72', current: false },
            { plan: 'Business', storage: '100 GB', color: '#a78bfa', current: false },
          ].map(t => (
            <div key={t.plan} style={{ background: '#111', border: `1px solid ${t.current ? '#2a2a2a' : t.color + '33'}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ color: t.color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.plan}</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{t.storage}</div>
              {t.current
                ? <span style={{ color: '#555', fontSize: 12 }}>Current plan</span>
                : <a href='/pricing' style={{ color: t.color, fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Upgrade →</a>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
