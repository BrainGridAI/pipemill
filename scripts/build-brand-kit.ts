/*
 * Builds the logo kit in public/brand from the founder-approved source marks,
 * and writes src/components/brand/paths.ts from the same path data.
 *
 *   node scripts/build-brand-kit.ts /path/to/pipemill-brand
 *
 * Nothing here draws a mark. Every path is copied from a source file. The only
 * derived geometry is:
 *   - colorways (the fill changes, the path does not);
 *   - the Gate ear overlay: the folded ear cut at the fold, using four vertices
 *     the source letter already has;
 *   - Tagged Hold: the Ear Tag parts moved onto the folded ear with one affine
 *     transform (scale, rotate square to the ear, translate).
 *
 * Small-size cuts come from final/small, then final, then the shortlist
 * favicons, so a later cut is a re-run, not a code change.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { FLOUR, GATE, IRON } from '../src/lib/brand-data.ts';

const root = join(import.meta.dirname, '..');
const src = process.argv[2];
if (!src || !existsSync(join(src, 'assets/shortlist'))) {
  console.error('usage: node scripts/build-brand-kit.ts /path/to/pipemill-brand');
  process.exit(1);
}
const shortlist = join(src, 'assets/shortlist');
const out = join(root, 'public/brand');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'png'), { recursive: true });
mkdirSync(join(out, 'explorations'), { recursive: true });

/* ─── Reading source files ────────────────────────────────────────────── */

type SourcePath = { fill: string; d: string };

function readPaths(file: string): SourcePath[] {
  const svg = readFileSync(file, 'utf8');
  return [...svg.matchAll(/<path fill="([^"]+)" d="([^"]+)"\/>/g)].map(([, fill, d]) => ({
    fill,
    d,
  }));
}

function points(d: string): [number, number][] {
  const nums = (d.match(/-?\d+\.?\d*/g) ?? []).map(Number);
  const pts: [number, number][] = [];
  for (let i = 0; i < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

/** A tight viewBox around a set of paths (control points included). */
function viewBox(ds: string[], pad = 0): string {
  const pts = ds.flatMap(points);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const r = (n: number) => Math.round(n * 100) / 100;
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return `${r(x)} ${r(y)} ${r(Math.max(...xs) + pad - x)} ${r(Math.max(...ys) + pad - y)}`;
}

/** Apply an affine transform to an absolute M/L/Q/C/Z path. */
function transform(d: string, f: (x: number, y: number) => [number, number]): string {
  if (/[^MLQCZ\d\s.-]/.test(d))
    throw new Error('transform: only absolute M, L, Q, C, Z are handled');
  return d.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g, (_, a, b) => {
    const [x, y] = f(Number(a), Number(b));
    return `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;
  });
}

type Layer = { d: string; fill: string };

function svg(box: string, layers: Layer[], opts: { bg?: string; size?: number } = {}): string {
  const [x, y, w, h] = box.split(' ');
  const size = opts.size ? ` width="${opts.size}" height="${opts.size}"` : '';
  const bg = opts.bg
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${opts.bg}"/>`
    : '';
  const body = layers.map((l) => `<path fill="${l.fill}" d="${l.d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg"${size} viewBox="${box}">${bg}${body}</svg>\n`;
}

const written: string[] = [];
function write(name: string, content: string) {
  writeFileSync(join(out, name), content);
  written.push(name);
}
function copy(from: string, name: string) {
  copyFileSync(from, join(out, name));
  written.push(name);
}

/* ─── Wordmark: Back is Left ──────────────────────────────────────────── */

const wm = readPaths(join(shortlist, '01-back-is-left/wordmark.svg'));
if (wm.length !== 9) throw new Error('wordmark.svg: expected 9 paths');
// Paths 0 to 6 and 8 are the letters. Path 7 is the tip overlay, not needed.
const letters = [...wm.slice(0, 7), wm[8]].map((p) => p.d);
const WORDMARK_BODY = letters.join('');
const foldedL = points(wm[6].d);
// Vertices 3 to 6 of the folded l: fold left, tip left, tip right, fold right.
const earOf = (l: [number, number][]) =>
  `M${l[3][0]} ${l[3][1]}L${l[4][0]} ${l[4][1]}L${l[5][0]} ${l[5][1]}L${l[6][0]} ${l[6][1]}Z`;
const WORDMARK_EAR = earOf(foldedL);
const WORDMARK_BOX = viewBox(letters);

write('pipemill-wordmark.svg', svg(WORDMARK_BOX, [{ d: WORDMARK_BODY, fill: 'currentColor' }]));
write('pipemill-wordmark-iron.svg', svg(WORDMARK_BOX, [{ d: WORDMARK_BODY, fill: IRON }]));
write('pipemill-wordmark-flour.svg', svg(WORDMARK_BOX, [{ d: WORDMARK_BODY, fill: FLOUR }]));
write(
  'pipemill-wordmark-gate-ear.svg',
  svg(WORDMARK_BOX, [
    { d: WORDMARK_BODY, fill: FLOUR },
    { d: WORDMARK_EAR, fill: GATE },
  ])
);

/* Lockups: the wordmark over a reeded rule and the tagline, as shipped. */
for (const mode of ['light', 'dark'] as const) {
  const file = join(shortlist, `01-back-is-left/lockup-${mode}.svg`);
  const paths = readPaths(file);
  const box = readFileSync(file, 'utf8').match(/viewBox="([^"]+)"/)?.[1];
  if (paths.length !== 11 || !box) throw new Error(`lockup-${mode}.svg: unexpected structure`);
  const ink = mode === 'light' ? IRON : FLOUR;
  const layers: Layer[] = [
    { d: [...paths.slice(0, 7), paths[8]].map((p) => p.d).join(''), fill: ink },
    ...(mode === 'dark' ? [{ d: WORDMARK_EAR, fill: GATE }] : []),
    { d: paths[9].d + paths[10].d, fill: ink },
  ];
  write(`pipemill-lockup-${mode}.svg`, svg(box, layers, { bg: mode === 'light' ? FLOUR : IRON }));
}

/* ─── The ll icon and its states ──────────────────────────────────────── */

const sym = readPaths(join(shortlist, '01-back-is-left/symbol.svg'));
const LL_BODY = sym[0].d + sym[2].d;
const LL_EAR = earOf(points(sym[0].d));
const LL_BOX = viewBox([LL_BODY]);
write('pipemill-ll.svg', svg(LL_BOX, [{ d: LL_BODY, fill: 'currentColor' }]));

const st = readPaths(join(shortlist, '01-back-is-left/states.svg'));
if (st.length !== 9) throw new Error('states.svg: expected 9 paths');
const STATE_PASS = st[0].d + st[1].d;
const STATE_HOLD = st[3].d + st[4].d;
const STATE_DENY = st[6].d + st[7].d;
const STATE_BOXES = {
  pass: viewBox([STATE_PASS]),
  hold: viewBox([STATE_HOLD]),
  deny: viewBox([STATE_DENY]),
};
write('pipemill-state-pass.svg', svg(STATE_BOXES.pass, [{ d: STATE_PASS, fill: 'currentColor' }]));
write('pipemill-state-hold.svg', svg(STATE_BOXES.hold, [{ d: STATE_HOLD, fill: 'currentColor' }]));
write('pipemill-state-deny.svg', svg(STATE_BOXES.deny, [{ d: STATE_DENY, fill: 'currentColor' }]));
const allStates = st.map((p) => p.d);
write(
  'pipemill-states.svg',
  svg(viewBox(allStates, 200), [{ d: allStates.join(''), fill: IRON }], { bg: FLOUR })
);

/* ─── Small-size cuts: final/small, then final, then the shortlist ────── */

const smallDirs = [join(src, 'final/small'), join(src, 'final')];
function finalFile(name: string): string | null {
  for (const dir of smallDirs) if (existsSync(join(dir, name))) return join(dir, name);
  return null;
}
const smallSource: Record<string, string> = {};
function small(name: string, fallback: string | null) {
  const from = finalFile(name) ?? fallback;
  if (!from) return;
  copy(from, name);
  smallSource[name] = from.slice(src.length + 1);
}
const bil = join(shortlist, '01-back-is-left');
small('pipemill-icon.svg', join(bil, 'app-icon.svg'));
small('pipemill-icon-light.svg', null);
small('pipemill-icon-16.svg', join(bil, 'favicon-16.svg'));
small('pipemill-icon-32.svg', join(bil, 'favicon-32.svg'));
small('pipemill-icon-48.svg', null);
small('pipemill-icon-light-16.svg', null);
small('pipemill-icon-light-32.svg', null);
small('pipemill-icon-light-48.svg', null);
small('pipemill-wordmark-small.svg', null);
small('pipemill-wordmark-small-iron.svg', null);
small('pipemill-wordmark-small-flour.svg', null);
// The app icon is the icon master at a fixed 512: Iron tile, square corners.
copy(join(out, 'pipemill-icon.svg'), 'pipemill-app-icon.svg');

/* ─── Ear Tag and Tagged Hold ─────────────────────────────────────────── */

const tagSrc = readPaths(join(src, 'final/pipemill-tag.svg'));
const holdSrc = readPaths(join(src, 'final/pipemill-tagged-hold.svg'));
const blankSrc = readPaths(join(src, 'final/pipemill-tagged-hold-blank.svg'));
if (tagSrc.length !== 3 || holdSrc.length !== 4 || blankSrc.length !== 4) {
  throw new Error('final tag: unexpected source structure');
}
const TAG_KEYLINE = tagSrc[0].d;
const TAG_PLATE = tagSrc[1].d;
const TAG_STUD = tagSrc[2].d;
const TAG_BOX = '0 0 846.8 1156';
// Extract only the outlined lot number appended to the final wordmark.
if (!holdSrc[2].d.startsWith(blankSrc[2].d)) throw new Error('final tag: number prefix changed');
const sourceNumber = holdSrc[2].d.slice(blankSrc[2].d.length);
// Straighten the outlined number independently of the inverted tag panel.
const angle = (15 * Math.PI) / 180;
const straightNumber = transform(sourceNumber, (x, y) => [
  (x * Math.cos(angle) - y * Math.sin(angle)) / 1.25,
  (x * Math.sin(angle) + y * Math.cos(angle)) / 1.25,
]);
const [nx, ny, nw, nh] = viewBox([straightNumber]).split(' ').map(Number);
const TAG_NUMBER = transform(straightNumber, (x, y) => [
  x - nx - nw / 2 + 423.4,
  y - ny - nh / 2 + 790,
]);
const tagLayers = (number: boolean): Layer[] => [
  { d: TAG_KEYLINE, fill: IRON },
  { d: TAG_PLATE, fill: GATE },
  { d: TAG_STUD, fill: IRON },
  ...(number ? [{ d: TAG_NUMBER, fill: IRON }] : []),
];
write('pipemill-tag.svg', svg(TAG_BOX, tagLayers(true)));
write('pipemill-tag-blank.svg', svg(TAG_BOX, tagLayers(false)));
// Keep the final panel behind the ear and its stud in front. Translate the
// source composition onto the CURRENT shortlist ear, preserving all paths.
const base = [(foldedL[3][0] + foldedL[6][0]) / 2, (foldedL[3][1] + foldedL[6][1]) / 2];
const tip = [(foldedL[4][0] + foldedL[5][0]) / 2, (foldedL[4][1] + foldedL[5][1]) / 2];
const anchor = [base[0] + (tip[0] - base[0]) * 0.84, base[1] + (tip[1] - base[1]) * 0.84];
const onEar = (x: number, y: number): [number, number] => [
  x + anchor[0] - 8511.4,
  y + anchor[1] - 1309,
];
const TAGGED_KEYLINE = transform(holdSrc[0].d, onEar);
const TAGGED_PLATE = transform(holdSrc[1].d, onEar);
const TAGGED_STUD = transform(holdSrc[3].d, onEar);
const TAGGED_NUMBER = transform(sourceNumber, onEar);
const TAGGED_BOX = viewBox([WORDMARK_BODY, TAGGED_KEYLINE, TAGGED_STUD]);
const tagged = (ink: string, number: boolean): Layer[] => [
  { d: TAGGED_KEYLINE, fill: IRON },
  { d: TAGGED_PLATE, fill: GATE },
  { d: WORDMARK_BODY, fill: ink },
  ...(number ? [{ d: TAGGED_NUMBER, fill: IRON }] : []),
  { d: TAGGED_STUD, fill: GATE },
];
write('pipemill-tagged-hold.svg', svg(TAGGED_BOX, tagged(IRON, true)));
write('pipemill-tagged-hold-dark.svg', svg(TAGGED_BOX, tagged(FLOUR, true)));
write('pipemill-tagged-hold-blank.svg', svg(TAGGED_BOX, tagged(IRON, false)));

/* Mascot: final tapered ears and even vertical reeding ticks. */
const mule = readPaths(join(src, 'final/pipemill-mascot.svg'));
const muleDark = readPaths(join(src, 'final/pipemill-mascot-dark.svg'));
if (mule.length !== 1 || muleDark.length !== 2) throw new Error('final mascot: unexpected paths');
const MASCOT_BODY = mule[0].d;
const MASCOT_DARK_BODY = muleDark[0].d;
const MASCOT_EAR_TIP = muleDark[1].d;
const MASCOT_BOX = viewBox([MASCOT_BODY]);
write('pipemill-mascot.svg', svg(MASCOT_BOX, [{ d: MASCOT_BODY, fill: 'currentColor' }]));
write('pipemill-mascot-iron.svg', svg(MASCOT_BOX, [{ d: MASCOT_BODY, fill: IRON }]));
write('pipemill-mascot-flour.svg', svg(MASCOT_BOX, [{ d: MASCOT_BODY, fill: FLOUR }]));
write(
  'pipemill-mascot-gate-ear.svg',
  svg(MASCOT_BOX, [
    { d: MASCOT_DARK_BODY, fill: FLOUR },
    { d: MASCOT_EAR_TIP, fill: GATE },
  ])
);

/* ─── Explorations: history only, never in the downloads ──────────────── */

const explorations: [string, string][] = [
  ['explore/r4/fable/02-hinge-fixed/wordmark.svg', 'explorations/hinge-fixed.svg'],
  ['assets/shortlist/03-ear-tag/wordmark.svg', 'explorations/ear-tag.svg'],
  ['explore/r3/fable/02-assay-row/row.svg', 'explorations/assay-row.svg'],
];
for (const [from, to] of explorations) {
  if (existsSync(join(src, from))) copy(join(src, from), to);
}

/* ─── PNG exports, favicon.ico, apple-icon ────────────────────────────── */

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');

async function png(from: string, name: string, width: number, bg?: string) {
  // Rasterize at the target size: density scales the intrinsic (viewBox) width.
  const box = readFileSync(join(out, from), 'utf8').match(/viewBox="([^"]+)"/)?.[1];
  const intrinsic = Number(box?.split(' ')[2] ?? width);
  const density = Math.max(1, Math.min(100000, (72 * width) / intrinsic));
  let image = sharp(join(out, from), { density }).resize({ width });
  if (bg) image = image.flatten({ background: bg });
  await image.png({ compressionLevel: 9 }).toFile(join(out, 'png', name));
  written.push(`png/${name}`);
}

await png('pipemill-wordmark-iron.svg', 'pipemill-wordmark-iron-1600.png', 1600);
await png('pipemill-wordmark-flour.svg', 'pipemill-wordmark-flour-1600.png', 1600);
await png('pipemill-wordmark-gate-ear.svg', 'pipemill-wordmark-gate-ear-1600.png', 1600);
await png('pipemill-lockup-light.svg', 'pipemill-lockup-light-1600.png', 1600);
await png('pipemill-lockup-dark.svg', 'pipemill-lockup-dark-1600.png', 1600);
await png('pipemill-tagged-hold.svg', 'pipemill-tagged-hold-1600.png', 1600);
await png('pipemill-tagged-hold-dark.svg', 'pipemill-tagged-hold-dark-1600.png', 1600);
await png('pipemill-mascot-iron.svg', 'pipemill-mascot-iron-1024.png', 1024);
await png('pipemill-mascot-flour.svg', 'pipemill-mascot-flour-1024.png', 1024);
await png('pipemill-mascot-gate-ear.svg', 'pipemill-mascot-gate-ear-1024.png', 1024);
for (const size of [1024, 512, 192, 180]) {
  await png('pipemill-icon.svg', `pipemill-icon-${size}.png`, size);
}
await png('pipemill-icon-light.svg', 'pipemill-icon-light-512.png', 512);
for (const size of [16, 32, 48]) {
  const cut = existsSync(join(out, `pipemill-icon-${size}.svg`))
    ? `pipemill-icon-${size}.svg`
    : 'pipemill-icon.svg';
  await png(cut, `pipemill-icon-${size}.png`, size);
}

/** An .ico that holds PNG images, one per size. */
function ico(sizes: number[]): Buffer {
  const images = sizes.map((s) => readFileSync(join(out, 'png', `pipemill-icon-${s}.png`)));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((image, i) => {
    const at = 6 + 16 * i;
    header.writeUInt8(sizes[i], at);
    header.writeUInt8(sizes[i], at + 1);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(image.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += image.length;
  });
  return Buffer.concat([header, ...images]);
}
const shippedIco = finalFile('favicon.ico');
if (shippedIco) copy(shippedIco, 'favicon.ico');
else {
  writeFileSync(join(out, 'favicon.ico'), ico([16, 32, 48]));
  written.push('favicon.ico');
}
// The file conventions Next reads. Both are copies of files in public/brand.
copyFileSync(join(out, 'favicon.ico'), join(root, 'src/app/favicon.ico'));
copyFileSync(join(out, 'png/pipemill-icon-180.png'), join(root, 'src/app/apple-icon.png'));

/* ─── Zip of the kit ──────────────────────────────────────────────────── */

const kit = written.filter((name) => !name.startsWith('explorations/')).sort();
try {
  execFileSync(
    'python3',
    [
      '-c',
      'import sys, zipfile\nwith zipfile.ZipFile("pipemill-brand-kit.zip", "w", zipfile.ZIP_DEFLATED) as kit:\n for name in sys.argv[1:]: kit.write(name, name)',
      ...kit,
    ],
    { cwd: out }
  );
  written.push('pipemill-brand-kit.zip');
} catch {
  console.warn('build-brand-kit: python3 zipfile is not available, no zip written');
}

/* ─── Inline paths for the React components ───────────────────────────── */

const consts: Record<string, string> = {
  WORDMARK_BOX,
  WORDMARK_BODY,
  WORDMARK_EAR,
  LL_BOX,
  LL_BODY,
  LL_EAR,
  STATE_PASS_BOX: STATE_BOXES.pass,
  STATE_PASS,
  STATE_HOLD_BOX: STATE_BOXES.hold,
  STATE_HOLD,
  STATE_DENY_BOX: STATE_BOXES.deny,
  STATE_DENY,
  TAG_BOX,
  TAG_KEYLINE,
  TAG_PLATE,
  TAG_NUMBER,
  TAG_STUD,
  TAGGED_BOX,
  TAGGED_KEYLINE,
  TAGGED_PLATE,
  TAGGED_NUMBER,
  TAGGED_STUD,
  MASCOT_BOX,
  MASCOT_BODY,
  MASCOT_DARK_BODY,
  MASCOT_EAR_TIP,
};
const header = `/*
 * GENERATED by scripts/build-brand-kit.ts. Do not edit by hand and never redraw.
 * Path data copied from the shipped assets in public/brand. To change a mark,
 * change its source file and run the script again. scripts/check-brand.ts
 * fails when these constants drift from the files.
 */
`;
const body = Object.entries(consts)
  .map(([name, value]) => {
    // Biome's line width is 100: a short constant stays on one line.
    const oneLine = `export const ${name} = '${value}';`;
    return oneLine.length <= 100 ? `${oneLine}\n` : `export const ${name} =\n  '${value}';\n`;
  })
  .join('\n');
writeFileSync(join(root, 'src/components/brand/paths.ts'), `${header}\n${body}`);

console.log(`build-brand-kit: ${written.length} files in public/brand`);
for (const [name, from] of Object.entries(smallSource)) console.log(`  ${name} <- ${from}`);
