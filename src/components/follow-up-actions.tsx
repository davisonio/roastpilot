"use client";

import { useState } from "react";
import { useSession } from "./wallet-providers";
import { POINTS } from "@/lib/points";

export function FollowUpActions({ submissionId }: { submissionId: string }) {
  const { user } = useSession();
  const [open, setOpen] = useState<null | "plead" | "ask">(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cost =
    open === "plead" ? -POINTS.pleadYourCase : -POINTS.askFollowUp;

  async function send() {
    if (!open || text.trim().length < 10) {
      setError("Tell us a bit more.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/follow-up`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: open, prompt: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not deliver the follow-up.");
      } else {
        setResponse(data.aiResponse ?? "");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => {
            setOpen(open === "plead" ? null : "plead");
            setText("");
            setResponse(null);
          }}
          className="card flex items-center gap-3 p-4 text-left text-[15px] font-medium text-ink hover:bg-soft"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-soft">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path
                d="M3 13l2-1 8-8-2-2-8 8-1 2zM10 4l2 2"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            Plead your case
            <span className="ml-2 text-xs font-normal text-mute tnum">
              🔥 {POINTS.pleadYourCase * -1}
            </span>
          </span>
        </button>

        <button
          onClick={() => {
            setOpen(open === "ask" ? null : "ask");
            setText("");
            setResponse(null);
          }}
          className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-ember-soft)] bg-[color:var(--color-ember-soft)] p-4 text-left text-[15px] font-medium text-ember-deep hover:bg-[color:var(--color-yta-soft)]"
        >
          <span className="text-lg" aria-hidden>
            ✨
          </span>
          <span>
            Ask a follow-up
            <span className="block text-xs font-normal text-ember-deep/80">
              Get more feedback on a detail · 🔥 {POINTS.askFollowUp * -1}
            </span>
          </span>
        </button>
      </div>

      {open && (
        <div className="card mt-3 p-5">
          <p className="text-sm font-medium text-ink">
            {open === "plead"
              ? "Plead your case"
              : "Ask the bench a follow-up"}
          </p>
          <p className="mt-1 text-xs text-mute">
            {open === "plead"
              ? "Add new context. The bench will re-rule."
              : "Pin a detail you want a sharper take on."}{" "}
            Costs <span className="tnum">🔥 {cost * -1}</span>.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={
              open === "plead"
                ? "What I forgot to mention is…"
                : "Be specific: 'Was the hot sauce really the problem?'"
            }
            className="mt-3 w-full resize-y rounded-lg border border-rule bg-paper px-3 py-2 text-[15px] text-ink placeholder:text-mute focus:border-ember focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={send}
              disabled={loading || !user}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ember-deep disabled:cursor-not-allowed disabled:bg-mute"
            >
              {loading ? "Sending…" : !user ? "Connect wallet" : "Send"}
            </button>
            {error && <p className="text-sm text-yta">{error}</p>}
            {!user && (
              <p className="text-xs text-mute">
                Connect a wallet to spend Roastpoints.
              </p>
            )}
          </div>
          {response && (
            <div className="mt-4 rounded-lg border border-rule bg-paper p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-mute">
                Bench reply
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
                {response}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
