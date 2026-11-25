import { cx } from '@/lib/cx';

const CORNERS = [
  { key: 'tl', outside: '-left-[17px] -top-[17px]', inside: 'left-2 top-2', flip: '' },
  {
    key: 'tr',
    outside: '-right-[17px] -top-[17px]',
    inside: 'right-2 top-2',
    flip: '-scale-x-100',
  },
  {
    key: 'bl',
    outside: '-bottom-[17px] -left-[17px]',
    inside: 'bottom-2 left-2',
    flip: '-scale-y-100',
  },
  {
    key: 'br',
    outside: '-bottom-[17px] -right-[17px]',
    inside: 'bottom-2 right-2',
    flip: '-scale-x-100 -scale-y-100',
  },
] as const;

/**
 * Corner crop marks, a nod to print and inspection. The parent must be
 * `relative`. `outside` marks sit off the corners and need room around the
 * panel; `inside` marks sit within it, for artifacts that export at exact size.
 */
export function RegistrationMarks({
  placement = 'outside',
  className,
}: {
  placement?: 'outside' | 'inside';
  className?: string;
}) {
  return (
    <>
      {CORNERS.map((corner) => (
        <svg
          key={corner.key}
          aria-hidden="true"
          viewBox="0 0 17 17"
          className={cx(
            'pointer-events-none absolute size-[17px]',
            placement === 'outside' ? corner.outside : corner.inside,
            corner.flip,
            className
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {placement === 'outside' ? (
            <path d="M0 16.5H11M16.5 0V11" />
          ) : (
            <path d="M0.5 11V0.5H11" />
          )}
        </svg>
      ))}
    </>
  );
}
