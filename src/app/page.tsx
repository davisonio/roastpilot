import Link from "next/link";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { VerdictStamp } from "@/components/verdict-stamp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = db
    .select()
    .from(submissions)
    .where(eq(submissions.moderationStatus, "approved"))
    .orderBy(desc(submissions.createdAt))
    .limit(30)
    .all();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <section className="grid items-baseline gap-8 md:grid-cols-[1.2fr_1fr]">
          <h1 className="display text-5xl leading-none text-ink md:text-7xl">
            A quiet bench.
            <br />
            A loud crowd.
          </h1>
          <p className="text-lg text-mute md:text-xl">
            Submit a situation. The model writes the opinion. Verified humans
            disagree. Welcome to the docket.
          </p>
        </section>

        <div className="mt-12 flex items-baseline gap-6 border-b border-rule pb-3 text-sm">
          <span className="border-b-2 border-ember pb-3 text-ink">
            New
          </span>
          <span className="text-mute">Hot</span>
          <span className="text-mute">Controversial</span>
          <span className="text-mute">AI vs Crowd</span>
        </div>

        <ul className="mt-2 divide-y divide-rule">
          {rows.length === 0 && <EmptyState />}
          {rows.map((row) => (
            <li key={row.id} className="py-8">
              <Link href={`/v/${row.id}`} className="group block">
                <div className="flex items-center justify-between text-xs text-mute">
                  <span className="tnum">
                    {new Date(row.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {row.severity === "nuclear" && (
                    <span className="display text-base text-ember">
                      Nuclear
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-3 text-lg leading-relaxed text-ink group-hover:text-ember-deep">
                  {row.body}
                </p>
                <div className="mt-3 flex items-baseline gap-6">
                  {row.aiVerdict ? (
                    <VerdictStamp verdict={row.aiVerdict} size="sm" />
                  ) : (
                    <span className="display text-sm text-mute">
                      deliberating…
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}

function EmptyState() {
  return (
    <li className="py-16 text-center">
      <p className="display text-3xl text-mute">The docket is empty.</p>
      <Link
        href="/submit"
        className="mt-4 inline-block text-sm text-ink underline underline-offset-4 hover:text-ember"
      >
        be the first
      </Link>
    </li>
  );
}
