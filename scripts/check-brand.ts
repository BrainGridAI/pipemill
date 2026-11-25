/*
 * Brand guard, run by `pnpm lint`. Node runs this file directly (type
 * stripping), so it imports brand-data.ts by relative path.
 *
 * It fails when:
 *   1. a token in src/app/globals.css differs from LIGHT_TOKENS or DARK_TOKENS;
 *   2. an inline logo path differs from the file it was copied from;
 *   3. brand copy carries an em dash, an exclamation mark or a banned word.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BRAND, DARK_TOKENS, LIGHT_TOKENS } from '../src/lib/brand-data.ts';

const root = join(import.meta.dirname, '..');
const failures: string[] = [];

/* 1. CSS tokens match the data. */
const css = readFileSync(join(root, 'src/app/globals.css'), 'utf8');
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const seen = { light: 0, dark: 0 };
for (const [, selector, body] of blocks) {
  const declared = [...body.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)];
  if (declared.length === 0) continue;
  const isDark = selector.includes('data-theme="dark"') || selector.includes(':root:not(');
  const mode = isDark ? 'dark' : 'light';
  const expected = isDark ? DARK_TOKENS : LIGHT_TOKENS;
  seen[mode] += 1;
  for (const [, name, hex] of declared) {
    if (!(name in expected)) {
      failures.push(`globals.css (${mode}): --${name} is not a token in brand-data.ts`);
    } else if (expected[name].toLowerCase() !== hex.toLowerCase()) {
      failures.push(
        `globals.css (${mode}): --${name} is ${hex}, brand-data.ts says ${expected[name]}`
      );
    }
  }
  for (const name of Object.keys(expected)) {
    if (!declared.some(([, declaredName]) => declaredName === name)) {
      failures.push(`globals.css (${mode}): --${name} is missing from "${selector.trim()}"`);
    }
  }
}
if (seen.light !== 1 || seen.dark !== 2) {
  failures.push(
    `globals.css: expected 1 light and 2 dark token blocks, found ${seen.light} and ${seen.dark}`
  );
}

/*
 * 2. Inline logo paths match the shipped files. Each file is listed with the
 * constants in src/components/brand/paths.ts that its <path> elements must
 * equal, in order. A redraw on either side fails here.
 */
const pathsSource = readFileSync(join(root, 'src/components/brand/paths.ts'), 'utf8');
const inline = Object.fromEntries(
  [...pathsSource.matchAll(/export const (\w+) =\s*'([^']+)'/g)].map(([, name, value]) => [
    name,
    value,
  ])
);
const tag = ['TAG_KEYLINE', 'TAG_PLATE', 'TAG_STUD'];
const tagged = ['TAGGED_KEYLINE', 'TAGGED_PLATE', 'WORDMARK_BODY'];
/** File: [the viewBox constant, then the path constants in order]. */
const shippedPaths: Record<string, string[]> = {
  'pipemill-wordmark.svg': ['WORDMARK_BOX', 'WORDMARK_BODY'],
  'pipemill-wordmark-iron.svg': ['WORDMARK_BOX', 'WORDMARK_BODY'],
  'pipemill-wordmark-flour.svg': ['WORDMARK_BOX', 'WORDMARK_BODY'],
  'pipemill-wordmark-gate-ear.svg': ['WORDMARK_BOX', 'WORDMARK_BODY', 'WORDMARK_EAR'],
  'pipemill-ll.svg': ['LL_BOX', 'LL_BODY'],
  'pipemill-state-pass.svg': ['STATE_PASS_BOX', 'STATE_PASS'],
  'pipemill-state-hold.svg': ['STATE_HOLD_BOX', 'STATE_HOLD'],
  'pipemill-state-deny.svg': ['STATE_DENY_BOX', 'STATE_DENY'],
  'pipemill-tag.svg': ['TAG_BOX', ...tag, 'TAG_NUMBER'],
  'pipemill-tag-blank.svg': ['TAG_BOX', ...tag],
  'pipemill-tagged-hold.svg': ['TAGGED_BOX', ...tagged, 'TAGGED_NUMBER', 'TAGGED_STUD'],
  'pipemill-tagged-hold-dark.svg': ['TAGGED_BOX', ...tagged, 'TAGGED_NUMBER', 'TAGGED_STUD'],
  'pipemill-tagged-hold-blank.svg': ['TAGGED_BOX', ...tagged, 'TAGGED_STUD'],
  'pipemill-mascot.svg': ['MASCOT_BOX', 'MASCOT_BODY'],
  'pipemill-mascot-iron.svg': ['MASCOT_BOX', 'MASCOT_BODY'],
  'pipemill-mascot-flour.svg': ['MASCOT_BOX', 'MASCOT_BODY'],
  'pipemill-mascot-gate-ear.svg': ['MASCOT_BOX', 'MASCOT_DARK_BODY', 'MASCOT_EAR_TIP'],
};
const brandDir = join(root, 'public/brand');
const read = (file: string) => {
  try {
    return readFileSync(join(brandDir, file));
  } catch {
    return null;
  }
};
const pathData = (svg: string) => [...svg.matchAll(/ d="([^"]+)"/g)].map(([, d]) => d);
for (const [file, [boxName, ...names]] of Object.entries(shippedPaths)) {
  const shipped = read(file);
  if (!shipped) {
    failures.push(`public/brand/${file} is missing`);
    continue;
  }
  const ds = pathData(shipped.toString());
  if (ds.length !== names.length) {
    failures.push(`public/brand/${file}: expected ${names.length} paths, found ${ds.length}`);
  }
  names.forEach((name, i) => {
    if (!inline[name]) failures.push(`paths.ts: ${name} is missing`);
    else if (inline[name] !== ds[i]) failures.push(`paths.ts: ${name} differs from ${file}`);
  });
  const box = shipped.toString().match(/viewBox="([^"]+)"/)?.[1];
  if (inline[boxName] !== box) failures.push(`paths.ts: ${boxName} differs from ${file}`);
}

/*
 * The mascot is for large surfaces only. It must never reach an icon, a
 * favicon, a wordmark or a lockup file.
 */
for (const file of readdirSync(brandDir)) {
  if (!file.endsWith('.svg') || file.includes('mascot')) continue;
  const svg = read(file)?.toString() ?? '';
  if (inline.MASCOT_BODY && svg.includes(inline.MASCOT_BODY)) {
    failures.push(`public/brand/${file} carries the mascot. Large surfaces only.`);
  }
}

/* The data and the disk list the same files, and each PNG has the size it claims. */
const listedAssets = new Map(BRAND.logos.assets.map((a) => [a.path.replace('/brand/', ''), a]));
const onDisk = [
  ...readdirSync(brandDir).filter((f) => f.includes('.')),
  ...readdirSync(join(brandDir, 'png')).map((f) => `png/${f}`),
];
for (const file of onDisk) {
  if (!listedAssets.has(file)) failures.push(`public/brand/${file} is not listed in brand-data.ts`);
}
for (const [file, asset] of listedAssets) {
  const bytes = read(file);
  if (!bytes) {
    failures.push(`brand-data.ts lists ${asset.path}, which is not in public/`);
  } else if (asset.format === 'PNG') {
    const actual = `${bytes.readUInt32BE(16)} x ${bytes.readUInt32BE(20)}`;
    if (actual !== asset.size) failures.push(`${file} is ${actual}, the data says ${asset.size}`);
  }
}
const listed = [
  ...listedAssets.keys(),
  ...BRAND.logos.explorations.map((e) => e.asset),
  ...BRAND.logos.states.items.map((s) => s.asset),
  ...Object.values(BRAND.logos.perMode).flatMap((m) => [m.wordmark, m.lockup, m.icon]),
  BRAND.logos.smallSize.asset,
  BRAND.logos.tag.asset,
  BRAND.logos.tag.assetDark,
  BRAND.logos.mascot.asset,
];
for (const path of listed) {
  if (path.startsWith('/') && !existsSync(join(root, 'public', path))) {
    failures.push(`brand-data.ts points at ${path}, which is not in public/`);
  }
}

/* The favicon and the Apple icon in src/app are copies of the kit files. */
const copies: [string, string][] = [
  ['src/app/favicon.ico', 'favicon.ico'],
  ['src/app/apple-icon.png', 'png/pipemill-icon-180.png'],
];
for (const [app, kit] of copies) {
  const a = existsSync(join(root, app)) ? readFileSync(join(root, app)) : null;
  if (!a || !read(kit)?.equals(a)) failures.push(`${app} is not a copy of public/brand/${kit}`);
}

/* 3. Copy rules. */
const banned = BRAND.voice.bannedWords.map((w) => w.toLowerCase());

function walkStrings(value: unknown, path: string, visit: (s: string, p: string) => void): void {
  if (typeof value === 'string') visit(value, path);
  else if (Array.isArray(value)) {
    for (const [i, v] of value.entries()) walkStrings(v, `${path}[${i}]`, visit);
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walkStrings(v, `${path}.${k}`, visit);
  }
}

walkStrings(BRAND, 'BRAND', (text, path) => {
  if (/[—–]/.test(text)) failures.push(`${path}: em or en dash in copy`);
  if (text.includes('!')) failures.push(`${path}: exclamation mark in copy`);
  if (path.startsWith('BRAND.voice.bannedWords')) return;
  const lower = text.toLowerCase();
  for (const word of banned) {
    if (new RegExp(`(^|[^a-z0-9])${word.replace(/[-]/g, '[- ]')}([^a-z0-9]|$)`).test(lower)) {
      failures.push(`${path}: banned word "${word}"`);
    }
  }
});

/* The same dash and exclamation rules for copy written straight into components. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}
for (const file of sourceFiles(join(root, 'src'))) {
  const source = readFileSync(file, 'utf8');
  if (/[—–]/.test(source)) failures.push(`${file.slice(root.length + 1)}: em or en dash`);
}

if (failures.length > 0) {
  console.error(`check-brand: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(
  `check-brand: ok (${Object.keys(LIGHT_TOKENS).length} tokens x 2 modes, ${Object.keys(shippedPaths).length} files of inline paths, ${listedAssets.size} assets, copy rules)`
);
