import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { roastRequests, roasts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Avatar } from "@/components/avatar";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Me() {
  const me = await currentUser();
  if (!me) redirect("/");

  const myRequests = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.requesterId, me.id))
    .orderBy(desc(roastRequests.createdAt))
    .all();

  const myRoasts = db
    .select({
      id: roasts.id,
      body: roasts.body,
      rank: roasts.rank,
      pointsAwarded: roasts.pointsAwarded,
      createdAt: roasts.createdAt,
      requestId: roasts.requestId,
      caseNumber: roastRequests.caseNumber,
      scenario: roastRequests.scenario,
    })
    .from(roasts)
    .innerJoin(roastRequests, eq(roastRequests.id, roasts.requestId))
    .where(eq(roasts.roasterId, me.id))
    .orderBy(desc(roasts.createdAt))
    .all();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <section className="card-lg p-6 md:p-8">
          <div className="flex items-center gap-4">
            <Avatar seed={me.walletAddress ?? me.handleSol} verified={me.roasterVerified} size={56} />
            <div className="min-w-0">
              <h1 className="display text-3xl text-ink">{me.handleSol}</h1>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-mute">
                <span>{me.roasterVerified ? <span className="text-verified font-medium">Verified roaster</span> : <span>Not yet a roaster</span>}</span>
                <span>·</span>
                <span><span className="font-medium text-ink tnum">🔥 {me.roastPoints.toLocaleString()}</span> Roastpoints</span>
                <span>·</span>
                <span className="tnum">{me.roastsWon} {me.roastsWon === 1 ? "win" : "wins"}</span>
              </div>
            </div>
          </div>
          {!me.roasterVerified && (
            <Link href="/become-a-roaster" className="mt-4 inline-block rounded-full bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember-deep">
              Become a roaster →
            </Link>
          )}
        </section>

        <section className="mt-8">
          <h2 className="display text-2xl text-ink">Your cases</h2>
          {myRequests.length === 0 ? (
            <p className="mt-3 text-sm text-mute">You haven&apos;t requested any roasts yet. <Link href="/request" className="text-ember hover:text-ember-deep">Try one.</Link></p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {myRequests.map((r) => (
                <li key={r.id}>
                  <Link href={`/r/${r.id}`} className="card flex flex-col gap-2 p-4 hover:shadow-card-lg">
                    <div className="flex items-center justify-between text-xs text-mute">
                      <span className="font-medium text-ink tnum">Case #{r.caseNumber}</span>
                      <span>${(r.bountyCents / 100).toFixed(0)} · {r.status}</span>
                    </div>
                    <p className="line-clamp-3 text-sm text-ink">{r.scenario}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="display text-2xl text-ink">Your roasts</h2>
          {myRoasts.length === 0 ? (
            <p className="mt-3 text-sm text-mute">You haven&apos;t roasted any cases yet. <Link href="/browse" className="text-ember hover:text-ember-deep">Browse open bounties.</Link></p>
          ) : (
            <ul className="mt-4 space-y-3">
              {myRoasts.map((r) => (
                <li key={r.id} className="card p-4">
                  <div className="flex items-center justify-between text-xs text-mute">
                    <Link href={`/r/${r.requestId}`} className="font-medium text-ink hover:text-ember tnum">Case #{r.caseNumber}</Link>
                    <span className="flex items-center gap-2">
                      {r.rank ? (
                        <span className="rounded-full bg-[color:var(--color-ember-soft)] px-2 py-0.5 text-[11px] font-medium text-ember-deep">
                          rank #{r.rank} · +{r.pointsAwarded} 🔥
                        </span>
                      ) : (
                        <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">awaiting verdict</span>
                      )}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-ink">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
