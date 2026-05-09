# Implementation Notes

These notes describe the current code shape and the likely next implementation steps. They are intentionally docs-only so parallel code work can continue without merge friction.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind v4
- SQLite
- Drizzle ORM
- Anthropic SDK
- Zod validation

Before changing Next.js route or app conventions, read the relevant files under `node_modules/next/dist/docs/`. This project is on Next.js 16 and may differ from older Next.js assumptions.

## Important Files

| Area | File |
| --- | --- |
| Project overview | `README.md` |
| Agent notes | `CLAUDE.md` |
| Design guardrails | `DESIGN.md` |
| Database schema | `src/db/schema.ts` |
| Database client | `src/db/index.ts` |
| Verdict prompts | `src/lib/prompts.ts` |
| Anthropic wrapper | `src/lib/anthropic.ts` |
| Moderation and verdict generation | `src/lib/verdict.ts` |
| Submit API | `src/app/api/submissions/route.ts` |
| Submit UI | `src/app/submit/page.tsx` |
| Case page | `src/app/v/[id]/page.tsx` |
| Wallet connect API | `src/app/api/wallet/connect/route.ts` |
| Session helpers | `src/lib/session.ts` |
| Points ledger helpers | `src/lib/points.ts` |
| Proof of Human helper | `src/lib/poh.ts` |

## Data Model

### `users`

Stores wallet-backed users.

Important columns:

- `walletAddress`
- `handleSol`
- `pohVerified`
- `paidSignup`
- `roastPoints`
- `emberReputation`

Notes:

- `handleSol` is generated locally for now.
- `pohVerified` can be true in demo mode when `POH_API_KEY` is missing.
- `roastPoints` is the cached balance; the ledger remains the source of event history.

### `submissions`

Stores cases and generated AI verdict content.

Important columns:

- `caseNumber`
- `body`
- `category`
- `severity`
- `moderationStatus`
- `moderationReason`
- `aiVerdict`
- `aiRoast`
- `aiReasoning`
- `aiConfidence`
- `submitterId`

Notes:

- `aiReasoning` is JSON-encoded.
- Anonymous submissions are allowed by keeping `submitterId` optional.
- Moderation should complete before verdict generation.

### `votes`

Stores verified human verdicts and optional takes.

Important columns:

- `submissionId`
- `userId`
- `verdict`
- `take`
- `takeTag`
- `isCounterRoast`
- `embers`

Notes:

- Vote creation should require a verified human in production.
- `embers` should reflect reaction counts or top-take mechanics, not arbitrary client input.

### `follow_ups`

Stores plead-your-case and ask-follow-up prompts.

Important columns:

- `submissionId`
- `kind`
- `prompt`
- `aiResponse`

Notes:

- Follow-ups should run moderation.
- Follow-ups should charge points before generation.

### `points_ledger`

Append-only point history.

Important columns:

- `userId`
- `delta`
- `reason`
- `refId`

Notes:

- Negative deltas must check available balance.
- New point reasons should be added through `src/lib/points.ts`.

### `reactions`

Stores reactions to human takes.

Important columns:

- `voteId`
- `userId`

Notes:

- Add uniqueness constraints before relying on reactions for rewards.
- Prevent reacting to your own take if ember reputation or payouts depend on it.

## Current API Behavior

### `POST /api/submissions`

Input:

```json
{
  "body": "string, 40-4000 chars",
  "severity": "house | nuclear"
}
```

Behavior:

1. Validates body and severity.
2. Runs moderation.
3. Inserts an approved submission.
4. Streams the generated verdict as text.
5. Updates the submission with parsed verdict data.

Current caveat:

- The API inserts `id`, `body`, `severity`, and `moderationStatus`; if `caseNumber` is required without a database default, submission creation needs to generate one before insert.

### `POST /api/wallet/connect`

Input:

```json
{
  "walletAddress": "string"
}
```

Behavior:

1. Validates wallet address length.
2. Finds or creates a user.
3. Runs Proof of Human check for new users.
4. Grants signup bonus through the points ledger.
5. Sets session.
6. Returns the user and POH demo-mode state.

Current caveat:

- Address validation is length-based only. Real wallet validation should parse the public key.

## Environment

Required for live AI generation:

```bash
ANTHROPIC_API_KEY=...
```

Optional for production human verification:

```bash
POH_API_KEY=...
```

Without `POH_API_KEY`, Proof of Human runs in demo mode.

## Useful Commands

```bash
npm run dev
npm run db:push
npm run db:seed
npm run typecheck
npm run lint
```

## Near-Term Engineering Tasks

1. Ensure submission creation supplies every required database field, including `caseNumber`.
2. Enforce Roastpoints costs for submissions and follow-ups.
3. Add wallet UI and session-aware user state.
4. Gate votes, reactions, and counter-roasts behind verified human status.
5. Add duplicate-vote and duplicate-reaction protection.
6. Add moderation and points checks for follow-ups.
7. Add reporting/admin review before business pages or bounties.

## Parallel Work Notes

Claude or another agent may be editing code in parallel. To reduce conflicts:

- Keep roadmap and product decisions in `docs/`.
- Avoid broad formatting-only edits.
- Do not rewrite `DESIGN.md` unless the visual direction changes.
- Treat dirty files as owned by whoever is currently implementing.
- Prefer small, named docs over one giant project brain-dump.
