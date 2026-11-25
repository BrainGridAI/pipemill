import type { Metadata } from 'next';
import { NotFoundPanel } from '@/components/brand/artifacts';
import { BRAND } from '@/lib/brand-data';

export const metadata: Metadata = {
  title: BRAND.notFound.title,
  robots: { index: false },
};

/*
 * The 404 page. One of the large surfaces the mascot is allowed on: the mule
 * at the gate, one ear back. The wordmark does not appear here, so the two
 * never share a lockup.
 */
export default function NotFound() {
  return (
    <main className="min-h-dvh">
      <NotFoundPanel heading="h1" />
    </main>
  );
}
