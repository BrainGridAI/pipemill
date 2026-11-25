# Pipemill

Pipeline, milled.

Pipemill ([pipemill.ai](https://pipemill.ai)) is the open-source GTM factory: a multi-tenant
system of governance for go-to-market workflows. An Org holds Workspaces, one per product. Each
Workflow has Stages. Each Stage runs Actions, measures with Checks, and a Policy decides whether an
Item advances: Pass, Hold or Deny. A Curator reads run traces and proposes better prompts, specs
and workflows. Hosted or self-hosted.

This repo currently holds the site and the brand manual.

## Run it

```sh
pnpm i && pnpm dev
```

Then open <http://localhost:3000/brand>.

## Routes

| Route                                    | What it is                                        |
| ---------------------------------------- | ------------------------------------------------- |
| `/`                                      | The pipemill.ai placeholder hero                  |
| `/brand`                                 | The brand manual, 15 sections                     |
| `/brand.md`, `/brand.json`, `/brand.txt` | The same brand as data, for agents and developers |
| `/brand/og`                              | Social card at exactly 1200 x 630, for PNG export |
| `/brand/readme-banner`                   | README banner at exactly 1280 x 320               |
| `/brand/deck-title`                      | Deck title slide at exactly 1920 x 1080           |
| any unknown path                         | The 404 page: the mascot, held at the gate        |

## The marks

- The logo is the wordmark "Back is Left": Bevan "pipemill" with the first l of the double l
  folded back. It always shows Hold.
- The ll icon is the favicon and the app icon. Pass, Hold and Deny live there.
- The Ear Tag is the per-run stamp, clipped to the folded ear ("Tagged Hold").
- The mascot (Mule Sign) is for large surfaces only: merch, flour sacks, the 404 page, social.
  Never the favicon, the app icon, a trademark filing, or a lockup next to the wordmark.

## Where things live

- `src/lib/brand-data.ts` is the single source of truth. The manual and the three data routes
  all derive from it.
- `src/app/globals.css` holds the semantic tokens for light and dark, the reeding, hatch and
  floor-stripe patterns, and the motion.
- `src/components/brand/marks.tsx` holds the inline marks. `paths.ts` next to it is generated.
- `public/brand/` holds the logo kit. Never redraw a mark and never edit `paths.ts` by hand.

## Rebuilding the logo kit

```sh
pnpm brand:kit /path/to/pipemill-brand
```

`scripts/build-brand-kit.ts` copies paths from the source marks, writes every colorway, the PNG
exports, `favicon.ico`, the zip and `src/components/brand/paths.ts`. Small-size cuts come from
`final/small`, then `final`, then the shortlist, so a new cut is a re-run with no code change.

## Checks

```sh
pnpm lint         # Biome, then scripts/check-brand.ts
pnpm type-check
pnpm build
```

`scripts/check-brand.ts` fails when the CSS tokens drift from `brand-data.ts`, when the inline
logo paths drift from the files in `public/brand/`, or when brand copy carries an em dash, an
exclamation mark or a banned word.

Stack: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4, Biome, pnpm.
Node 22.18 or later.
