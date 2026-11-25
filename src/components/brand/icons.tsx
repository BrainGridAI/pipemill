import type { ReactNode } from 'react';

/*
 * The core icon set. 24px grid, 1.5px stroke, square caps, miter joins. No
 * rounded ends and no fills, except the Gate dot that marks an active icon.
 * Every icon is drawn from straight segments on the quarter-pixel grid.
 */

export type IconName =
  | 'org'
  | 'workspace'
  | 'workflow'
  | 'stage'
  | 'action'
  | 'check'
  | 'policy'
  | 'approval'
  | 'runner-local'
  | 'runner-cloud'
  | 'curator'
  | 'trace'
  | 'pass'
  | 'hold'
  | 'deny';

const ICONS: Record<IconName, ReactNode> = {
  // The mill house: one roof over every workspace.
  org: <path d="M3.75 20.25V8.75L12 3.75l8.25 5v11.5zM9.75 20.25v-6.5h4.5v6.5M9.75 9.75h4.5" />,
  // A bench with a tabbed header: one per product.
  workspace: <path d="M3.75 5.75h16.5v12.5H3.75zM3.75 9.75h16.5M8.75 5.75v4" />,
  // Three stages in a row, joined.
  workflow: (
    <path d="M2.75 9.75h4.5v4.5h-4.5zM9.75 9.75h4.5v4.5h-4.5zM16.75 9.75h4.5v4.5h-4.5zM7.25 12h2.5M14.25 12h2.5" />
  ),
  // One frame over a gauge of reeding.
  stage: (
    <path d="M4.75 4.75h14.5v9.5H4.75zM4.75 19.25v-2M8.375 19.25v-1M12 19.25v-2M15.625 19.25v-1M19.25 19.25v-2" />
  ),
  // Run: a wedge.
  action: <path d="M7.75 4.75l10.5 7.25-10.5 7.25z" />,
  // A measurement: a rule with a pointer on the mark.
  check: (
    <path d="M3.75 19.25v-5.5h16.5v5.5M7.875 13.75v2.5M12 13.75v3.5M16.125 13.75v2.5M9.75 4.75h4.5L12 9.75z" />
  ),
  // The gate: two posts, a lintel and the leaf.
  policy: (
    <path d="M5.75 20.25V3.75M18.25 20.25V3.75M5.75 6.75h12.5M8.75 6.75v8.5h6.5v-8.5M2.75 20.25h18.5" />
  ),
  // A hand stamp.
  approval: <path d="M9.75 3.75h4.5v6l3 3.5v2.5H6.75v-2.5l3-3.5zM4.75 19.75h14.5" />,
  // A machine on your bench.
  'runner-local': (
    <path d="M3.75 4.75h16.5v11.5H3.75zM7.75 8.75l2.5 1.75-2.5 1.75M12.25 12.75h3.5M8.75 19.75h6.5M12 16.25v3.5" />
  ),
  // A stepped cloud. No curves.
  'runner-cloud': <path d="M4.75 16.25v-5h3.5v-3.5h7.5v3.5h3.5v5zM8.75 19.75h6.5M12 16.25v3.5" />,
  // The mill bill: the double-ended pick a miller keeps the mill true with.
  curator: <path d="M3.75 7.25l3.5-2.5h9.5l3.5 2.5-3.5 2.5h-9.5zM12 9.75v10.5" />,
  // What ran, in order: a stepped line.
  trace: <path d="M3.75 18.25h5.5v-6h5.5v-6h5.5M3.75 15.25v6M20.25 3.25v6" />,
  pass: <path d="M3.75 3.75h16.5v16.5H3.75zM7.75 12.25l3 3 5.5-6.5" />,
  hold: <path d="M3.75 3.75h16.5v16.5H3.75zM9.75 8.25v7.5M14.25 8.25v7.5" />,
  deny: <path d="M3.75 3.75h16.5v16.5H3.75zM8.25 8.25l7.5 7.5M15.75 8.25l-7.5 7.5" />,
};

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

type IconProps = {
  name: IconName;
  /** Accessible name. Without it the icon is decorative and hidden. */
  title?: string;
  /** Adds the Gate dot: the one fill the set allows. */
  active?: boolean;
  size?: number;
  className?: string;
};

export function Icon({ name, title, active = false, size = 24, className }: IconProps) {
  const body = (
    <>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      >
        {ICONS[name]}
      </g>
      {active ? (
        <circle
          cx="20"
          cy="4"
          r="3"
          fill="var(--accent)"
          stroke="var(--background)"
          strokeWidth="1.5"
        />
      ) : null}
    </>
  );
  if (title) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} role="img" className={className}>
        <title>{title}</title>
        {body}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      {body}
    </svg>
  );
}
