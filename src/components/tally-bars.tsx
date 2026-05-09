import type { Verdict } from "@/db/schema";

const ORDER: Exclude<Verdict, "INFO">[] = ["YTA", "NTA", "ESH", "NAH"];
const COLORS: Record<Exclude<Verdict, "INFO">, string> = {
  YTA: "var(--color-yta)",
  NTA: "var(--color-nta)",
  ESH: "var(--color-esh)",
  NAH: "var(--color-nah)",
};

export function TallyBars({
  tally,
  total,
}: {
  tally: Partial<Record<Verdict, number>>;
  total: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
      {ORDER.map((v) => {
        const count = tally[v] ?? 0;
        const pct = total === 0 ? 0 : Math.round((count / total) * 100);
        return (
          <div key={v} className="min-w-0">
            <div className="flex items-baseline justify-between">
              <span className="display text-2xl text-ink tnum">{pct}%</span>
              <span className="text-xs text-mute tnum">
                {count} {count === 1 ? "vote" : "votes"}
              </span>
            </div>
            <div className="mt-1 text-sm font-medium" style={{ color: COLORS[v] }}>
              {v}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rule">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                  background: COLORS[v],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
