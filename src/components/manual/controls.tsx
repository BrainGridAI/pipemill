'use client';

import { useState } from 'react';
import { BRAND } from '@/lib/brand-data';

export function CopyButton({
  text,
  src,
  label = 'Copy',
  name,
}: {
  text?: string;
  src?: string;
  label?: string;
  name: string;
}) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      let value = text ?? '';
      if (src) {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Copy failed');
        value = await response.text();
      }
      await navigator.clipboard.writeText(value);
      setStatus('Copied');
    } catch {
      setStatus('Copy failed. Try again.');
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} ${name}`}
      className="data min-h-9 max-w-full cursor-pointer border border-border px-2 py-1 text-left break-words hover:border-foreground"
    >
      <span aria-live="polite">{status || label}</span>
    </button>
  );
}

export function ManualToolbar() {
  const [dark, setDark] = useState<boolean | null>(null);
  function toggle() {
    const next = !(dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    setDark(next);
  }
  return (
    <nav
      aria-label="Quick section navigation"
      className="sticky top-0 z-30 border-y border-border bg-background"
    >
      <div className="page flex min-h-14 items-center justify-between gap-4 py-2">
        <label className="kicker flex min-w-0 items-center gap-3">
          <span className="hidden sm:inline">Jump to</span>
          <select
            aria-label="Jump to section"
            defaultValue=""
            className="min-w-0 max-w-56 bg-background py-2 text-foreground"
            onChange={(event) => {
              window.location.hash = event.target.value;
            }}
          >
            <option value="" disabled>
              Sections
            </option>
            {BRAND.manual.sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={toggle}
          className="kicker min-h-9 shrink-0 cursor-pointer border border-foreground px-3"
          aria-label="Toggle light and dark theme"
        >
          {dark === null ? 'Light / dark' : dark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </nav>
  );
}
