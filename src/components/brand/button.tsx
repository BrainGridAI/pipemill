import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

const VARIANT_CLASS = {
  /** Ink fill with the stamped 2px hard shadow. */
  primary: 'stamp border-primary bg-primary text-primary-foreground',
  /** Gate fill, Iron text. One per view. */
  signal: 'stamp border-foreground bg-accent text-accent-foreground',
  secondary:
    'border-foreground text-foreground transition-colors duration-240 ease-mill hover:bg-foreground hover:text-background',
  ghost:
    'border-transparent text-foreground underline decoration-1 underline-offset-4 transition-colors duration-240 ease-mill hover:border-foreground',
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASS;

type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  /** With an href: the link downloads the file. */
  download?: boolean;
  children: ReactNode;
  className?: string;
};

/** Square, 1px border, no radius. Renders a link when given an href. */
export function Button({ variant = 'primary', href, download, children, className }: ButtonProps) {
  const classes = cx(
    'inline-flex h-11 items-center justify-center gap-2 border px-5 text-[15px] font-semibold',
    VARIANT_CLASS[variant],
    className
  );
  if (href) {
    return (
      <a href={href} download={download} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
