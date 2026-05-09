@AGENTS.md

# Roastpilot

AITA-style verdict platform. Submit a situation; Claude writes a court-opinion roast; verified humans vote and counter-roast. Three-pillar product (personal, business pages, paid bounties); MVP is the personal pillar only.

## Read first
- `DESIGN.md` — brand guardrails (impeccable.style direction). Cormorant Garamond italic + Instrument Sans, oklch palette, ember accent, no shadcn defaults, no gradients.
- `AGENTS.md` — Next.js 16 has breaking changes from training data. Read `node_modules/next/dist/docs/` before writing route conventions.

## Stack
- Next.js 16 (App Router) + Tailwind v4 + Radix primitives (no shadcn)
- SQLite + Drizzle (`src/db/`). `npm run db:push` to sync schema. `npm run db:seed` for sample rows.
- Anthropic SDK. Verdict model: `claude-sonnet-4-6`. Moderation: `claude-haiku-4-5-20251001`.
- Wallet auth + POH are deferred behind a flag — currently every connected wallet would be treated as a verified human. POH (verify-humanity-poh skill) wires in when we lift the flag.

## Conventions
- Verdict tags: `NTA | YTA | ESH | NAH | INFO`
- Severity dial: `house | nuclear` — different system prompts in `src/lib/prompts.ts`
- Pre-publish moderation runs before generation (`moderate()` in `src/lib/verdict.ts`); blocks doxing, real names, protected-class attacks.
- Reputation = ember count on top takes. Explicitly no karma score.
- Anonymous by default; handle is opt-in.

## Run
```
npm run dev          # Next dev (port 3000)
npm run db:push      # apply schema
npm run db:seed      # sample rows
npm run typecheck    # tsc --noEmit
```

`ANTHROPIC_API_KEY` required for live verdict generation. Without it, the seeded sample rows render fine but `/submit` will error at the moderation step.
