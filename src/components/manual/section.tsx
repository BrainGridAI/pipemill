import type { ReactNode } from 'react';
import { Reeding } from '@/components/brand/reeding';
import { RegistrationMarks } from '@/components/brand/registration-marks';
import { type ManualSectionId, manualSection } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/*
 * Manual layout primitives, shared by every section of /brand so the reeded
 * divider, the inspection-label kicker and the heading rhythm stay consistent.
 */

/** A mono uppercase label, set like an inspection label. */
export function Kicker({
  as: Tag = 'p',
  className,
  children,
}: {
  as?: 'p' | 'span' | 'h3' | 'h4' | 'figcaption' | 'dt';
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cx('kicker', className)}>{children}</Tag>;
}

/**
 * A section number, set like the station plate bolted to a machine: an ink
 * block with the number, then the station name on a dashed rule.
 */
export function StationMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-stretch">
      <span className="flex items-center bg-foreground px-3 py-2 font-mono text-[1.375rem] font-bold leading-none text-background">
        {number}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-between border-y border-r border-foreground px-3 py-1.5">
        <span className="kicker text-muted-foreground">Station</span>
        <span className="kicker">{label}</span>
      </span>
    </div>
  );
}

/**
 * One numbered section of the manual: a reeded divider, the station marker
 * ("03 / STATION / LOGOS AND SYMBOLS"), an Expanded headline and a lead.
 */
export function ManualSection({
  id,
  title,
  lead,
  children,
}: {
  id: ManualSectionId;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const section = manualSection(id);
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <Reeding />
      <div className="page pb-24 pt-14 md:pb-32 md:pt-20">
        <header className="grid gap-x-10 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <StationMarker number={section.number} label={section.label} />
          </div>
          <div className="md:col-span-9">
            <h2
              id={`${id}-title`}
              className="display max-w-[18ch] text-[2.125rem] leading-[1.02] md:text-[2.75rem]"
            >
              <a href={`#${id}`} className="underline-offset-4 hover:underline">
                {title}
              </a>
            </h2>
            {lead ? (
              <p className="mt-6 max-w-[42rem] text-[19px] leading-[1.5] text-muted-foreground">
                {lead}
              </p>
            ) : null}
          </div>
        </header>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}

/** A titled block inside a section: a mono label riding a 1px rule. */
export function Block({
  label,
  note,
  className,
  children,
}: {
  label: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx('mt-16 first:mt-0', className)}>
      <div className="flex items-baseline gap-4 border-t border-foreground pt-3">
        <Kicker as="h3">{label}</Kicker>
        {note ? <Kicker className="ml-auto text-right text-muted-foreground">{note}</Kicker> : null}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/**
 * A framed specimen panel with corner registration marks and a figure label.
 * `theme` pins the panel to one mode, so light and dark specimens can sit
 * side by side whatever the reader's mode is.
 */
export function Panel({
  figure,
  caption,
  theme,
  className,
  bodyClassName,
  children,
}: {
  figure?: string;
  caption?: string;
  theme?: 'light' | 'dark';
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <figure className={cx('min-w-0', className)}>
      <div className="p-[18px]">
        <div
          data-theme={theme}
          className={cx(
            'relative border border-foreground bg-card',
            theme ? 'text-foreground' : undefined
          )}
        >
          <RegistrationMarks className="text-foreground" />
          <div className={bodyClassName}>{children}</div>
        </div>
      </div>
      {figure || caption ? (
        <figcaption className="kicker flex gap-3 px-[18px] text-muted-foreground">
          {figure ? <span className="text-foreground">{figure}</span> : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** A plain 1px card. Square, no shadow. */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('border border-foreground bg-card p-6', className)}>{children}</div>;
}
