import type { Metadata } from 'next';
import { ReadmeBanner } from '@/components/brand/artifacts';

export const metadata: Metadata = {
  title: 'README banner, 1280 x 320',
  robots: { index: false },
};

/* The README banner alone, at exact size on a bare page, for PNG export. */
export default function ReadmeBannerExport() {
  return (
    <main style={{ width: 1280, height: 320 }}>
      <ReadmeBanner />
    </main>
  );
}
