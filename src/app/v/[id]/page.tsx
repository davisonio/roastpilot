import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { submissions, votes, users, type Verdict } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Donut } from "@/components/donut";
import { TallyBars } from "@/components/tally-bars";
import { TopTakes, type TakeRow } from "@/components/top-takes";
import { ShareRail } from "@/components/share-rail";
import { AboutCase } from "@/components/about-case";
import { VerdictPill, SeverityPill } from "@/components/verdict-pill";
import { FollowUpActions } from "@/components/follow-up-actions";

export const dynamic = "force-dynamic";

export default async function VerdictPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = db.select().from(submissions).where(eq(submissions.id, id)).get();
  if (!row) notFound();

  const takeRows = db
    .select({
      id: votes.id,
      verdict: votes.verdict,
      take: votes.take,
      takeTag: votes.takeTag,
      embers: votes.embers,
      handleSol: users.handleSol,
      walletAddress: users.walletAddress,
      pohVerified: users.pohVerified,
    })
    .from(votes)
    .innerJoin(users, eq(users.id, votes.userId))
    .where(eq(votes.submissionId, id))
    .orderBy(desc(votes.embers))
    .all();

  const reasoning: string[] = row.aiReasoning
    ? (JSON.parse(row.aiReasoning) as string[])
    : [];

  const tally = countTally(takeRows.map((t) => t.verdict));
  const total = takeRows.length;
  const { topVerdict, topPct } = pickTop(tally, total, row.aiVerdict);

  const takesForUI: TakeRow[] = takeRows
    .filter((t) => t.take)
    .map((t) => ({
      id: t.id,
      handleSol: t.handleSol,
      walletAddress: t.walletAddress,
      pohVerified: t.pohVerified,
      verdict: t.verdict,
      take: t.take ?? "",
      takeTag: t.takeTag,
      embers: t.embers,
    }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-mute hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M9 3l-4 4 4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to feed
          </Link>
          <div className="flex items-center gap-3 text-mute">
            <span className="font-medium text-ink tnum">
              Case #{row.caseNumber}
            </span>
            <span className="text-rule">·</span>
            <span>
              {new Date(row.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-rule">·</span>
            <SeverityPill severity={row.severity} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <section className="card-lg overflow-hidden">
              <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-8">
                <div className="flex justify-center md:justify-start">
                  <Donut
                    percent={topPct}
                    verdict={topVerdict}
                    label="Humans say"
                  />
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="display text-5xl leading-[0.95] text-ink">
                      Mostly{" "}
                      <span
                        style={{
                          color: `var(--color-${topVerdict.toLowerCase()})`,
                        }}
                      >
                        {topVerdict}
                      </span>
                    </h2>
                    <p className="mt-2 text-base text-mute">
                      {total === 0
                        ? "Be the first verdict on this case."
                        : topPct >= 60
                          ? "It’s not even close."
                          : "It’s tighter than expected."}
                    </p>
                  </div>

                  <AiHumanRow
                    aiVerdict={row.aiVerdict}
                    humansVerdict={total === 0 ? null : topVerdict}
                  />

                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      AI Roast <span aria-hidden>✨</span>
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
                      {row.aiRoast ??
                        "The bench is still deliberating on this one."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-rule bg-paper/40 p-6 md:p-8">
                <TallyBars tally={tally} total={total} />
              </div>
            </section>

            <TopTakes takes={takesForUI} totalCount={takesForUI.length} />

            <FollowUpActions submissionId={row.id} />

            <SubmissionBody body={row.body} />

            {reasoning.length > 0 && (
              <section className="card p-6 md:p-7">
                <h3 className="text-sm font-medium text-ink">
                  Why the bench ruled this way
                </h3>
                <ul className="mt-3 space-y-2 text-[15px] text-mute">
                  {reasoning.map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ember" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ShareRail
              caseNumber={row.caseNumber}
              topVerdict={topVerdict}
              topVerdictPct={topPct}
              aiVerdict={row.aiVerdict}
            />
            <AboutCase
              category={row.category}
              severity={row.severity}
              submittedAt={new Date(row.createdAt)}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function SubmissionBody({ body }: { body: string }) {
  return (
    <section className="card p-6 md:p-7">
      <h3 className="text-sm font-medium text-ink">The submission</h3>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
        {body}
      </p>
    </section>
  );
}

function AiHumanRow({
  aiVerdict,
  humansVerdict,
}: {
  aiVerdict: Verdict | null;
  humansVerdict: Verdict | null;
}) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-rule bg-paper px-4 py-2 text-sm">
      <span className="flex items-center gap-1.5">
        <span aria-hidden>🤖</span>
        <span className="text-mute">AI says:</span>
        {aiVerdict ? (
          <VerdictPill verdict={aiVerdict} />
        ) : (
          <span className="text-mute">—</span>
        )}
      </span>
      <span className="h-3 w-px bg-rule" />
      <span className="flex items-center gap-1.5">
        <span aria-hidden>👥</span>
        <span className="text-mute">Humans say:</span>
        {humansVerdict ? (
          <VerdictPill verdict={humansVerdict} />
        ) : (
          <span className="text-mute">no votes</span>
        )}
      </span>
    </div>
  );
}

function countTally(verdicts: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of verdicts) out[v] = (out[v] ?? 0) + 1;
  return out;
}

function pickTop(
  tally: Record<string, number>,
  total: number,
  fallback: Verdict | null,
): { topVerdict: Verdict; topPct: number } {
  if (total === 0) {
    const v = (fallback ?? "INFO") as Verdict;
    return { topVerdict: v === "INFO" ? "NTA" : v, topPct: 0 };
  }
  let best: Verdict = "NTA";
  let bestCount = -1;
  for (const v of ["YTA", "NTA", "ESH", "NAH"] as Verdict[]) {
    const c = tally[v] ?? 0;
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return { topVerdict: best, topPct: (bestCount / total) * 100 };
}
