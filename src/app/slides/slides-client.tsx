"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const SLIDES = [
  "title",
  "problem",
  "why-now",
  "solution",
  "how-it-works",
  "demo",
  "why-crypto",
  "traction",
  "model",
  "competition",
  "roadmap",
  "ask",
  "closing",
] as const;

export default function SlidesClient() {
  const [i, setI] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (delta: number) => {
      setI((prev) => Math.max(0, Math.min(total - 1, prev + delta)));
    },
    [total],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") {
        setI(0);
      } else if (e.key === "End") {
        setI(total - 1);
      } else if (/^[0-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10);
        if (n > 0 && n <= total) setI(n - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-6 py-8 md:px-10 md:py-12">
        {/* Top chrome */}
        <header className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-mute">
          <Link href="/" className="font-medium text-ink hover:text-ember">
            Roastpilot
          </Link>
          <span className="tnum">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </header>

        {/* Slide stage */}
        <main className="relative mt-8 flex flex-1 items-center">
          <div className="w-full">
            <Slide index={i} />
          </div>
        </main>

        {/* Bottom chrome */}
        <footer className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={() => go(-1)}
            disabled={i === 0}
            className="rounded-full border border-rule bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink disabled:opacity-30"
          >
            ← Prev
          </button>

          <div className="flex flex-1 items-center justify-center gap-1.5">
            {SLIDES.map((s, n) => (
              <button
                key={s}
                onClick={() => setI(n)}
                aria-label={`Go to slide ${n + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  n === i
                    ? "w-8 bg-ember"
                    : "w-1.5 bg-rule hover:bg-mute"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            disabled={i === total - 1}
            className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember-deep disabled:opacity-30"
          >
            Next →
          </button>
        </footer>

        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.16em] text-mute">
          ← → arrows · space · digits 1–9 · home/end
        </p>
      </div>
    </div>
  );
}

function Slide({ index }: { index: number }) {
  const key = SLIDES[index];
  switch (key) {
    case "title":
      return <Title />;
    case "problem":
      return <Problem />;
    case "why-now":
      return <WhyNow />;
    case "solution":
      return <Solution />;
    case "how-it-works":
      return <HowItWorks />;
    case "demo":
      return <Demo />;
    case "why-crypto":
      return <WhyCrypto />;
    case "traction":
      return <Traction />;
    case "model":
      return <Model />;
    case "competition":
      return <Competition />;
    case "roadmap":
      return <Roadmap />;
    case "ask":
      return <Ask />;
    case "closing":
      return <Closing />;
  }
}

/* ---------- Slides ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-ember">
      {children}
    </p>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="display mt-5 text-5xl leading-[0.95] text-ink md:text-7xl">
      {children}
    </h1>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mute md:text-xl">
      {children}
    </p>
  );
}

function Title() {
  return (
    <div>
      <Eyebrow>Roast as a Service</Eyebrow>
      <H1>
        Pay for the roast you{" "}
        <span className="text-ember">deserve.</span>
      </H1>
      <Lede>
        A two-sided marketplace where requesters post real-life scenarios,
        attach a bounty, and verified humans compete to deliver the sharpest
        cut. AI-assisted, but humans hold the knife.
      </Lede>

      <div className="mt-12 flex flex-wrap items-center gap-3 text-sm text-mute">
        <span className="rounded-full border border-rule bg-card px-3 py-1.5 font-medium text-ink">
          🔥 Roastpoints
        </span>
        <span className="rounded-full border border-rule bg-card px-3 py-1.5 font-medium text-ink">
          Stripe + Solana bounties
        </span>
        <span className="rounded-full border border-rule bg-card px-3 py-1.5 font-medium text-ink">
          Proof-of-Human verified
        </span>
      </div>
    </div>
  );
}

function Problem() {
  return (
    <div>
      <Eyebrow>The problem</Eyebrow>
      <H1>
        Everyone needs a verdict.{" "}
        <span className="text-mute">Nobody pays for a good one.</span>
      </H1>
      <Lede>
        Reddit&apos;s AITA gets <span className="text-ink font-medium">100M+ readers</span>{" "}
        a year begging strangers to judge their lives. The takes are mob-shaped,
        karma-farmed, and free. ChatGPT will hedge until you fall asleep. Your
        friends are too polite.
      </Lede>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <div className="display text-4xl text-ember tnum">100M+</div>
          <div className="mt-2 text-sm text-mute">
            annual AITA readers — proof of demand for verdicts
          </div>
        </Card>
        <Card>
          <div className="display text-4xl text-esh tnum">∞</div>
          <div className="mt-2 text-sm text-mute">
            hedged AI replies that won&apos;t commit to a take
          </div>
        </Card>
        <Card>
          <div className="display text-4xl text-nah tnum">$0</div>
          <div className="mt-2 text-sm text-mute">
            paid to the strangers doing the actual work
          </div>
        </Card>
      </div>
    </div>
  );
}

function WhyNow() {
  return (
    <div>
      <Eyebrow>Why now</Eyebrow>
      <H1>
        AI made the <span className="text-ember">setup</span> cheap.
        <br />
        Humans still own the <span className="text-ember">punchline.</span>
      </H1>
      <Lede>
        Three things lined up in 2026:
      </Lede>

      <ol className="mt-8 space-y-4">
        <Beat n="01" title="AI summarises, can&apos;t roast">
          Frontier models will draft a polite reference take in seconds, but
          they refuse to be cruel. Comedy needs a human signature.
        </Beat>
        <Beat n="02" title="Sub-cent settlement is real">
          Solana clears $1 bounties without burning the bounty in fees. Stripe
          handles the normies. Both work today.
        </Beat>
        <Beat n="03" title="Sybil resistance shipped">
          Proof-of-Human + wallet-bound identity means &ldquo;verified roaster&rdquo;
          isn&apos;t hand-wavy anymore — it&apos;s an on-chain fact.
        </Beat>
      </ol>
    </div>
  );
}

function Beat({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="card flex items-start gap-5 p-5">
      <span className="display text-3xl text-ember tnum">{n}</span>
      <div>
        <div className="font-medium text-ink">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-mute">{children}</p>
      </div>
    </li>
  );
}

function Solution() {
  return (
    <div>
      <Eyebrow>The solution</Eyebrow>
      <H1>
        Roastpilot is a <span className="text-ember">bounty board</span>{" "}
        for verdicts.
      </H1>
      <Lede>
        Post your scenario, attach a bounty in USD or SOL, and verified human
        roasters compete. Top three split the pot{" "}
        <span className="text-ink font-medium">50 / 30 / 20</span>
        {" "}in Roastpoints. AI drafts a reference take so you&apos;re never reading
        a blank page.
      </Lede>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">For requesters</div>
          <div className="display mt-2 text-3xl text-ink">A real take, on demand.</div>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            <li>· Pay for a verdict that bites</li>
            <li>· Stripe checkout or wallet pay</li>
            <li>· Pick your top three from the pile</li>
          </ul>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">For roasters</div>
          <div className="display mt-2 text-3xl text-ink">Get paid to be right.</div>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            <li>· POH + wallet-bound identity</li>
            <li>· Climb the public leaderboard</li>
            <li>· 🔥 Roastpoints settle to your wallet</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div>
      <Eyebrow>How it works</Eyebrow>
      <H1>Four steps. Nothing weird.</H1>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <Step n="1" label="Post">
          Drop your scenario. Stripe or Solana bounty.
        </Step>
        <Step n="2" label="AI drafts">
          Claude writes the reference roast as inspiration only.
        </Step>
        <Step n="3" label="Humans cut">
          Verified roasters submit their cleaner, sharper version.
        </Step>
        <Step n="4" label="You judge">
          You pick the top three. Bounty splits 50 / 30 / 20.
        </Step>
      </div>

      <p className="mt-10 max-w-2xl text-sm text-mute">
        Moderation runs on Claude Haiku in the background. POH gates roaster
        signup. The owner of the request is the only one who can rank — no mob
        upvoting.
      </p>
    </div>
  );
}

function Step({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="display text-4xl text-ember tnum">{n}</div>
      <div className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-ink">
        {label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-mute">{children}</p>
    </div>
  );
}

function Demo() {
  return (
    <div>
      <Eyebrow>The product</Eyebrow>
      <H1>Live, working, deployed.</H1>
      <Lede>
        Seeded with the top scenarios from r/AmItheAsshole so the marketplace
        never looks empty. Try the real thing.
      </Lede>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">Try it</div>
          <ul className="mt-4 space-y-3 text-sm">
            <Linky href="/">/ — Landing &amp; latest cases</Linky>
            <Linky href="/browse">/browse — Open bounties</Linky>
            <Linky href="/request">/request — Post a scenario</Linky>
            <Linky href="/leaderboard">/leaderboard — Top roasters</Linky>
            <Linky href="/become-a-roaster">/become-a-roaster — POH signup</Linky>
          </ul>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">Under the hood</div>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            <li>
              <span className="text-ink font-medium">Next.js 16</span> · App
              Router · Tailwind v4
            </li>
            <li>
              <span className="text-ink font-medium">Drizzle + SQLite</span>{" "}
              (Postgres-ready)
            </li>
            <li>
              <span className="text-ink font-medium">Anthropic Claude</span> ·
              Sonnet 4.6 for drafts, Haiku 4.5 for moderation
            </li>
            <li>
              <span className="text-ink font-medium">Solana wallet adapter</span>{" "}
              · Phantom + Solflare on devnet
            </li>
            <li>
              <span className="text-ink font-medium">Stripe Checkout</span> for
              fiat bounties
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Linky({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-soft"
      >
        <span className="font-mono text-[13px] text-ink">{children}</span>
        <span className="text-mute group-hover:text-ember">→</span>
      </Link>
    </li>
  );
}

function WhyCrypto() {
  return (
    <div>
      <Eyebrow>Why crypto</Eyebrow>
      <H1>
        Rip out the chain and{" "}
        <span className="text-ember">three things break.</span>
      </H1>

      <ol className="mt-10 space-y-5">
        <Break
          n="01"
          title="Sub-cent bounties"
          test="A $1 verdict can&apos;t pay 30¢ in card fees."
          fix="Solana settles instantly for fractions of a cent."
        />
        <Break
          n="02"
          title="Sybil-resistant identity"
          test="Anonymous roasters with no skin in the game = trolls."
          fix="POH + wallet-bound handle = one human, one reputation."
        />
        <Break
          n="03"
          title="Portable points"
          test="A platform-locked score is a hostage, not a reward."
          fix="Roastpoints live on a public ledger and travel with the wallet."
        />
      </ol>
    </div>
  );
}

function Break({
  n,
  title,
  test,
  fix,
}: {
  n: string;
  title: string;
  test: string;
  fix: string;
}) {
  return (
    <li className="card grid gap-3 p-5 md:grid-cols-[auto_1fr_1fr] md:items-center">
      <span className="display text-3xl text-ember tnum">{n}</span>
      <div>
        <div className="font-medium text-ink">{title}</div>
        <div className="mt-1 text-sm text-mute">{test}</div>
      </div>
      <div className="rounded-md bg-[color:var(--color-ember-soft)] px-3 py-2 text-sm text-ember-deep">
        {fix}
      </div>
    </li>
  );
}

function Traction() {
  return (
    <div>
      <Eyebrow>Where we are</Eyebrow>
      <H1>
        Shipped. Seeded. <span className="text-ember">Live on Vercel.</span>
      </H1>
      <Lede>
        Honest read: this is hackathon-stage. The marketplace is built end-to-end,
        seeded with real Reddit scenarios, and both payment rails work in
        sandbox. Next is paid roasters and mainnet bounties.
      </Lede>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <Metric label="Routes shipped" value="11" />
        <Metric label="Seeded cases" value="50+" />
        <Metric label="Payment rails" value="2" sub="Stripe + SOL" />
        <Metric label="Days to MVP" value="< 7" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Tick>End-to-end request → roast → judge → payout flow</Tick>
        <Tick>Wallet auth with cookie session, POH-gated signup</Tick>
        <Tick>Claude-drafted reference roast + Haiku moderation</Tick>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="display text-4xl text-ink tnum">{value}</div>
      {sub && <div className="mt-1 text-xs text-ember">{sub}</div>}
      <div className="mt-2 text-xs uppercase tracking-[0.14em] text-mute">
        {label}
      </div>
    </div>
  );
}

function Tick({ children }: { children: React.ReactNode }) {
  return (
    <div className="card flex items-start gap-3 p-4 text-sm">
      <span className="text-verified">✓</span>
      <span className="text-ink">{children}</span>
    </div>
  );
}

function Model() {
  return (
    <div>
      <Eyebrow>Business model</Eyebrow>
      <H1>
        Take rate on every <span className="text-ember">verdict.</span>
      </H1>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">Primary</div>
          <div className="display mt-2 text-3xl text-ink">10% of every bounty.</div>
          <p className="mt-3 text-sm text-mute">
            Standard marketplace cut. Roasters keep 90% of the pot, split
            50 / 30 / 20 across the top three.
          </p>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">Secondary</div>
          <div className="display mt-2 text-3xl text-ink">Roaster verification.</div>
          <p className="mt-3 text-sm text-mute">
            POH costs us money. Verified roasters pay a one-time fee to unlock
            higher-bounty pools.
          </p>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">Future</div>
          <div className="display mt-2 text-3xl text-ink">Featured cases.</div>
          <p className="mt-3 text-sm text-mute">
            Brands and creators sponsor cases for distribution. Built into the
            same marketplace surface.
          </p>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.18em] text-ember">Future</div>
          <div className="display mt-2 text-3xl text-ink">Roastpoints economy.</div>
          <p className="mt-3 text-sm text-mute">
            On-chain reputation that gates premium pools, partner discounts, and
            eventually a redeemable token.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Competition() {
  return (
    <div>
      <Eyebrow>Competition</Eyebrow>
      <H1>
        Everyone&apos;s judging.{" "}
        <span className="text-mute">Nobody&apos;s built the rails.</span>
      </H1>

      <div className="mt-10 overflow-hidden rounded-2xl border border-rule bg-card">
        <table className="w-full text-sm">
          <thead className="bg-soft text-left text-xs uppercase tracking-[0.14em] text-mute">
            <tr>
              <th className="px-4 py-3 font-medium">&nbsp;</th>
              <th className="px-4 py-3 font-medium">Sharp takes</th>
              <th className="px-4 py-3 font-medium">Pays the human</th>
              <th className="px-4 py-3 font-medium">Sybil-resistant</th>
              <th className="px-4 py-3 font-medium">Portable rep</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            <Row name="Reddit / AITA" cells={["yes", "no", "no", "no"]} />
            <Row name="ChatGPT" cells={["no", "n/a", "n/a", "no"]} />
            <Row name="Advice columns" cells={["sometimes", "yes", "yes", "no"]} />
            <Row name="Friends" cells={["no", "no", "yes", "no"]} />
            <Row
              name="Roastpilot"
              cells={["yes", "yes", "yes", "yes"]}
              highlight
            />
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-2xl text-sm text-mute">
        The status quo isn&apos;t a competitor — it&apos;s an attention farm with no
        alignment. We pay the people doing the work.
      </p>
    </div>
  );
}

function Row({
  name,
  cells,
  highlight,
}: {
  name: string;
  cells: string[];
  highlight?: boolean;
}) {
  return (
    <tr className={highlight ? "bg-[color:var(--color-ember-soft)]" : ""}>
      <td className={`px-4 py-3 font-medium ${highlight ? "text-ember-deep" : "text-ink"}`}>
        {name}
      </td>
      {cells.map((c, i) => (
        <td key={i} className="px-4 py-3 tnum">
          <Cell value={c} />
        </td>
      ))}
    </tr>
  );
}

function Cell({ value }: { value: string }) {
  if (value === "yes")
    return <span className="text-verified font-medium">✓ yes</span>;
  if (value === "no") return <span className="text-mute">— no</span>;
  if (value === "n/a") return <span className="text-mute">n/a</span>;
  return <span className="text-nta">~ {value}</span>;
}

function Roadmap() {
  return (
    <div>
      <Eyebrow>What&apos;s next</Eyebrow>
      <H1>
        From hackathon to{" "}
        <span className="text-ember">live marketplace.</span>
      </H1>

      <ol className="mt-10 space-y-3">
        <Phase
          when="Now"
          title="MVP shipped"
          items={[
            "End-to-end marketplace flow",
            "Stripe + Solana devnet rails",
            "AITA-seeded case library",
          ]}
          done
        />
        <Phase
          when="Next 30 days"
          title="Mainnet + first roasters"
          items={[
            "Mainnet Solana payouts",
            "First 100 verified roasters",
            "Postgres migration for production",
          ]}
        />
        <Phase
          when="60–90 days"
          title="Distribution"
          items={[
            "Featured / sponsored cases",
            "Creator partnerships",
            "Mobile-first request flow",
          ]}
        />
        <Phase
          when="Later"
          title="Reputation economy"
          items={[
            "Roastpoints redemption",
            "Cross-app POH integrations",
            "Open API for third-party clients",
          ]}
        />
      </ol>
    </div>
  );
}

function Phase({
  when,
  title,
  items,
  done,
}: {
  when: string;
  title: string;
  items: string[];
  done?: boolean;
}) {
  return (
    <li className="card grid gap-3 p-5 md:grid-cols-[140px_1fr]">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-ember">
          {when}
        </div>
        <div
          className={`mt-1 text-sm font-medium ${
            done ? "text-verified" : "text-ink"
          }`}
        >
          {done ? "✓ Done" : title}
        </div>
      </div>
      <ul className="text-sm text-mute">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mute" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

function Ask() {
  return (
    <div>
      <Eyebrow>The ask</Eyebrow>
      <H1>
        Help us turn this into{" "}
        <span className="text-ember">a real marketplace.</span>
      </H1>
      <Lede>
        We&apos;re looking for distribution partners, early roasters with a real
        voice, and judges who&apos;ll tell us what&apos;s broken before users do.
      </Lede>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card>
          <div className="display text-3xl text-ink">Try it</div>
          <p className="mt-2 text-sm text-mute">
            Post a scenario at{" "}
            <Link href="/request" className="text-ember underline-offset-4 hover:underline">
              /request
            </Link>
            . Tell us what feels off.
          </p>
        </Card>
        <Card>
          <div className="display text-3xl text-ink">Roast for us</div>
          <p className="mt-2 text-sm text-mute">
            Verified roasters with sharp voices.{" "}
            <Link
              href="/become-a-roaster"
              className="text-ember underline-offset-4 hover:underline"
            >
              /become-a-roaster
            </Link>
          </p>
        </Card>
        <Card>
          <div className="display text-3xl text-ink">Back us</div>
          <p className="mt-2 text-sm text-mute">
            Pre-seed conversations open. Hackathon judges: see scoring criteria
            in the appendix.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Closing() {
  return (
    <div className="text-center">
      <Eyebrow>Roastpilot</Eyebrow>
      <h1 className="display mt-6 text-6xl leading-[0.95] text-ink md:text-8xl">
        Pay for the roast you{" "}
        <span className="text-ember">deserve.</span>
      </h1>
      <p className="mx-auto mt-8 max-w-2xl text-lg text-mute md:text-xl">
        Real scenarios. Real money. Real humans, sharper than your group chat.
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-ember px-6 py-3 text-sm font-medium text-white hover:bg-ember-deep"
        >
          Open the app →
        </Link>
        <Link
          href="/browse"
          className="rounded-full border border-rule bg-card px-6 py-3 text-sm font-medium text-ink hover:border-ink"
        >
          Browse open bounties
        </Link>
      </div>
      <p className="mt-12 text-xs uppercase tracking-[0.18em] text-mute">
        roastpilot.vercel.app · 🔥 thanks for reading
      </p>
    </div>
  );
}

/* ---------- Primitives ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="card p-5">{children}</div>;
}
