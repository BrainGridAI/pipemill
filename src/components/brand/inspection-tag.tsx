import { OUTCOME_TEXT_CLASS } from '@/components/brand/policy-badge';
import type { PolicyOutcome } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

const TONE_CLASS = {
  /** 1px ink outline on the surface. The default. */
  outline: 'border-foreground bg-card text-foreground',
  /** Ink slab: the surface inverted. */
  ink: 'border-foreground bg-foreground text-background',
  /** Gate slab with Iron text. One per view. */
  slab: 'border-accent-foreground bg-accent text-accent-foreground',
} as const;

type InspectionTagProps = {
  lot: string;
  stage?: { index: number; total: number; name: string };
  policy?: PolicyOutcome;
  run?: string;
  tone?: keyof typeof TONE_CLASS;
  className?: string;
};

const two = (n: number) => String(n).padStart(2, '0');

/**
 * The inspection tag, the signature component. Every item carries its lot
 * number, stage, policy outcome and run date, like a factory floor label:
 * LOT 0412 · STAGE 03/05 QUALIFY · POLICY PASS · RUN 2026-11-23
 */
export function InspectionTag({
  lot,
  stage,
  policy,
  run,
  tone = 'outline',
  className,
}: InspectionTagProps) {
  const cell = 'border-l border-current px-2 py-1';
  return (
    <span
      className={cx('kicker inline-flex max-w-full flex-wrap border', TONE_CLASS[tone], className)}
    >
      <span className="flex items-center gap-2 px-2 py-1">
        {/* The punch: a tag is tied on. Square, like everything else. */}
        <span aria-hidden="true" className="size-1.5 border border-current" />
        LOT {lot}
      </span>
      {stage ? (
        <span className={cell}>
          STAGE {two(stage.index)}/{two(stage.total)} {stage.name}
        </span>
      ) : null}
      {policy ? (
        <span className={cell}>
          POLICY{' '}
          <span className={tone === 'outline' ? OUTCOME_TEXT_CLASS[policy] : undefined}>
            {policy}
          </span>
        </span>
      ) : null}
      {run ? <span className={cell}>RUN {run}</span> : null}
    </span>
  );
}
