"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Candidate = { id: string; body: string; handleSol: string };

export function SelectTop3({
  requestId,
  candidates,
}: {
  requestId: string;
  candidates: Candidate[];
}) {
  const router = useRouter();
  const [picks, setPicks] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ordered = useMemo(() => picks, [picks]);

  function toggle(id: string) {
    setError(null);
    if (picks.includes(id)) {
      setPicks(picks.filter((p) => p !== id));
    } else if (picks.length < 3) {
      setPicks([...picks, id]);
    }
  }

  async function submit() {
    if (picks.length !== 3) {
      setError("Pick exactly 3.");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/requests/${requestId}/select`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rank1: picks[0],
        rank2: picks[1],
        rank3: picks[2],
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save selection.");
      return;
    }
    router.refresh();
  }

  return (
    <section className="card-lg p-6">
      <h3 className="text-base font-medium text-ink">Pick your top 3</h3>
      <p className="mt-1 text-xs text-mute">
        Click in order. First click = winner.
      </p>

      <ul className="mt-4 space-y-2">
        {candidates.map((c) => {
          const idx = picks.indexOf(c.id);
          const rank = idx === -1 ? null : idx + 1;
          return (
            <li key={c.id}>
              <button
                onClick={() => toggle(c.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  rank
                    ? "border-ember bg-[color:var(--color-ember-soft)]"
                    : "border-rule bg-card hover:border-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-medium ${rank ? "bg-ember text-white" : "bg-soft text-mute"}`}>
                    {rank ?? "·"}
                  </span>
                  <span className="text-sm font-medium text-ink">{c.handleSol}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-[14px] text-ink">{c.body}</p>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-mute tnum">{ordered.length} / 3 picked</p>
        <button
          onClick={submit}
          disabled={submitting || picks.length !== 3}
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ember-deep disabled:cursor-not-allowed disabled:bg-mute"
        >
          {submitting ? "Awarding…" : "Lock in & award"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-yta">{error}</p>}
    </section>
  );
}
