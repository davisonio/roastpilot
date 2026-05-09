# Roastpilot

Roast as a Service (RaaS).

Submit a situation, get a composed verdict, then let verified humans disagree with it. The product tone is quiet and editorial; the content does the damage.

## MVP

- Personal submissions only
- AITA-style verdicts: `NTA`, `YTA`, `ESH`, `NAH`, `INFO`
- Severity dial: `house` or `nuclear`
- Pre-publish moderation before verdict generation
- SQLite + Drizzle persistence
- Anthropic-backed verdict generation

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run db:push
npm run db:seed
npm run typecheck
```

Live verdict generation requires `ANTHROPIC_API_KEY`.
