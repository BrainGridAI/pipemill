import { IconCut } from '@/components/brand/artifacts';
import { Button } from '@/components/brand/button';
import { Icon } from '@/components/brand/icons';
import { InspectionTag } from '@/components/brand/inspection-tag';
import {
  EarTag,
  LlGlyph,
  LlIcon,
  Mascot,
  StateIcon,
  TaggedHold,
  Wordmark,
  WordmarkPaths,
} from '@/components/brand/marks';
import { WORDMARK_BODY, WORDMARK_BOX, WORDMARK_EAR } from '@/components/brand/paths';
import { OUTCOME_TEXT_CLASS, PolicyBadge } from '@/components/brand/policy-badge';
import { Reeding, ReedingGauge } from '@/components/brand/reeding';
import { CopyButton } from '@/components/manual/controls';
import {
  Block,
  Card,
  Kicker,
  ManualSection,
  Panel,
  StationMarker,
} from '@/components/manual/section';
import {
  type AssetGroup,
  BRAND,
  type BrandAsset,
  MISUSE_COLORS,
  manualSection,
  type PolicyOutcome,
} from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/* 01 to 04: the hero, what we stand for, the logo and the name. */

/* ─── 01 Hero ─────────────────────────────────────────────────────────── */

export function HeroSection() {
  const section = manualSection('hero');
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-theme="dark"
      className="relative overflow-hidden bg-background"
    >
      <div className="page pt-8 md:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-full max-w-[17rem]">
            <StationMarker number={section.number} label={section.label} />
          </div>
          <InspectionTag
            lot="0001"
            stage={{ index: 1, total: BRAND.manual.sections.length, name: 'MANUAL' }}
            policy="hold"
            run={BRAND.meta.lastUpdated}
          />
        </div>

        {/* The logo at full width. On Iron the folded ear is Gate. */}
        <Wordmark
          tone="signal"
          title="The Pipemill wordmark: pipemill, with the first l of the double l folded back"
          className="mt-12 w-full md:mt-16"
        />

        <div className="rule-dashed mt-10 text-foreground/50 md:mt-14" aria-hidden="true" />

        <div className="grid gap-x-10 gap-y-10 py-10 md:py-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1
              id="hero-title"
              className="display text-[clamp(3rem,9.5vw,7.5rem)] leading-[0.9] tracking-[-0.03em]"
            >
              Pipeline,
              <br />
              milled.
            </h1>
            <div className="mt-8 inline-flex max-w-full items-stretch border border-accent">
              <span className="kicker flex items-center bg-accent px-3 py-2 text-accent-foreground">
                Policy hold
              </span>
              <span className="kicker flex items-center px-3 py-2">{BRAND.logos.story}</span>
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <p className="max-w-[30rem] text-[19px] leading-[1.5]">{BRAND.manual.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="signal" href="/brand.md">
                brand.md
              </Button>
              <Button variant="secondary" href="/brand.json">
                brand.json
              </Button>
              <Button variant="secondary" href="/brand.txt">
                brand.txt
              </Button>
            </div>
            <a
              href="/brand/pipemill-brand-kit.zip"
              download
              className="kicker mt-6 inline-block underline decoration-1 underline-offset-4"
            >
              Download the logo kit (zip)
            </a>
          </div>
        </div>
      </div>
      {/* The floor marking: the one hazard band above the fold. */}
      <div className="hazard h-5" aria-hidden="true" />
    </section>
  );
}

/* ─── 02 What we stand for ────────────────────────────────────────────── */

function ArtifactFigure({ number }: { number: string }) {
  if (number === '01') return <StateIcon outcome="hold" className="h-20" />;
  if (number === '02') {
    return (
      <div className="w-full">
        <ReedingGauge total={48} filled={31} label="Reeding gauge" />
        <Reeding className="mt-3" />
      </div>
    );
  }
  return <EarTag title="Ear Tag, lot 0412" className="h-12" />;
}

export function StandForSection() {
  return (
    <ManualSection
      id="stand-for"
      title="Gated. Runs anywhere. Gets truer every run."
      lead={BRAND.identity.positioning}
    >
      <Block label="The one idea" note={BRAND.identity.idea}>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
          <p className="display text-[3.5rem] leading-[0.9] md:col-span-4 md:text-[4.5rem]">
            {BRAND.identity.idea}
          </p>
          <p className="max-w-[40rem] text-[19px] leading-[1.5] md:col-span-8">
            {BRAND.identity.ideaBody}
          </p>
        </div>
        <div className="mt-10 grid gap-px border border-foreground bg-foreground md:grid-cols-3">
          {BRAND.artifacts.map((artifact) => (
            <div key={artifact.number} className="flex flex-col bg-card p-6">
              <Kicker className="text-muted-foreground">
                {artifact.number} / {artifact.role}
              </Kicker>
              <div className="flex h-32 items-center">
                <ArtifactFigure number={artifact.number} />
              </div>
              <h4 className="display text-[1.5rem]">{artifact.name}</h4>
              <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
                {artifact.body}
              </p>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Messaging pillars" note="03">
        <div className="grid gap-px border border-foreground bg-foreground md:grid-cols-3">
          {BRAND.pillars.items.map((pillar) => (
            <div key={pillar.number} className="bg-card p-6">
              <p className="display text-[3rem] text-foreground/25">{pillar.number}</p>
              <h4 className="display mt-6 text-[1.5rem] uppercase">{pillar.name}</h4>
              <p className="mt-3 text-[17px] font-semibold leading-[1.4]">{pillar.headline}</p>
              <p className="mt-2 text-[15px] leading-[1.55] text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block label="Principles" note="04">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND.principles.map((principle, i) => (
            <Card key={principle.name}>
              <Kicker className="text-muted-foreground">P{i + 1}</Kicker>
              <h4 className="mt-4 text-[17px] font-bold leading-[1.3]">{principle.name}</h4>
              <p className="mt-2 text-[15px] leading-[1.55] text-muted-foreground">
                {principle.body}
              </p>
            </Card>
          ))}
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── 03 Logos and symbols ────────────────────────────────────────────── */

const DIAGRAM_TEXT = {
  fontFamily: 'var(--font-mono)',
  fontStretch: '87.5%',
  fontWeight: 500,
} as const;

/* Wordmark metrics, in the units of the shipped file. */
const X_HEIGHT = 1091;
const WM = { left: 42, right: 10049, top: -1806.65, bottom: 398 } as const;

/** The wordmark with its guides, the 25 degree fold and the square tittles called out. */
function ConstructionDiagram() {
  const guides = [
    { y: WM.top, label: 'EAR TOP' },
    { y: -X_HEIGHT, label: 'X-HEIGHT' },
    { y: 0, label: 'BASELINE' },
    { y: WM.bottom, label: 'DESCENDER' },
  ];
  return (
    <svg viewBox="-900 -2620 12500 3350" role="img" className="h-auto w-full">
      <title>
        Construction of the wordmark: pipemill in Bevan on its baseline and x-height, with square
        tittles and the first l of the double l folded 25 degrees to the left.
      </title>
      <g stroke="currentColor" strokeWidth="8" opacity="0.4">
        {guides.map((guide) => (
          <path key={guide.label} d={`M-350 ${guide.y}H10250`} />
        ))}
      </g>
      <WordmarkPaths />
      <g fill="none" stroke="var(--hold)" strokeWidth="18">
        {/* The folded ear, the upright it left, and the angle between them. */}
        <path d={WORDMARK_EAR} />
        <path d="M8740 -1091V-2420" strokeDasharray="60 40" />
        <path d="M8740 -1091L8178 -2296" />
        <path d="M8740 -2191A1100 1100 0 0 0 8275 -2088" />
        {/* Square tittles */}
        <rect x="1713" y="-1593" width="480" height="435" />
        <rect x="7586" y="-1593" width="480" height="435" />
        <path d="M1953 -1593V-1900M7826 -1593V-1900H2700" />
        {/* X: the height of the bowl of the p */}
        <path d="M-520 -1091V0M-610 -1091H-430M-610 0H-430" />
      </g>
      <g fill="currentColor" fontSize="150" letterSpacing="0.08em" style={DIAGRAM_TEXT}>
        {guides.map((guide) => (
          <text key={guide.label} x="10330" y={guide.y + 50}>
            {guide.label}
          </text>
        ))}
        <text x="1953" y="-1960" textAnchor="middle">
          SQUARE TITTLES
        </text>
        <text x="8090" y="-2400" textAnchor="end">
          FOLD 25 DEG LEFT
        </text>
        <text x="8860" y="-2330">
          UPRIGHT
        </text>
        <text x="-700" y="-490" textAnchor="end">
          X
        </text>
        <text x="42" y="640">
          BEVAN / OUTLINED / ONE POLYGON PER LETTER / NO SEAM AT THE FOLD
        </text>
      </g>
    </svg>
  );
}

/** The wordmark inside its clear space: X, the x-height, on every side. */
function ClearSpaceDiagram() {
  const m = X_HEIGHT;
  const w = WM.right - WM.left;
  const h = WM.bottom - WM.top;
  return (
    <svg
      viewBox={`${WM.left - m - 40} ${WM.top - m - 420} ${w + 2 * m + 80} ${h + 2 * m + 840}`}
      role="img"
      className="h-auto w-full"
    >
      <title>
        The wordmark with its clear space marked: X on all four sides, where X is the x-height.
      </title>
      <defs>
        <pattern
          id="clear-space-hatch"
          width="110"
          height="110"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0V110" stroke="currentColor" strokeWidth="14" opacity="0.45" />
        </pattern>
      </defs>
      <rect
        x={WM.left - m}
        y={WM.top - m}
        width={w + 2 * m}
        height={h + 2 * m}
        fill="url(#clear-space-hatch)"
        stroke="currentColor"
        strokeWidth="14"
      />
      <rect
        x={WM.left}
        y={WM.top}
        width={w}
        height={h}
        fill="var(--card)"
        stroke="var(--hold)"
        strokeWidth="14"
      />
      <WordmarkPaths />
      <g fill="none" stroke="var(--hold)" strokeWidth="14">
        <path
          d={`M${WM.left - m} ${WM.top - m - 150}H${WM.left}M${WM.left - m} ${WM.top - m - 230}V${WM.top - m - 70}M${WM.left} ${WM.top - m - 230}V${WM.top - m - 70}`}
        />
        <path
          d={`M${WM.right} ${WM.bottom + m + 150}H${WM.right + m}M${WM.right} ${WM.bottom + m + 70}V${WM.bottom + m + 230}M${WM.right + m} ${WM.bottom + m + 70}V${WM.bottom + m + 230}`}
        />
      </g>
      <g fill="currentColor" fontSize="220" letterSpacing="0.08em" style={DIAGRAM_TEXT}>
        <text x={WM.left + 120} y={WM.top - m - 80}>
          X
        </text>
        <text x={WM.right - 120} y={WM.bottom + m + 230} textAnchor="end">
          X
        </text>
      </g>
    </svg>
  );
}

/** A shipped file, shown as the file itself. */
function Shipped({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // biome-ignore lint/performance/noImgElement: a preview of the shipped file itself; next/image would need dangerouslyAllowSVG
    <img src={src} alt={alt} className={className} loading="lazy" />
  );
}

function MisuseFigure({ kind }: { kind: string }) {
  switch (kind) {
    case 'gradient':
      return (
        <svg viewBox={WORDMARK_BOX} aria-hidden="true" className="w-[80%]">
          <defs>
            <linearGradient id="misuse-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={MISUSE_COLORS.from} />
              <stop offset="1" stopColor={MISUSE_COLORS.to} />
            </linearGradient>
          </defs>
          <path d={WORDMARK_BODY} fill="url(#misuse-gradient)" />
        </svg>
      );
    case 'rotated':
      return <Wordmark className="w-[70%] -rotate-[14deg]" />;
    case 'unfolded':
      // Typed Bevan: two straight ears. This is the misuse, shown on purpose.
      return (
        <span aria-hidden="true" className="font-wordmark text-[2.75rem] leading-none">
          pipemill
        </span>
      );
    case 'outlined':
      return (
        <svg viewBox={WORDMARK_BOX} aria-hidden="true" className="w-[80%] overflow-visible">
          <path d={WORDMARK_BODY} fill="none" stroke="currentColor" strokeWidth="50" />
        </svg>
      );
    case 'stretched':
      return <Wordmark className="w-[52%] scale-x-[1.6] scale-y-[0.7]" />;
    case 'low-contrast':
      return <Wordmark className="w-[80%] text-accent" />;
    case 'mascot-lockup':
      return (
        <span className="flex w-[86%] items-end gap-3">
          <Mascot className="w-[26%] shrink-0" />
          <Wordmark className="min-w-0 flex-1" />
        </span>
      );
    default:
      return (
        <span className="flex items-end gap-5">
          <span className="flex items-center gap-2 border border-foreground bg-card px-3 py-2">
            <Mascot className="size-4" />
            <span className="text-[13px]">Pipemill</span>
          </span>
          <span
            data-theme="dark"
            className="flex size-16 items-center justify-center bg-background"
          >
            <Mascot className="w-10 text-foreground" />
          </span>
        </span>
      );
  }
}

const STATUS_CLASS: Record<string, string> = {
  Chosen: 'border-foreground bg-foreground text-background',
  Kept: 'border-foreground text-foreground',
  Killed: 'border-foreground/40 text-muted-foreground line-through',
  'Not used': 'border-foreground/40 text-muted-foreground',
};

const ASSET_GROUPS: AssetGroup[] = ['Wordmark', 'Icon', 'States', 'Ear Tag', 'Mascot', 'Kit'];
const PREVIEWABLE = new Set(['SVG', 'PNG']);

function DownloadRow({ asset }: { asset: BrandAsset }) {
  const file = asset.path.split('/').pop();
  return (
    <tr className="border-t border-border align-middle">
      <td className="py-2 pr-4">
        <span
          data-theme={asset.surface}
          className="flex h-11 w-24 items-center justify-center border border-border bg-background p-1.5"
        >
          {PREVIEWABLE.has(asset.format) ? (
            <Shipped src={asset.path} alt="" className="max-h-full max-w-full" />
          ) : (
            <span className="kicker text-muted-foreground">{asset.format}</span>
          )}
        </span>
      </td>
      <th scope="row" className="py-2 pr-4 text-left text-[15px] font-semibold">
        {asset.name}
        <span className="data block font-normal text-muted-foreground">{file}</span>
      </th>
      <td className="kicker py-2 pr-4">{asset.format}</td>
      <td className="py-2 pr-4 text-[14px]">{asset.colorway}</td>
      <td className="data py-2 pr-4">{asset.size}</td>
      <td className="py-2 pr-4 text-[14px] leading-[1.4] text-muted-foreground">{asset.use}</td>
      <td className="py-2 text-right">
        {asset.format === 'SVG' ? (
          <CopyButton src={asset.path} label="Copy SVG" name={asset.name} />
        ) : null}
        <a
          href={asset.path}
          download
          className="kicker inline-block border border-foreground px-2 py-1 transition-colors duration-240 ease-mill hover:bg-foreground hover:text-background"
        >
          Download
          <span className="sr-only">
            {' '}
            {asset.name}, {asset.format}
          </span>
        </a>
      </td>
    </tr>
  );
}

function ListBox({
  label,
  items,
  deny,
}: {
  label: string;
  items: readonly string[];
  deny?: boolean;
}) {
  return (
    <div className="bg-card p-5">
      <p className="flex items-center gap-2">
        <Icon
          name={deny ? 'deny' : 'pass'}
          size={20}
          className={deny ? 'text-destructive' : 'text-success'}
        />
        <Kicker as="span">{label}</Kicker>
      </p>
      <ul className="mt-3">
        {items.map((item) => (
          <li key={item} className="border-t border-border py-2 text-[15px] leading-[1.45]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogoSection() {
  const { logos } = BRAND;
  const { tag, mascot } = logos;
  return (
    <ManualSection id="logo" title="One ear folded back." lead={logos.story}>
      <Block label="The story" note="Fig. 03.1 / Back is Left">
        <Panel
          theme="light"
          figure="The logo"
          caption="Iron on Flour. The wordmark always shows Hold."
          bodyClassName="flex items-center justify-center bg-background px-6 py-14 md:px-16 md:py-24"
        >
          <Wordmark title="The Pipemill wordmark" className="w-full max-w-[60rem]" />
        </Panel>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="text-[19px] leading-[1.5] md:col-span-5">{logos.storyBody}</p>
          <dl className="grid gap-px self-start border border-foreground bg-foreground sm:grid-cols-2 md:col-span-7">
            {logos.system.map((part) => (
              <div key={part.key} className="bg-card p-4">
                <Kicker as="dt">
                  {part.name} <span className="text-muted-foreground">/ {part.role}</span>
                </Kicker>
                <dd className="mt-2 text-[15px] leading-[1.5] text-muted-foreground">
                  {part.rule}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Block>

      <Block label="Wordmark, light and dark" note="Fig. 03.2">
        <div className="grid gap-x-2 gap-y-8 md:grid-cols-2">
          <Panel
            theme="light"
            figure="Light"
            caption={logos.perMode.light.summary}
            bodyClassName="flex h-56 items-center justify-center bg-background px-8"
          >
            <Shipped
              src={logos.perMode.light.wordmark}
              alt="Pipemill wordmark, Iron on Flour"
              className="w-full max-w-[24rem]"
            />
          </Panel>
          <Panel
            theme="dark"
            figure="Dark"
            caption={logos.perMode.dark.summary}
            bodyClassName="flex h-56 items-center justify-center bg-background px-8"
          >
            <Shipped
              src={logos.perMode.dark.wordmark}
              alt="Pipemill wordmark, Flour on Iron with the folded ear in Gate"
              className="w-full max-w-[24rem]"
            />
          </Panel>
          <Panel
            theme="light"
            figure="Lockup, light"
            caption="Wordmark, reeded rule, domain, tagline"
          >
            <Shipped
              src={logos.perMode.light.lockup}
              alt="Pipemill lockup with tagline, light"
              className="w-full"
            />
          </Panel>
          <Panel
            theme="dark"
            figure="Lockup, dark"
            caption="Wordmark, reeded rule, domain, tagline"
          >
            <Shipped
              src={logos.perMode.dark.lockup}
              alt="Pipemill lockup with tagline, dark"
              className="w-full"
            />
          </Panel>
        </div>
      </Block>

      <Block label="Construction" note="Fig. 03.3 / Bevan, cut once">
        <div className="grid gap-10 md:grid-cols-12">
          <Panel className="md:col-span-8" bodyClassName="p-4 md:p-8">
            <ConstructionDiagram />
          </Panel>
          <div className="self-center md:col-span-4">
            <ul>
              {Object.values(logos.construction).map((line) => (
                <li
                  key={line}
                  className="data border-b border-border py-3 first:border-t first:border-t-foreground"
                >
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-end justify-between gap-4 border border-border bg-card p-4">
              <span
                aria-hidden="true"
                className="font-wordmark text-[1.75rem] leading-none text-muted-foreground"
              >
                pipemill
              </span>
              <Kicker className="text-right text-muted-foreground">
                Bevan, typed. The base, not the logo.
              </Kicker>
            </div>
          </div>
        </div>
      </Block>

      <Block label="Clear space and minimum sizes" note="Fig. 03.4">
        <div className="grid gap-x-2 gap-y-8 md:grid-cols-2">
          <Panel
            figure="Clear space"
            caption="X = the x-height, the bowl of the p"
            bodyClassName="flex min-h-64 items-center justify-center p-6 md:p-10"
          >
            <ClearSpaceDiagram />
          </Panel>
          <Panel
            figure="Minimum sizes"
            caption="Full cut 120 px. Small cut 64 px. Icon 16 px."
            bodyClassName="flex min-h-64 flex-col justify-center gap-7 p-6 md:p-10"
          >
            <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
              {[240, 160, 120].map((width) => (
                <div key={width}>
                  <Wordmark style={{ width }} title={`Wordmark at ${width} px`} />
                  <Kicker className="mt-2 text-muted-foreground">{width} px / full cut</Kicker>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
              {[96, 64].map((width) => (
                <div key={width}>
                  {/* The shipped small-cut file, inked through a mask. */}
                  <span
                    role="img"
                    aria-label={`Small-size cut at ${width} px`}
                    className="block bg-foreground"
                    style={{
                      width,
                      aspectRatio: '10134.6 / 2204.7',
                      mask: `url(${logos.smallSize.asset}) center / contain no-repeat`,
                      WebkitMask: `url(${logos.smallSize.asset}) center / contain no-repeat`,
                    }}
                  />
                  <Kicker className="mt-2 text-muted-foreground">{width} px / small cut</Kicker>
                </div>
              ))}
              {([48, 32, 16] as const).map((px) => (
                <div key={px}>
                  <IconCut px={px} />
                  <Kicker className="mt-2 text-muted-foreground">{px} px</Kicker>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
          <p className="text-[15px] leading-[1.55] text-muted-foreground">
            {logos.clearSpace} {logos.minSize}
          </p>
          <p className="border-l-4 border-accent pl-4 text-[15px] leading-[1.55]">
            {logos.smallSize.rule}
          </p>
        </div>
      </Block>

      <Block label="The ll icon and its states" note="Fig. 03.5 / Pass, Hold, Deny">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex flex-wrap items-end gap-5">
              <LlIcon size={160} title="The Pipemill ll icon" />
              <span
                data-theme="light"
                className="flex size-24 items-center justify-center border border-foreground bg-background"
              >
                <LlGlyph className="h-[60%]" />
              </span>
              <div className="flex items-end gap-3">
                <IconCut px={48} />
                <IconCut px={32} />
                <IconCut px={16} />
              </div>
            </div>
            <p className="mt-6 text-[17px] leading-[1.5]">{logos.icon.body}</p>
            <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
              {logos.icon.smallCuts}
            </p>
          </div>
          <div className="md:col-span-7">
            <dl className="grid grid-cols-3 gap-px border border-foreground bg-foreground">
              {logos.states.items.map((state) => (
                <div key={state.outcome} className="flex flex-col bg-card p-4 md:p-6">
                  <div className="flex h-28 items-end md:h-40">
                    <StateIcon
                      outcome={state.outcome as PolicyOutcome}
                      title={`${state.label}: ${state.ears}`}
                      className="h-full max-w-full"
                    />
                  </div>
                  <dt className="mt-5">
                    <PolicyBadge outcome={state.outcome as PolicyOutcome} />
                  </dt>
                  <dd className="mt-3 text-[14px] leading-[1.45] md:text-[15px]">{state.ears}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-start gap-3 text-[15px] leading-[1.5]">
              <span className={cx('kicker shrink-0 pt-0.5', OUTCOME_TEXT_CLASS.hold)}>Rule</span>
              {logos.states.rule}
            </p>
          </div>
        </div>
      </Block>

      <Block label="Ear Tag and Tagged Hold" note="Fig. 03.6 / The per-run stamp">
        <div className="grid gap-x-2 gap-y-8 md:grid-cols-2">
          <Panel
            theme="light"
            figure="Tagged Hold"
            caption="Lot 0412. Receipts, exports, run records."
            bodyClassName="flex h-64 items-center justify-center bg-background px-8"
          >
            <TaggedHold title="Tagged Hold, lot 0412" className="w-full max-w-[26rem]" />
          </Panel>
          <Panel
            theme="dark"
            figure="Tagged Hold, dark"
            caption="Social and OG cards."
            bodyClassName="flex h-64 items-center justify-center bg-background px-8"
          >
            <TaggedHold title="Tagged Hold on Iron, lot 0412" className="w-full max-w-[26rem]" />
          </Panel>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-[1.5rem] leading-[1.1]">{tag.story}</p>
            <p className="mt-4 text-[17px] leading-[1.5]">{tag.body}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              {['0412', '0413', '1207'].map((lot) => (
                <EarTag key={lot} lot={lot} title={`Ear Tag, lot ${lot}`} className="h-9" />
              ))}
              <EarTag blank title="Ear Tag, blank" className="h-9" />
            </div>
            <p className="mt-4 text-[15px] leading-[1.55] text-muted-foreground">{tag.blankRule}</p>
          </div>
          <div className="md:col-span-7">
            {/* A trace receipt: the tag in service. */}
            <div data-theme="light" className="border border-foreground bg-card text-foreground">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground px-5 py-4">
                <TaggedHold blank title="Pipemill, tagged" className="w-44" />
                <p className="kicker text-right">
                  Trace 0412 / Workspace AEO
                  <br />
                  <span className="text-muted-foreground">Stage 03/05 Qualify</span>
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="data">{BRAND.voice.lines[0]}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <PolicyBadge outcome="hold" />
                  <span className="kicker text-muted-foreground">{BRAND.identity.domain}</span>
                </div>
              </div>
              <Reeding />
            </div>
            <div className="mt-4 grid gap-px border border-foreground bg-foreground sm:grid-cols-2">
              <ListBox label="The tag goes on" items={tag.use} />
              <ListBox label="Never on" items={tag.never} deny />
            </div>
          </div>
        </div>
      </Block>

      <Block label="The mascot" note="Fig. 03.7 / Large surfaces only">
        <div className="grid gap-x-2 gap-y-8 md:grid-cols-12">
          <Panel
            className="md:col-span-7"
            theme="light"
            figure="Mule Sign"
            caption="One flat ink. Minimum 64 px tall."
            bodyClassName="flex items-center justify-center bg-background px-8 py-12 md:py-16"
          >
            <Mascot title="The Pipemill mascot: a mule head, one ear back" className="w-[70%]" />
          </Panel>
          <Panel
            className="md:col-span-5"
            theme="dark"
            figure="On Iron"
            caption="Only the tip of the back ear is Gate."
            bodyClassName="flex h-full min-h-64 items-center justify-center bg-background p-10"
          >
            <Mascot tone="signal" title="The mascot on Iron" className="w-[72%]" />
          </Panel>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-[1.5rem] leading-[1.1]">{mascot.story}</p>
            <p className="mt-4 text-[17px] leading-[1.5]">{mascot.body}</p>
          </div>
          <div className="md:col-span-7">
            {/* The restriction, set as a floor notice. */}
            <div className="border border-foreground">
              <div className="hazard h-4" aria-hidden="true" />
              <div className="bg-card p-5 md:p-6">
                <Kicker className="text-muted-foreground">Restriction / Policy deny</Kicker>
                <p className="display mt-3 text-[2rem] uppercase leading-[0.95] md:text-[2.75rem]">
                  {mascot.rule}
                </p>
                <p className="mt-4 text-[15px] leading-[1.55]">{mascot.reason}</p>
              </div>
              <div className="grid gap-px border-t border-foreground bg-foreground sm:grid-cols-2">
                <ListBox label="Allowed on" items={mascot.allowed} />
                <ListBox label="Never on" items={mascot.never} deny />
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block label="Explorations" note="4 rounds / 1 chosen, 2 kept, 2 dropped">
        <div className="grid gap-px border border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-5">
          {logos.explorations.map((exploration) => (
            <div key={exploration.key} className="flex flex-col bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <Kicker>{exploration.key}</Kicker>
                <span className={cx('kicker border px-2 py-1', STATUS_CLASS[exploration.status])}>
                  {exploration.verdict}
                </span>
              </div>
              <div data-theme="light" className="my-5 flex h-28 items-center justify-center">
                <Shipped
                  src={exploration.asset}
                  alt={`Exploration ${exploration.name}`}
                  className={cx(
                    'max-h-full max-w-full',
                    exploration.status === 'Killed' || exploration.status === 'Not used'
                      ? 'opacity-50'
                      : undefined
                  )}
                />
              </div>
              <h4 className="display text-[1.125rem]">{exploration.name}</h4>
              <p className="mt-2 text-[14px] leading-[1.5] text-muted-foreground">
                {exploration.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[46rem] text-[15px] leading-[1.55] text-muted-foreground">
          {logos.history}
        </p>
      </Block>

      <Block label="Misuse" note={`${logos.misuse.length} / Policy deny`}>
        <ul className="grid gap-px border border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-4">
          {logos.misuse.map((misuse) => (
            <li key={misuse.key} className="flex flex-col bg-card">
              <div
                data-theme="light"
                className="flex h-40 items-center justify-center overflow-hidden bg-background text-foreground"
              >
                <MisuseFigure kind={misuse.key} />
              </div>
              <p className="flex flex-1 items-start gap-3 border-t border-foreground p-4 text-[15px] leading-[1.45]">
                <Icon name="deny" size={20} className="mt-px shrink-0 text-destructive" />
                {misuse.label}
              </p>
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Downloads" note={`${logos.assets.length} files`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border border-foreground bg-card p-5">
          <p className="text-[17px] leading-[1.4]">
            Every mark, every colorway. SVG first, PNG where a raster helps.
          </p>
          <Button href="/brand/pipemill-brand-kit.zip" download>
            Download the kit (zip)
          </Button>
        </div>
        {/* relative: the sr-only labels inside must scroll with the table. */}
        <div className="relative mt-6 overflow-x-auto border border-foreground bg-card">
          <table className="w-full min-w-[60rem] border-collapse text-left">
            <caption className="sr-only">
              Every logo file, with its format, colorway and size
            </caption>
            <thead>
              <tr>
                {['Preview', 'File', 'Format', 'Colorway', 'Size', 'Use', ''].map((heading) => (
                  <th
                    key={heading || 'download'}
                    scope="col"
                    className="kicker bg-elevated px-0 py-3 pr-4 first:pl-4"
                  >
                    {heading || <span className="sr-only">Download</span>}
                  </th>
                ))}
              </tr>
            </thead>
            {ASSET_GROUPS.map((group) => (
              <tbody key={group} className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={7}
                    className="kicker border-t border-foreground bg-foreground px-4 py-2 text-left text-background"
                  >
                    {group}
                  </th>
                </tr>
                {logos.assets
                  .filter((asset) => asset.group === group)
                  .map((asset) => (
                    <DownloadRow key={asset.path} asset={asset} />
                  ))}
              </tbody>
            ))}
          </table>
        </div>
        <ol className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {logos.rules.map((rule, i) => (
            <li
              key={rule}
              className="flex gap-4 border-t border-border py-3 text-[15px] leading-[1.5]"
            >
              <span className="kicker pt-0.5 text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              {rule}
            </li>
          ))}
        </ol>
      </Block>
    </ManualSection>
  );
}

/* ─── 04 Our name ─────────────────────────────────────────────────────── */

export function NameSection() {
  const { identity } = BRAND;
  return (
    <ManualSection id="name" title="Pipemill." lead={identity.nameRule}>
      <div className="grid gap-x-2 gap-y-8 md:grid-cols-12">
        <Panel
          className="md:col-span-8"
          figure="Fig. 04.1"
          caption="The wordmark. Outlined paths, square tittles, one folded ear."
          bodyClassName="flex h-72 items-center justify-center px-8 md:px-16"
        >
          <Wordmark title="pipemill wordmark" className="h-auto w-full max-w-[36rem]" />
        </Panel>
        <div className="p-[18px] md:col-span-4">
          <div className="flex h-full min-h-72 flex-col justify-between border border-foreground bg-card p-6">
            <div>
              <Kicker className="text-muted-foreground">The pipe / The mill</Kicker>
              <p className="mt-4 text-[17px] leading-[1.5]">{identity.nameMeaning}</p>
            </div>
            <p className="data mt-4">{identity.url}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-px border border-foreground bg-foreground md:grid-cols-2">
        <div className="bg-card p-6">
          <p className="flex items-center gap-2">
            <Icon name="pass" size={20} className="text-success" />
            <Kicker as="span">Write</Kicker>
          </p>
          <ul className="mt-4">
            {identity.nameForms.correct.map((form) => (
              <li key={form} className="display border-t border-border py-3 text-[1.5rem]">
                {form}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card p-6">
          <p className="flex items-center gap-2">
            <Icon name="deny" size={20} className="text-destructive" />
            <Kicker as="span">Never write</Kicker>
          </p>
          <ul className="mt-4">
            {identity.nameForms.incorrect.map((form) => (
              <li
                key={form}
                className="display border-t border-border py-3 text-[1.5rem] text-muted-foreground line-through decoration-1"
              >
                {form}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ManualSection>
  );
}
