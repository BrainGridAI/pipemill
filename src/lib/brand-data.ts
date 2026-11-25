/**
 * Pipemill brand data: the single source of truth for the /brand manual and the
 * machine-readable /brand.md, /brand.json and /brand.txt surfaces.
 *
 * Copy here is site content. Voice rules apply to every string: no em dashes,
 * no exclamation marks, none of the banned words outside the banned list
 * itself. scripts/check-brand.ts enforces those rules and checks that the
 * tokens in src/app/globals.css match LIGHT_TOKENS and DARK_TOKENS.
 *
 * This module has no imports on purpose: Node runs it directly for the check.
 */

/** Which mode a color belongs to. `shared` = the identity colors, same in both. */
export type ColorMode = 'light' | 'dark' | 'shared';

export type BrandColor = {
  name: string;
  hex: string;
  cssVariable: string;
  mode: ColorMode;
  usage: string;
};

export type BrandTerm = { term: string; context: string };
export type BrandAvoidTerm = { term: string; reason: string };
export type PolicyOutcome = 'pass' | 'hold' | 'deny';

export const BRAND_URL = 'https://pipemill.ai';

/** Iron: the ink, the wordmark, the dark canvas. */
export const IRON = '#141519';
/** Flour: the light canvas, and the ink on Iron. */
export const FLOUR = '#F2EEE4';
/** Gate: the single signal accent. Iron text on it, always. */
export const GATE = '#FFC21A';
/** Gate Ink: the only gate-colored text allowed on light. */
export const GATE_INK = '#8A5A00';

/** Light-mode semantic token map. Flour paper canvas, Iron ink, Gate accent. */
export const LIGHT_TOKENS: Record<string, string> = {
  background: '#F2EEE4',
  card: '#FAF8F2',
  elevated: '#E8E3D7',
  border: '#D6D0C2',
  foreground: '#141519',
  'muted-foreground': '#6B675F',
  primary: '#141519',
  'primary-foreground': '#F2EEE4',
  accent: '#FFC21A',
  'accent-foreground': '#141519',
  success: '#2F7A4B',
  destructive: '#B83A26',
  hold: '#8A5A00',
  ring: '#141519',
};

/** Dark-mode semantic token map. Iron canvas, Flour ink, the same Gate accent. */
export const DARK_TOKENS: Record<string, string> = {
  background: '#141519',
  card: '#1E1F24',
  elevated: '#292A30',
  border: '#34353B',
  foreground: '#F2EEE4',
  'muted-foreground': '#A29D92',
  primary: '#F2EEE4',
  'primary-foreground': '#141519',
  accent: '#FFC21A',
  'accent-foreground': '#141519',
  success: '#5DBB7F',
  destructive: '#EE7A63',
  hold: '#FFC21A',
  ring: '#FFC21A',
};

/* ─── WCAG contrast ───────────────────────────────────────────────────────── */

/** Relative luminance of a #RRGGBB color, per WCAG 2.x. */
export function relativeLuminance(hex: string): number {
  const channel = (offset: number) => {
    const v = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** Contrast ratio between two #RRGGBB colors, rounded to 2 decimals. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  return Math.round(ratio * 100) / 100;
}

export type WcagGrade = 'AAA' | 'AA' | 'AA LARGE' | 'FAIL';

/** AAA at 7:1, AA at 4.5:1, AA for large text and marks at 3:1. */
export function wcagGrade(ratio: number): WcagGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA LARGE';
  return 'FAIL';
}

type ContrastPairInput = {
  fg: string;
  fgHex: string;
  bg: string;
  bgHex: string;
  mode: 'light' | 'dark';
  usage: string;
  forbidden?: boolean;
};

function pair(input: ContrastPairInput) {
  const ratio = contrastRatio(input.fgHex, input.bgHex);
  return { ...input, forbidden: input.forbidden ?? false, ratio, grade: wcagGrade(ratio) };
}

export type ContrastPair = ReturnType<typeof pair>;

/* ─── Colors ──────────────────────────────────────────────────────────────── */

const IDENTITY_COLORS: BrandColor[] = [
  {
    name: 'Iron',
    hex: IRON,
    cssVariable: '--iron',
    mode: 'shared',
    usage:
      'The ink. The wordmark, body text and the primary button in light mode. The canvas in dark mode.',
  },
  {
    name: 'Flour',
    hex: FLOUR,
    cssVariable: '--flour',
    mode: 'shared',
    usage:
      'The light canvas. Warm paper, never pure white. Also the ink on Iron: text and the wordmark in dark mode.',
  },
  {
    name: 'Gate',
    hex: GATE,
    cssVariable: '--accent',
    mode: 'shared',
    usage:
      'The single signal accent: the gate, the hold state, kickers on dark, highlights. Always with Iron text on it. Never as text on light.',
  },
  {
    name: 'Gate Ink',
    hex: GATE_INK,
    cssVariable: '--gate-ink',
    mode: 'shared',
    usage: 'The only way to write gate-colored text on light surfaces.',
  },
];

const LIGHT_COLORS: BrandColor[] = [
  {
    name: 'Flour',
    hex: '#F2EEE4',
    cssVariable: '--background',
    mode: 'light',
    usage: 'The light canvas.',
  },
  {
    name: 'Paper',
    hex: '#FAF8F2',
    cssVariable: '--card',
    mode: 'light',
    usage: 'Cards and panels in light mode.',
  },
  {
    name: 'Meal',
    hex: '#E8E3D7',
    cssVariable: '--elevated',
    mode: 'light',
    usage: 'Elevated fills and table headers. Iron text only: Grit fails AA on Meal.',
  },
  {
    name: 'Chaff',
    hex: '#D6D0C2',
    cssVariable: '--border',
    mode: 'light',
    usage: 'The 1px border in light mode.',
  },
  {
    name: 'Iron',
    hex: '#141519',
    cssVariable: '--foreground',
    mode: 'light',
    usage: 'Primary text and the primary button fill in light mode.',
  },
  {
    name: 'Grit',
    hex: '#6B675F',
    cssVariable: '--muted-foreground',
    mode: 'light',
    usage: 'Secondary text in light mode, on Flour or Paper.',
  },
  {
    name: 'Pass',
    hex: '#2F7A4B',
    cssVariable: '--success',
    mode: 'light',
    usage: 'The Pass outcome and passing checks in light mode.',
  },
  {
    name: 'Deny',
    hex: '#B83A26',
    cssVariable: '--destructive',
    mode: 'light',
    usage: 'The Deny outcome and failing checks in light mode.',
  },
  {
    name: 'Gate Ink',
    hex: '#8A5A00',
    cssVariable: '--hold',
    mode: 'light',
    usage: 'The Hold outcome as text in light mode.',
  },
];

const DARK_COLORS: BrandColor[] = [
  {
    name: 'Iron',
    hex: '#141519',
    cssVariable: '--background',
    mode: 'dark',
    usage: 'The dark canvas.',
  },
  {
    name: 'Forge',
    hex: '#1E1F24',
    cssVariable: '--card',
    mode: 'dark',
    usage: 'Cards and panels in dark mode.',
  },
  {
    name: 'Elevated (dark)',
    hex: '#292A30',
    cssVariable: '--elevated',
    mode: 'dark',
    usage: 'Elevated fills and table headers in dark mode.',
  },
  {
    name: 'Border (dark)',
    hex: '#34353B',
    cssVariable: '--border',
    mode: 'dark',
    usage: 'The 1px border in dark mode.',
  },
  {
    name: 'Flour',
    hex: '#F2EEE4',
    cssVariable: '--foreground',
    mode: 'dark',
    usage: 'Primary text and the primary button fill in dark mode.',
  },
  {
    name: 'Muted (dark)',
    hex: '#A29D92',
    cssVariable: '--muted-foreground',
    mode: 'dark',
    usage: 'Secondary text in dark mode.',
  },
  {
    name: 'Pass (dark)',
    hex: '#5DBB7F',
    cssVariable: '--success',
    mode: 'dark',
    usage: 'The Pass outcome and passing checks in dark mode.',
  },
  {
    name: 'Deny (dark)',
    hex: '#EE7A63',
    cssVariable: '--destructive',
    mode: 'dark',
    usage: 'The Deny outcome and failing checks in dark mode.',
  },
  {
    name: 'Gate',
    hex: '#FFC21A',
    cssVariable: '--hold',
    mode: 'dark',
    usage: 'The Hold outcome in dark mode. Gate is legal as text on Iron.',
  },
];

const CONTRAST_PAIRS: ContrastPair[] = [
  pair({
    fg: 'Iron',
    fgHex: '#141519',
    bg: 'Flour',
    bgHex: '#F2EEE4',
    mode: 'light',
    usage: 'Body text',
  }),
  pair({
    fg: 'Iron',
    fgHex: '#141519',
    bg: 'Gate',
    bgHex: '#FFC21A',
    mode: 'light',
    usage: 'Signal button, Hold badge, gate slabs',
  }),
  pair({
    fg: 'Flour',
    fgHex: '#F2EEE4',
    bg: 'Iron',
    bgHex: '#141519',
    mode: 'light',
    usage: 'Primary button',
  }),
  pair({
    fg: 'Grit',
    fgHex: '#6B675F',
    bg: 'Flour',
    bgHex: '#F2EEE4',
    mode: 'light',
    usage: 'Secondary text',
  }),
  pair({
    fg: 'Grit',
    fgHex: '#6B675F',
    bg: 'Paper',
    bgHex: '#FAF8F2',
    mode: 'light',
    usage: 'Secondary text on cards',
  }),
  pair({
    fg: 'Gate Ink',
    fgHex: '#8A5A00',
    bg: 'Flour',
    bgHex: '#F2EEE4',
    mode: 'light',
    usage: 'Hold as text, gate-colored kickers',
  }),
  pair({
    fg: 'Pass',
    fgHex: '#2F7A4B',
    bg: 'Flour',
    bgHex: '#F2EEE4',
    mode: 'light',
    usage: 'Pass as text',
  }),
  pair({
    fg: 'Deny',
    fgHex: '#B83A26',
    bg: 'Flour',
    bgHex: '#F2EEE4',
    mode: 'light',
    usage: 'Deny as text, Deny badge fill',
  }),
  pair({
    fg: 'Grit',
    fgHex: '#6B675F',
    bg: 'Meal',
    bgHex: '#E8E3D7',
    mode: 'light',
    usage: 'Forbidden for text. Use Iron on Meal.',
    forbidden: true,
  }),
  pair({
    fg: 'Gate',
    fgHex: '#FFC21A',
    bg: 'Flour',
    bgHex: '#F2EEE4',
    mode: 'light',
    usage: 'Forbidden for text or thin marks',
    forbidden: true,
  }),
  pair({
    fg: 'Flour',
    fgHex: '#F2EEE4',
    bg: 'Iron',
    bgHex: '#141519',
    mode: 'dark',
    usage: 'Body text',
  }),
  pair({
    fg: 'Gate',
    fgHex: '#FFC21A',
    bg: 'Iron',
    bgHex: '#141519',
    mode: 'dark',
    usage: 'Hold, kickers, the folded ear of the wordmark',
  }),
  pair({
    fg: 'Muted (dark)',
    fgHex: '#A29D92',
    bg: 'Iron',
    bgHex: '#141519',
    mode: 'dark',
    usage: 'Secondary text',
  }),
  pair({
    fg: 'Muted (dark)',
    fgHex: '#A29D92',
    bg: 'Forge',
    bgHex: '#1E1F24',
    mode: 'dark',
    usage: 'Secondary text on cards',
  }),
  pair({
    fg: 'Pass (dark)',
    fgHex: '#5DBB7F',
    bg: 'Iron',
    bgHex: '#141519',
    mode: 'dark',
    usage: 'Pass as text',
  }),
  pair({
    fg: 'Deny (dark)',
    fgHex: '#EE7A63',
    bg: 'Iron',
    bgHex: '#141519',
    mode: 'dark',
    usage: 'Deny as text, Deny badge fill',
  }),
];

/* ─── The logo kit ────────────────────────────────────────────────────────── */

export type AssetGroup = 'Wordmark' | 'Icon' | 'States' | 'Ear Tag' | 'Mascot' | 'Kit';

export type BrandAsset = {
  group: AssetGroup;
  name: string;
  /** Path under the site root. The file lives in public/brand. */
  path: string;
  format: 'SVG' | 'PNG' | 'ICO' | 'ZIP';
  colorway: string;
  size: string;
  use: string;
  /** The surface the preview sits on. */
  surface: 'light' | 'dark';
};

function asset(
  group: AssetGroup,
  name: string,
  file: string,
  colorway: string,
  size: string,
  use: string,
  surface: 'light' | 'dark' = 'light'
): BrandAsset {
  const format = file.split('.').pop()?.toUpperCase() as BrandAsset['format'];
  return { group, name, path: `/brand/${file}`, format, colorway, size, use, surface };
}

const ON_IRON = 'For Iron surfaces.';
const ON_FLOUR = 'For Flour and Paper.';
const MASCOT_USE = 'Large surfaces only. Never next to the wordmark.';

/** Every file in public/brand, one row each. scripts/check-brand.ts holds it to the disk. */
const LOGO_ASSETS: BrandAsset[] = [
  asset(
    'Wordmark',
    'Wordmark',
    'pipemill-wordmark.svg',
    'currentColor',
    'Vector, 4.54:1',
    'The source. Inherits the text color.'
  ),
  asset('Wordmark', 'Wordmark, Iron', 'pipemill-wordmark-iron.svg', 'Iron', 'Vector', ON_FLOUR),
  asset(
    'Wordmark',
    'Wordmark, Flour',
    'pipemill-wordmark-flour.svg',
    'Flour',
    'Vector',
    ON_IRON,
    'dark'
  ),
  asset(
    'Wordmark',
    'Wordmark, Gate ear',
    'pipemill-wordmark-gate-ear.svg',
    'Flour, Gate ear',
    'Vector',
    'Flour word, Gate folded ear. Iron surfaces only.',
    'dark'
  ),
  asset(
    'Wordmark',
    'Small-size cut',
    'pipemill-wordmark-small.svg',
    'currentColor',
    'Vector, for 64 to 120 px wide',
    'The fold becomes one clean notch. Use below 120 px wide.'
  ),
  asset(
    'Wordmark',
    'Small-size cut, Iron',
    'pipemill-wordmark-small-iron.svg',
    'Iron',
    'Vector, for 64 to 120 px wide',
    ON_FLOUR
  ),
  asset(
    'Wordmark',
    'Small-size cut, Flour',
    'pipemill-wordmark-small-flour.svg',
    'Flour',
    'Vector, for 64 to 120 px wide',
    ON_IRON,
    'dark'
  ),
  asset(
    'Wordmark',
    'Lockup, light',
    'pipemill-lockup-light.svg',
    'Iron on Flour',
    'Vector, with background',
    'Wordmark, reeded rule, domain and tagline.'
  ),
  asset(
    'Wordmark',
    'Lockup, dark',
    'pipemill-lockup-dark.svg',
    'Flour on Iron, Gate ear',
    'Vector, with background',
    'Wordmark, reeded rule, domain and tagline.',
    'dark'
  ),
  asset(
    'Wordmark',
    'Wordmark, Iron',
    'png/pipemill-wordmark-iron-1600.png',
    'Iron',
    '1600 x 352',
    ON_FLOUR
  ),
  asset(
    'Wordmark',
    'Wordmark, Flour',
    'png/pipemill-wordmark-flour-1600.png',
    'Flour',
    '1600 x 352',
    ON_IRON,
    'dark'
  ),
  asset(
    'Wordmark',
    'Wordmark, Gate ear',
    'png/pipemill-wordmark-gate-ear-1600.png',
    'Flour, Gate ear',
    '1600 x 352',
    ON_IRON,
    'dark'
  ),
  asset(
    'Wordmark',
    'Lockup, light',
    'png/pipemill-lockup-light-1600.png',
    'Iron on Flour',
    '1600 x 609',
    'With background.'
  ),
  asset(
    'Wordmark',
    'Lockup, dark',
    'png/pipemill-lockup-dark-1600.png',
    'Flour on Iron, Gate ear',
    '1600 x 609',
    'With background.',
    'dark'
  ),

  asset(
    'Icon',
    'll icon',
    'pipemill-icon.svg',
    'Flour on Iron, Gate ear',
    'Vector, 512 tile',
    'The icon master. Square corners.',
    'dark'
  ),
  asset(
    'Icon',
    'll icon, light',
    'pipemill-icon-light.svg',
    'Iron on Flour',
    'Vector, 512 tile',
    'Single ink, for light surfaces.'
  ),
  asset(
    'Icon',
    'll glyph',
    'pipemill-ll.svg',
    'currentColor',
    'Vector, no tile',
    'The two letters alone. Inherits the text color.'
  ),
  asset(
    'Icon',
    'App icon',
    'pipemill-app-icon.svg',
    'Flour on Iron, Gate ear',
    '512 x 512',
    'The icon master at app size.',
    'dark'
  ),
  asset(
    'Icon',
    'Icon, 16 px cut',
    'pipemill-icon-16.svg',
    'Flour on Iron, Gate ear',
    '16 x 16, pixel-fit',
    'The favicon. The whole folded ear is Gate.',
    'dark'
  ),
  asset(
    'Icon',
    'Icon, 32 px cut',
    'pipemill-icon-32.svg',
    'Flour on Iron, Gate ear',
    '32 x 32, pixel-fit',
    'Tabs and bookmarks.',
    'dark'
  ),
  asset(
    'Icon',
    'Icon, 48 px cut',
    'pipemill-icon-48.svg',
    'Flour on Iron, Gate ear',
    '48 x 48, pixel-fit',
    'Shortcuts.',
    'dark'
  ),
  asset(
    'Icon',
    'Icon, 16 px cut, light',
    'pipemill-icon-light-16.svg',
    'Iron on Flour',
    '16 x 16, pixel-fit',
    'Single ink.'
  ),
  asset(
    'Icon',
    'Icon, 32 px cut, light',
    'pipemill-icon-light-32.svg',
    'Iron on Flour',
    '32 x 32, pixel-fit',
    'Single ink.'
  ),
  asset(
    'Icon',
    'Icon, 48 px cut, light',
    'pipemill-icon-light-48.svg',
    'Iron on Flour',
    '48 x 48, pixel-fit',
    'Single ink.'
  ),
  asset(
    'Icon',
    'favicon.ico',
    'favicon.ico',
    'Flour on Iron, Gate ear',
    '16, 32 and 48 px',
    'Three sizes in one file.',
    'dark'
  ),
  ...[1024, 512, 192, 180, 48, 32, 16].map((px) =>
    asset(
      'Icon',
      `Icon, ${px} px`,
      `png/pipemill-icon-${px}.png`,
      'Flour on Iron, Gate ear',
      `${px} x ${px}`,
      px === 180 ? 'The Apple touch icon.' : px <= 48 ? 'From the pixel-fit cut.' : 'App stores.',
      'dark'
    )
  ),
  asset(
    'Icon',
    'Icon, light, 512 px',
    'png/pipemill-icon-light-512.png',
    'Iron on Flour',
    '512 x 512',
    'Single ink.'
  ),

  asset(
    'States',
    'Pass, Hold, Deny',
    'pipemill-states.svg',
    'Iron on Flour',
    'Vector, with labels',
    'The three states in a row, for documents.'
  ),
  asset(
    'States',
    'State, Pass',
    'pipemill-state-pass.svg',
    'currentColor',
    'Vector',
    'Both ears up.'
  ),
  asset(
    'States',
    'State, Hold',
    'pipemill-state-hold.svg',
    'currentColor',
    'Vector',
    'One ear back. The default.'
  ),
  asset(
    'States',
    'State, Deny',
    'pipemill-state-deny.svg',
    'currentColor',
    'Vector',
    'Both ears back.'
  ),

  asset(
    'Ear Tag',
    'Ear Tag, lot 0412',
    'pipemill-tag.svg',
    'Gate, Iron keyline',
    'Vector',
    'The tag alone, with the specimen lot number.'
  ),
  asset(
    'Ear Tag',
    'Ear Tag, blank',
    'pipemill-tag-blank.svg',
    'Gate, Iron keyline',
    'Vector',
    'Set your own lot number in Martian Mono.'
  ),
  asset(
    'Ear Tag',
    'Tagged Hold',
    'pipemill-tagged-hold.svg',
    'Iron, Gate tag',
    'Vector',
    'Receipts, exports, run records. For Flour and Paper.'
  ),
  asset(
    'Ear Tag',
    'Tagged Hold, dark',
    'pipemill-tagged-hold-dark.svg',
    'Flour, Gate tag',
    'Vector',
    'Social and OG cards. For Iron.',
    'dark'
  ),
  asset(
    'Ear Tag',
    'Tagged Hold, blank',
    'pipemill-tagged-hold-blank.svg',
    'Iron, Gate tag',
    'Vector',
    'Under 300 px wide the tag is blank.'
  ),
  asset(
    'Ear Tag',
    'Tagged Hold',
    'png/pipemill-tagged-hold-1600.png',
    'Iron, Gate tag',
    '1600 x 532',
    ON_FLOUR
  ),
  asset(
    'Ear Tag',
    'Tagged Hold, dark',
    'png/pipemill-tagged-hold-dark-1600.png',
    'Flour, Gate tag',
    '1600 x 532',
    ON_IRON,
    'dark'
  ),

  asset(
    'Mascot',
    'Mascot',
    'pipemill-mascot.svg',
    'currentColor',
    'Vector, 64 px tall minimum',
    MASCOT_USE
  ),
  asset('Mascot', 'Mascot, Iron', 'pipemill-mascot-iron.svg', 'Iron', 'Vector', MASCOT_USE),
  asset(
    'Mascot',
    'Mascot, Flour',
    'pipemill-mascot-flour.svg',
    'Flour',
    'Vector',
    MASCOT_USE,
    'dark'
  ),
  asset(
    'Mascot',
    'Mascot, Gate ear tip',
    'pipemill-mascot-gate-ear.svg',
    'Flour, Gate ear tip',
    'Vector',
    'On Iron, only the tip of the back ear is Gate. Large surfaces only.',
    'dark'
  ),
  asset(
    'Mascot',
    'Mascot, Iron',
    'png/pipemill-mascot-iron-1024.png',
    'Iron',
    '1024 x 935',
    MASCOT_USE
  ),
  asset(
    'Mascot',
    'Mascot, Flour',
    'png/pipemill-mascot-flour-1024.png',
    'Flour',
    '1024 x 935',
    MASCOT_USE,
    'dark'
  ),
  asset(
    'Mascot',
    'Mascot, Gate ear tip',
    'png/pipemill-mascot-gate-ear-1024.png',
    'Flour, Gate ear tip',
    '1024 x 935',
    MASCOT_USE,
    'dark'
  ),

  asset(
    'Kit',
    'The whole kit',
    'pipemill-brand-kit.zip',
    'All',
    'Every file above',
    'One download.'
  ),
];

/* ─── The manual ──────────────────────────────────────────────────────────── */

/** The 15 sections of /brand, in order. The ids are screenshot anchors. */
const MANUAL_SECTIONS = [
  { id: 'hero', label: 'Brand guidelines' },
  { id: 'stand-for', label: 'What we stand for' },
  { id: 'logo', label: 'Logos and symbols' },
  { id: 'name', label: 'Our name' },
  { id: 'color', label: 'Color palette' },
  { id: 'type', label: 'Typography' },
  { id: 'pattern', label: 'Pattern and imagery' },
  { id: 'icons', label: 'Iconography' },
  { id: 'motion', label: 'Motion' },
  { id: 'components', label: 'Components' },
  { id: 'applications', label: 'Applications' },
  { id: 'voice', label: 'How we sound' },
  { id: 'words', label: 'Words matter' },
  { id: 'usage', label: 'Usage guidelines' },
  { id: 'ai', label: 'For AI and developers' },
] as const;

export type ManualSectionId = (typeof MANUAL_SECTIONS)[number]['id'];

export const BRAND = {
  meta: {
    version: '1.0.0',
    revision: 'REV 1.0',
    lastUpdated: '2026-11-25',
    status: 'IN SERVICE',
    description:
      'Pipemill brand guidelines as structured data, for AI agents and developers. Pipemill is the open-source GTM factory. One idea: Milled. The logo is a wordmark with one ear folded back: nothing passes by default. Three inks: Iron, Flour and Gate, the single signal accent.',
  },

  manual: {
    title: 'Pipemill brand manual',
    statusStrip: ['PIPEMILL BRAND MANUAL', 'REV 1.0', '2026-11-25', 'STATUS: IN SERVICE'],
    readouts: [
      { label: 'Status', value: 'In service' },
      { label: 'Field operation', value: 'Brand manual' },
      { label: 'Rev', value: '1.0 / 2026-11-25' },
      { label: 'Default policy', value: 'Hold' },
    ],
    lead: 'One idea, one wordmark, three inks. The name has one ear folded back, because nothing passes by default. This manual is the shift log for every Pipemill surface. Everything on this page also ships as machine-readable tokens.',
    sections: MANUAL_SECTIONS,
  },

  identity: {
    name: 'Pipemill',
    url: BRAND_URL,
    domain: 'pipemill.ai',
    category: 'The open-source GTM factory',
    tagline: 'Pipeline, milled.',
    idea: 'Milled.',
    ideaBody:
      'A mill is the oldest factory: a fixed process, a source of power, a gate that controls the flow, and a miller who keeps the machine true. Something that has been milled has been through the machine and carries proof of it. Pipemill puts pipeline through the mill: every signal is graded, gated, stamped and traceable.',
    oneLiner: {
      full: 'Pipemill is the open-source GTM factory: a multi-tenant system of governance for go-to-market workflows. An Org holds Workspaces, one per product. Each Workflow has Stages. Each Stage runs Actions, measures with Checks, and a Policy decides whether an Item advances. A Curator reads run traces and proposes better prompts, specs and workflows. Hosted or self-hosted.',
      tight: 'The open-source GTM factory. Every signal runs through stages, checks and policies.',
    },
    positioning:
      'For GTM engineers and founders running more than one motion across more than one product, Pipemill is the open-source GTM factory that runs every signal through stages, checks and policies, so pipeline only advances when it has earned it. Every Pipemill action passes a gate and leaves a trace, and the factory gets better every run.',
    firstWorkflow: 'AEO tracking',
    nameRule:
      'Always "Pipemill": one word, capital P only. Never "PipeMill", "Pipe Mill" or "pipemill" in prose. Lowercase belongs to the wordmark and the domain. Where a URL appears, write pipemill.ai.',
    nameMeaning:
      'The pipe is pipeline. The mill is the machine. Our imagery is always the mill and the mule that worked it: the gate, the ear, the tag, the milled edge. Never pipes, elbows, valves, wrenches or water drops.',
    nameForms: {
      correct: ['Pipemill', 'pipemill.ai', 'Pipemill Cloud'],
      incorrect: ['PipeMill', 'Pipe Mill', 'pipemill (in prose)', 'PIPEMILL (outside mono labels)'],
    },
  },

  artifacts: [
    {
      number: '01',
      name: 'The Folded Ear',
      role: 'The logo',
      body: 'Mules walked the horse mills, and a mule tells you what it thinks with its ears. The first l of the double l in "pipemill" folds back 25 degrees. Ear back means Hold. The logo reports a policy outcome, and its default is the same as ours: nothing passes by default.',
    },
    {
      number: '02',
      name: 'The Milled Edge',
      role: 'The pattern',
      body: 'Coins got reeded edges in the 17th century so anyone could tell if one had been clipped. Isaac Newton, as Warden of the Royal Mint, spent years prosecuting clippers and counterfeiters. A milled edge is proof nothing was shaved off: governance you can feel.',
    },
    {
      number: '03',
      name: 'The Ear Tag',
      role: 'The per-run stamp',
      body: 'Every item leaving a mill carried a lot number and an inspection stamp. Every animal in a herd carries a numbered tag in its ear. Ours are one component: every run leaves with its own numbered tag, and every surface labels items like a factory floor.',
    },
  ],

  pillars: {
    intro: 'Three things make pipeline milled. Gated. Runs anywhere. Gets truer every run.',
    items: [
      {
        number: '01',
        name: 'Gated',
        headline: 'Policies decide what advances.',
        body: 'Deny always wins. A missing or stale check holds the item. It never passes by default. Approvals expire and never approve themselves.',
      },
      {
        number: '02',
        name: 'Runs anywhere',
        headline: 'Local scripts or cloud services.',
        body: 'Open source. Self-host with docker-compose, or use Pipemill Cloud. Runners pull work, so nothing opens a port.',
      },
      {
        number: '03',
        name: 'Gets truer every run',
        headline: 'The miller keeps the mill true.',
        body: 'Every run leaves a trace. The Curator reads the traces and proposes better prompts, specs and workflows. Evals decide what gets promoted.',
      },
    ],
  },

  principles: [
    {
      name: 'One mill, many workspaces',
      body: 'An Org holds one Workspace per product. One factory, one set of gates, every motion.',
    },
    {
      name: 'Simple factories first',
      body: 'A board, a trigger, one action. Add stages when the first one runs true.',
    },
    {
      name: 'Evidence over vibes',
      body: 'Every check returns status, value and evidence. Nothing advances on a guess.',
    },
    {
      name: 'Shadow before live',
      body: 'New workflows run in shadow, then a sample, then full volume.',
    },
  ],

  colors: {
    identity: IDENTITY_COLORS,
    light: LIGHT_COLORS,
    dark: DARK_COLORS,
    all: [...IDENTITY_COLORS, ...LIGHT_COLORS, ...DARK_COLORS] as BrandColor[],
    contrast: CONTRAST_PAIRS,
    gateRule: {
      headline: 'One accent. Never a gradient.',
      body: 'Gate covers at most 5% of any surface. The one exception is a deliberate gate slab: a full-bleed Gate band, allowed once per page, for the call to action. Gate always carries Iron text. Gate on Flour measures 1.4:1, so it is forbidden for text or thin marks on light. Use Gate Ink there.',
      maxCoverage: 0.05,
      never: ['A gradient', 'Purple', 'Mint', 'A second accent', 'Gate text on Flour'],
    },
  },

  modes: {
    light: {
      appliesTo: 'The default. The site, docs and the app in light mode.',
      colorScheme: 'light',
      radius: '0px. Square corners everywhere. Only status dots are round.',
      tokens: LIGHT_TOKENS,
    },
    dark: {
      appliesTo: 'The app in dark mode, social cards, the README banner and the app icon.',
      colorScheme: 'dark',
      radius: '0px. Square corners everywhere. Only status dots are round.',
      tokens: DARK_TOKENS,
    },
  },

  typography: {
    line: 'One family, milled to width.',
    license: 'SIL Open Font License, served from Google Fonts.',
    fonts: [
      {
        name: 'Archivo',
        cssVariable: '--font-archivo',
        utility: 'font-sans',
        axes: 'wdth 62 to 125, wght 100 to 900',
        usage:
          'Display and text. Headlines at width 125 (Expanded), weight 800, tracking -0.02em, sentence case. Body at width 100, weight 400.',
      },
      {
        name: 'Martian Mono',
        cssVariable: '--font-martian-mono',
        utility: 'font-mono',
        axes: 'wdth 75 to 112.5, wght 100 to 800',
        usage:
          'Labels, data, tags and code. Kickers and inspection tags: uppercase, width 87.5, weight 500, tracking 0.08em, 11 to 12px.',
      },
      {
        name: 'Bevan',
        cssVariable: '--font-bevan',
        utility: 'font-wordmark',
        axes: 'One weight, 400',
        usage:
          'The wordmark only. A wood-type slab, outlined to paths and then cut: square tittles and one folded ear. Never a headline, never body text.',
      },
    ],
    wordmark:
      'The wordmark starts as Bevan, outlined to paths, with square tittles and the folded ear. It is never typed live: typed Bevan has two straight ears, and that is a different word.',
    widths: [
      {
        wdth: 125,
        name: 'Expanded',
        weight: 800,
        sample: 'Every stage has a gate.',
        usage: 'Headlines',
      },
      {
        wdth: 100,
        name: 'Normal',
        weight: 400,
        sample: 'A missing or stale check holds the item. It never passes by default.',
        usage: 'Body text',
      },
      {
        wdth: 75,
        name: 'Condensed',
        weight: 600,
        sample: '37 items ran. 31 passed. 6 held at Qualify.',
        usage: 'Dense tables and figures',
      },
    ],
    styles: [
      {
        name: 'Poster',
        family: 'Archivo',
        wdth: 125,
        weight: 800,
        size: 'Fluid, 52px to 152px',
        px: 152,
        tracking: '-0.03em',
        usage: 'The manual hero, slides and print. One line of it per surface.',
      },
      {
        name: 'Hero',
        family: 'Archivo',
        wdth: 125,
        weight: 800,
        size: '64px, 72px at md',
        px: 72,
        tracking: '-0.02em',
        usage: 'One per page.',
      },
      {
        name: 'H2',
        family: 'Archivo',
        wdth: 125,
        weight: 800,
        size: '44px',
        px: 44,
        tracking: '-0.02em',
        usage: 'Section titles.',
      },
      {
        name: 'H3',
        family: 'Archivo',
        wdth: 125,
        weight: 700,
        size: '24px',
        px: 24,
        tracking: '-0.01em',
        usage: 'Card and block titles.',
      },
      {
        name: 'Body large',
        family: 'Archivo',
        wdth: 100,
        weight: 400,
        size: '19px',
        px: 19,
        tracking: '0',
        usage: 'Leads and hero subtext.',
      },
      {
        name: 'Body',
        family: 'Archivo',
        wdth: 100,
        weight: 400,
        size: '16px',
        px: 16,
        tracking: '0',
        usage: 'Running text.',
      },
      {
        name: 'Small',
        family: 'Archivo',
        wdth: 100,
        weight: 400,
        size: '14px',
        px: 14,
        tracking: '0',
        usage: 'Captions and dense UI.',
      },
      {
        name: 'Tag',
        family: 'Martian Mono',
        wdth: 87.5,
        weight: 500,
        size: '11px',
        px: 11,
        tracking: '0.08em',
        usage: 'Kickers and inspection tags. Uppercase.',
      },
    ],
  },

  logos: {
    name: 'Back is Left',
    story: 'The name has one ear folded back: nothing passes by default.',
    storyBody:
      'The logo is the word. "pipemill" is set in Bevan, a wood-type slab, and the first l of the double l folds back 25 degrees to the left, like the ear of a mule that has not decided yet. Ear back means Hold, and Hold is what every policy answers until a check earns a Pass. The wordmark always shows Hold. It has no Pass cut and no Deny cut.',
    system: [
      {
        key: 'wordmark',
        name: 'Wordmark',
        role: 'The logo',
        rule: 'Always Hold. The only mark that goes on trademark filings, headers and lockups.',
      },
      {
        key: 'icon',
        name: 'll icon',
        role: 'Favicon, app icon, badge',
        rule: 'The double l alone. Pass, Hold and Deny live here and nowhere else.',
      },
      {
        key: 'tag',
        name: 'Ear Tag',
        role: 'The per-run stamp',
        rule: 'A numbered Gate tag clipped to the folded ear. Receipts, exports, run records, social cards.',
      },
      {
        key: 'mascot',
        name: 'Mule Sign',
        role: 'The mascot',
        rule: 'Large surfaces only. Never the favicon, the app icon, a trademark filing or a lockup with the wordmark.',
      },
    ],
    construction: {
      base: 'Base: "pipemill" in Bevan, lowercase, outlined to paths',
      tittles: 'Tittles: both dots are cut square',
      fold: 'Fold: the first l of the double l folds 25 degrees to the LEFT, starting near the x-height',
      ear: 'Ear: the folded ear is as long as the upright ear, and both tips are cut 11 degrees off square',
      polygon: 'One polygon per letter. The fold has no seam and no joint',
      gate: 'Gate: on Iron only, the folded ear may be Gate. On Flour the word is one ink',
    },
    clearSpace:
      'Clear space is X on all four sides, where X is the x-height: the height of the bowl of the p.',
    minSize:
      'Minimum sizes: the full wordmark needs 120 px of width. From 64 to 120 px wide, use the small-size cut. Below 64 px, use the ll icon. The icon goes down to 16 px with pixel-fit cuts at 16, 32 and 48 px. The mascot is never smaller than 64 px tall.',
    smallSize: {
      rule: 'Below 120 px wide, the 25 degree fold shrinks to a notch that looks like a rendering fault. Use the small-size cut there: the fold becomes one clean notch that survives at 64 px.',
      threshold: 120,
      floor: 64,
      asset: '/brand/pipemill-wordmark-small.svg',
    },
    wordmark:
      'The wordmark is "pipemill" in lowercase Bevan, outlined to paths, with square tittles and the first l of the double l folded 25 degrees to the left. One ink: Iron on light, Flour on dark. On Iron only, the folded ear may be Gate.',
    icon: {
      body: 'The double l on a square Iron tile, with the folded ear in Gate. It is the favicon, the app icon and the badge on anything too small for the word. Square corners, always.',
      smallCuts:
        'At 16, 32 and 48 px the icon is redrawn on the pixel grid, with the whole folded ear in Gate and the fold on a pixel row.',
    },
    states: {
      rule: 'Pass, Hold and Deny live in the ll icon only. The wordmark always shows Hold.',
      items: [
        {
          outcome: 'pass',
          label: 'Pass',
          ears: 'Both ears up.',
          asset: '/brand/pipemill-state-pass.svg',
        },
        {
          outcome: 'hold',
          label: 'Hold',
          ears: 'One ear back. The default.',
          asset: '/brand/pipemill-state-hold.svg',
        },
        {
          outcome: 'deny',
          label: 'Deny',
          ears: 'Both ears back.',
          asset: '/brand/pipemill-state-deny.svg',
        },
      ],
    },
    tag: {
      name: 'Ear Tag',
      lockupName: 'Tagged Hold',
      story: 'Every run leaves with its own numbered tag.',
      body: 'A livestock ear tag with a round stud, neck, shoulders and rounded Gate panel. A 4-digit lot number is set in Martian Mono. The tilted panel stands above the folded ear, behind it, with the stud in front. The wordmark with its tag is called Tagged Hold. The inspection tag of the mill and the ear tag of the herd are one component.',
      specimenLot: '0412',
      use: ['Receipts', 'Exports', 'Run records', 'Social and OG cards'],
      never: ['The app icon', 'The favicon', 'The site header', 'A trademark filing'],
      blankRule:
        'Under 300 px wide the number cannot be read. Use the blank tag there, or the plain wordmark.',
      asset: '/brand/pipemill-tagged-hold.svg',
      assetDark: '/brand/pipemill-tagged-hold-dark.svg',
    },
    mascot: {
      name: 'Mule Sign',
      story: 'A mule at the gate, one ear back. It has not decided yet.',
      body: 'Mules walked the horse mills, and the spinning mule of 1779 ran the textile mills. Ours is a sign: a mule head with tapered ears, wide at the base, and a mane of even vertical reeding ticks. The folded ear points the same way as the wordmark. One flat ink. On Iron, only the tip of the back ear is Gate.',
      rule: 'Large surfaces only.',
      allowed: ['Merch', 'Flour sacks', 'The 404 page', 'Social'],
      never: [
        'The favicon',
        'The app icon',
        'Trademark filings',
        'Any lockup next to the wordmark',
      ],
      reason:
        'MuleSoft has a mule mascot, Max the Mule, in a category next to ours. A mule head next to our name, or standing in for it at icon size, risks confusion with their brand. So the mascot stays art for large surfaces, the wordmark stays the trademark, and the two never share a lockup.',
      minSize: '64 px tall',
      asset: '/brand/pipemill-mascot.svg',
    },
    perMode: {
      light: {
        summary: 'Iron wordmark on Flour or Paper. One ink.',
        wordmark: '/brand/pipemill-wordmark-iron.svg',
        lockup: '/brand/pipemill-lockup-light.svg',
        icon: '/brand/pipemill-icon-light.svg',
      },
      dark: {
        summary: 'Flour wordmark on Iron. The folded ear may be Gate.',
        wordmark: '/brand/pipemill-wordmark-gate-ear.svg',
        lockup: '/brand/pipemill-lockup-dark.svg',
        icon: '/brand/pipemill-icon.svg',
      },
    },
    explorations: [
      {
        key: '01',
        name: 'Back is Left',
        status: 'Chosen',
        verdict: 'The logo',
        asset: '/brand/pipemill-wordmark-iron.svg',
        body: 'The first l folds left. It reads "pipemill" at 96, 160 and 400 px, and it is the only direction both critics kept.',
      },
      {
        key: '03',
        name: 'Ear Tag',
        status: 'Kept',
        verdict: 'The per-run tag system',
        asset: '/brand/explorations/ear-tag.svg',
        body: 'A lot-number tag on plain Bevan. Killed as the lead: it read as a price tag. Kept as the tag, now clipped to the folded ear.',
      },
      {
        key: '04',
        name: 'Mule Sign v2',
        status: 'Kept',
        verdict: 'The mascot',
        asset: '/brand/pipemill-mascot-iron.svg',
        body: 'A straight-edge mule head. Killed as a mark: it fails at 16 px and sits too close to MuleSoft. Kept for large surfaces.',
      },
      {
        key: '02',
        name: 'Hinge Fixed',
        status: 'Killed',
        verdict: 'Killed',
        asset: '/brand/explorations/hinge-fixed.svg',
        body: 'A small flick to the right on the last l. The gesture disappears at size.',
      },
      {
        key: 'R3',
        name: 'Assay Row',
        status: 'Not used',
        verdict: 'Not used',
        asset: '/brand/explorations/assay-row.svg',
        body: 'A row of inspection hallmarks for every run. One stamp system is enough, and the Ear Tag won.',
      },
    ],
    history:
      'Four critique rounds, two generators, two critics. The kill rule: a direction needs 8 of 10 for both uniqueness and meaning. An earlier symbol, a grinding stone seen from above, was killed along the way and is not shown.',
    misuse: [
      { key: 'gradient', label: 'Never recolor it or fill it with a gradient.' },
      { key: 'rotated', label: 'Never rotate it.' },
      { key: 'unfolded', label: 'Never straighten the ear. Typed Bevan is not the logo.' },
      { key: 'outlined', label: 'Never outline it.' },
      { key: 'stretched', label: 'Never stretch or squeeze it.' },
      { key: 'low-contrast', label: 'Never set the word in Gate on Flour. 1.4:1 fails.' },
      {
        key: 'mascot-lockup',
        label: 'Never lock the mascot up with the wordmark. MuleSoft conflict risk.',
      },
      { key: 'mascot-favicon', label: 'Never use the mascot as a favicon or app icon.' },
    ],
    assets: LOGO_ASSETS,
    rules: [
      'The logo is the wordmark with the folded ear. It always shows Hold.',
      'One ink: Iron on light, Flour on dark. On Iron only, the folded ear may be Gate.',
      'The wordmark is outlined paths. Never type it live, and never straighten the ear.',
      'Below 120 px wide, use the small-size cut. Below 64 px, use the ll icon.',
      'Pass, Hold and Deny live in the ll icon only.',
      'The favicon and the app icon are the ll icon. Never the mascot, never the tag.',
      'The Ear Tag goes on receipts, exports, run records and social cards. Never in the app icon.',
      'The mascot is for large surfaces only: merch, flour sacks, the 404 page, social. Never the favicon, the app icon, a trademark filing, or any lockup next to the wordmark. Reason: MuleSoft has a mule mascot, Max the Mule.',
      'Never recolor into a second hue, outline, rotate, stretch or add effects.',
    ],
  },

  pattern: {
    reeding: {
      name: 'Reeding',
      spec: '1px vertical ticks at a 4px pitch. Every 5th tick is longer, like a gauge.',
      usage:
        'Rules, progress gauges, loading bars and section dividers. Filled ticks are passed stages.',
    },
    hazard: {
      name: 'Floor stripes',
      spec: 'Diagonal stripes at 45 degrees, 8px Gate and 8px Iron, like the floor marking at a machine guard.',
      usage:
        'A warning band for a held or denied area, and one edge of a hero panel. At most one band per view. Never a background for text.',
    },
    hatch: {
      name: 'Hatch',
      spec: 'Fields of parallel 1px ink lines at 45 degrees, 6px apart.',
      usage: 'A quiet fill for shadow mode and clear-space diagrams. It marks an area as not live.',
    },
    registration: {
      name: 'Registration marks',
      spec: 'Crop marks at the corners of hero panels and mockups.',
      usage: 'A nod to print and inspection. They frame a surface as a finished, checked piece.',
    },
    illustration: {
      name: 'Illustration',
      spec: 'Flat solid signs cut on straight edges, like a stencil on a crate: the mule, the ear, the tag, the gate. One ink per shape.',
      usage: 'No outlines, no shading. Gate marks one spot, such as the tip of an ear.',
      never: [
        '3D',
        'Glass',
        'Gradients',
        'Robots',
        'Glowing brains',
        'Stock photos of people',
        'Pipes, valves or wrenches',
      ],
    },
    photography:
      'If ever: real tools and real paper, shot overhead in flat light on flour-colored backgrounds.',
  },

  iconography: {
    spec: '24px grid. 1.5px stroke. Square caps and miter joins. No rounded ends. No fills, except a Gate dot for active.',
    icons: [
      { name: 'org', label: 'Org', note: 'The mill. Holds every workspace.' },
      { name: 'workspace', label: 'Workspace', note: 'One per product.' },
      { name: 'workflow', label: 'Workflow', note: 'Stages in a row.' },
      { name: 'stage', label: 'Stage', note: 'One part of the run.' },
      { name: 'action', label: 'Action', note: 'A script or a service.' },
      { name: 'check', label: 'Check', note: 'A measurement.' },
      { name: 'policy', label: 'Policy', note: 'The gate.' },
      { name: 'approval', label: 'Approval', note: 'A stamp. It expires.' },
      { name: 'runner-local', label: 'Runner, local', note: 'Pulls work on your machine.' },
      { name: 'runner-cloud', label: 'Runner, cloud', note: 'Pulls work in Pipemill Cloud.' },
      { name: 'curator', label: 'Curator', note: 'The mill bill. Keeps the mill true.' },
      { name: 'trace', label: 'Trace', note: 'What ran, in order.' },
      { name: 'pass', label: 'Pass', note: 'The item advances.' },
      { name: 'hold', label: 'Hold', note: 'The item waits at the gate.' },
      { name: 'deny', label: 'Deny', note: 'The item stops. Deny wins.' },
    ],
  },

  motion: {
    line: 'The mill turns in steps.',
    curve: 'cubic-bezier(0.2, 0, 0, 1)',
    duration: '240ms',
    gateDuration: '160ms',
    rules: [
      'Items advance stage to stage in discrete steps. Never floaty.',
      'One curve for UI: cubic-bezier(0.2, 0, 0, 1) at 240ms.',
      'The loading ear flicks between Hold and Pass in one step. It has not decided yet.',
      'A gate opens and closes with a 160ms vertical wipe.',
      'The reeding gauge fills tick by tick.',
      'Nothing bounces. Nothing loops except the loading ear.',
      'prefers-reduced-motion renders everything settled.',
    ],
    demos: [
      {
        key: 'ear',
        name: 'Loading ear',
        spec: 'steps(1), 960ms per flick',
        body: 'While a policy decides, the ll icon flicks one ear: back, up, back. No tween. When the answer lands, the ears stop on it.',
      },
      {
        key: 'gauge',
        name: 'Reeding gauge',
        spec: 'steps(1 per tick)',
        body: 'Progress fills one tick at a time. A filled tick is a passed stage or a finished unit of work.',
      },
      {
        key: 'gate',
        name: 'Gate wipe',
        spec: '160ms vertical wipe',
        body: 'The gate leaf lifts to let an item through and drops to hold it. Vertical only.',
      },
    ],
  },

  components: {
    rules: [
      'Square corners everywhere. Radius 0. Only status dots are round.',
      '1px borders do the work.',
      'No shadows, except a 2px hard offset shadow in Iron on the primary call to action. It reads as stamped.',
    ],
    buttons: [
      { variant: 'primary', label: 'Run the workflow', spec: 'Iron fill, Flour text' },
      { variant: 'signal', label: 'Open the gate', spec: 'Gate fill, Iron text' },
      { variant: 'secondary', label: 'Read the trace', spec: '1px outline' },
      { variant: 'ghost', label: 'Skip', spec: 'Text only' },
    ],
    inspectionTag: {
      example: 'LOT 0412 · STAGE 03/05 QUALIFY · POLICY PASS · RUN 2026-11-23',
      spec: 'The signature component, and the Ear Tag written out in full. A mono uppercase chip with the lot number, the stage, the policy outcome and the run date. The lot number is the number on the tag.',
    },
    outcomes: [
      {
        outcome: 'pass',
        label: 'PASS',
        meaning: 'Every check is fresh and green. The item advances.',
      },
      {
        outcome: 'hold',
        label: 'HOLD',
        meaning: 'A check is missing or stale, or an approval is pending. The item waits.',
      },
      { outcome: 'deny', label: 'DENY', meaning: 'A rule refused the item. Deny always wins.' },
    ],
    stages: ['Capture', 'Enrich', 'Qualify', 'Draft', 'Send'],
    workflowCard: {
      workspace: 'Acme Analytics',
      workflow: 'AEO tracking',
      item: 'northwind.io',
      lot: '0412',
      stage: 3,
      run: '2026-11-23',
      checks: [
        {
          name: 'domain.reachable',
          status: 'pass',
          value: '200',
          evidence: 'GET / in 412 ms',
        },
        {
          name: 'answer.cited',
          status: 'pass',
          value: '3 of 5',
          evidence: '3 answer engines cite the domain',
        },
        {
          name: 'intent.score',
          status: 'error',
          value: 'none',
          evidence: 'check is 9 days stale',
        },
        {
          name: 'contact.verified',
          status: 'warn',
          value: '0.71',
          evidence: 'below 0.80 target',
        },
      ],
      outcome: 'hold',
      reason: 'intent.score is stale. A stale check holds the item.',
    },
    runLog: [
      { time: '09:14:02', level: 'run', text: 'workflow aeo-tracking started. 37 items.' },
      { time: '09:14:03', level: 'stage', text: '01 capture. 37 in, 37 out.' },
      { time: '09:14:11', level: 'stage', text: '02 enrich. 37 in, 37 out.' },
      { time: '09:14:19', level: 'pass', text: '03 qualify. 31 passed.' },
      { time: '09:14:19', level: 'hold', text: '03 qualify. 6 held: missing intent check.' },
      { time: '09:14:20', level: 'deny', text: '03 qualify. 0 denied.' },
      { time: '09:14:20', level: 'trace', text: 'trace written. run 2026-11-23, lot 0412.' },
    ],
  },

  applications: [
    { key: 'site', name: 'Site hero', spec: 'pipemill.ai' },
    { key: 'og', name: 'Social card', spec: '1200 x 630', route: '/brand/og' },
    {
      key: 'deck',
      name: 'Deck title slide',
      spec: '1920 x 1080, 16:9',
      route: '/brand/deck-title',
    },
    {
      key: 'readme',
      name: 'README banner',
      spec: '1280 x 320',
      route: '/brand/readme-banner',
    },
    { key: 'favicon', name: 'Favicon and app icon', spec: 'll icon, 16 px cut to 512 px tile' },
    { key: 'sack', name: 'Flour sack and tote', spec: 'Mascot, large surface, 2 inks' },
    { key: '404', name: '404 page', spec: 'Mascot, large surface', route: '/404' },
  ],

  notFound: {
    code: '404',
    title: 'Held at the gate.',
    body: 'This page did not pass. No route matches this path, so the policy holds it here. Nothing advances on a guess.',
    log: [
      'GET this page. 0 routes matched.',
      'policy: hold. reason: page not found.',
      'next action: go back to the mill.',
    ],
    actions: [
      { label: 'Back to the mill', href: '/' },
      { label: 'Read the brand manual', href: '/brand' },
    ],
  },

  voice: {
    persona:
      'The Miller: exact, unhurried, accountable. Speaks like a shift log: what ran, what passed, what held, and why.',
    markers: [
      'Short declarative sentences.',
      'Numbers with units.',
      'Present tense.',
      'Second person, singular team: your workflow, your runner, your gate.',
      'No exclamation marks.',
      'No em dashes in site copy.',
    ],
    craftVerbs: ['run', 'grade', 'gate', 'hold', 'pass', 'stamp', 'trace', 'tag', 'mill', 'grind'],
    lines: [
      '37 items ran. 31 passed. 6 held at Qualify: missing intent check.',
      'Deny wins.',
      'Nothing advances on a guess.',
    ],
    sliders: [
      { is: 'Precise', not: 'pedantic', position: 0.3 },
      { is: 'Confident', not: 'loud', position: 0.35 },
      { is: 'Industrial', not: 'militaristic', position: 0.4 },
      { is: 'Warm', not: 'cute', position: 0.3 },
    ],
    rewrites: [
      {
        not: 'Our AI finds and books your best leads while you sleep.',
        write: '37 items ran overnight. 31 passed. 6 held at Qualify.',
      },
      {
        not: 'Something went wrong. Please try again later.',
        write: 'Held at Qualify. intent.score is 9 days stale. Run the check again.',
      },
      {
        not: 'Set it and forget it.',
        write: 'Every stage has a gate. You set the policy.',
      },
    ],
    bannedWords: [
      'revolutionize',
      'supercharge',
      '10x',
      'unleash',
      'seamless',
      'streamline',
      'autopilot',
      'magic',
      'AI SDR',
      'effortless',
      'game-changing',
      'synergy',
    ],
    noEmDashes: true,
    noExclamationMarks: true,
  },

  taglines: {
    primary: 'Pipeline, milled.',
    alternates: [
      'Raw signal in. Milled pipeline out.',
      'Nothing leaves the mill unmarked.',
      'Every stage has a gate.',
      'The GTM factory you can audit.',
    ],
    internal: {
      line: 'Grind fine.',
      note: 'Internal rally line, from "the mills of God grind slowly, yet they grind exceeding small".',
    },
  },

  terminology: {
    ontology: ['Org', 'Workspace', 'Workflow', 'Stage', 'Item', 'Run', 'Trace'] as const,
    stageParts: ['Action', 'Check', 'Policy'] as const,
    roles: ['Runner (local or cloud)', 'Curator', 'Approval'],
    outcomes: {
      policy: ['Pass', 'Hold', 'Deny'],
      check: ['pass', 'fail', 'warn', 'error'],
      note: 'Policies return Pass, Hold or Deny. Checks return pass, fail, warn or error. Never approve, reject or fail for a policy outcome.',
    },
    preferred: [
      {
        term: 'Org > Workspace > Workflow > Stage > Item > Run > Trace',
        context: 'The ontology, locked. A Stage holds Actions, Checks and a Policy.',
      },
      { term: 'Workflow', context: 'Always. Stages in order, each with a gate.' },
      { term: 'Action', context: 'What a Stage runs: a local script or a cloud service.' },
      { term: 'Check', context: 'A measurement. Returns status, value and evidence.' },
      { term: 'Policy', context: 'Decides whether an Item advances: Pass, Hold or Deny.' },
      { term: 'Workspace', context: 'One per product, inside an Org.' },
      { term: 'Runner', context: 'Local or cloud. Runners pull jobs. No open ports.' },
      {
        term: 'Curator',
        context: 'Reads run traces and proposes better prompts, specs and workflows.',
      },
      { term: 'self-host', context: 'Always, with docker-compose.' },
    ] as BrandTerm[],
    avoid: [
      { term: 'sequence, playbook', reason: 'It is a Workflow.' },
      { term: 'step, task', reason: 'It is an Action.' },
      { term: 'project', reason: 'It is a Workspace.' },
      { term: 'on-prem', reason: 'Say self-host.' },
      {
        term: 'approve, reject, fail (for a policy)',
        reason: 'Policy outcomes are Pass, Hold and Deny.',
      },
      {
        term: 'pipes, plumbing',
        reason: 'Our pipe is pipeline. Our imagery is the mill.',
      },
    ] as BrandAvoidTerm[],
  },

  guidelines: {
    dos: [
      'Use semantic tokens only. The mode decides the mapping.',
      'Keep corners square. Radius 0 everywhere. Only status dots are round.',
      'Let 1px borders do the work.',
      'Use Gate once per view, with Iron text on it.',
      'Use Gate Ink for gate-colored text on light.',
      'Label items like a factory floor: lot, stage, policy, run.',
      'Write numbers with units, in present tense.',
      'Say Pass, Hold and Deny for policy outcomes.',
      'Use the wordmark files as shipped. Below 120 px wide, use the small-size cut.',
      'Use the ll icon for the favicon, the app icon and badges.',
      'Clip the Ear Tag to receipts, exports, run records and social cards.',
      'Keep the mascot to large surfaces: merch, flour sacks, the 404 page, social.',
      'Write the domain as pipemill.ai wherever a URL appears.',
    ],
    donts: [
      'Never use a gradient, glass, purple or mint.',
      'Never use rounded pills, rounded cards or soft shadows.',
      'Never set Gate as text or thin marks on Flour.',
      'Never add a second accent color.',
      'Never recolor, outline, rotate, stretch or add effects to the wordmark.',
      'Never type the wordmark live, and never straighten the folded ear.',
      'Never show Pass or Deny in the wordmark. States live in the ll icon.',
      'Never put the mascot on the favicon, the app icon or a trademark filing.',
      'Never lock the mascot up next to the wordmark. MuleSoft has a mule mascot, Max the Mule.',
      'Never put the Ear Tag in the app icon.',
      'Never draw pipes, elbows, valves, wrenches or water drops.',
      'Never show 3D objects, robots, glowing brains or stock photos of people.',
      'No em dashes and no exclamation marks in site copy.',
      'Never use a word from the banned list.',
      'Never let motion bounce or loop, except the loading ear.',
    ],
  },

  visualPersonality: {
    attributes: ['industrial', 'exact', 'flat ink', 'stencil-cut', 'square', 'warm paper'],
    avoid: [
      'glassy 3D objects',
      'mint green',
      'pill buttons',
      'rounded cards',
      'soft shadows',
      'gradients',
      'purple',
      'pipe or plumbing imagery',
    ],
  },
} as const;

export type Brand = typeof BRAND;

/**
 * Look up a color's hex by name. Throws at build time if the swatch data and a
 * component drift apart: /brand is fully static, so a rename here fails the
 * build instead of rendering a fallback.
 */
export function brandHex(group: readonly BrandColor[], name: string): string {
  const color = group.find((c) => c.name === name);
  if (!color) throw new Error(`Unknown brand color: ${name}`);
  return color.hex;
}

/** Look up a manual section and its 1-based number, for kickers and anchors. */
export function manualSection(id: ManualSectionId) {
  const index = MANUAL_SECTIONS.findIndex((s) => s.id === id);
  if (index < 0) throw new Error(`Unknown manual section: ${id}`);
  return {
    id,
    label: MANUAL_SECTIONS[index].label,
    number: String(index + 1).padStart(2, '0'),
  };
}

/**
 * Off-brand colors, used only by the misuse grid on /brand to render the
 * forbidden gradient. Kept here so no component carries a raw hex.
 */
export const MISUSE_COLORS = { from: '#7C3AED', to: '#5EEAD4' } as const;
