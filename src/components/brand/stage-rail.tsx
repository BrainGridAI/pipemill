import { cx } from '@/lib/cx';

/**
 * The stage rail: a reeding gauge with stage labels. Passed stages are filled
 * ticks. The current stage ends at a closed gate, drawn in Gate. Stages ahead
 * sit at reduced ink.
 */
export function StageRail({
  stages,
  current,
  className,
}: {
  stages: readonly string[];
  /** 1-based index of the stage the item is at. */
  current: number;
  className?: string;
}) {
  return (
    <ol
      className={cx('grid gap-x-1', className)}
      style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
    >
      {stages.map((name, i) => {
        const n = i + 1;
        const state = n < current ? 'passed' : n === current ? 'current' : 'ahead';
        return (
          <li
            key={name}
            aria-current={state === 'current' ? 'step' : undefined}
            className="min-w-0"
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className={cx(
                  'reeding',
                  state === 'ahead' ? 'text-foreground/25' : 'text-foreground'
                )}
              />
              {state === 'current' ? (
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 h-[14px] w-[5px] bg-accent"
                />
              ) : null}
            </div>
            <p
              className={cx(
                'kicker mt-2 truncate',
                state === 'ahead' ? 'text-muted-foreground' : 'text-foreground'
              )}
            >
              <span className="text-muted-foreground">{String(n).padStart(2, '0')}</span> {name}
              <span className="sr-only">
                {state === 'passed' ? ' (passed)' : state === 'current' ? ' (at the gate)' : ''}
              </span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
