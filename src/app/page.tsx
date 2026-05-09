import Link from "next/link";
import { db } from "@/db";
import { roastRequests, users, roasts } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Avatar } from "@/components/avatar";

export const dynamic = "force-dynamic";

export default async function Landing() {
  const recent = db
    .select()
    .from(roastRequests)
    .orderBy(desc(roastRequests.createdAt))
    .limit(6)
    .all();

  const stats = db
    .select({
      cases: sql<number>`count(*)`.as("cases"),
    })
    .from(roastRequests)
    .get();
  const roastsCount = db
    .select({ n: sql<number>`count(*)` })
    .from(roasts)
    .get();
  const roastersCount = db
    .select({ n: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.roasterVerified, true))
    .get();

  const topRoasters = db
    .select({
      handleSol: users.handleSol,
      walletAddress: users.walletAddress,
      roastPoints: users.roastPoints,
      roastsWon: users.roastsWon,
    })
    .from(users)
    .where(eq(users.roasterVerified, true))
    .orderBy(desc(users.roastPoints))
    .limit(5)
    .all();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto w-full max-w-7xl px-6 pt-16 md:pt-24">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-ember">
            Roast as a Service
          </p>
          <h1 className="display mt-4 text-5xl leading-[0.95] text-ink md:text-7xl">
            Pay for the roast you{" "}
            <span className="text-ember">deserve.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute md:text-xl">
            Post your scenario, attach a bounty, and verified human roasters
            compete for the top three spots. Stripe or Solana. AI-assisted, but
            the cuts are real.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/request"
              className="rounded-full bg-ember px-5 py-3 text-sm font-medium text-white hover:bg-ember-deep"
            >
              Request a roast
            </Link>
            <Link
              href="/browse"
              className="rounded-full border border-rule bg-card px-5 py-3 text-sm font-medium text-ink hover:border-ink"
            >
              Browse open bounties →
            </Link>
            <Link
              href="/become-a-roaster"
              className="rounded-full px-5 py-3 text-sm font-medium text-mute hover:text-ink"
            >
              Become a roaster
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-2 max-w-md text-sm">
            <Stat label="Cases" value={stats?.cases ?? 0} />
            <Stat label="Roasts" value={roastsCount?.n ?? 0} />
            <Stat label="Roasters" value={roastersCount?.n ?? 0} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="display text-3xl text-ink">Latest cases.</h2>
            <Link href="/browse" className="text-sm font-medium text-ember hover:text-ember-deep">
              See all →
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recent.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/r/${r.id}`}
                  className="card flex h-full flex-col gap-3 p-5 transition hover:shadow-card-lg"
                >
                  <div className="flex items-center justify-between text-xs text-mute">
                    <span className="font-medium text-ink tnum">Case #{r.caseNumber}</span>
                    <BountyBadge cents={r.bountyCents} currency={r.currency} status={r.paymentStatus} />
                  </div>
                  <p className="line-clamp-4 text-[15px] leading-relaxed text-ink">{r.scenario}</p>
                  <div className="mt-auto flex items-center justify-between text-sm text-mute">
                    <span className="capitalize">{r.category}</span>
                    <span>{r.status === "judged" ? "Judged" : "Open"}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="display text-3xl text-ink">Top roasters.</h2>
            <Link href="/leaderboard" className="text-sm font-medium text-ember hover:text-ember-deep">
              Full leaderboard →
            </Link>
          </div>
          <ol className="mt-6 divide-y divide-rule rounded-2xl border border-rule bg-card">
            {topRoasters.map((u, i) => (
              <li key={u.handleSol} className="flex items-center gap-4 px-5 py-4">
                <span className="display text-2xl text-mute tnum w-8 tabular-nums">{i + 1}</span>
                <Avatar seed={u.walletAddress ?? u.handleSol} verified size={32} />
                <span className="flex-1 font-medium text-ink">{u.handleSol}</span>
                <span className="text-sm text-mute tnum">{u.roastsWon} {u.roastsWon === 1 ? "win" : "wins"}</span>
                <span className="text-base font-medium text-ember tnum">🔥 {u.roastPoints.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-l-2 border-ember pl-3">
      <div className="display text-2xl text-ink tnum">{value.toLocaleString()}</div>
      <div className="text-[11px] uppercase tracking-[0.14em] text-mute">{label}</div>
    </div>
  );
}

function BountyBadge({ cents, currency, status }: { cents: number; currency: string; status: string }) {
  if (status === "seeded") {
    return <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">seed</span>;
  }
  if (cents <= 0) {
    return <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">free</span>;
  }
  const dollars = (cents / 100).toFixed(0);
  return (
    <span className="rounded-full bg-[color:var(--color-ember-soft)] px-2 py-0.5 text-[11px] font-medium text-ember-deep">
      ${dollars}{currency === "sol" ? " SOL" : ""}
    </span>
  );
}
