import type { Metadata } from 'next';
import { Button } from '@/components/brand/button';
import { LlIcon, Wordmark } from '@/components/brand/marks';
import { Reeding } from '@/components/brand/reeding';
import { ManualToolbar } from '@/components/manual/controls';
import {
  HeroSection,
  LogoSection,
  NameSection,
  StandForSection,
} from '@/components/manual/identity';
import { AiSection, UsageSection, VoiceSection, WordsSection } from '@/components/manual/language';
import { ApplicationsSection, ComponentsSection } from '@/components/manual/product';
import {
  ColorSection,
  IconsSection,
  MotionSection,
  PatternSection,
  TypeSection,
} from '@/components/manual/system';
import { BRAND } from '@/lib/brand-data';

/*
 * The brand manual (/brand): one visual page plus the machine-readable
 * /brand.md, /brand.json and /brand.txt. Everything renders from BRAND
 * (src/lib/brand-data.ts), the single source of truth those surfaces share.
 *
 * Each section carries the id listed in BRAND.manual.sections. The ids are
 * screenshot anchors, and the order below is the order of that list:
 * hero, stand-for, logo, name, color, type, pattern, icons, motion,
 * components, applications, voice, words, usage, ai.
 */

export const metadata: Metadata = {
  title: 'Brand manual',
  description:
    'Pipemill brand guidelines: the wordmark with one ear folded back, the ll icon, the Ear Tag, the mascot, color, type, pattern, motion, components, voice, and machine-readable tokens for AI agents and developers.',
  alternates: { types: { 'text/markdown': '/brand.md' } },
};

/** The factory floor header: the ll badge, then mono status readouts. */
function StatusBar() {
  return (
    <header data-theme="dark" className="bg-background">
      <div className="page flex flex-wrap items-center gap-x-8 gap-y-4 py-4">
        <a href="/" className="flex items-center gap-3">
          <LlIcon size={44} title="Pipemill" className="border border-foreground/40" />
          <span className="kicker leading-[1.5]">
            Pipemill
            <br />
            <span className="text-muted-foreground">Brand manual</span>
          </span>
        </a>
        <dl className="kicker grid w-full grid-cols-2 gap-x-6 gap-y-1 md:flex md:w-auto md:flex-1 md:flex-wrap md:justify-end md:gap-x-8">
          {BRAND.manual.readouts.map((readout) => (
            <div key={readout.label} className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">{readout.label}:</dt>
              <dd className={readout.label === 'Default policy' ? 'text-accent' : undefined}>
                {readout.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="page">
        <div className="rule-dashed text-foreground/50" aria-hidden="true" />
      </div>
    </header>
  );
}

function Contents() {
  return (
    <nav aria-label="Manual contents" className="page py-10">
      <ol className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
        {BRAND.manual.sections.map((section, i) => (
          <li key={section.id} className="border-t border-border">
            <a
              href={`#${section.id}`}
              className="kicker flex gap-3 py-3 underline-offset-4 hover:underline"
            >
              <span className="text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The gate slab: the one full-bleed Gate band the page is allowed. */
function Colophon() {
  return (
    <footer>
      {/* Pinned to light, so the buttons on the slab are Iron in both modes. */}
      <div data-theme="light" className="bg-accent text-accent-foreground">
        <div className="page flex flex-wrap items-end justify-between gap-8 py-16 md:py-24">
          <p className="display max-w-[14ch] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
            {BRAND.taglines.alternates[1]}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/brand.md">brand.md</Button>
            <Button variant="secondary" href="/">
              {BRAND.identity.domain}
            </Button>
          </div>
        </div>
      </div>
      <div data-theme="dark" className="bg-background">
        <Reeding className="text-foreground/40" />
        <div className="page flex flex-wrap items-center justify-between gap-6 py-10">
          <Wordmark tone="signal" title="Pipemill" className="w-44" />
          <p className="kicker text-muted-foreground">
            {BRAND.manual.statusStrip.join(' · ')} · {BRAND.identity.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function BrandPage() {
  return (
    <>
      <StatusBar />
      <main>
        <HeroSection />
        <Contents />
        <ManualToolbar />
        <StandForSection />
        <LogoSection />
        <NameSection />
        <ColorSection />
        <TypeSection />
        <PatternSection />
        <IconsSection />
        <MotionSection />
        <ComponentsSection />
        <ApplicationsSection />
        <VoiceSection />
        <WordsSection />
        <UsageSection />
        <AiSection />
      </main>
      <Colophon />
    </>
  );
}
