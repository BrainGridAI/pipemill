import type { Metadata } from 'next';
import { SocialCard } from '@/components/brand/artifacts';

export const metadata: Metadata = {
  title: 'Social card, 1200 x 630',
  robots: { index: false },
};

/* The social card alone, at exact size on a bare page, for PNG export. */
export default function SocialCardExport() {
  return (
    <main style={{ width: 1200, height: 630 }}>
      <SocialCard />
    </main>
  );
}
