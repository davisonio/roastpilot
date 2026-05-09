import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { roastRequests, roasts, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Avatar } from "@/components/avatar";
import { currentUser } from "@/lib/session";
import { RoastSubmitForm } from "@/components/roast-submit-form";
import { SelectTop3 } from "@/components/select-top-3";
import { SolanaPayInline } from "@/components/solana-pay-inline";

export const dynamic = "force-dynamic";

type RoastRow = {
  id: string;
  body: string;
  rank: number | null;
  embers: number;
  pointsAwarded: number;
  createdAt: Date;
  redditScore: number | null;
  roasterId: string;
  handleSol: string;
  walletAddress: string | null;
  roasterVerified: boolean;
};

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pay?: string; paid?: string; canceled?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const me = await currentUser();

  const req = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.id, id))
    .get();
  if (!req) notFound();

  const allRoasts = db
    .select({
      id: roasts.id,
      body: roasts.body,
      rank: roasts.rank,
      embers: roasts.embers,
      pointsAwarded: roasts.pointsAwarded,
      createdAt: roasts.createdAt,
      redditScore: roasts.redditScore,
      roasterId: roasts.roasterId,
      handleSol: users.handleSol,
      walletAddress: users.walletAddress,
      roasterVerified: users.roasterVerified,
    })
    .from(roasts)
    .innerJoin(users, eq(users.id, roasts.roasterId))
    .where(eq(roasts.requestId, id))
    .all() as RoastRow[];

  const ranked = allRoasts.filter((r) => r.rank).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  const unranked = allRoasts
    .filter((r) => !r.rank)
    .sort((a, b) => (b.redditScore ?? b.embers) - (a.redditScore ?? a.embers));

  const isOwner = !!me && me.id === req.requesterId;
  const isOpen = req.status === "open";
  const canRoast = !!me && !!me.roasterVerified && isOpen && me.id !== req.requesterId;
  const alreadyRoasted = !!me && allRoasts.some((r) => r.roasterId === me.id);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link href="/browse" className="flex items-center gap-1.5 text-mute hover:text-ink">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M9 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to browse
          </Link>
          <div className="flex items-center gap-3 text-mute">
            <span className="font-medium text-ink tnum">Case #{req.caseNumber}</span>
            <span className="text-rule">·</span>
            <span>{new Date(req.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="text-rule">·</span>
            <BountyTag cents={req.bountyCents} status={req.paymentStatus} currency={req.currency} />
            <span className="text-rule">·</span>
            <StatusTag status={req.status} />
          </div>
        </div>

        {sp.paid === "1" && (
          <Banner tone="ok">Payment received. Your case is open for roasting.</Banner>
        )}
        {sp.canceled === "1" && (
          <Banner tone="warn">Payment was canceled — your case is still pending.</Banner>
        )}
        {req.paymentStatus === "pending" && req.paymentProvider !== "solana" && sp.pay !== "solana" && (
          <Banner tone="warn">
            This case is unpaid. Roasters can&apos;t reply until the bounty is settled.
          </Banner>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <section className="card-lg p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.14em] text-mute">The scenario</p>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{req.scenario}</p>
              {req.redditUrl && (
                <p className="mt-4 text-[11px] text-mute">
                  Originally posted on Reddit · <a href={req.redditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">{req.redditId}</a>
                </p>
              )}
            </section>

            {req.aiSuggestion && (
              <section className="card-lg p-6 md:p-8">
                <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  AI suggestion <span aria-hidden>✨</span>
                </p>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{req.aiSuggestion}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-mute">
                  reference — riff on it, sharpen it, disagree with it
                </p>
              </section>
            )}

            {req.status === "judged" && ranked.length > 0 && (
              <section>
                <h3 className="display text-2xl text-ink mb-4">The verdict.</h3>
                <ul className="space-y-3">
                  {ranked.map((r) => (
                    <RankedRoast key={r.id} roast={r} />
                  ))}
                </ul>
              </section>
            )}

            {unranked.length > 0 && (
              <section className="card p-6 md:p-7">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-medium text-ink">{unranked.length} roast{unranked.length === 1 ? "" : "s"} pending judgment</h3>
                  {isOpen && me && req.requesterId === me.id && unranked.length >= 3 && (
                    <span className="text-sm text-ember">Pick your top 3 below ↓</span>
                  )}
                </div>
                <ul className="mt-4 divide-y divide-rule">
                  {unranked.map((r) => (
                    <UnrankedRoast key={r.id} roast={r} />
                  ))}
                </ul>
              </section>
            )}

            {isOwner && isOpen && unranked.length >= 3 && (
              <SelectTop3 requestId={req.id} candidates={unranked.map((r) => ({ id: r.id, body: r.body, handleSol: r.handleSol }))} />
            )}

            {canRoast && !alreadyRoasted && (
              <RoastSubmitForm requestId={req.id} />
            )}

            {!canRoast && isOpen && me && !me.roasterVerified && (
              <div className="card p-5">
                <p className="text-sm text-ink">
                  You need to verify as a roaster before replying to cases.
                </p>
                <Link href="/become-a-roaster" className="mt-2 inline-block text-sm font-medium text-ember hover:text-ember-deep">
                  Become a roaster →
                </Link>
              </div>
            )}

            {alreadyRoasted && isOpen && (
              <div className="card p-5 text-sm text-mute">
                You&apos;ve already roasted this case. Waiting on the requester to pick the top 3.
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {sp.pay === "solana" && req.paymentStatus === "pending" && (
              <SolanaPayInline requestId={req.id} bountyCents={req.bountyCents} />
            )}
            <BountyCard
              cents={req.bountyCents}
              status={req.paymentStatus}
              currency={req.currency}
              roasts={allRoasts.length}
            />
            <AboutBox category={req.category} createdAt={new Date(req.createdAt)} judgedAt={req.judgedAt ? new Date(req.judgedAt) : null} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function RankedRoast({ roast }: { roast: RoastRow }) {
  const rank = roast.rank ?? 0;
  const accent =
    rank === 1 ? "var(--color-ember)" : rank === 2 ? "oklch(58% 0.14 305)" : "oklch(72% 0.10 200)";
  return (
    <li className="card-lg p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="display text-3xl tnum"
            style={{ color: accent }}
          >
            #{rank}
          </span>
          <Avatar seed={roast.walletAddress ?? roast.handleSol} verified={roast.roasterVerified} size={32} />
          <span className="font-medium text-ink">{roast.handleSol}</span>
        </div>
        <span className="text-sm text-ember tnum">+{roast.pointsAwarded} 🔥</span>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{roast.body}</p>
    </li>
  );
}

function UnrankedRoast({ roast }: { roast: RoastRow }) {
  return (
    <li className="py-4">
      <div className="flex items-center gap-3">
        <Avatar seed={roast.walletAddress ?? roast.handleSol} verified={roast.roasterVerified} size={28} />
        <span className="text-sm font-medium text-ink">{roast.handleSol}</span>
        <span className="text-[11px] text-mute">{new Date(roast.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{roast.body}</p>
    </li>
  );
}

function BountyTag({ cents, status, currency }: { cents: number; status: string; currency: string }) {
  if (status === "seeded") return <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">seed · ${(cents / 100).toFixed(0)}</span>;
  if (status === "pending") return <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">pending</span>;
  return (
    <span className="rounded-full bg-[color:var(--color-ember-soft)] px-2 py-0.5 text-[11px] font-medium text-ember-deep">
      ${(cents / 100).toFixed(0)}{currency === "sol" ? " · SOL" : ""}
    </span>
  );
}

function StatusTag({ status }: { status: string }) {
  if (status === "judged")
    return <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">judged</span>;
  return <span className="rounded-full bg-[color:var(--color-yta-soft)] px-2 py-0.5 text-[11px] font-medium text-yta">open</span>;
}

function Banner({
  tone,
  children,
}: {
  tone: "ok" | "warn";
  children: React.ReactNode;
}) {
  const base = "mb-5 rounded-xl px-4 py-3 text-sm";
  const t = tone === "ok"
    ? "bg-[color:var(--color-nah-soft)] text-[color:var(--color-nah)]"
    : "bg-[color:var(--color-yta-soft)] text-[color:var(--color-yta)]";
  return <div className={`${base} ${t}`}>{children}</div>;
}

function BountyCard({ cents, status, currency, roasts }: { cents: number; status: string; currency: string; roasts: number }) {
  const dollars = (cents / 100).toFixed(0);
  return (
    <section className="card-lg p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-mute">Bounty</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="display text-4xl text-ember">${dollars}</span>
        <span className="text-sm text-mute">{currency === "sol" ? "in SOL" : "USD"}</span>
      </div>
      <p className="mt-3 text-sm text-mute">
        Top 3 split <span className="font-medium text-ink">50 / 30 / 20</span>.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <PoolRow label="Rank #1" pct={0.5} cents={cents} />
        <PoolRow label="Rank #2" pct={0.3} cents={cents} />
        <PoolRow label="Rank #3" pct={0.2} cents={cents} />
      </ul>
      <p className="mt-4 text-xs text-mute">
        {roasts} {roasts === 1 ? "roast" : "roasts"} submitted · status {status}
      </p>
    </section>
  );
}

function PoolRow({ label, pct, cents }: { label: string; pct: number; cents: number }) {
  const points = Math.round(Math.max(30, cents) * pct);
  return (
    <li className="flex items-center justify-between text-mute">
      <span>{label}</span>
      <span className="text-ink tnum">+{points} 🔥</span>
    </li>
  );
}

function AboutBox({ category, createdAt, judgedAt }: { category: string; createdAt: Date; judgedAt: Date | null }) {
  return (
    <section className="card-lg p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-mute">About</p>
      <dl className="mt-3 space-y-2 text-sm">
        <Row label="Category" value={<span className="capitalize">{category}</span>} />
        <Row label="Submitted" value={createdAt.toLocaleDateString()} />
        {judgedAt && <Row label="Judged" value={judgedAt.toLocaleDateString()} />}
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-mute">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
