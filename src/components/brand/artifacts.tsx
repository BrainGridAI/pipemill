import type { CSSProperties, ReactNode } from 'react';
import { Button } from '@/components/brand/button';
import { InspectionTag } from '@/components/brand/inspection-tag';
import { LlIcon, Mascot, TaggedHold, Wordmark } from '@/components/brand/marks';
import { PolicyBadge } from '@/components/brand/policy-badge';
import { Reeding } from '@/components/brand/reeding';
import { RegistrationMarks } from '@/components/brand/registration-marks';
import { StageRail } from '@/components/brand/stage-rail';
import { BRAND } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/*
 * Brand applications, built as real components. The fixed-size artifacts
 * (social card, deck slide, README banner) are drawn in em units inside an
 * ArtifactFrame, so one component renders at exact size on its export route
 * and scaled down inside the manual.
 *
 * Mark rules these follow: the wordmark is the logo everywhere. The Ear Tag
 * rides on the social card. The mascot appears only on the large surfaces
 * (sack, tote, 404) and never shares a lockup with the wordmark.
 */

const STAGES = BRAND.components.stages;

/* ─── Fixed-size frame ────────────────────────────────────────────────── */

export function ArtifactFrame({
  width,
  height,
  theme,
  className,
  children,
}: {
  width: number;
  height: number;
  theme: 'light' | 'dark';
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="artifact-frame">
      <div
        data-theme={theme}
        className={cx('artifact relative overflow-hidden bg-background', className)}
        style={
          { aspectRatio: `${width} / ${height}`, '--artifact-cols': width / 16 } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

/** Mono status readouts, set like the plate on a machine. */
function Readouts({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <p className={cx('kicker flex flex-wrap gap-x-[2em] gap-y-1', className)}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </p>
  );
}

/* ─── Social card, 1200 x 630 ─────────────────────────────────────────── */

export function SocialCard() {
  return (
    <ArtifactFrame width={1200} height={630} theme="dark">
      <RegistrationMarks placement="inside" className="text-muted-foreground" />
      <div className="relative flex h-full flex-col justify-between px-14 pb-0 pt-12">
        <div className="flex items-start justify-between text-[1.2em]">
          <Readouts items={['Status: in service', 'Run 2026-11-23', 'Policy: hold']} />
          <p className="kicker text-muted-foreground">{BRAND.identity.domain}</p>
        </div>
        {/* Tagged Hold: the one place the Ear Tag rides on the wordmark. */}
        <TaggedHold title="Pipemill, tagged lot 0412" className="w-[56em]" />
        <div>
          <div className="flex items-end justify-between gap-8">
            <p className="display text-[4.5em] leading-[0.95] tracking-[-0.03em]">
              {BRAND.identity.tagline}
            </p>
            <p className="max-w-[17em] pb-1 text-right text-[1.5em] leading-[1.3] text-muted-foreground">
              {BRAND.identity.category}. {BRAND.taglines.alternates[2]}
            </p>
          </div>
          <div className="hazard -mx-14 mt-7 h-[1.75em]" aria-hidden="true" />
        </div>
      </div>
    </ArtifactFrame>
  );
}

/* ─── Deck title slide, 1920 x 1080 ───────────────────────────────────── */

export function DeckTitle() {
  return (
    <ArtifactFrame width={1920} height={1080} theme="light">
      <RegistrationMarks placement="inside" className="text-foreground" />
      <div className="relative flex h-full flex-col justify-between p-20">
        <div className="text-[1.5em]">
          <div className="flex items-center justify-between">
            <p className="kicker">Pipemill / {BRAND.identity.category}</p>
            <p className="kicker">{BRAND.meta.lastUpdated} / Sheet 01</p>
          </div>
          <Reeding className="mt-4" />
        </div>
        <div>
          <p className="display text-[14.5em] leading-[0.9] tracking-[-0.03em]">
            Pipeline,
            <br />
            milled.
          </p>
          <p className="mt-12 max-w-[21em] text-[2.5em] leading-[1.25]">
            {BRAND.taglines.alternates[0]} {BRAND.taglines.alternates[2]}
          </p>
        </div>
        <div className="flex items-end justify-between gap-10">
          <Wordmark title="Pipemill" className="w-[34em]" />
          <div className="text-[1.9em]">
            <InspectionTag
              lot="0001"
              stage={{ index: 1, total: 5, name: 'CAPTURE' }}
              run={BRAND.meta.lastUpdated}
              tone="ink"
            />
          </div>
        </div>
      </div>
    </ArtifactFrame>
  );
}

/* ─── README banner, 1280 x 320 ───────────────────────────────────────── */

export function ReadmeBanner() {
  return (
    <ArtifactFrame width={1280} height={320} theme="dark">
      <RegistrationMarks placement="inside" className="text-muted-foreground" />
      <div className="relative flex h-full items-stretch">
        <div className="hazard w-[2.25em] shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col justify-between py-10 pl-11 pr-14">
          <div className="flex items-start justify-between gap-10">
            <Wordmark tone="signal" title="Pipemill" className="w-[31em]" />
            <Readouts
              className="max-w-[22em] justify-end text-right text-[1.15em]"
              items={['Open source', 'Self-host or cloud', 'Default policy: hold']}
            />
          </div>
          <div>
            <p className="text-[1.75em]">
              <span className="display tracking-[-0.02em]">{BRAND.identity.tagline}</span>{' '}
              <span className="text-muted-foreground">
                {BRAND.identity.category}. {BRAND.taglines.alternates[2]}
              </span>
            </p>
            <div className="mt-5 text-[1.2em]">
              <StageRail stages={STAGES.map((s) => s.toUpperCase())} current={3} />
            </div>
          </div>
        </div>
      </div>
    </ArtifactFrame>
  );
}

/* ─── Site hero, pipemill.ai ──────────────────────────────────────────── */

const NAV = ['Workflows', 'Docs', 'Self-host', 'GitHub'];

/**
 * The pipemill.ai hero. Responsive to its container, so the same component is
 * the home page and the framed mock in the manual.
 */
export function SiteHero({
  heading = 'p',
  cta,
  className,
}: {
  /** `h1` on the home page. `p` inside the manual, which has its own h1. */
  heading?: 'h1' | 'p';
  cta: { label: string; href: string };
  className?: string;
}) {
  const Heading = heading;
  const card = BRAND.components.workflowCard;
  return (
    <div className={cx('@container bg-background text-foreground', className)}>
      <header
        data-theme="dark"
        className="flex items-center justify-between gap-3 bg-background px-5 py-4 @3xl:px-10"
      >
        {/* 136 px wide: above the 120 px floor of the full wordmark. */}
        <Wordmark tone="signal" title="Pipemill" className="w-[8.5rem] shrink-0" />
        <nav aria-label="Primary" className="hidden items-center gap-7 @3xl:flex">
          {NAV.map((item) => (
            <span key={item} className="kicker">
              {item}
            </span>
          ))}
        </nav>
        <a href={cta.href} className="kicker whitespace-nowrap border border-foreground px-2 py-2">
          Brand manual
        </a>
      </header>

      <div className="grid gap-10 px-5 py-12 @3xl:grid-cols-12 @3xl:px-10 @3xl:py-20">
        <div className="min-w-0 @3xl:col-span-7">
          <p className="kicker text-muted-foreground">Open source / Self-host or Pipemill Cloud</p>
          <Heading className="display mt-5 text-[clamp(2.25rem,11cqw,7.5rem)] leading-[0.92] tracking-[-0.03em]">
            Pipeline,
            <br />
            milled.
          </Heading>
          <p className="mt-7 max-w-[34rem] text-[19px] leading-[1.5]">
            {BRAND.identity.oneLiner.tight} Pipeline only advances when it has earned it.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button variant="signal" href={cta.href}>
              {cta.label}
            </Button>
            <span className="data border border-foreground px-4 py-[11px]">docker compose up</span>
          </div>
        </div>

        <div className="min-w-0 @3xl:col-span-5">
          <div className="relative border border-foreground bg-card">
            <RegistrationMarks />
            <div className="flex items-center justify-between gap-3 border-b border-foreground px-4 py-3">
              <p className="kicker truncate">
                {card.workflow} / {card.item}
              </p>
              <PolicyBadge outcome="hold" />
            </div>
            <div className="px-4 py-5">
              <StageRail stages={STAGES.map((s) => s.toUpperCase())} current={card.stage} />
            </div>
            <ul className="data border-t border-border px-4 py-3">
              {BRAND.voice.lines.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden="true" className="text-muted-foreground">
                    &gt;
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Reeding />
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 @3xl:px-10">
        <p className="kicker text-muted-foreground">{BRAND.taglines.alternates[1]}</p>
        <p className="kicker">{BRAND.identity.domain}</p>
      </div>
    </div>
  );
}

/* ─── Favicon and app icon ────────────────────────────────────────────── */

/** A pixel-fit icon cut, shown from the shipped file at its true size. */
export function IconCut({ px, light }: { px: 16 | 32 | 48; light?: boolean }) {
  return (
    // biome-ignore lint/performance/noImgElement: the shipped pixel-fit file itself, at true size
    <img
      src={`/brand/pipemill-icon-${light ? 'light-' : ''}${px}.svg`}
      alt={`Pipemill icon, ${px} px cut`}
      width={px}
      height={px}
      className="shrink-0"
    />
  );
}

export function BrowserTabMock() {
  return (
    <div className="border border-foreground bg-card">
      <div className="flex items-end gap-1 border-b border-foreground bg-elevated px-3 pt-3">
        <div className="mr-3 flex gap-1.5 pb-3" aria-hidden="true">
          <span className="size-2.5 border border-foreground" />
          <span className="size-2.5 border border-foreground" />
          <span className="size-2.5 border border-foreground" />
        </div>
        <div className="-mb-px flex min-w-0 items-center gap-2 border border-b-0 border-foreground bg-card px-3 py-2">
          <IconCut px={16} />
          <span className="truncate text-[13px]">Pipemill. 6 held at Qualify</span>
        </div>
        <div className="hidden min-w-0 items-center gap-2 px-3 py-2 sm:flex">
          <span aria-hidden="true" className="size-4 shrink-0 border border-foreground/40" />
          <span className="truncate text-[13px]">Run 2026-11-23</span>
        </div>
      </div>
      <div className="border-b border-border px-3 py-2">
        <p className="data border border-border bg-background px-3 py-1">
          {BRAND.identity.domain}/brand
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-8 px-6 py-8">
        <div>
          <LlIcon size={96} title="Pipemill app icon" />
          <p className="kicker mt-3 text-muted-foreground">App icon / 512 tile</p>
        </div>
        {([48, 32, 16] as const).map((px) => (
          <div key={px}>
            <IconCut px={px} />
            <p className="kicker mt-3 text-muted-foreground">{px} px cut</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Large surfaces: the mascot ──────────────────────────────────────── */

function SackStripes() {
  return (
    <div aria-hidden="true" className="grid gap-[5px]">
      <span className="block h-[5px] bg-foreground" />
      <span className="block h-[5px] bg-foreground" />
      <span className="block h-[5px] bg-foreground" />
    </div>
  );
}

/**
 * A flour sack print. The mascot fills the face and the name is set in type:
 * the wordmark goes on the other face, never next to the mule.
 */
export function FlourSack({ className }: { className?: string }) {
  return (
    <div
      data-theme="light"
      className={cx(
        'flex w-full max-w-[19rem] flex-col border border-foreground bg-card px-6 py-6 text-foreground',
        className
      )}
    >
      <SackStripes />
      <div className="flex flex-1 flex-col items-center py-10">
        <Mascot title="The Pipemill mascot, a mule head" className="w-[78%]" />
        <p className="display mt-10 text-center text-[1.75rem] leading-[0.95]">
          Pipeline,
          <br />
          milled.
        </p>
        <p className="kicker mt-5 text-center">Lot 0412 / Stage 03/05 / Hold</p>
        <p className="kicker mt-1 text-center text-muted-foreground">
          Net 50 kg / {BRAND.identity.domain}
        </p>
      </div>
      <SackStripes />
    </div>
  );
}

/** A tote: Iron canvas, Flour mule, the tip of the back ear in Gate. */
export function Tote({ className }: { className?: string }) {
  return (
    <div data-theme="dark" className={cx('w-full max-w-[15rem] text-foreground', className)}>
      <div aria-hidden="true" className="mx-auto h-14 w-[46%] border-x-[10px] border-t-[10px]" />
      <div className="flex aspect-[5/6] flex-col items-center justify-center bg-background p-6">
        <Mascot tone="signal" title="The Pipemill mascot on a tote" className="w-[80%]" />
        <p className="kicker mt-6 text-muted-foreground">It has not decided yet.</p>
      </div>
    </div>
  );
}

/**
 * The 404 panel: the mascot at the gate. Shared by the real not-found page
 * and the mock in the manual. No wordmark on this surface.
 */
export function NotFoundPanel({
  heading = 'p',
  className,
}: {
  heading?: 'h1' | 'p';
  className?: string;
}) {
  const Heading = heading;
  const { notFound } = BRAND;
  return (
    <div className={cx('@container bg-background text-foreground', className)}>
      <div className="hazard h-4" aria-hidden="true" />
      <div className="grid items-end gap-10 px-5 py-12 @3xl:grid-cols-12 @3xl:px-10 @3xl:py-20">
        <div className="@3xl:col-span-5">
          <Mascot title="A mule at the gate, one ear back" className="w-full max-w-[26rem]" />
        </div>
        <div className="@3xl:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <PolicyBadge outcome="hold" />
            <p className="kicker text-muted-foreground">Error {notFound.code} / Page not found</p>
          </div>
          <p
            aria-hidden="true"
            className="display mt-6 text-[clamp(5rem,22cqw,13rem)] leading-[0.8] tracking-[-0.04em]"
          >
            {notFound.code}
          </p>
          <Heading className="display mt-6 text-[clamp(2rem,6cqw,3.5rem)] leading-[1]">
            {notFound.title}
          </Heading>
          <p className="mt-5 max-w-[32rem] text-[19px] leading-[1.5]">{notFound.body}</p>
          <ul className="data mt-6 border-y border-border py-3">
            {notFound.log.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden="true" className="text-muted-foreground">
                  &gt;
                </span>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={notFound.actions[0].href}>{notFound.actions[0].label}</Button>
            <Button variant="secondary" href={notFound.actions[1].href}>
              {notFound.actions[1].label}
            </Button>
          </div>
        </div>
      </div>
      <Reeding />
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 @3xl:px-10">
        <p className="kicker text-muted-foreground">{BRAND.logos.mascot.story}</p>
        <p className="kicker">{BRAND.identity.domain}</p>
      </div>
    </div>
  );
}
