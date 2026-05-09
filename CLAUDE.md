@AGENTS.md

# Roastpilot — AITA, but settled

Post a dilemma. Claude Opus drops a verdict. Real humans pile on after.
Trustpilot, but for being told you suck.

## Status: pure mock demo

There is no database. There are no API keys. Everything is in memory and
faked, on purpose, because we needed a deployable demo fast.

- **Storage**: `src/lib/store.ts` — in-memory module-level singleton, seeded
  from `src/data/seed.ts`. New posts and comments live as long as the
  serverless instance. Seed posts are always there.
- **AI verdicts**: `src/lib/ai.ts` — picks one of 5 canned verdicts based on
  a hash of the post, streams the response chunk-by-chunk so the live panel
  feels real. No Anthropic SDK, no key required.

When we wire this back up to a real DB + real Anthropic, replace just those
two files. Everything else is the real shape.

## Stack
- Next.js 16 (App Router) + Tailwind v4
- React 19
- That's it.

## Routes
- `/` — feed (pinned + recent)
- `/posts/new` — submit a dilemma
- `/posts/[id]` — post detail with Claude's verdict + comments
- API: `POST /api/posts`, `POST /api/posts/[id]/comments`, `POST /api/posts/[id]/verdict` (SSE stream)

## Run
```
npm install
npm run dev          # localhost:3000
npm run typecheck
npm run build
```

## Display name
No accounts. Pick a handle in the top-right; it's stored in localStorage.
