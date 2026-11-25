import { buildBrandJson } from '@/lib/brand-json';

export const dynamic = 'force-static';

export function GET(): Response {
  // Pretty-printed so the endpoint is readable by humans as well as machines.
  return new Response(`${JSON.stringify(buildBrandJson(), null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
