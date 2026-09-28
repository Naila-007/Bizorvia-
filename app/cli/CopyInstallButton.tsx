'use client';
import { useState } from 'react';

export default function CopyInstallButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: 'none',
        border: 'none',
        color: copied ? '#d8ff72' : '#555',
        fontSize: 12,
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'inherit',
      }}
    >
      {copied ? 'copied ✓' : 'copy'}
    </button>
  );
}
