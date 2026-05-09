"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "./avatar";
import { VerdictPill } from "./verdict-pill";
import { cn } from "@/lib/cn";
import type { TakeTag, Verdict } from "@/db/schema";

export type TakeRow = {
  id: string;
  handleSol: string;
  walletAddress: string;
  pohVerified: boolean;
  verdict: Verdict;
  take: string;
  takeTag: TakeTag | null;
  embers: number;
};

const FILTERS: { key: TakeTag | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "funny", label: "Funny" },
  { key: "helpful", label: "Helpful" },
  { key: "savage", label: "Savage" },
];

export function TopTakes({
  takes,
  totalCount,
}: {
  takes: TakeRow[];
  totalCount: number;
}) {
  const [filter, setFilter] = useState<TakeTag | "all">("funny");
  const visible = takes.filter((t) =>
    filter === "all" ? true : t.takeTag === filter,
  );

  return (
    <section className="card p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-medium text-ink">
          Top takes from verified humans
          <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden>
            <circle cx="6" cy="6" r="6" fill="var(--color-verified)" />
            <path
              d="M3.6 6.1l1.7 1.7L8.6 4.5"
              stroke="white"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </h3>
        <Link
          href="#all-takes"
          className="text-sm font-medium text-ember hover:text-ember-deep"
        >
          See all {totalCount} takes →
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-1 border-b border-rule">
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors",
                active ? "text-ink" : "text-mute hover:text-ink",
              )}
            >
              {f.label}
              {active && (
                <span className="absolute bottom-[-1px] left-2 right-2 h-[2px] rounded-full bg-ember" />
              )}
            </button>
          );
        })}
      </div>

      <ul className="mt-2 divide-y divide-rule">
        {visible.length === 0 && (
          <li className="py-8 text-center text-sm text-mute">
            No {filter === "all" ? "" : filter} takes yet.
          </li>
        )}
        {visible.map((t) => (
          <TakeRow key={t.id} take={t} />
        ))}
      </ul>
    </section>
  );
}

function TakeRow({ take }: { take: TakeRow }) {
  const [count, setCount] = useState(take.embers);
  const [reacted, setReacted] = useState(false);
  const [, startTransition] = useTransition();

  function react() {
    if (reacted) return;
    setReacted(true);
    setCount((c) => c + 1);
    startTransition(async () => {
      await fetch(`/api/votes/${take.id}/ember`, { method: "POST" }).catch(
        () => {
          setReacted(false);
          setCount((c) => c - 1);
        },
      );
    });
  }

  return (
    <li className="flex items-center gap-4 py-4">
      <Avatar seed={take.walletAddress} verified={take.pohVerified} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-medium text-ink">{take.handleSol}</span>
          {take.pohVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-verified">
              <span className="inline-block h-1 w-1 rounded-full bg-verified" />
              Verified Human
            </span>
          )}
          <VerdictPill verdict={take.verdict} className="ml-1" />
        </div>
        <p className="mt-1 truncate text-[15px] text-ink">{take.take}</p>
      </div>
      <button
        onClick={react}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium tnum transition",
          reacted
            ? "bg-[color:var(--color-ember-soft)] text-ember-deep"
            : "text-mute hover:bg-soft hover:text-ember",
        )}
        aria-label="React with fire"
      >
        <span aria-hidden>🔥</span>
        <span>{count}</span>
      </button>
    </li>
  );
}
