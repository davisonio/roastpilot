import Link from "next/link";
import { db } from "@/db";
import {
  roastRequests,
  CATEGORIES,
  type Category,
  type RequestStatus,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { SiteHeader, SiteFooter } from "@/components/site-header";

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

export default async function Browse({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; s?: string }>;
}) {
  const { c, s } = await searchParams;
  const category =
    c && (CATEGORIES as readonly string[]).includes(c) ? (c as Category) : null;
  const status = s === "judged" ? "judged" : s === "open" ? "open" : null;

  const filters = [];
  if (category) filters.push(eq(roastRequests.category, category));
  if (status) filters.push(eq(roastRequests.status, status as RequestStatus));

  const where = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters);

  const rows = db
    .select()
    .from(roastRequests)
    .where(where as never)
    .orderBy(desc(roastRequests.createdAt))
    .limit(120)
    .all();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="display text-5xl text-ink">Browse the docket.</h1>
        <p className="mt-2 text-mute">Filter, claim, roast.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip href="/browse" active={!category && !status}>All</Chip>
          <Chip href="/browse?s=open" active={status === "open"}>Open bounties</Chip>
          <Chip href="/browse?s=judged" active={status === "judged"}>Judged</Chip>
          <span className="mx-1 self-center text-rule">·</span>
          {CATEGORIES.map((cat) => (
            <Chip key={cat} href={`/browse?c=${cat}`} active={category === cat}>
              {CATEGORY_LABEL[cat]}
            </Chip>
          ))}
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/r/${r.id}`}
                className="card flex h-full flex-col gap-3 p-5 transition hover:shadow-card-lg"
              >
                <div className="flex items-center justify-between text-xs text-mute">
                  <span className="font-medium text-ink tnum">Case #{r.caseNumber}</span>
                  {r.status === "open" ? (
                    <span className="rounded-full bg-[color:var(--color-ember-soft)] px-2 py-0.5 text-[11px] font-medium text-ember-deep">
                      open · ${(r.bountyCents / 100).toFixed(0)}
                    </span>
                  ) : (
                    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] text-mute">judged</span>
                  )}
                </div>
                <p className="line-clamp-5 text-[15px] leading-relaxed text-ink">{r.scenario}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-mute">
                  <span className="capitalize">{r.category}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <div className="card mt-8 py-16 text-center">
            <p className="display text-3xl text-mute">No cases match.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function Chip({
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
        active ? "bg-ink text-paper" : "border border-rule bg-card text-mute hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
