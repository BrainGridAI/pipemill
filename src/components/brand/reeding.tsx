import { cx } from '@/lib/cx';

/** Pitch of the reeding in px: one 1px tick every 4px. */
export const REEDING_PITCH = 4;

/** A reeded rule: the milled edge used as a divider. Decorative. */
export function Reeding({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx('reeding w-full', className)} />;
}

/**
 * The reeding gauge. Filled ticks are passed stages or finished work. The
 * pending ticks sit at reduced ink, the filled ticks at full ink.
 */
export function ReedingGauge({
  total = 40,
  filled,
  label,
  className,
  fillClassName,
}: {
  total?: number;
  filled: number;
  label: string;
  className?: string;
  /** Extra class on the filled layer (the motion demo animates it). */
  fillClassName?: string;
}) {
  const done = Math.max(0, Math.min(total, filled));
  return (
    // Spans, so the gauge is valid inside a button or a paragraph.
    <span
      role="img"
      aria-label={`${label}: ${done} of ${total}`}
      className={cx('relative block h-[10px] max-w-full', className)}
      style={{ width: total * REEDING_PITCH + 1 }}
    >
      <span className="reeding absolute inset-0 text-foreground/25" />
      <span
        className={cx('reeding absolute inset-y-0 left-0 text-foreground', fillClassName)}
        style={{ width: done === total ? '100%' : done * REEDING_PITCH }}
      />
    </span>
  );
}
