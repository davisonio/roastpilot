# Product Spec

## One-Liner

Roastpilot turns personal conflicts into composed AITA-style verdict pages, then lets verified humans agree, disagree, and deliver better takes.

## Product Promise

Submit the situation. Get the opinion. Let the court of verified humans decide whether the bench got it right.

## Audience

Primary MVP users:

- People who want an entertaining verdict on a personal situation.
- People who enjoy reading interpersonal drama and voting on who was wrong.
- People who want sharper feedback than a generic advice chatbot gives.

Later users:

- Creators or brands that want controlled public roasts.
- Communities that want bountied takes or verdict contests.

## Core Concepts

### Submission

A personal situation submitted for judgment.

Required MVP fields:

- Body
- Severity: `house` or `nuclear`
- Moderation status
- AI verdict and roast after generation

Later fields:

- Category
- Submitter wallet
- Case number
- Follow-ups

### Verdict

A normalized AITA-style outcome.

Allowed values:

- `NTA`: not the asshole
- `YTA`: you're the asshole
- `ESH`: everyone sucks here
- `NAH`: no assholes here
- `INFO`: not enough information

### Severity

`house` is sharp but controlled.

`nuclear` is harsher and more direct, but it still cannot punch at protected traits, bodies, disabilities, mental illness, religion, race, gender identity, sexuality, or other identity categories.

### Verified Human

A wallet-backed user that can participate in verdict voting and takes. Proof of Human is currently planned behind a demo mode.

### Roastpoints

Internal points used for action costs and rewards.

Current point table:

| Action | Delta |
| --- | ---: |
| Signup bonus | `+1000` |
| Submit house case | `-50` |
| Submit nuclear case | `-200` |
| Plead your case | `-75` |
| Ask follow-up | `-100` |
| Top take reward | `+25` |
| Fire reaction | `+1` |
| Daily login | `+10` |

### Ember Reputation

The count of takes that reach top-take status. This is the public reputation primitive. It should not be renamed to karma.

## MVP User Flows

### Submit a Case

1. User opens `/submit`.
2. User writes a situation.
3. User chooses `house` or `nuclear`.
4. API validates length and severity.
5. Moderation runs before publication.
6. If approved, the submission is created.
7. Anthropic streams the verdict.
8. The case record is updated with AI verdict, roast, reasoning, and confidence.
9. User is sent to `/v/[id]`.

Failure states:

- Body too short.
- Body too long.
- Moderation block.
- Anthropic/API error.
- Database insert or update failure.

### Read a Case

1. User opens `/v/[id]`.
2. Page shows AI verdict, roast, reasoning, and metadata.
3. Human vote tally appears in the right rail.
4. Top takes appear below the tally.

Empty states:

- No human votes yet.
- Verdict generation failed or has not completed.
- Case not found.

### Connect Wallet

1. Client submits `walletAddress`.
2. API validates address length.
3. Existing user is returned, or a new user is created.
4. New users receive a generated handle and signup bonus.
5. POH check runs in demo mode unless `POH_API_KEY` is configured.
6. Session is set.

Production requirement:

- Demo POH must not be treated as real verification in production.

## Moderation Rules

Moderation happens before verdict generation.

Block or decline:

- Doxing
- Real names where the case targets private people
- Protected-class attacks
- Attempts to bait identity-based insults
- Content that asks the model to harass someone

Allow:

- Personal conflicts
- Petty interpersonal disputes
- Workplace, family, relationship, friend, money, and other everyday situations
- Sharp criticism of behavior

## Tone

The product chrome is warm and editorial. The verdict is composed, specific, and cutting.

Avoid:

- Generic chatbot phrasing
- Over-explaining that AI is involved
- Meme overload in verdict text
- Cruelty about traits people did not choose
- Social-app language that makes the product feel like a feed clone

Prefer:

- Court-opinion structure
- Dry, precise observations
- Short punchy sentences
- Clear verdict labels
- Human takes that feel like testimony from the gallery

## Current Product Boundaries

In scope now:

- Personal cases
- AI verdict generation
- Pre-publish moderation
- Case pages
- Seed data
- Wallet-backed user model
- Points ledger foundation

Deferred:

- Business pages
- Paid bounties
- Production POH enforcement
- Payment rails
- Reporting and appeals
- Admin moderation dashboard
- Full wallet adapter UI
- SNS handle resolution
