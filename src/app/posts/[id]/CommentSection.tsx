"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VerdictBadge } from "@/components/VerdictBadge";
import { HandleBadge } from "@/components/HandleBadge";
import { IgnitionButton } from "@/components/IgnitionButton";
import {
  DISPLAY_NAME_KEY,
  getDisplayName,
  setDisplayName,
} from "@/components/DisplayNameWidget";
import { VERDICTS, type Verdict } from "@/lib/verdicts";

type CommentRow = {
  id: string;
  authorName: string;
  verdict: Verdict;
  body: string;
  ignitions: number;
  createdAt: Date;
};

function timeAgo(date: Date) {
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export function CommentSection({
  postId,
  postAuthorName,
  comments,
}: {
  postId: string;
  postAuthorName: string;
  comments: CommentRow[];
}) {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict>("NTA");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(getDisplayName());
    const onChange = () => setName(getDisplayName());
    window.addEventListener("roastpilot:name-changed", onChange);
    window.addEventListener("storage", (e) => {
      if (e.key === DISPLAY_NAME_KEY) onChange();
    });
    return () => window.removeEventListener("roastpilot:name-changed", onChange);
  }, []);

  const isAuthor = name && name.toLowerCase() === postAuthorName.toLowerCase();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name) { setError("Pick a handle (top-right) before commenting."); return; }
    if (body.trim().length < 10) { setError("Say more — at least 10 characters."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name, verdict, body: body.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? "Failed to post.");
      }
      setBody("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {!name ? (
        <NameInline onSet={setName} />
      ) : isAuthor ? (
        <div className="rounded-xl border border-dashed border-rule bg-paper px-5 py-4 text-sm text-ink-soft">
          You posted this — you can&rsquo;t vote on yourself. Watch the verdicts roll in.
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-xl border border-rule bg-paper p-5 space-y-3 noise-texture">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-soft mr-1">Your verdict:</span>
            {VERDICTS.map((v) => (
              <button key={v} type="button" onClick={() => setVerdict(v)}
                className={`text-[11px] font-bold tracking-wider rounded-full px-2.5 py-1 ring-1 transition-colors ${
                  verdict === v
                    ? "bg-accent/15 text-accent ring-accent/60"
                    : "bg-paper text-ink-soft ring-rule hover:ring-accent/40 hover:text-ink"
                }`}>
                {v}
              </button>
            ))}
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3}
            maxLength={1000} placeholder="Tell us why."
            className="w-full bg-background border border-rule rounded-lg px-3 py-2 focus:outline-none focus:border-accent text-sm leading-relaxed resize-none" />
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</div>
          )}
          <div className="flex items-center justify-between">
            <HandleBadge name={name} size="sm" />
            <button type="submit" disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-accent text-background px-4 h-9 text-sm font-semibold hover:bg-accent-strong shadow-[0_0_15px_rgba(255,107,26,0.3)] disabled:opacity-60 transition-all">
              {submitting ? "Posting..." : "Post verdict"}
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {comments.length === 0 ? (
          <li className="text-sm text-ink-soft italic text-center py-8">No human verdicts yet. Be first.</li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="rounded-xl border border-rule bg-paper p-4 noise-texture transition-heat hover:border-accent/30">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <VerdictBadge verdict={c.verdict} />
                  <HandleBadge name={c.authorName} size="sm" />
                  <span className="text-[11px] text-ink-faint">{timeAgo(c.createdAt)}</span>
                </div>
                <IgnitionButton postId={postId} commentId={c.id} initial={c.ignitions} />
              </div>
              <div className="text-ink leading-relaxed whitespace-pre-wrap text-[15px]">{c.body}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function NameInline({ onSet }: { onSet: (n: string) => void }) {
  const [draft, setDraft] = useState("");
  function save() {
    const v = draft.trim().slice(0, 32);
    if (v) { setDisplayName(v); onSet(v); }
  }
  return (
    <div className="rounded-xl border border-rule bg-paper p-5 noise-texture">
      <div className="font-semibold text-ink mb-1">Pick a handle to comment</div>
      <p className="text-sm text-ink-soft mb-3">Stored locally. No account needed.</p>
      <div className="flex gap-2">
        <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. throwaway42"
          className="flex-1 bg-background border border-rule rounded-lg px-3 py-2 focus:outline-none focus:border-accent text-sm"
          onKeyDown={(e) => { if (e.key === "Enter") save(); }} />
        <button onClick={save}
          className="rounded-lg bg-accent text-background px-4 text-sm font-semibold hover:bg-accent-strong shadow-[0_0_12px_rgba(255,107,26,0.3)]">
          Continue
        </button>
      </div>
    </div>
  );
}
