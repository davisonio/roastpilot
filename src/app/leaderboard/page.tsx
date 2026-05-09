import { getLeaderboard } from "@/lib/store";
import { FlameRank } from "@/components/FlameRank";
import { HandleBadge } from "@/components/HandleBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Leaderboard() {
  const leaders = getLeaderboard();

  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 pb-20">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">
          The room remembers
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-tight">
          Top roasters.
        </h1>
        <p className="mt-3 text-ink-soft">
          Ranked by 🔥 ignitions — takes other humans found worthy enough to light.
        </p>
      </div>

      {leaders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-rule p-12 text-center">
          <p className="text-ink-soft">No ignitions yet. Go ignite some takes.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-accent hover:text-accent-strong">
            Browse the feed →
          </Link>
        </div>
      ) : (
        <ol className="space-y-2">
          {leaders.map((entry, i) => {
            const rank = i + 1;
            const isTop3 = rank <= 3;
            return (
              <li
                key={entry.handle}
                className={`flex items-center gap-4 rounded-xl p-4 transition-heat ${
                  rank === 1
                    ? "border border-accent/30 bg-paper heat-glow-2 noise-texture"
                    : rank <= 3
                      ? "border border-rule bg-paper heat-glow-1 noise-texture"
                      : "border border-rule bg-paper"
                }`}
              >
                <FlameRank rank={rank} />

                <div className="w-7 text-right shrink-0">
                  <span
                    className={`font-display font-bold text-xl ${
                      rank === 1 ? "text-accent-pale"
                      : rank === 2 ? "text-accent-bright"
                      : rank === 3 ? "text-accent"
                      : "text-ink-faint"
                    }`}
                  >
                    {rank}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <HandleBadge
                    name={entry.handle}
                    size={isTop3 ? "md" : "sm"}
                    className={rank === 1 ? "text-ink" : undefined}
                  />
                  <p className="text-xs text-ink-faint mt-1">
                    {entry.commentCount} {entry.commentCount === 1 ? "verdict" : "verdicts"} posted
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`font-display font-semibold text-2xl ${
                      rank === 1 ? "text-accent-pale"
                      : rank <= 3 ? "text-accent"
                      : "text-ink-soft"
                    }`}
                  >
                    {entry.ignitions}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    ignitions
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-12 rounded-xl border border-rule bg-paper p-6 noise-texture text-sm">
        <h3 className="font-semibold text-ink mb-2">How ignitions work</h3>
        <p className="text-ink-soft leading-relaxed">
          Read a comment that nails it? Hit 🔥 to ignite it. Every ignition is one point for that roaster.
          The leaderboard resets each server restart — this is a live demo.
        </p>
      </div>
    </div>
  );
}
