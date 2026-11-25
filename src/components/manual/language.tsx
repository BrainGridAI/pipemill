import { Icon } from '@/components/brand/icons';
import { PolicyBadge } from '@/components/brand/policy-badge';
import { Reeding } from '@/components/brand/reeding';
import { CopyButton } from '@/components/manual/controls';
import { Block, Card, Kicker, ManualSection } from '@/components/manual/section';
import { BRAND, type PolicyOutcome } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/* §12 to §15: voice, words, usage, and the machine-readable surfaces. */

const STRUCK_CHIP =
  'kicker border border-foreground/40 px-2 py-1 text-muted-foreground line-through';

/* ─── §12 How we sound ────────────────────────────────────────────────── */

export function VoiceSection() {
  const { voice } = BRAND;
  return (
    <ManualSection id="voice" title="The Miller." lead={voice.persona}>
      <Block label="Lines that hold" note="From the shift log">
        <ul className="grid gap-px border border-foreground bg-foreground md:grid-cols-3">
          {voice.lines.map((line, i) => (
            <li key={line} className="flex flex-col justify-between gap-10 bg-card p-6">
              <Kicker className="text-muted-foreground">
                Line {String(i + 1).padStart(2, '0')}
              </Kicker>
              <p className="display text-[1.5rem] leading-[1.12] md:text-[1.75rem]">{line}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Voice markers" note={`${voice.markers.length} rules`}>
        <div className="grid gap-10 md:grid-cols-12">
          <ol className="md:col-span-7">
            {voice.markers.map((marker, i) => (
              <li
                key={marker}
                className="flex gap-5 border-t border-border py-3 text-[17px] leading-[1.45] first:border-t-foreground"
              >
                <span className="kicker pt-1 text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {marker}
              </li>
            ))}
          </ol>
          <div className="md:col-span-5">
            <Kicker className="text-muted-foreground">Craft verbs</Kicker>
            <ul className="mt-4 flex flex-wrap gap-2">
              {voice.craftVerbs.map((verb) => (
                <li
                  key={verb}
                  className="display border border-foreground px-3 py-2 text-[1.125rem]"
                >
                  {verb}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>

      <Block label="Tone" note="Where the needle sits">
        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {voice.sliders.map((slider) => (
            <li key={slider.is}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="display text-[1.25rem]">{slider.is}</p>
                <p className="text-[15px] text-muted-foreground">not {slider.not}</p>
              </div>
              <div
                role="img"
                aria-label={`${slider.is}, not ${slider.not}`}
                className="relative mt-3"
              >
                <Reeding className="text-foreground/40" />
                <span
                  className="absolute bottom-0 h-[18px] w-[5px] bg-foreground"
                  style={{ left: `${slider.position * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Rewrites" note="Not this / write this">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="kicker w-1/2 pb-3 pr-6 text-muted-foreground">
                  Not this
                </th>
                <th scope="col" className="kicker w-1/2 pb-3">
                  Write this
                </th>
              </tr>
            </thead>
            <tbody>
              {voice.rewrites.map((rewrite) => (
                <tr key={rewrite.not} className="border-t border-border align-top">
                  <td className="py-4 pr-6 text-[17px] leading-[1.45] text-muted-foreground line-through decoration-1">
                    {rewrite.not}
                  </td>
                  <td className="py-4 text-[17px] font-semibold leading-[1.45]">{rewrite.write}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── §13 Words matter ────────────────────────────────────────────────── */

export function WordsSection() {
  const { terminology, taglines, voice } = BRAND;
  return (
    <ManualSection id="words" title="The ontology is locked." lead={terminology.outcomes.note}>
      <Block label="Ontology" note="Locked">
        <ol className="flex flex-wrap items-start gap-y-4">
          {terminology.ontology.map((term, i) => (
            <li key={term} className="flex items-start">
              <div>
                <span className="display block border border-foreground bg-card px-4 py-3 text-[1.25rem]">
                  {term}
                </span>
                {term === 'Stage' ? (
                  <ul className="border-x border-b border-foreground bg-card">
                    {terminology.stageParts.map((part) => (
                      <li
                        key={part}
                        className="kicker border-t border-border px-4 py-2 first:border-t-0"
                      >
                        {part}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {i < terminology.ontology.length - 1 ? (
                <span aria-hidden="true" className="kicker px-3 py-4 text-muted-foreground">
                  &gt;
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[15px] leading-[1.55] text-muted-foreground">
          Also locked: {terminology.roles.join('. ')}.
        </p>
      </Block>

      <Block label="Outcomes" note="Two vocabularies, never mixed">
        <div className="grid gap-px border border-foreground bg-foreground md:grid-cols-2">
          <div className="bg-card p-6">
            <Kicker className="text-muted-foreground">A Policy returns</Kicker>
            <div className="mt-4 flex flex-wrap gap-2">
              {terminology.outcomes.policy.map((outcome) => (
                <PolicyBadge key={outcome} outcome={outcome.toLowerCase() as PolicyOutcome} />
              ))}
            </div>
          </div>
          <div className="bg-card p-6">
            <Kicker className="text-muted-foreground">A Check returns</Kicker>
            <p className="data mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem]">
              <span className="text-success">pass</span>
              <span className="text-destructive">fail</span>
              <span className="text-hold">warn</span>
              <span className="text-destructive">error</span>
            </p>
          </div>
        </div>
      </Block>

      <Block label="Terminology" note="Say / never say">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="flex items-center gap-2">
              <Icon name="pass" size={20} className="text-success" />
              <Kicker as="span">Say</Kicker>
            </p>
            <dl className="mt-4">
              {terminology.preferred.map((term) => (
                <div key={term.term} className="border-t border-border py-3">
                  <dt className="text-[15px] font-bold">{term.term}</dt>
                  <dd className="mt-1 text-[15px] leading-[1.5] text-muted-foreground">
                    {term.context}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <p className="flex items-center gap-2">
              <Icon name="deny" size={20} className="text-destructive" />
              <Kicker as="span">Never say</Kicker>
            </p>
            <dl className="mt-4">
              {terminology.avoid.map((term) => (
                <div key={term.term} className="border-t border-border py-3">
                  <dt className="text-[15px] font-bold line-through decoration-1">{term.term}</dt>
                  <dd className="mt-1 text-[15px] leading-[1.5] text-muted-foreground">
                    {term.reason}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </Block>

      <Block label="Banned words" note={`${voice.bannedWords.length} words / 2 marks`}>
        <ul className="flex flex-wrap gap-2">
          {[...voice.bannedWords, 'em dashes', 'exclamation marks'].map((word) => (
            <li key={word} className={STRUCK_CHIP}>
              {word}
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Taglines" note="1 primary / 4 alternates / 1 internal">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Kicker className="text-muted-foreground">Primary</Kicker>
            <p className="display mt-3 text-[2.5rem] leading-[0.95] md:text-[3.5rem]">
              {taglines.primary}
            </p>
          </div>
          <div className="md:col-span-6">
            <Kicker className="text-muted-foreground">Alternates</Kicker>
            <ul className="mt-3">
              {taglines.alternates.map((line) => (
                <li key={line} className="border-t border-border py-3 text-[19px] font-semibold">
                  {line}
                </li>
              ))}
              <li className="border-t border-foreground py-3">
                <span className="text-[19px] font-semibold">{taglines.internal.line}</span>
                <span className="mt-1 block text-[15px] leading-[1.5] text-muted-foreground">
                  {taglines.internal.note}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── §14 Usage guidelines ────────────────────────────────────────────── */

function GuidelineList({ kind, items }: { kind: 'do' | 'dont'; items: readonly string[] }) {
  const pass = kind === 'do';
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-foreground px-6 py-4">
        <h3 className="display text-[1.5rem]">{pass ? 'Do' : "Don't"}</h3>
        <PolicyBadge outcome={pass ? 'pass' : 'deny'} />
      </div>
      <ul className="px-6 py-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 border-t border-border py-3 text-[15px] leading-[1.5] first:border-t-0"
          >
            <Icon
              name={pass ? 'pass' : 'deny'}
              size={20}
              className={cx('mt-px shrink-0', pass ? 'text-success' : 'text-destructive')}
            />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function UsageSection() {
  const { guidelines } = BRAND;
  return (
    <ManualSection
      id="usage"
      title="Do and don't."
      lead="The short list. If a surface passes every line in the left column and none in the right, it is on brand."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <GuidelineList kind="do" items={guidelines.dos} />
        <GuidelineList kind="dont" items={guidelines.donts} />
      </div>
    </ManualSection>
  );
}

/* ─── §15 For AI and developers ───────────────────────────────────────── */

const RESOURCES = [
  {
    href: '/brand.md',
    label: '/brand.md',
    description: 'Agent-readable reference: YAML token frontmatter, then prose.',
  },
  {
    href: '/brand.json',
    label: '/brand.json',
    description: 'Structured tokens: colors, modes, contrast, type, logos, voice, terminology.',
  },
  {
    href: '/brand.txt',
    label: '/brand.txt',
    description: 'Plain ASCII, for a quick read or a paste into any terminal.',
  },
] as const;

export function AiSection() {
  const tokens = Object.entries(BRAND.modes.light.tokens);
  const darkTokens = BRAND.modes.dark.tokens;
  return (
    <ManualSection
      id="ai"
      title="Machine-readable tokens."
      lead="Every token, font, mark rule and copy rule on this page ships as data, derived from one source of truth. Token names stay constant. The mode decides the mapping. Fetch the format your tool reads."
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {RESOURCES.map((resource) => (
          <li key={resource.href}>
            <a
              href={resource.href}
              className="block h-full border border-foreground bg-card p-6 transition-colors duration-240 ease-mill hover:bg-foreground hover:text-background"
            >
              <span className="font-mono text-[1.125rem] font-medium">{resource.label}</span>
              <span className="mt-3 block text-[15px] leading-[1.5] opacity-70">
                {resource.description}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div data-theme="dark" className="mt-4 border border-foreground bg-background px-6 py-5">
        <p className="data overflow-x-auto whitespace-nowrap">
          <span className="text-muted-foreground">$ </span>curl {BRAND.identity.url}/brand.md
        </p>
      </div>

      <Block label="Semantic tokens" note={`${tokens.length} tokens / 2 modes`}>
        <div className="mb-6 flex flex-wrap gap-3">
          <CopyButton text={JSON.stringify(BRAND.modes, null, 2)} label="Copy tokens" name="JSON" />
          <CopyButton src="/brand.md" label="Copy brand.md" name="manual" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">Semantic tokens and their value in each mode</caption>
            <thead>
              <tr>
                {['Token', 'Utility', 'Light', 'Dark'].map((heading) => (
                  <th key={heading} scope="col" className="kicker pb-3 pr-4 text-muted-foreground">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="data">
              {tokens.map(([name, light]) => (
                <tr key={name} className="border-t border-border">
                  <td className="py-2 pr-4">
                    <CopyButton text={`--${name}`} label={`--${name}`} name="token" />
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {name.endsWith('foreground') || name === 'ring' ? 'text' : 'bg'}-{name}
                  </td>
                  <td className="py-2 pr-4">
                    <TokenValue hex={light} />{' '}
                    <CopyButton text={light} name={`${name} light hex`} />
                  </td>
                  <td className="py-2">
                    <TokenValue hex={darkTokens[name]} />{' '}
                    <CopyButton text={darkTokens[name]} name={`${name} dark hex`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block label="Mark rules" note={`${BRAND.logos.rules.length} rules / in every format`}>
        <div className="grid gap-10 md:grid-cols-12">
          <ol className="md:col-span-7">
            {BRAND.logos.rules.map((rule, i) => (
              <li
                key={rule}
                className="flex gap-5 border-t border-border py-3 text-[15px] leading-[1.5] first:border-t-foreground"
              >
                <span className="kicker pt-0.5 text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {rule}
              </li>
            ))}
          </ol>
          <div className="md:col-span-5">
            <div className="border border-foreground">
              <div className="hazard h-3" aria-hidden="true" />
              <div className="bg-card p-5">
                <Kicker className="text-muted-foreground">For agents / Mascot restriction</Kicker>
                <p className="mt-3 text-[15px] leading-[1.55]">
                  If you generate a Pipemill surface, use the wordmark. Do not place the mule on a
                  favicon, an app icon or next to the name. {BRAND.logos.mascot.reason}
                </p>
              </div>
            </div>
            <ul className="data mt-4 border border-foreground bg-card p-5">
              {MARK_FILES.map((file) => (
                <li key={file.path} className="flex flex-wrap justify-between gap-x-4 py-1">
                  <span className="text-muted-foreground">{file.role}</span>
                  <a href={file.path} className="underline decoration-1 underline-offset-4">
                    {file.path}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>
    </ManualSection>
  );
}

const MARK_FILES = [
  { role: 'logo', path: BRAND.logos.perMode.light.wordmark },
  { role: 'logo, on Iron', path: BRAND.logos.perMode.dark.wordmark },
  { role: 'logo, under 120 px', path: BRAND.logos.smallSize.asset },
  { role: 'icon', path: BRAND.logos.perMode.dark.icon },
  { role: 'per-run tag', path: BRAND.logos.tag.asset },
  { role: 'mascot, large only', path: BRAND.logos.mascot.asset },
] as const;

function TokenValue({ hex }: { hex: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-3 shrink-0 border border-foreground"
        style={{ backgroundColor: hex }}
      />
      {hex}
    </span>
  );
}
