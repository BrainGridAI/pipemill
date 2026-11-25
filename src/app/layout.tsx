import type { Metadata, Viewport } from 'next';
import { Archivo, Bevan, Martian_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { BRAND, BRAND_URL, FLOUR, IRON } from '@/lib/brand-data';
import './globals.css';

/*
 * Brand fonts, both variable on the width axis (weight is variable by default).
 * The next/font variables are raw handles; the font-sans and font-mono
 * utilities come from the @theme mapping in globals.css.
 *   Archivo       --font-archivo        display and text, "milled to width"
 *   Martian Mono  --font-martian-mono   labels, data, tags, code
 *   Bevan         --font-bevan          the base face of the wordmark. The
 *                                       logo itself is outlined paths. Bevan
 *                                       loads only for the manual's specimens.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const martianMono = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-martian-mono',
  display: 'swap',
});

const bevan = Bevan({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bevan',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND_URL),
  title: {
    default: `${BRAND.identity.name}. ${BRAND.identity.tagline}`,
    template: `%s | ${BRAND.identity.name}`,
  },
  description: BRAND.identity.oneLiner.tight,
  applicationName: BRAND.identity.name,
  // The ll icon with the Gate ear, never the mascot. src/app/favicon.ico and
  // src/app/apple-icon.png are wired by file convention, and both are copies
  // made by scripts/build-brand-kit.ts. These add the pixel-fit cuts.
  icons: {
    icon: [
      { url: '/brand/pipemill-icon-32.svg', type: 'image/svg+xml', sizes: '32x32' },
      { url: '/brand/png/pipemill-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/png/pipemill-icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/png/pipemill-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: FLOUR },
    { media: '(prefers-color-scheme: dark)', color: IRON },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${martianMono.variable} ${bevan.variable}`}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
