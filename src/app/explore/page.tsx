import Link from "next/link";
import { db } from "@/db";
import { submissions, CATEGORIES, type Category } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { VerdictPill, SeverityPill } from "@/components/verdict-pill";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<Category, string> = {
  relationships: "Relationships",
  family: "Family",
  work: "Work",
  money: "Money",
  friends: "Friends",
  petty: "Petty",
  other: "Other",
};

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const category =
    c && (CATEGORIES as readonly string[]).includes(c)
      ? (c as Category)
      : null;

  const rows = db
    .select()
    .from(submissions)
    .where(
      category
        ? and(
            eq(submissions.moderationStatus, "approved"),
            eq(submissions.category, category),
          )
        : eq(submissions.moderationStatus, "approved"),
    )
    .orderBy(desc(submissions.createdAt))
    .limit(60)
    .all();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="display text-5xl text-ink">Explore the docket.</h1>
        <p className="mt-2 text-mute">
          Filter by category. Settle by reading.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <CategoryChip href="/explore" active={!category}>
            All
          </CategoryChip>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              href={`/explore?c=${cat}`}
              active={category === cat}
            >
              {CATEGORY_LABEL[cat]}
            </CategoryChip>
          ))}
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/v/${r.id}`}
                className="card flex h-full flex-col gap-3 p-5 transition hover:shadow-card-lg"
              >
                <div className="flex items-center justify-between text-xs text-mute">
                  <span className="font-medium text-ink tnum">
                    Case #{r.caseNumber}
                  </span>
                  <SeverityPill severity={r.severity} />
                </div>
                <p className="line-clamp-4 text-[15px] leading-relaxed text-ink">
                  {r.body}
                </p>
                <div className="mt-auto flex items-center justify-between text-sm text-mute">
                  <span className="capitalize">{r.category}</span>
                  {r.aiVerdict && <VerdictPill verdict={r.aiVerdict} />}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <div className="card mt-8 py-16 text-center">
            <p className="display text-3xl text-mute">No cases here yet.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-sm transition ${
        active
          ? "bg-ink text-paper"
          : "border border-rule bg-card text-mute hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
