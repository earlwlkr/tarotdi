# tarotdi

Daily tarot ritual with a single-card reveal, reflective guidance, and shareable readings.

## What it does

- **Deterministic daily draw** — each date yields the same card via a stable hash, so the reading is consistent across visits.
- **Shuffle animation** — a ritualistic deck shuffle before the card is revealed.
- **Upright or reversed** — orientation is also date-determined, and both meanings are fully written out.
- **Layered interpretation** — every reading combines the card's core meaning with suit- and rank-specific guidance.
- **Shareable links** — each reading gets a unique URL (`/reading/<slug>`) that can be copied or shared via the native share sheet.

## How it works

The card of the day is selected from the full 78-card tarot deck using a deterministic hash of the current date. The draw includes:

- Card name, suit, arcana, and number
- Upright or reversed orientation
- Key themes (keywords)
- A reflection prompt
- Three meaning paragraphs: primary meaning, suit + rank interpretation, and practical guidance

## Tech stack

- Next.js 16
- React 19
- TypeScript
- CSS animations (no external animation libraries)

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` — start development server
- `pnpm build` — build for production
- `pnpm start` — start production server
- `pnpm lint` — run ESLint

## Deploy

This project is deployed on Vercel.

Production URL:
- https://tarotdi.vercel.app
