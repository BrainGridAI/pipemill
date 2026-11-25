import type { Metadata } from 'next';
import { DeckTitle } from '@/components/brand/artifacts';

export const metadata: Metadata = {
  title: 'Deck title slide, 1920 x 1080',
  robots: { index: false },
};

/* The deck title slide alone, at exact size on a bare page, for PNG export. */
export default function DeckTitleExport() {
  return (
    <main style={{ width: 1920, height: 1080 }}>
      <DeckTitle />
    </main>
  );
}
