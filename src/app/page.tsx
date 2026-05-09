import Link from "next/link";
import { db } from "@/db";
import { submissions, votes, type Verdict } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { VerdictPill, SeverityPill } from "@/components/verdict-pill";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = db
    .select()
    .from(submissions)
    .where(eq(submissions.moderationStatus, "approved"))
    .orderBy(desc(submissions.createdAt))
    .limit(40)
    .all();

  // Pull tallies for the visible page in one go.
  const tallies = new Map<string, Record<Verdict, number>>();
  for (const r of rows) {
    const counts = db
      .select({ verdict: votes.verdict, embers: votes.embers })
      .from(votes)
      .where(eq(votes.submissionId, r.id))
      .all();
    const acc: Record<Verdict, number> = {
      YTA: 0,
      NTA: 0,
      ESH: 0,
      NAH: 0,
      INFO: 0,
    };
    for (const c of counts) acc[c.verdict] += 1;
    tallies.set(r.id, acc);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <section className="mb-8 grid items-end gap-6 md:grid-cols-[1.4fr_1fr]">
          <h1 className="display text-5xl leading-[0.95] text-ink md:text-6xl">
            Submit a situation.
            <br />
            <span className="text-ember">Get the verdict.</span>
          </h1>
          <p className="text-base leading-relaxed text-mute md:text-lg">
            An AI delivers the opinion. Verified humans deliver the truth.
            <br className="hidden md:block" />
            Earn 🔥 Roastpoints for great takes.
          </p>
        </section>

        <div className="mb-5 flex items-center gap-1 border-b border-rule">
          {(["New", "Hot", "Controversial", "AI vs Crowd"] as const).map(
            (label, i) => (
              <span
                key={label}
                className={`relative px-3 py-2 text-sm font-medium ${i === 0 ? "text-ink" : "text-mute"}`}
              >
                {label}
                {i === 0 && (
                  <span className="absolute bottom-[-1px] left-2 right-2 h-[2px] rounded-full bg-ember" />
                )}
              </span>
            ),
          )}
        </div>

        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {rows.map((r) => {
              const tally = tallies.get(r.id) ?? null;
              const total = tally
                ? tally.YTA + tally.NTA + tally.ESH + tally.NAH
                : 0;
              return (
                <li key={r.id}>
                  <Link
                    href={`/v/${r.id}`}
                    className="card flex h-full flex-col gap-4 p-5 transition hover:shadow-card-lg"
                  >
                    <div className="flex items-center justify-between text-xs text-mute">
                      <span className="font-medium text-ink tnum">
                        Case #{r.caseNumber}
                      </span>
                      <span className="flex items-center gap-2">
                        <SeverityPill severity={r.severity} />
                        <span>
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                    </div>

                    <p className="line-clamp-3 text-[15px] leading-relaxed text-ink">
                      {r.body}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-sm">
                      {r.aiVerdict ? (
                        <div className="flex items-center gap-2 text-mute">
                          <span>AI:</span>
                          <VerdictPill verdict={r.aiVerdict} />
                        </div>
                      ) : (
                        <span className="text-mute">deliberating…</span>
                      )}
                      <span className="text-mute tnum">
                        {total} {total === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center gap-3 py-16 text-center">
      <p className="display text-3xl text-mute">The docket is empty.</p>
      <Link
        href="/submit"
        className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember-deep"
      >
        Be the first
      </Link>
    </div>
  );
}
