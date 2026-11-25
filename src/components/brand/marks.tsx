import type { CSSProperties, ReactNode } from 'react';
import {
  LL_BODY,
  LL_BOX,
  LL_EAR,
  MASCOT_BODY,
  MASCOT_BOX,
  MASCOT_DARK_BODY,
  MASCOT_EAR_TIP,
  STATE_DENY,
  STATE_DENY_BOX,
  STATE_HOLD,
  STATE_HOLD_BOX,
  STATE_PASS,
  STATE_PASS_BOX,
  TAG_BOX,
  TAG_KEYLINE,
  TAG_NUMBER,
  TAG_PLATE,
  TAG_STUD,
  TAGGED_BOX,
  TAGGED_KEYLINE,
  TAGGED_NUMBER,
  TAGGED_PLATE,
  TAGGED_STUD,
  WORDMARK_BODY,
  WORDMARK_BOX,
  WORDMARK_EAR,
} from '@/components/brand/paths';
import type { PolicyOutcome } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/*
 * The marks, inline. Every path is copied from a file in public/brand by
 * scripts/build-brand-kit.ts, and scripts/check-brand.ts fails if one drifts.
 * Nothing here is drawn by hand.
 *
 *   Wordmark    the logo. Always Hold.
 *   LlIcon      the double l: favicon, app icon, badge.
 *   StateIcon   Pass, Hold and Deny, in the ll icon only.
 *   EarTag      the per-run tag, alone.
 *   TaggedHold  the wordmark with the tag clipped to the folded ear.
 *   Mascot      the Mule Sign. Large surfaces only, never next to the wordmark.
 */

type SvgProps = {
  /** Accessible name. Without it the mark is decorative and hidden. */
  title?: string;
  className?: string;
  style?: CSSProperties;
};

function Svg({
  viewBox,
  title,
  className,
  style,
  children,
}: SvgProps & { viewBox: string; children: ReactNode }) {
  if (title) {
    return (
      <svg viewBox={viewBox} role="img" className={className} style={style} fill="currentColor">
        <title>{title}</title>
        {children}
      </svg>
    );
  }
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      className={className}
      style={style}
      fill="currentColor"
    >
      {children}
    </svg>
  );
}

/** Aspect ratio of the wordmark, width over height. */
export const WORDMARK_RATIO = 10007 / 2204.65;

/**
 * The wordmark: "pipemill" in Bevan with the first l folded back. One ink,
 * currentColor. `signal` sets the folded ear in Gate: Iron surfaces only.
 */
export function Wordmark({ tone = 'ink', ...props }: SvgProps & { tone?: 'ink' | 'signal' }) {
  return (
    <Svg viewBox={WORDMARK_BOX} {...props}>
      <path d={WORDMARK_BODY} />
      {tone === 'signal' ? <path d={WORDMARK_EAR} fill="var(--accent)" /> : null}
    </Svg>
  );
}

/** The wordmark paths, for drawing it inside a larger SVG diagram. */
export function WordmarkPaths({ fill = 'currentColor' }: { fill?: string }) {
  return <path d={WORDMARK_BODY} fill={fill} />;
}

/** The double l alone, no tile. `signal` sets the folded ear in Gate. */
export function LlGlyph({ tone = 'ink', ...props }: SvgProps & { tone?: 'ink' | 'signal' }) {
  return (
    <Svg viewBox={LL_BOX} {...props}>
      <path d={LL_BODY} />
      {tone === 'signal' ? <path d={LL_EAR} fill="var(--accent)" /> : null}
    </Svg>
  );
}

/**
 * The ll icon as an industrial badge: the glyph on a square Iron tile, Gate
 * ear. For 48 px and under, use the pixel-fit files in public/brand instead.
 */
export function LlIcon({
  size,
  title,
  className,
}: {
  size: number;
  title?: string;
  className?: string;
}) {
  return (
    <span
      data-theme="dark"
      className={cx('flex shrink-0 items-center justify-center bg-background', className)}
      style={{ width: size, height: size }}
    >
      <LlGlyph tone="signal" title={title} style={{ height: size * 0.6 }} />
    </span>
  );
}

const STATES = {
  pass: { box: STATE_PASS_BOX, d: STATE_PASS },
  hold: { box: STATE_HOLD_BOX, d: STATE_HOLD },
  deny: { box: STATE_DENY_BOX, d: STATE_DENY },
} as const;

/** A policy outcome, told by the ears: both up, one back, both back. */
export function StateIcon({ outcome, ...props }: SvgProps & { outcome: PolicyOutcome }) {
  const state = STATES[outcome];
  return (
    <Svg viewBox={state.box} {...props}>
      <path d={state.d} />
    </Svg>
  );
}

const TAG_TEXT = {
  fontFamily: 'var(--font-mono)',
  fontStretch: '87.5%',
  fontWeight: 700,
} as const;

/**
 * The Ear Tag alone: a Gate plate, its clip and a lot number. The specimen
 * number 0412 is outlined in the file. Any other lot is set live in Martian
 * Mono, the face the specimen was cut from. Iron and Gate are fixed inks.
 */
export function EarTag({ lot, blank, ...props }: SvgProps & { lot?: string; blank?: boolean }) {
  return (
    <Svg viewBox={TAG_BOX} {...props}>
      <path d={TAG_KEYLINE} fill="var(--accent-foreground)" />
      <path d={TAG_PLATE} fill="var(--accent)" />
      <path d={TAG_STUD} fill="var(--accent-foreground)" />
      {blank ? null : lot && lot !== '0412' ? (
        <text
          x="423.4"
          y="840"
          textAnchor="middle"
          fontSize="195"
          fill="var(--accent-foreground)"
          style={TAG_TEXT}
        >
          {lot}
        </text>
      ) : (
        <path d={TAG_NUMBER} fill="var(--accent-foreground)" />
      )}
    </Svg>
  );
}

/** Tagged Hold: the wordmark with the Ear Tag clipped to the folded ear. */
export function TaggedHold({ blank, ...props }: SvgProps & { blank?: boolean }) {
  return (
    <Svg viewBox={TAGGED_BOX} {...props}>
      <path d={TAGGED_KEYLINE} fill="var(--accent-foreground)" />
      <path d={TAGGED_PLATE} fill="var(--accent)" />
      <path d={WORDMARK_BODY} />
      {blank ? null : <path d={TAGGED_NUMBER} fill="var(--accent-foreground)" />}
      <path d={TAGGED_STUD} fill="var(--accent)" />
    </Svg>
  );
}

/**
 * The mascot: the Mule Sign. LARGE SURFACES ONLY (merch, flour sacks, the 404
 * page, social). Never the favicon, the app icon, a trademark filing, or any
 * lockup next to the wordmark: MuleSoft has a mule mascot. `signal` sets the
 * tip of the back ear in Gate, on Iron only.
 */
export function Mascot({ tone = 'ink', ...props }: SvgProps & { tone?: 'ink' | 'signal' }) {
  return (
    <Svg viewBox={MASCOT_BOX} {...props}>
      <path d={tone === 'signal' ? MASCOT_DARK_BODY : MASCOT_BODY} />
      {tone === 'signal' ? <path d={MASCOT_EAR_TIP} fill="var(--accent)" /> : null}
    </Svg>
  );
}
