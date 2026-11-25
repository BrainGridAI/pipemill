import { buildBrandMd } from '@/lib/brand-md';

// Baked at build time: the body is a pure function of the brand data module.
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildBrandMd(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
