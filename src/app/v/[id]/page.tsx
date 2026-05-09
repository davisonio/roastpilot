import { notFound } from "next/navigation";
import { db } from "@/db";
import { submissions, votes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import {
  VerdictStamp,
  VerdictDisplay,
} from "@/components/verdict-stamp";

export const dynamic = "force-dynamic";

export default async function VerdictPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .get();
  if (!row) notFound();

  const takes = db
    .select()
    .from(votes)
    .where(eq(votes.submissionId, id))
    .orderBy(desc(votes.embers))
    .limit(20)
    .all();

  const reasoning: string[] = row.aiReasoning
    ? (JSON.parse(row.aiReasoning) as string[])
    : [];

  const tally = countTally(takes.map((t) => t.verdict));

  return (
    <>
      <SiteHeader />
      <main className="column px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-mute">
          Submission · {new Date(row.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-ink">
          {row.body}
        </p>

        <hr className="rule mt-12" />

        <section className="mt-12">
          <p className="text-xs uppercase tracking-widest text-mute">
            The opinion
          </p>
          {row.aiVerdict && (
            <div className="mt-6">
              <VerdictDisplay verdict={row.aiVerdict} />
            </div>
          )}
          {row.aiRoast ? (
            <p className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-ink">
              {row.aiRoast}
            </p>
          ) : (
            <p className="mt-8 display text-2xl text-mute">
              the bench is still deliberating.
            </p>
          )}
          {reasoning.length > 0 && (
            <ul className="mt-8 space-y-2 text-mute">
              {reasoning.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="display text-ember">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}
          {row.aiVerdict && (
            <p className="mt-8 text-xs text-mute">
              <VerdictStamp verdict={row.aiVerdict} size="sm" />{" "}
              <span className="ml-2 tnum">
                confidence {row.aiConfidence ?? 60}
              </span>
            </p>
          )}
        </section>

        <hr className="rule mt-16" />

        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-widest text-mute">
              The crowd
            </p>
            <p className="text-sm text-mute tnum">
              {takes.length} verified human take{takes.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
            {(["NTA", "YTA", "ESH", "NAH"] as const).map((v) => (
              <div key={v} className="flex items-baseline justify-between">
                <VerdictStamp verdict={v} size="sm" />
                <span className="display text-2xl tnum text-ink">
                  {tally[v] ?? 0}
                </span>
              </div>
            ))}
          </div>

          {takes.length === 0 ? (
            <p className="mt-12 display text-2xl text-mute">
              no human has dared rule yet.
            </p>
          ) : (
            <ul className="mt-12 divide-y divide-rule">
              {takes.map((t) => (
                <li key={t.id} className="py-5">
                  <div className="flex items-baseline justify-between">
                    <VerdictStamp verdict={t.verdict} size="sm" />
                    <span className="text-xs text-mute tnum">
                      {t.embers} ember{t.embers === 1 ? "" : "s"}
                    </span>
                  </div>
                  {t.take && (
                    <p className="mt-2 text-ink">{t.take}</p>
                  )}
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

function countTally(verdicts: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of verdicts) out[v] = (out[v] ?? 0) + 1;
  return out;
}
