# Roastpilot — Design Guardrails

The container is editorial. The content is brutal. That contrast is the brand.

Reference: https://impeccable.style. Default to that taste.

## Voice

Calm, clinical, no hype. Verdicts are written like a court opinion: composed, deliberate, devastating. The product never shouts. The roast does the cutting; the UI just frames it.

Anti-voice: marketing-speak, exclamation points, "AI-powered," "supercharge," "revolutionary," any word that would appear in a SaaS landing page.

## Type

- Display: **Cormorant Garamond, Italic 400.** Reserved for verdict words ("*Yes, you are.*"), section markers, and the wordmark. Never for body text. Never bolded.
- Body: **Instrument Sans, Regular 400.** Everything readable. Tracking slightly tightened on large body. No font-weight gymnastics — 400 only, occasional 500 on labels.
- Numerals: tabular for verdict tallies, ember counts, timestamps.

Banned fonts: Inter, Geist, Space Grotesk, Plus Jakarta Sans, Mona Sans, Fraunces, Recoleta. If we ever ship one of these by accident, treat it as a bug.

## Color (oklch)

Mono ink-on-cream with a single ember accent.

- `--ink:    oklch(18% .02 60);`     // near-black, warm undertone
- `--paper:  oklch(97% .015 80);`    // cream, not white
- `--rule:   oklch(85% .015 70);`    // hairline rules, not borders
- `--mute:   oklch(55% .015 70);`    // secondary text
- `--ember:  oklch(65% .19 45);`     // the only chromatic accent
- `--ember-deep: oklch(48% .18 35);` // pressed/active ember
- `--verdict-yta: oklch(45% .19 25);`  // oxblood, only for YTA stamp
- `--verdict-nta: oklch(38% .12 145);` // deep moss, only for NTA stamp

Dark mode: invert ink↔paper, dim ember to `oklch(60% .17 45)`, keep verdict colors.

Banned: gradients (any), purple of any kind, gray-500-on-gray-50 SaaS chrome, drop shadows on cards.

## Layout

- Single 720px reading column for verdict pages. Everything else is grid-aware but never feels grid-driven.
- Whitespace is the primary structure. Sections separated by space, not by boxes.
- No nested cards. No card on card. If you find yourself wrapping a card in a card, restructure.
- Hairline rules (1px `--rule`) are the only divider primitive.
- Generous line-height on body (1.6+). Tight on display.

## Components

- Buttons: text-button by default (underlined on hover), filled only for primary CTAs. No rounded-2xl. Square or 2px radius.
- Inputs: bottom border only, no boxes.
- "Verdict stamps" (NTA/YTA/ESH/NAH): small caps, letter-spaced, in `--ink` with verdict color underline. Not pills. Not badges.
- Tabs: text only, current tab gets an `--ember` underline.
- No skeleton shimmer. Use a typographic placeholder ("loading the verdict...") in italic Cormorant if anything.

## Motion

- Almost none. Page transitions are instant. Verdicts stream character-by-character (typewriter feel) — that *is* the animation budget.
- No `transition-all`. No spring physics on UI. No parallax. No floating cards.
- Hover states: 100ms color change, nothing else.

## Anti-pattern checklist (run before merge)

- [ ] No gradient text or gradient backgrounds anywhere
- [ ] No `rounded-2xl shadow-md bg-card` constructions
- [ ] No purple, anywhere, at all
- [ ] No emoji in UI chrome (content is fair game if a user submits)
- [ ] No `font-bold` on body copy — use Cormorant italic for emphasis instead
- [ ] No nested cards
- [ ] No "Powered by AI" badges or sparkle icons
