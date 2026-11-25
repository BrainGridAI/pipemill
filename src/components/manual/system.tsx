import { ICON_NAMES, Icon, type IconName } from '@/components/brand/icons';
import { InspectionTag } from '@/components/brand/inspection-tag';
import { EarTag, Mascot, StateIcon } from '@/components/brand/marks';
import { PolicyBadge } from '@/components/brand/policy-badge';
import { Reeding, ReedingGauge } from '@/components/brand/reeding';
import { CopyButton } from '@/components/manual/controls';
import { Block, Card, Kicker, ManualSection, Panel } from '@/components/manual/section';
import { BRAND, type BrandColor, type ContrastPair, type WcagGrade } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/* §05 to §09: color, typography, pattern, iconography and motion. */

/* ─── §05 Color palette ───────────────────────────────────────────────── */

function Swatch({ color, tall = false }: { color: BrandColor; tall?: boolean }) {
  return (
    <div className="border border-foreground bg-card" title={color.usage}>
      <div
        className={cx('border-b border-foreground', tall ? 'h-36' : 'h-20')}
        style={{ backgroundColor: color.hex }}
      />
      <div className="p-3">
        <p className="text-[15px] font-semibold">{color.name}</p>
        <div className="mt-2">
          <CopyButton text={color.hex} label={color.hex} name={`${color.name} hex`} />
        </div>
        <div className="mt-1">
          <CopyButton
            text={color.cssVariable}
            label={color.cssVariable}
            name={`${color.name} token`}
          />
        </div>
        {tall ? (
          <p className="mt-3 text-[14px] leading-[1.45] text-muted-foreground">{color.usage}</p>
        ) : null}
      </div>
    </div>
  );
}

const GRADE_CLASS: Record<WcagGrade, string> = {
  AAA: 'border-success text-success',
  AA: 'border-success text-success',
  'AA LARGE': 'border-hold text-hold',
  FAIL: 'border-destructive bg-destructive text-background',
};

function ContrastRow({ pair }: { pair: ContrastPair }) {
  return (
    <tr className="border-t border-border">
      <td className="py-3 pr-4">
        <span
          className="display inline-flex h-10 w-16 items-center justify-center border border-foreground text-[1.125rem]"
          style={{ backgroundColor: pair.bgHex, color: pair.fgHex }}
        >
          Aa
        </span>
      </td>
      <td className="py-3 pr-4">
        <span className="text-[15px] font-semibold">{pair.fg}</span>
        <span className="data block uppercase text-muted-foreground">{pair.fgHex}</span>
      </td>
      <td className="py-3 pr-4">
        <span className="text-[15px] font-semibold">{pair.bg}</span>
        <span className="data block uppercase text-muted-foreground">{pair.bgHex}</span>
      </td>
      <td className="data py-3 pr-4 text-[0.875rem]">{pair.ratio.toFixed(2)}:1</td>
      <td className="py-3 pr-4">
        <span className={cx('kicker inline-block border px-2 py-1', GRADE_CLASS[pair.grade])}>
          {pair.grade}
        </span>
      </td>
      <td className="py-3 text-[14px] leading-[1.45] text-muted-foreground">{pair.usage}</td>
    </tr>
  );
}

function ContrastTable({ mode }: { mode: 'light' | 'dark' }) {
  const pairs = BRAND.colors.contrast.filter((p) => p.mode === mode);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="kicker pb-3 text-left">
          {mode} mode <span className="text-muted-foreground">/ {pairs.length} pairs</span>
        </caption>
        <thead>
          <tr className="border-t border-foreground">
            {['Sample', 'Foreground', 'Background', 'Ratio', 'WCAG', 'Usage'].map((heading) => (
              <th key={heading} scope="col" className="kicker py-2 pr-4 text-muted-foreground">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => (
            <ContrastRow key={`${pair.fg}-${pair.bg}`} pair={pair} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ColorSection() {
  const { colors } = BRAND;
  const maxPercent = Math.round(colors.gateRule.maxCoverage * 100);
  return (
    <ManualSection
      id="color"
      title="Iron, Flour and one Gate."
      lead="Flour paper in light. Iron in dark. Gate is the single signal accent, and it always carries Iron text. Token names stay constant. The mode decides the mapping."
    >
      <Block label="Identity" note={`${colors.identity.length} colors`}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {colors.identity.map((color) => (
            <Swatch key={color.name} color={color} tall />
          ))}
        </div>
      </Block>

      <Block label="Light mode" note="Flour paper">
        <div data-theme="light" className="border border-foreground bg-background p-4 md:p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-9">
            {colors.light.map((color) => (
              <Swatch key={color.cssVariable} color={color} />
            ))}
          </div>
        </div>
      </Block>

      <Block label="Dark mode" note="Iron">
        <div data-theme="dark" className="border border-foreground bg-background p-4 md:p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-9">
            {colors.dark.map((color) => (
              <Swatch key={color.cssVariable} color={color} />
            ))}
          </div>
        </div>
      </Block>

      <Block label="Contrast" note="WCAG 2 / computed from hex">
        <p className="max-w-[42rem] text-[15px] leading-[1.55] text-muted-foreground">
          Every ratio below is computed in code from the two hex values with the WCAG relative
          luminance formula. AAA is 7:1. AA is 4.5:1. AA Large is 3:1, for large text and marks
          only.
        </p>
        <div className="mt-8 grid gap-12">
          <ContrastTable mode="light" />
          <ContrastTable mode="dark" />
        </div>
      </Block>

      <Block label="The Gate rule" note={`Max ${maxPercent}% of a surface`}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h4 className="display text-[1.5rem]">{colors.gateRule.headline}</h4>
            <p className="mt-4 text-[17px] leading-[1.5]">{colors.gateRule.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {colors.gateRule.never.map((item) => (
                <li
                  key={item}
                  className="kicker border border-foreground/40 px-2 py-1 text-muted-foreground line-through"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 md:col-span-7">
            <figure>
              <div
                role="img"
                aria-label={`A surface with ${maxPercent}% of its area in Gate`}
                className="flex h-24 border border-foreground bg-card"
              >
                <div className="bg-accent" style={{ width: `${maxPercent}%` }} />
              </div>
              <Kicker as="figcaption" className="mt-3 text-muted-foreground">
                <span className="text-foreground">{maxPercent}%</span> / The most Gate any surface
                carries
              </Kicker>
            </figure>
            <figure>
              <div className="flex h-24 items-center justify-between gap-4 border border-foreground bg-accent px-6 text-accent-foreground">
                <p className="display text-[1.5rem]">{BRAND.taglines.alternates[1]}</p>
                <Kicker as="span" className="hidden sm:block">
                  Iron on Gate
                </Kicker>
              </div>
              <Kicker as="figcaption" className="mt-3 text-muted-foreground">
                <span className="text-foreground">Gate slab</span> / The one exception. Once per
                page.
              </Kicker>
            </figure>
          </div>
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── §06 Typography ──────────────────────────────────────────────────── */

export function TypeSection() {
  const { typography } = BRAND;
  return (
    <ManualSection
      id="type"
      title={typography.line}
      lead={`Archivo sets display and text on one width axis. Martian Mono sets labels, data, tags and code. Bevan is the base of the wordmark and nothing else. ${typography.license}`}
    >
      <Block label="Archivo / The width axis" note={typography.fonts[0].axes}>
        <div className="border-b border-foreground">
          {typography.widths.map((width) => (
            <div
              key={width.wdth}
              className="grid gap-x-10 gap-y-3 border-t border-border py-8 first:border-t-0 first:pt-0 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <Kicker>
                  wdth {width.wdth} <span className="text-muted-foreground">/ {width.name}</span>
                </Kicker>
                <Kicker className="mt-1 text-muted-foreground">
                  wght {width.weight} / {width.usage}
                </Kicker>
              </div>
              <p
                className="text-[clamp(1.75rem,4.4vw,3.5rem)] leading-[1.05] md:col-span-9"
                style={{
                  fontStretch: `${width.wdth}%`,
                  fontWeight: width.weight,
                  letterSpacing: width.wdth === 125 ? '-0.02em' : undefined,
                }}
              >
                {width.sample}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {typography.fonts.map((font) => (
            <Card key={font.name}>
              <p
                className={cx(
                  'text-[4.5rem] leading-none',
                  font.utility === 'font-mono'
                    ? 'font-mono font-medium'
                    : font.utility === 'font-wordmark'
                      ? 'font-wordmark'
                      : 'display'
                )}
              >
                {font.utility === 'font-wordmark' ? 'pill' : 'Aa09'}
              </p>
              <h4 className="mt-6 text-[17px] font-bold">{font.name}</h4>
              <p className="data mt-1 text-muted-foreground">
                {font.utility} / {font.cssVariable}
              </p>
              <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">{font.usage}</p>
            </Card>
          ))}
        </div>
      </Block>

      <Block label="Martian Mono / Tags and data" note={typography.fonts[1].axes}>
        <div className="grid gap-px border border-foreground bg-foreground md:grid-cols-2">
          <div className="flex flex-col items-start gap-5 bg-card p-6">
            <Kicker className="text-muted-foreground">Kicker / 11px / 0.08em / wdth 87.5</Kicker>
            <Kicker>Station 06 / Typography</Kicker>
            <InspectionTag
              lot="0412"
              stage={{ index: 3, total: 5, name: 'QUALIFY' }}
              policy="pass"
              run="2026-11-23"
            />
            <div className="flex flex-wrap gap-2">
              <PolicyBadge outcome="pass" />
              <PolicyBadge outcome="hold" />
              <PolicyBadge outcome="deny" />
            </div>
          </div>
          <div className="bg-card p-6">
            <Kicker className="text-muted-foreground">Data / 12px / wght 400</Kicker>
            <pre className="data mt-5 overflow-x-auto">
              {`0123456789  37 items  412 ms  0.71\npolicy: qualify\n  deny_wins: true\n  on_stale_check: hold`}
            </pre>
            <CopyButton
              text={`0123456789  37 items  412 ms  0.71\npolicy: qualify\n  deny_wins: true\n  on_stale_check: hold`}
              name="type specimen"
            />
          </div>
        </div>
        <p className="mt-6 max-w-[42rem] text-[15px] leading-[1.55] text-muted-foreground">
          {typography.wordmark}
        </p>
      </Block>

      <Block label="Type scale" note={`${typography.styles.length} styles`}>
        <div className="border-b border-foreground">
          {typography.styles.map((style) => (
            <div
              key={style.name}
              className="grid items-baseline gap-x-10 gap-y-2 border-t border-border py-5 first:border-t-0 first:pt-0 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <Kicker>{style.name}</Kicker>
                <Kicker className="mt-1 text-muted-foreground">
                  {style.size} / wdth {style.wdth} / wght {style.weight}
                </Kicker>
              </div>
              <p
                className={cx(
                  'min-w-0 truncate md:col-span-6',
                  style.family === 'Martian Mono' ? 'font-mono uppercase' : undefined
                )}
                style={{
                  fontSize: `min(${style.px}px, 11vw)`,
                  fontStretch: `${style.wdth}%`,
                  fontWeight: style.weight,
                  letterSpacing: style.tracking === '0' ? undefined : style.tracking,
                  lineHeight: style.px >= 24 ? 1 : 1.5,
                }}
              >
                {style.px >= 24 ? BRAND.identity.tagline : BRAND.voice.lines[2]}
              </p>
              <p className="text-[14px] leading-[1.45] text-muted-foreground md:col-span-3">
                {style.usage}
              </p>
            </div>
          ))}
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── §07 Pattern and imagery ─────────────────────────────────────────── */

export function PatternSection() {
  const { pattern } = BRAND;
  return (
    <ManualSection id="pattern" title="The milled edge." lead={BRAND.artifacts[1].body}>
      <Block label={pattern.reeding.name} note="1px ticks / 4px pitch / every 5th long">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reeding />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <ReedingGauge total={60} filled={37} label="Run progress" />
                <Kicker className="mt-3 text-muted-foreground">
                  Gauge / <span className="text-foreground">37 of 60</span> items through
                </Kicker>
              </div>
              <div>
                <ReedingGauge total={60} filled={60} label="Run progress" />
                <Kicker className="mt-3 text-muted-foreground">
                  Gauge / <span className="text-foreground">60 of 60</span> / run complete
                </Kicker>
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="text-[17px] leading-[1.5]">{pattern.reeding.spec}</p>
            <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
              {pattern.reeding.usage}
            </p>
          </div>
        </div>
      </Block>

      <Block label={pattern.hazard.name} note="45 deg / 8px Gate, 8px Iron / one band per view">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="grid gap-4 md:col-span-8">
            <div className="hazard h-10 border border-foreground" aria-hidden="true" />
            <div className="border border-foreground bg-card">
              <div className="hazard h-3" aria-hidden="true" />
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <span className="kicker">Item 0413 / Held at Qualify / intent.score is stale</span>
                <PolicyBadge outcome="hold" />
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="text-[17px] leading-[1.5]">{pattern.hazard.spec}</p>
            <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
              {pattern.hazard.usage}
            </p>
          </div>
        </div>
      </Block>

      <Block label={pattern.hatch.name} note="1px lines / 45 deg / 6px apart">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="relative border border-foreground bg-card md:col-span-8">
            <div className="hatch absolute inset-0 text-foreground/40" aria-hidden="true" />
            <div className="relative flex flex-wrap items-center justify-between gap-3 p-5 py-10">
              <span className="kicker bg-card px-2 py-1">Shadow mode / nothing is sent</span>
              <span className="kicker bg-card px-2 py-1 text-muted-foreground">Not live</span>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="text-[17px] leading-[1.5]">{pattern.hatch.spec}</p>
            <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
              {pattern.hatch.usage}
            </p>
          </div>
        </div>
      </Block>

      <Block label="Illustration and registration marks" note="Flat signs / one ink per shape">
        <div className="grid gap-x-2 gap-y-8 md:grid-cols-12">
          <Panel
            className="md:col-span-8"
            figure="Fig. 07.4"
            caption="Signs cut on straight edges: the ear, the tag, the mule."
            bodyClassName="grid grid-cols-3 items-end gap-6 p-6 md:gap-10 md:p-10"
          >
            <StateIcon outcome="hold" title="The folded ear" className="mx-auto h-24 md:h-40" />
            <EarTag title="The Ear Tag" className="mb-6 w-full md:mb-12" />
            <Mascot title="The mule, a large-surface sign" className="w-full" />
          </Panel>
          <div className="px-[18px] md:col-span-4 md:py-[18px]">
            <p className="text-[17px] leading-[1.5]">
              {pattern.illustration.spec} {pattern.illustration.usage}
            </p>
            <p className="mt-4 text-[15px] leading-[1.55] text-muted-foreground">
              {pattern.registration.spec} {pattern.registration.usage}
            </p>
            <Kicker className="mt-8 text-muted-foreground">Never</Kicker>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pattern.illustration.never.map((item) => (
                <li
                  key={item}
                  className="kicker border border-foreground/40 px-2 py-1 text-muted-foreground line-through"
                >
                  {item}
                </li>
              ))}
            </ul>
            <Kicker className="mt-8 text-muted-foreground">Photography</Kicker>
            <p className="mt-3 text-[15px] leading-[1.55]">{pattern.photography}</p>
          </div>
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── §08 Iconography ─────────────────────────────────────────────────── */

const ICON_GRID = [0, 4, 8, 12, 16, 20, 24];

export function IconsSection() {
  const { iconography } = BRAND;
  return (
    <ManualSection id="icons" title="Square caps. Miter joins." lead={iconography.spec}>
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Panel
            figure="Fig. 08.1"
            caption="24 grid / 1.5 stroke / Gate dot = active"
            bodyClassName="relative aspect-square"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute inset-0 size-full">
              <g stroke="currentColor" strokeWidth="0.04" opacity="0.5">
                {ICON_GRID.map((v) => (
                  <path key={v} d={`M${v} 0V24M0 ${v}H24`} />
                ))}
              </g>
            </svg>
            <Icon
              name="policy"
              title="Policy icon, active"
              active
              className="absolute inset-0 size-full"
            />
          </Panel>
          <div className="mt-6 flex items-end gap-6 px-[18px]">
            {[16, 24, 32, 48].map((size) => (
              <div key={size}>
                <Icon name="stage" size={size} />
                <Kicker className="mt-2 text-muted-foreground">{size}</Kicker>
              </div>
            ))}
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-px self-start border border-foreground bg-foreground sm:grid-cols-3 md:col-span-8 lg:grid-cols-5">
          {iconography.icons.map((icon) => (
            <li key={icon.name} className="bg-card p-4">
              <Icon name={icon.name as IconName} size={40} />
              <Kicker className="mt-5">{icon.label}</Kicker>
              <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">{icon.note}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Build-time guard: the data and the drawn set must list the same icons. */}
      {assertIconSet(iconography.icons.map((i) => i.name))}
    </ManualSection>
  );
}

function assertIconSet(names: readonly string[]): null {
  const missing = names.filter((n) => !ICON_NAMES.includes(n as IconName));
  if (missing.length > 0 || names.length !== ICON_NAMES.length) {
    throw new Error(`Icon set and brand data disagree: ${missing.join(', ') || 'count differs'}`);
  }
  return null;
}

/* ─── §09 Motion ──────────────────────────────────────────────────────── */

const DEMO_CLASS =
  'motion-demo flex h-56 w-full cursor-default flex-col items-center justify-center gap-5 bg-card text-left';

export function MotionSection() {
  const { motion } = BRAND;
  const [ear, gauge, gate] = motion.demos;
  return (
    <ManualSection
      id="motion"
      title={motion.line}
      lead="Items advance stage to stage in discrete steps. Nothing floats. Nothing bounces. Nothing loops except the loading ear."
    >
      <div className="grid gap-px border border-foreground bg-foreground md:grid-cols-3">
        <div className="bg-card">
          <div className="flex h-56 items-center justify-center">
            {/* Two frames on one baseline: Hold, then Pass. */}
            <span role="img" aria-label="Loading" className="ear-flick relative block h-28 w-28">
              <StateIcon outcome="hold" className="absolute bottom-0 right-0 h-full" />
              <StateIcon outcome="pass" className="absolute bottom-0 right-0 h-full" />
            </span>
          </div>
          <DemoCaption demo={ear} hint="Loops" />
        </div>
        <div className="bg-card">
          <button type="button" className={DEMO_CLASS}>
            <ReedingGauge total={40} filled={40} label="Gauge demo" fillClassName="gauge-fill" />
            <span className="kicker text-muted-foreground">Hover or focus to run</span>
          </button>
          <DemoCaption demo={gauge} hint="Runs once" />
        </div>
        <div className="bg-card">
          <button type="button" className={DEMO_CLASS}>
            <span className="relative flex h-24 w-56 max-w-[80%] items-center justify-center overflow-hidden border border-foreground">
              <span className="flex flex-col items-center gap-2">
                <span className="kicker">Item 0412</span>
                <PolicyBadge outcome="pass" />
              </span>
              <span className="gate-leaf absolute inset-0 flex items-center justify-center bg-accent text-accent-foreground">
                <span className="kicker">Gate closed / hold</span>
              </span>
            </span>
            <span className="kicker text-muted-foreground">Hover or focus to open</span>
          </button>
          <DemoCaption demo={gate} hint="160ms" />
        </div>
      </div>

      <Block label="The rules" note={`${motion.curve} / ${motion.duration}`}>
        <div className="grid gap-10 md:grid-cols-12">
          <figure className="md:col-span-4">
            <svg
              viewBox="-6 -6 112 112"
              role="img"
              className="h-auto w-full max-w-[16rem] border border-foreground bg-card"
            >
              <title>
                The UI easing curve, cubic-bezier 0.2, 0, 0, 1: a fast start and a long settle.
              </title>
              <path
                d="M0 0V100H100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <path
                d="M0 100L20 100M0 0L100 0"
                fill="none"
                stroke="var(--hold)"
                strokeWidth="0.5"
              />
              <path
                d="M0 100C20 100 0 0 100 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <rect x="18" y="98" width="4" height="4" fill="var(--hold)" />
              <rect x="-2" y="-2" width="4" height="4" fill="var(--hold)" />
            </svg>
            <Kicker as="figcaption" className="mt-3 text-muted-foreground">
              <span className="text-foreground">One curve</span> / {motion.duration} for UI
            </Kicker>
          </figure>
          <ol className="md:col-span-8">
            {motion.rules.map((rule, i) => (
              <li
                key={rule}
                className="flex gap-5 border-t border-border py-3 text-[17px] leading-[1.45] first:border-t-foreground"
              >
                <span className="kicker pt-1 text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {rule}
              </li>
            ))}
          </ol>
        </div>
      </Block>
    </ManualSection>
  );
}

function DemoCaption({ demo, hint }: { demo: (typeof BRAND.motion.demos)[number]; hint: string }) {
  return (
    <div className="border-t border-foreground p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-bold">{demo.name}</h3>
        <Kicker className="text-muted-foreground">{hint}</Kicker>
      </div>
      <p className="data mt-1">{demo.spec}</p>
      <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">{demo.body}</p>
    </div>
  );
}
