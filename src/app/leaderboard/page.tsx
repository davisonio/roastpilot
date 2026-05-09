import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Avatar } from "@/components/avatar";

export const dynamic = "force-dynamic";

export default async function Leaderboard() {
  const leaders = db
    .select({
      id: users.id,
      handleSol: users.handleSol,
      walletAddress: users.walletAddress,
      roasterVerified: users.roasterVerified,
      roastPoints: users.roastPoints,
      roastsWon: users.roastsWon,
    })
    .from(users)
    .orderBy(desc(users.roastPoints))
    .limit(100)
    .all();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="display text-5xl text-ink">Leaderboard.</h1>
        <p className="mt-2 text-mute">
          Earned by being picked top 3 on a case. Bigger bounty, bigger payout.
        </p>

        <ol className="mt-8 divide-y divide-rule rounded-2xl border border-rule bg-card">
          {leaders.map((u, i) => {
            const tone =
              i === 0
                ? "var(--color-ember)"
                : i === 1
                  ? "oklch(58% 0.14 305)"
                  : i === 2
                    ? "oklch(72% 0.10 200)"
                    : "var(--color-mute)";
            return (
              <li key={u.id} className="flex items-center gap-4 px-5 py-4">
                <span className="display text-2xl tnum w-10 text-right" style={{ color: tone }}>
                  {i + 1}
                </span>
                <Avatar seed={u.walletAddress ?? u.handleSol} verified={u.roasterVerified} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink truncate">{u.handleSol}</div>
                  {u.roasterVerified && (
                    <div className="text-[11px] text-verified">Verified roaster</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-ember tnum">🔥 {u.roastPoints.toLocaleString()}</div>
                  <div className="text-[11px] text-mute tnum">{u.roastsWon} {u.roastsWon === 1 ? "win" : "wins"}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}
