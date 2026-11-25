import { buildBrandTxt } from '@/lib/brand-txt';

export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(buildBrandTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
