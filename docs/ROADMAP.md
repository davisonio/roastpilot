# Roastpilot Roadmap

Roastpilot is an AITA-style verdict platform: a person submits a situation, Claude writes a composed court-opinion roast, and verified humans vote or counter-roast.

The product has three pillars:

1. Personal cases
2. Business pages
3. Paid bounties

The MVP is the personal pillar only. Business pages and paid bounties should be designed around the same core loop, but they should not complicate the first usable version.

## Phase 0: Foundation

Goal: make the app feel like a real editorial product, not a generic AI wrapper.

Current baseline:

- Next.js 16 App Router
- Tailwind v4
- SQLite and Drizzle
- Anthropic verdict generation
- Pre-publish moderation
- AITA-style verdict tags: `NTA`, `YTA`, `ESH`, `NAH`, `INFO`
- Severity dial: `house` and `nuclear`
- Warm editorial brand direction documented in `DESIGN.md`

Exit criteria:

- Seeded cases render correctly on the home page and verdict page.
- `/submit` can create a case and stream a verdict when `ANTHROPIC_API_KEY` is present.
- Unsafe submissions are blocked before verdict generation.
- The core UI follows the Roastpilot brand: cream paper, white cards, ember accent, Cormorant display type, and calm court-opinion voice.

## Phase 1: Personal MVP

Goal: ship the smallest complete Roastpilot loop for personal submissions.

User loop:

1. Submit a personal situation.
2. Choose `house` or `nuclear`.
3. Pass moderation.
4. Receive an AI verdict and roast.
5. Share or revisit the case page.
6. Verified humans can vote and leave short takes.

Product scope:

- Personal submissions only.
- Anonymous by default.
- Optional handle once wallet/session work is wired.
- Human votes use the same verdict set as AI verdicts.
- Human takes can be tagged as `funny`, `helpful`, or `savage`.
- Top takes build ember reputation.

Important exclusions:

- No business claim pages yet.
- No paid bounties yet.
- No broad social network mechanics.
- No karma score. Reputation is ember-based only.

Exit criteria:

- A user can submit, receive a verdict, and land on a stable case URL.
- Case pages show the AI verdict, reasoning, confidence, vote tally, and top human takes.
- Wallet-backed users can be represented in the database.
- Roastpoints are debited and credited through the ledger once spend actions are enforced.

## Phase 2: Verified Human Layer

Goal: make human disagreement feel credible rather than noisy.

Planned capabilities:

- Wallet connect session.
- Proof of Human gate for voting and counter-roasts.
- Generated `.sol`-style handles until SNS resolution is added.
- Clear verified state in the UI.
- Roastpoints balance and transaction history.
- Reactions on takes.
- Ember reputation for users whose takes become top takes.

Current implementation notes:

- `src/app/api/wallet/connect/route.ts` can create or return a wallet user.
- `src/lib/poh.ts` runs in demo mode when `POH_API_KEY` is missing.
- `src/lib/points.ts` defines the cost and reward table.
- `points_ledger` is append-only; `users.roastPoints` is the current cached balance.

Exit criteria:

- Only verified humans can cast votes and react.
- Demo POH mode is visible during local development and impossible to mistake for production verification.
- Points costs are enforced for paid actions.
- Ember reputation cannot be inflated by duplicate self-reactions.

## Phase 3: Plead Your Case

Goal: let submitters continue the drama without turning the product into a chat app.

Planned capabilities:

- Submitter posts a short follow-up.
- Follow-up is categorized as `plead` or `ask`.
- AI responds or re-judges in the same court-opinion voice.
- Follow-ups cost Roastpoints.

Data model support:

- `follow_ups.kind` supports `plead` and `ask`.
- `follow_ups.prompt` stores the submitter text.
- `follow_ups.aiResponse` stores the generated response.

Exit criteria:

- Follow-ups are attached to a case page.
- Moderation runs before AI response generation.
- Points are charged before the response is generated.
- The original verdict remains visible so follow-ups feel like case history, not a replacement.

## Phase 4: Business Pages

Goal: let companies, creators, or products host public verdict pages without diluting the personal case product.

Possible shape:

- Business profile page.
- Public submissions about a business or product.
- Verified responders can agree, disagree, or leave counter-roasts.
- Owner response lane with clear labeling.
- Strong moderation around doxing, harassment, and unverifiable claims.

Open questions:

- Is this for brands to invite roasts, or for users to roast brands?
- Should business owners be verified separately from human voters?
- Are business pages free, paid, or paid only after a claim flow?
- What claim-evidence standard is required before publishing allegations?

Do not build before:

- Personal cases work end to end.
- Moderation policy is stricter and more explicit.
- Abuse and brigading controls exist.

## Phase 5: Paid Bounties

Goal: let people pay for sharper or more useful human judgment without creating a harassment market.

Possible shape:

- A submitter or sponsor attaches a bounty to a case.
- Verified humans compete for best take, counter-roast, or practical advice.
- Rewards are allocated by reactions, submitter selection, or a mixed rule.
- Bounty pages clearly distinguish entertainment roasts from serious advice.

Open questions:

- What actions are eligible for payout?
- Who decides the winning take?
- How are low-effort, duplicate, or abusive takes filtered?
- Should bounties use Roastpoints, fiat, crypto, or a staged internal credit first?

Do not build before:

- Verified human layer is stable.
- Duplicate and self-reaction controls exist.
- Moderation and reporting flows are in place.

## Non-Negotiables

- Roast actions, not identities.
- Keep the verdict voice composed and specific.
- Do not use generic social-media engagement mechanics when a court-opinion product primitive would be sharper.
- Keep the MVP personal and narrow until the loop is actually fun.
- Preserve the ember reputation language. Do not introduce karma.
