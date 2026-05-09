"use client";

import { useState } from "react";

const IGNITED_KEY = "roastpilot.ignited";

function hasIgnited(commentId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const set = new Set(JSON.parse(localStorage.getItem(IGNITED_KEY) ?? "[]") as string[]);
    return set.has(commentId);
  } catch { return false; }
}

function markIgnited(commentId: string) {
  try {
    const set = new Set(JSON.parse(localStorage.getItem(IGNITED_KEY) ?? "[]") as string[]);
    set.add(commentId);
    localStorage.setItem(IGNITED_KEY, JSON.stringify([...set]));
  } catch {}
}

export function IgnitionButton({
  postId,
  commentId,
  initial,
}: {
  postId: string;
  commentId: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [fired, setFired] = useState(false);
  const [igniting, setIgniting] = useState(false);

  async function ignite() {
    if (fired || hasIgnited(commentId)) return;
    setIgniting(true);
    setFired(true);
    setCount((c) => c + 1);
    markIgnited(commentId);

    try {
      const res = await fetch(`/api/posts/${postId}/ignite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (res.ok) {
        const data = await res.json() as { ignitions: number };
        setCount(data.ignitions);
      }
    } catch {}

    setTimeout(() => setIgniting(false), 700);
  }

  const alreadyFired = fired || hasIgnited(commentId);

  return (
    <button
      onClick={ignite}
      disabled={alreadyFired}
      title={alreadyFired ? "Already ignited" : "Ignite this take"}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 transition-all ${
        alreadyFired
          ? "bg-accent/15 text-accent cursor-default"
          : "bg-paper-2 text-ink-soft hover:bg-accent/10 hover:text-accent"
      } ${igniting ? "scale-110" : "scale-100"}`}
      style={{
        transition: "transform 300ms cubic-bezier(0.34,1.56,0.64,1), background 200ms, color 200ms",
      }}
    >
      <span aria-hidden>{alreadyFired ? "🔥" : "🔥"}</span>
      <span className="tnum">{count}</span>
    </button>
  );
}
