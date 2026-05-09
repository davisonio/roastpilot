# Roastpilot — Design Guardrails

Warm cream paper with white cards, ember-orange brand, and color-coded verdict bars. Friendly but pointed. Cards are the primary primitive. Roastpoints (🔥) are the recurring accent.

## Voice

Composed but not stiff. The AI Roast itself is sharp; the surrounding chrome is warm. Emojis are encouraged in chrome (🔥 for points, ✨ for AI, ✓ for verified). The court-opinion tone remains for verdicts — calm sentences delivering devastating reads.

## Type

- Display: **Cormorant Garamond, Italic 500.** Used for big verdict words ("*Mostly YTA*"), wordmark, and category labels. Big, expressive, single weight.
- Body: **Instrument Sans.** 400 for prose, 500 for labels and numerics. Light tracking.
- Numerals: tabular for tallies, fire counts, percentages, points balance.

## Color (oklch)

Cream paper, white cards, ember primary, four-way verdict palette.

```
--color-paper:  oklch(96% .012 75)   page background
--color-card:   oklch(99% .005 80)   card surface
--color-ink:    oklch(22% .02 60)
--color-mute:   oklch(55% .015 70)
--color-rule:   oklch(91% .01 75)    card borders + dividers
--color-ember:  oklch(68% .19 38)    primary / YTA (same)
--color-yta:    oklch(68% .19 38)    orange
--color-nta:    oklch(82% .16 90)    warm yellow
--color-esh:    oklch(60% .16 305)   purple
--color-nah:    oklch(72% .10 200)   teal
--color-verified: oklch(62% .16 145) green badge
```

## Layout

- Two-column on the verdict page: 2/3 main + 1/3 right rail. Stack on mobile.
- Cards are the default container. Soft shadow, 16-20px radius, 1px hairline border.
- Generous internal padding (24-32px on cards).
- Nested cards are *fine* in this design — that's the mockup direction.

## Components

- **Card**: white surface, 1px rule border, soft shadow, rounded-2xl.
- **Verdict stamp**: small caps with colored underline OR a tinted pill using `bg-{verdict}-soft text-{verdict}`.
- **Tally bar**: horizontal bar, color matches verdict, height 4-6px, rounded.
- **Donut**: SVG, 12px stroke, animated stroke-dashoffset on mount.
- **Buttons**: primary = `bg-ember text-white`. Secondary = `bg-soft text-ink`. Ghost = text-only with hover. Radius matches inputs (~10px).
- **Pill**: `bg-ember-soft text-ember-deep` for category/severity.
- **Avatar**: 32-40px circle. Use colorful generated gradients keyed on wallet for now.

## Roastpoints (🔥)

- Always shown as `🔥 N` with tabular numerals.
- Color is `text-ember` when shown standalone.
- Earn rules surfaced in UI when relevant (e.g., "Costs 🔥 50" on the submit button).

## Verdict colors

Each verdict has a foreground and a soft background.

| Verdict | Use | Color |
|---|---|---|
| YTA | "you're the asshole" | orange (ember) |
| NTA | "not the asshole" | yellow |
| ESH | "everyone sucks here" | purple |
| NAH | "no assholes here" | teal |
| INFO | not enough info | mute |
