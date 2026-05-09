"use client";

import { useState } from "react";
import { Donut } from "./donut";
import type { Verdict } from "@/db/schema";

export function ShareRail({
  caseNumber,
  topVerdict,
  topVerdictPct,
  aiVerdict,
}: {
  caseNumber: number;
  topVerdict: Verdict;
  topVerdictPct: number;
  aiVerdict: Verdict | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  function postToX() {
    const text = `Case #${caseNumber}: humans say ${Math.round(
      topVerdictPct,
    )}% ${topVerdict}. Disagree? Roastpilot.com`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="space-y-4">
      <section className="card-lg p-6">
        <h3 className="text-base font-medium text-ink">Share your results</h3>
        <p className="mt-1 text-sm text-mute">
          Let the world weigh in <span aria-hidden>🔥</span>
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-rule bg-paper">
          <SharePreview
            caseNumber={caseNumber}
            topVerdict={topVerdict}
            topVerdictPct={topVerdictPct}
            aiVerdict={aiVerdict}
          />
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={copyLink}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rule bg-card py-2.5 text-sm font-medium text-ink hover:bg-soft"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M5.6 8.4l2.8-2.8M5.5 4.5h-1a2 2 0 100 4h1m3-4h1a2 2 0 110 4h-1"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={`/api/og/${caseNumber}.png`}
            download={`roastpilot-${caseNumber}.png`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rule bg-card py-2.5 text-sm font-medium text-ink hover:bg-soft"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M7 2v7m0 0l-2.5-2.5M7 9l2.5-2.5M3 11h8"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download image
          </a>
          <button
            onClick={postToX}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ember py-2.5 text-sm font-medium text-white hover:bg-ember-deep"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Post to X
          </button>
        </div>
      </section>
    </aside>
  );
}

function SharePreview({
  caseNumber,
  topVerdict,
  topVerdictPct,
  aiVerdict,
}: {
  caseNumber: number;
  topVerdict: Verdict;
  topVerdictPct: number;
  aiVerdict: Verdict | null;
}) {
  return (
    <div className="relative px-4 py-4">
      <div className="flex items-baseline justify-between">
        <span className="display text-base text-ink">
          Roastpilot <span aria-hidden>🔥</span>
        </span>
        <span className="text-[11px] text-mute tnum">Case #{caseNumber}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="display leading-[0.95]">
          <div className="text-2xl text-ink">Mostly</div>
          <div
            className="text-3xl"
            style={{ color: `var(--color-${topVerdict.toLowerCase()})` }}
          >
            {topVerdict}
          </div>
        </div>
        <Donut
          percent={topVerdictPct}
          verdict={topVerdict}
          size={88}
          stroke={10}
          label="YTA"
        />
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-mute">
        <span>
          AI says: <span className="font-medium text-ink">{aiVerdict ?? "—"}</span>
        </span>
        <span className="text-rule">|</span>
        <span>
          Humans say:{" "}
          <span className="font-medium text-ink">{topVerdict}</span>
        </span>
      </div>
    </div>
  );
}
