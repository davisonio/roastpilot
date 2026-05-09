"use client";

import { useEffect, useState } from "react";
import type { Verdict } from "@/db/schema";

const VERDICT_COLORS: Record<Verdict, string> = {
  YTA: "var(--color-yta)",
  NTA: "var(--color-nta)",
  ESH: "var(--color-esh)",
  NAH: "var(--color-nah)",
  INFO: "var(--color-mute)",
};

export function Donut({
  percent,
  verdict,
  size = 224,
  stroke = 24,
  label = "Humans say",
}: {
  percent: number; // 0-100
  verdict: Verdict;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => setDrawn(percent));
    return () => cancelAnimationFrame(t);
  }, [percent]);

  const dash = (drawn / 100) * c;
  const color = VERDICT_COLORS[verdict];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-yta-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: "stroke-dasharray 900ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="display text-5xl text-ink tnum">
          {Math.round(percent)}
          <span className="text-3xl">%</span>
        </div>
        <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
          {label}
        </div>
        <div
          className="mt-0.5 text-sm font-semibold tnum"
          style={{ color }}
        >
          {verdict}
        </div>
      </div>
    </div>
  );
}
