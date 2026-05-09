@AGENTS.md

# Roastpilot — Roast as a Service (RaaS)

A two-sided marketplace. Requesters post a real-life scenario, attach a bounty (Stripe USD or Solana SOL), and verified human roasters compete for the top three spots. Top-3 split bounty as Roastpoints (50/30/20). AI generates a reference roast as inspiration; humans do the cutting.

## Read first
- `DESIGN.md` — brand guardrails. Cream paper, white cards, ember orange, four-color verdict palette.
- `AGENTS.md` — Next.js 16 has breaking changes. Read `node_modules/next/dist/docs/` before changing route conventions.
- `docs/PRODUCT_SPEC.md`, `docs/ROADMAP.md` — codex's planning docs from the v0.1 era. Some details are stale (the verdict-page mechanic was replaced by the RaaS marketplace) but the goals still hold.

## Stack
- Next.js 16 (App Router) + Tailwind v4 + Radix primitives (no shadcn)
- SQLite + Drizzle. `npm run db:push` to sync schema. `npm run db:seed` runs `seed-from-aita.ts`.
- Anthropic SDK. Reference roasts: `claude-sonnet-4-6`. Moderation: `claude-haiku-4-5-20251001`.
- Solana wallet adapter (Phantom + Solflare on devnet).
- Stripe SDK for fiat checkout.
- Cookie session keyed on user id, set when wallet connects.

## Schema (post-pivot)
- `users` — wallet, handle.sol, POH, roasterVerified, roastPoints, roastsWon
- `roast_requests` — scenario, bountyCents, currency, paymentStatus, paymentProvider, aiSuggestion, status (open|judged|closed), redditId/score/url for seeded rows
- `roasts` — body, rank (null|1|2|3), pointsAwarded, embers
- `payments` — provider, externalRef, amountCents, currency, rawPayload
- `points_ledger` — append-only points history

## Routes
- `/` landing
- `/browse` marketplace (filter by category + status)
- `/request` create a request (form → Stripe Checkout or Solana inline pay)
- `/r/[id]` request detail (scenario, AI suggestion, roasts, submit-roast form, select-top-3 if owner)
- `/leaderboard` top 100 roasters by points
- `/me` requester+roaster dashboard
- `/become-a-roaster` POH-gated signup
- API: `/api/requests`, `/api/requests/[id]/roasts`, `/api/requests/[id]/select`, `/api/leaderboard`, `/api/roaster/verify`, `/api/payments/stripe/checkout`, `/api/payments/stripe/return`, `/api/payments/solana/verify`, `/api/wallet/connect|me|disconnect`

## Run
```
npm run dev          # localhost:3000 (or 3001)
npm run db:push      # apply schema
npm run import:aita  # fetch top AITA from Reddit → data/aita-seed.json
npm run db:seed      # map seeded data into db
npm run typecheck
```

## Env
- `ANTHROPIC_API_KEY` — required for live AI suggestions and moderation
- `STRIPE_SECRET_KEY` — required for fiat checkout
- `NEXT_PUBLIC_SOLANA_TREASURY` — required for Solana pay flow
- `SOLANA_RPC` — optional, defaults to devnet
- `POH_API_KEY` — optional; without it POH demo-passes everyone
