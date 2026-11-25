import { BRAND, type BrandColor, type ContrastPair } from '@/lib/brand-data';

/**
 * buildBrandMd renders the BRAND constant as an agent-readable brand reference,
 * served at /brand.md: a YAML frontmatter block carrying concrete tokens, then
 * imperative prose for an AI or developer consuming the system. Pure function
 * of BRAND.
 *
 * Copy rules apply to every line here: no em dashes, no exclamation marks.
 */

function yamlTokens(tokens: Record<string, string>, indent: string): string {
  return Object.entries(tokens)
    .map(([k, v]) => `${indent}${k}: "${v}"`)
    .join('\n');
}

function modeBlock(name: string, mode: (typeof BRAND.modes)[keyof typeof BRAND.modes]): string {
  return [
    `  ${name}:`,
    `    appliesTo: "${mode.appliesTo}"`,
    `    colorScheme: ${mode.colorScheme}`,
    `    radius: "${mode.radius}"`,
    '    tokens:',
    yamlTokens(mode.tokens, '      '),
  ].join('\n');
}

function colorTable(colors: readonly BrandColor[]): string {
  const head = '| Color | Hex | CSS variable | Usage |\n| --- | --- | --- | --- |';
  const rows = colors
    .map((c) => `| ${c.name} | \`${c.hex}\` | \`${c.cssVariable}\` | ${c.usage} |`)
    .join('\n');
  return `${head}\n${rows}`;
}

function contrastTable(pairs: readonly ContrastPair[]): string {
  const head =
    '| Foreground | Background | Mode | Ratio | WCAG | Usage |\n| --- | --- | --- | --- | --- | --- |';
  const rows = pairs
    .map(
      (p) =>
        `| ${p.fg} \`${p.fgHex}\` | ${p.bg} \`${p.bgHex}\` | ${p.mode} | ${p.ratio.toFixed(2)}:1 | ${p.grade} | ${p.usage} |`
    )
    .join('\n');
  return `${head}\n${rows}`;
}

function bullets(items: readonly string[]): string {
  return items.map((i) => `- ${i}`).join('\n');
}

export function buildBrandMd(): string {
  const b = BRAND;

  const frontmatter = [
    '---',
    `name: ${b.identity.name}`,
    `version: ${b.meta.version}`,
    `revision: ${b.meta.revision}`,
    `lastUpdated: ${b.meta.lastUpdated}`,
    `status: ${b.meta.status}`,
    `url: ${b.identity.url}`,
    `category: ${b.identity.category}`,
    `tagline: "${b.identity.tagline}"`,
    'modes:',
    modeBlock('light', b.modes.light),
    modeBlock('dark', b.modes.dark),
    'typography:',
    '  fonts:',
    b.typography.fonts
      .map(
        (f) =>
          `    - { name: "${f.name}", cssVar: "${f.cssVariable}", utility: "${f.utility}", axes: "${f.axes}" }`
      )
      .join('\n'),
    'motion:',
    `  curve: "${b.motion.curve}"`,
    `  duration: "${b.motion.duration}"`,
    `  gate: "${b.motion.gateDuration}"`,
    'radius: "0px"',
    '---',
  ].join('\n');

  const body = [
    `# ${b.identity.name} Brand`,
    '',
    '## Overview',
    '',
    b.identity.oneLiner.full,
    '',
    `The one idea: **${b.identity.idea}** ${b.identity.ideaBody}`,
    '',
    b.artifacts.map((a) => `- **${a.name}** (${a.role}). ${a.body}`).join('\n'),
    '',
    '## Positioning',
    '',
    b.identity.positioning,
    '',
    '## What we stand for',
    '',
    b.pillars.items.map((p) => `- **${p.name}.** ${p.headline} ${p.body}`).join('\n'),
    '',
    b.principles.map((p) => `- **${p.name}.** ${p.body}`).join('\n'),
    '',
    '## Name',
    '',
    `${b.identity.nameRule} ${b.identity.nameMeaning}`,
    '',
    '## Colors',
    '',
    `Semantic token names are constant across modes. Only the mapping changes. Use the tokens, never a hardcoded hex. ${b.colors.gateRule.headline} ${b.colors.gateRule.body}`,
    '',
    '### Identity',
    '',
    colorTable(b.colors.identity),
    '',
    '### Light mode',
    '',
    colorTable(b.colors.light),
    '',
    '### Dark mode',
    '',
    colorTable(b.colors.dark),
    '',
    '### Contrast',
    '',
    'Ratios are computed from the hex values with the WCAG 2 relative luminance formula.',
    '',
    contrastTable(b.colors.contrast),
    '',
    '## Typography',
    '',
    `${b.typography.line} ${b.typography.license} ${b.typography.wordmark}`,
    '',
    b.typography.fonts.map((f) => `- **${f.name}** (${f.axes}). ${f.usage}`).join('\n'),
    '',
    b.typography.styles
      .map(
        (s) =>
          `- **${s.name}**: ${s.family}, width ${s.wdth}, weight ${s.weight}, ${s.size}, tracking ${s.tracking}. ${s.usage}`
      )
      .join('\n'),
    '',
    '## Logo',
    '',
    `**${b.logos.story}** ${b.logos.storyBody}`,
    '',
    b.logos.system.map((s) => `- **${s.name}** (${s.role}). ${s.rule}`).join('\n'),
    '',
    '### Rules',
    '',
    bullets(b.logos.rules),
    '',
    '### Wordmark',
    '',
    `${b.logos.wordmark} ${b.logos.clearSpace}`,
    '',
    bullets(Object.values(b.logos.construction)),
    '',
    `- **Light mode:** ${b.logos.perMode.light.summary} Wordmark: \`${b.logos.perMode.light.wordmark}\`. Lockup: \`${b.logos.perMode.light.lockup}\`. Icon: \`${b.logos.perMode.light.icon}\`.`,
    `- **Dark mode:** ${b.logos.perMode.dark.summary} Wordmark: \`${b.logos.perMode.dark.wordmark}\`. Lockup: \`${b.logos.perMode.dark.lockup}\`. Icon: \`${b.logos.perMode.dark.icon}\`.`,
    '',
    '### Small sizes',
    '',
    `${b.logos.minSize} ${b.logos.smallSize.rule} File: \`${b.logos.smallSize.asset}\`.`,
    '',
    '### The ll icon and its states',
    '',
    `${b.logos.icon.body} ${b.logos.icon.smallCuts} ${b.logos.states.rule}`,
    '',
    b.logos.states.items.map((s) => `- **${s.label}**: ${s.ears} \`${s.asset}\``).join('\n'),
    '',
    `### ${b.logos.tag.name} (${b.logos.tag.lockupName})`,
    '',
    `${b.logos.tag.story} ${b.logos.tag.body} ${b.logos.tag.blankRule}`,
    '',
    `- **Use on:** ${b.logos.tag.use.join(', ')}.`,
    `- **Never on:** ${b.logos.tag.never.join(', ')}.`,
    `- Files: \`${b.logos.tag.asset}\`, \`${b.logos.tag.assetDark}\`.`,
    '',
    `### Mascot: ${b.logos.mascot.name}`,
    '',
    `${b.logos.mascot.story} ${b.logos.mascot.body}`,
    '',
    `**${b.logos.mascot.rule}** Minimum ${b.logos.mascot.minSize}.`,
    '',
    `- **Allowed on:** ${b.logos.mascot.allowed.join(', ')}.`,
    `- **Never on:** ${b.logos.mascot.never.join(', ')}.`,
    `- **Why:** ${b.logos.mascot.reason}`,
    `- File: \`${b.logos.mascot.asset}\`.`,
    '',
    '### Misuse',
    '',
    bullets(b.logos.misuse.map((m) => m.label)),
    '',
    '### Explorations',
    '',
    b.logos.explorations.map((e) => `- **${e.name}**: ${e.verdict}. ${e.body}`).join('\n'),
    '',
    b.logos.history,
    '',
    '## Pattern and imagery',
    '',
    [
      b.pattern.reeding,
      b.pattern.hazard,
      b.pattern.hatch,
      b.pattern.registration,
      b.pattern.illustration,
    ]
      .map((p) => `- **${p.name}.** ${p.spec} ${p.usage}`)
      .join('\n'),
    '',
    `Never in illustration: ${b.pattern.illustration.never.join(', ')}. Photography: ${b.pattern.photography}`,
    '',
    '## Iconography',
    '',
    b.iconography.spec,
    '',
    `Core set: ${b.iconography.icons.map((i) => i.name).join(', ')}.`,
    '',
    '## Motion',
    '',
    `${b.motion.line}`,
    '',
    bullets(b.motion.rules),
    '',
    '## Components',
    '',
    bullets(b.components.rules),
    '',
    b.components.buttons.map((x) => `- **Button, ${x.variant}**: ${x.spec}.`).join('\n'),
    `- **Inspection tag**: ${b.components.inspectionTag.spec} Example: \`${b.components.inspectionTag.example}\``,
    b.components.outcomes.map((o) => `- **${o.label}**: ${o.meaning}`).join('\n'),
    '',
    '## Voice and content',
    '',
    b.voice.persona,
    '',
    bullets(b.voice.markers),
    '',
    `Craft verbs: ${b.voice.craftVerbs.join(', ')}.`,
    '',
    `Tone: ${b.voice.sliders.map((s) => `${s.is}, not ${s.not}`).join('. ')}.`,
    '',
    'Example lines:',
    '',
    bullets(b.voice.lines),
    '',
    `Banned outright: ${b.voice.bannedWords.join(', ')}.`,
    '',
    '### Taglines',
    '',
    `Primary: **${b.taglines.primary}**`,
    '',
    bullets(b.taglines.alternates),
    `- ${b.taglines.internal.line} ${b.taglines.internal.note}`,
    '',
    '### Terminology',
    '',
    `Ontology, locked: ${b.terminology.ontology.join(' > ')}. A Stage holds ${b.terminology.stageParts.join(', ')}. ${b.terminology.outcomes.note}`,
    '',
    b.terminology.preferred.map((t) => `- **${t.term}**: ${t.context}`).join('\n'),
    '',
    'Avoid:',
    '',
    b.terminology.avoid.map((t) => `- ~~${t.term}~~: ${t.reason}`).join('\n'),
    '',
    "## Do's and Don'ts",
    '',
    '**Do**',
    '',
    bullets(b.guidelines.dos),
    '',
    "**Don't**",
    '',
    bullets(b.guidelines.donts),
    '',
    '## Assets',
    '',
    `Machine-readable tokens: [/brand.json](${b.identity.url}/brand.json). Plain text: [/brand.txt](${b.identity.url}/brand.txt). Visual guidelines: [/brand](${b.identity.url}/brand).`,
    '',
    '| File | Group | Format | Colorway | Size | Use |\n| --- | --- | --- | --- | --- | --- |',
    b.logos.assets
      .map(
        (a) =>
          `| [${a.name}](${b.identity.url}${a.path}) | ${a.group} | ${a.format} | ${a.colorway} | ${a.size} | ${a.use} |`
      )
      .join('\n'),
    '',
  ].join('\n');

  return `${frontmatter}\n\n${body}`;
}
