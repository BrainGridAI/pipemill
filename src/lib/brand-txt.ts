import { BRAND, type BrandColor } from '@/lib/brand-data';

/**
 * buildBrandTxt is a human-readable plain-text brand reference, served at
 * /brand.txt: banner headers and simple fixed-width tables. ASCII only, so it
 * pastes cleanly into any terminal or doc.
 */

const WIDTH = 78;

// BRAND may carry a few non-ASCII glyphs (the middle dot of an inspection tag).
// Fold them so the plain-text surface stays ASCII.
function ascii(s: string): string {
  return s.replace(/·/g, '|').replace(/→/g, '->').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}

function banner(title: string): string {
  const rule = '='.repeat(WIDTH);
  const pad = Math.max(0, Math.floor((WIDTH - title.length) / 2));
  return [rule, `${' '.repeat(pad)}${title}`, rule].join('\n');
}

function pad(value: string, width: number): string {
  return value.length >= width ? `${value.slice(0, width - 1)} ` : value.padEnd(width);
}

function colorTable(colors: readonly BrandColor[]): string {
  const header = `${pad('Name', 22)}${pad('Hex', 12)}CSS Variable`;
  const rule = '-'.repeat(WIDTH);
  const rows = colors.map((c) => `${pad(c.name, 22)}${pad(c.hex, 12)}${c.cssVariable}`);
  return [header, rule, ...rows].join('\n');
}

function list(items: readonly string[]): string {
  return items.map((i) => `  - ${i}`).join('\n');
}

export function buildBrandTxt(): string {
  const b = BRAND;
  const out: string[] = [];

  out.push(banner(`${b.identity.name.toUpperCase()} BRAND REFERENCE`));
  out.push('');
  out.push(`Version: ${b.meta.version} (${b.meta.revision})`);
  out.push(`Last updated: ${b.meta.lastUpdated}`);
  out.push(`Status: ${b.meta.status}`);
  out.push(`URL: ${b.identity.url}`);
  out.push(`Category: ${b.identity.category}`);
  out.push('');
  out.push(`Tagline: ${b.identity.tagline}`);
  out.push(`The one idea: ${b.identity.idea}`);
  out.push('');
  out.push('Machine-readable: /brand.json   Agent-readable: /brand.md   Visual: /brand');
  out.push('');

  out.push(banner('WHAT PIPEMILL IS'));
  out.push('');
  out.push(b.identity.oneLiner.full);
  out.push('');
  out.push(b.identity.ideaBody);
  out.push('');
  for (const a of b.artifacts) out.push(`  ${a.number} ${a.name} (${a.role}). ${a.body}`);
  out.push('');

  out.push(banner('WHAT WE STAND FOR'));
  out.push('');
  for (const p of b.pillars.items) out.push(`  ${p.number} ${p.name}. ${p.headline} ${p.body}`);
  out.push('');
  for (const p of b.principles) out.push(`  - ${p.name}. ${p.body}`);
  out.push('');

  out.push(banner('NAME'));
  out.push('');
  out.push(b.identity.nameRule);
  out.push(b.identity.nameMeaning);
  out.push('');

  out.push(banner('COLORS'));
  out.push('');
  out.push('Identity');
  out.push(colorTable(b.colors.identity));
  out.push('');
  out.push('Light mode');
  out.push(colorTable(b.colors.light));
  out.push('');
  out.push('Dark mode');
  out.push(colorTable(b.colors.dark));
  out.push('');
  out.push('Contrast (WCAG 2, computed from hex)');
  out.push(
    `${pad('Foreground', 16)}${pad('Background', 12)}${pad('Mode', 8)}${pad('Ratio', 10)}WCAG`
  );
  out.push('-'.repeat(WIDTH));
  for (const p of b.colors.contrast) {
    out.push(
      `${pad(p.fg, 16)}${pad(p.bg, 12)}${pad(p.mode, 8)}${pad(`${p.ratio.toFixed(2)}:1`, 10)}${p.grade}${p.forbidden ? ' (forbidden)' : ''}`
    );
  }
  out.push('');
  out.push(`Gate rule: ${b.colors.gateRule.headline} ${b.colors.gateRule.body}`);
  out.push('');

  out.push(banner('TYPOGRAPHY'));
  out.push('');
  out.push(`${b.typography.line} ${b.typography.license}`);
  for (const f of b.typography.fonts) out.push(`  - ${f.name} (${f.axes}). ${f.usage}`);
  out.push(`  - ${b.typography.wordmark}`);
  out.push('');
  out.push(`${pad('Style', 14)}${pad('Family', 16)}${pad('Width', 8)}${pad('Weight', 8)}Size`);
  out.push('-'.repeat(WIDTH));
  for (const s of b.typography.styles) {
    out.push(
      `${pad(s.name, 14)}${pad(s.family, 16)}${pad(String(s.wdth), 8)}${pad(String(s.weight), 8)}${s.size}`
    );
  }
  out.push('');

  out.push(banner('LOGO'));
  out.push('');
  out.push(b.logos.story);
  out.push(b.logos.storyBody);
  out.push('');
  for (const s of b.logos.system) out.push(`  - ${s.name} (${s.role}). ${s.rule}`);
  out.push('');
  out.push('Rules');
  out.push(list(b.logos.rules));
  out.push('');
  out.push('Wordmark');
  out.push(b.logos.wordmark);
  out.push(list(Object.values(b.logos.construction)));
  out.push(b.logos.clearSpace);
  out.push('');
  out.push('Small sizes');
  out.push(b.logos.minSize);
  out.push(b.logos.smallSize.rule);
  out.push('');
  out.push('The ll icon and its states');
  out.push(`${b.logos.icon.body} ${b.logos.icon.smallCuts}`);
  out.push(b.logos.states.rule);
  for (const s of b.logos.states.items) out.push(`  - ${s.label}: ${s.ears}`);
  out.push('');
  out.push(`${b.logos.tag.name} (${b.logos.tag.lockupName})`);
  out.push(`${b.logos.tag.story} ${b.logos.tag.body}`);
  out.push(b.logos.tag.blankRule);
  out.push(`  Use on: ${b.logos.tag.use.join(', ')}`);
  out.push(`  Never on: ${b.logos.tag.never.join(', ')}`);
  out.push('');
  out.push(`Mascot: ${b.logos.mascot.name}. ${b.logos.mascot.rule.toUpperCase()}`);
  out.push(`${b.logos.mascot.story} ${b.logos.mascot.body}`);
  out.push(`  Allowed on: ${b.logos.mascot.allowed.join(', ')}`);
  out.push(`  Never on: ${b.logos.mascot.never.join(', ')}`);
  out.push(`  Why: ${b.logos.mascot.reason}`);
  out.push(`  Minimum size: ${b.logos.mascot.minSize}`);
  out.push('');
  out.push('Misuse');
  out.push(list(b.logos.misuse.map((m) => m.label)));
  out.push('');

  out.push(banner('PATTERN, ICONS, MOTION'));
  out.push('');
  out.push(`Reeding: ${b.pattern.reeding.spec} ${b.pattern.reeding.usage}`);
  out.push(`Floor stripes: ${b.pattern.hazard.spec} ${b.pattern.hazard.usage}`);
  out.push(`Hatch: ${b.pattern.hatch.spec} ${b.pattern.hatch.usage}`);
  out.push(`Registration marks: ${b.pattern.registration.spec}`);
  out.push(`Illustration: ${b.pattern.illustration.spec} ${b.pattern.illustration.usage}`);
  out.push(`Icons: ${b.iconography.spec}`);
  out.push(`Icon set: ${b.iconography.icons.map((i) => i.name).join(', ')}`);
  out.push('');
  out.push(`Motion: ${b.motion.line}`);
  out.push(list(b.motion.rules));
  out.push('');

  out.push(banner('COMPONENTS'));
  out.push('');
  out.push(list(b.components.rules));
  for (const x of b.components.buttons) out.push(`  - Button, ${x.variant}: ${x.spec}`);
  out.push(`  - Inspection tag: ${b.components.inspectionTag.example}`);
  for (const o of b.components.outcomes) out.push(`  - ${o.label}: ${o.meaning}`);
  out.push('');

  out.push(banner('VOICE'));
  out.push('');
  out.push(b.voice.persona);
  out.push(list(b.voice.markers));
  out.push(`Craft verbs: ${b.voice.craftVerbs.join(', ')}`);
  out.push(`Tone: ${b.voice.sliders.map((s) => `${s.is}, not ${s.not}`).join('. ')}.`);
  out.push('');
  out.push('Example lines');
  out.push(list(b.voice.lines));
  out.push('');
  out.push(`Banned words: ${b.voice.bannedWords.join(', ')}`);
  out.push('');
  out.push(`Tagline: ${b.taglines.primary}`);
  out.push(list(b.taglines.alternates));
  out.push(`  - ${b.taglines.internal.line} ${b.taglines.internal.note}`);
  out.push('');

  out.push(banner('TERMINOLOGY'));
  out.push('');
  out.push(`Ontology: ${b.terminology.ontology.join(' > ')}`);
  out.push(`A Stage holds: ${b.terminology.stageParts.join(', ')}`);
  out.push(b.terminology.outcomes.note);
  out.push('');
  out.push('Preferred');
  for (const t of b.terminology.preferred) out.push(`  - ${t.term}: ${t.context}`);
  out.push('');
  out.push('Avoid');
  for (const t of b.terminology.avoid) out.push(`  - ${t.term}: ${t.reason}`);
  out.push('');

  out.push(banner('USAGE'));
  out.push('');
  out.push('Do');
  out.push(list(b.guidelines.dos));
  out.push('');
  out.push("Don't");
  out.push(list(b.guidelines.donts));
  out.push('');

  out.push(banner('ASSETS'));
  out.push('');
  for (const a of b.logos.assets) {
    out.push(`  ${pad(a.name, 26)}${pad(a.format, 5)}${pad(a.colorway, 26)}${a.size}`);
    out.push(`  ${' '.repeat(26)}${b.identity.url}${a.path}`);
  }
  out.push('');

  return `${ascii(out.join('\n'))}\n`;
}
