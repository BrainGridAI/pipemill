import type { Metadata } from 'next';
import { Wordmark } from '@/components/brand/marks';

const title = 'pipemill | the agentic GTM factory';
const description = 'the agentic GTM factory. Pipeline, milled. Coming soon at pipemill.ai.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, url: '/', type: 'website' },
  twitter: { card: 'summary', title, description },
};

/* The pipemill.ai placeholder: the site hero, linking to the brand manual. */
export default function HomePage() {
  return (
    <main
      data-theme="dark"
      className="flex min-h-dvh flex-col bg-background px-6 text-foreground sm:px-12"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-20">
        <h1>
          <Wordmark tone="signal" title="pipemill" className="w-full" />
        </h1>
        <p className="mt-8 text-center font-sans text-[clamp(1rem,2.5vw,1.75rem)]">
          the agentic GTM factory
        </p>
      </div>
      <footer className="mx-auto w-full max-w-5xl pb-8">
        <div className="rule-dashed mb-5 text-muted-foreground" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="font-mono text-[10px] leading-5 tracking-wide sm:text-xs">
            STATUS: COMING SOON · pipemill.ai
          </p>
          <a
            href="/brand"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Brand manual
          </a>
        </div>
      </footer>
    </main>
  );
}
