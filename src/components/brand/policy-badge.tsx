import type { PolicyOutcome } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

const OUTCOME_CLASS: Record<PolicyOutcome, string> = {
  // Pass is quiet: an outline. Hold is the gate, so it carries Gate with Iron
  // text. Deny wins, so it is the solid one.
  pass: 'border-success text-success',
  hold: 'border-accent bg-accent text-accent-foreground',
  deny: 'border-destructive bg-destructive text-background',
};

export const OUTCOME_TEXT_CLASS: Record<PolicyOutcome, string> = {
  pass: 'text-success',
  hold: 'text-hold',
  deny: 'text-destructive',
};

/** A policy outcome: PASS, HOLD or DENY. Never approve, reject or fail. */
export function PolicyBadge({
  outcome,
  className,
}: {
  outcome: PolicyOutcome;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'kicker inline-flex items-center gap-1.5 border px-2 py-1',
        OUTCOME_CLASS[outcome],
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {outcome}
    </span>
  );
}
