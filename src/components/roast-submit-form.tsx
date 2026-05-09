"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RoastSubmitForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (body.trim().length < 20) {
      setError("Roasts need at least 20 characters.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const res = await fetch(`/api/requests/${requestId}/roasts`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.reason ?? data.error ?? "Could not submit your roast.");
      return;
    }
    setBody("");
    router.refresh();
  }

  return (
    <section className="card-lg p-5 md:p-6">
      <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
        Submit your roast <span aria-hidden>🔥</span>
      </p>
      <p className="mt-1 text-xs text-mute">
        Sharper than the AI suggestion. The requester picks the top 3.
      </p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        disabled={submitting}
        placeholder="Look, the part that gives you away is…"
        className="mt-3 w-full resize-y rounded-xl border border-rule bg-paper p-3 text-[15px] text-ink placeholder:text-mute focus:border-ember focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-mute tnum">{body.length} / 2000</p>
        <button
          onClick={submit}
          disabled={submitting || body.trim().length < 20}
          className="rounded-full bg-ember px-4 py-2 text-sm font-medium text-white hover:bg-ember-deep disabled:cursor-not-allowed disabled:bg-mute"
        >
          {submitting ? "Submitting…" : "Submit roast"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-yta">{error}</p>}
    </section>
  );
}
