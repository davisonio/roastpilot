"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DISPLAY_NAME_KEY,
  getDisplayName,
  setDisplayName,
} from "@/components/DisplayNameWidget";

export default function NewPostPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [title, setTitle] = useState("AITA for ");
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name) {
      setError("Pick a handle first (top-right of the page).");
      return;
    }
    if (title.trim().length < 8 || body.trim().length < 30) {
      setError("Give us more — a real title and at least a paragraph.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), authorName: name }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed to post.");
      }
      const j = await res.json();
      router.push(`/posts/${j.id}?fresh=1`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-10 pb-20">
      <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">
        Submit a dilemma
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink leading-tight tracking-tight">Confess. We&rsquo;ll judge.</h1>
      <p className="mt-2 text-ink-soft">
        Claude Opus delivers the first verdict. Real humans pile on after.
      </p>

      {!name ? (
        <NamePrompt onSet={(n) => setName(n)} />
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              className="w-full bg-paper border border-rule rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
              placeholder="AITA for telling my MIL her lasagna was..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">The story</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              maxLength={4000}
              className="w-full bg-paper border border-rule rounded-lg px-4 py-3 focus:outline-none focus:border-accent leading-relaxed"
              placeholder="So last Sunday I went over to..."
            />
            <div className="mt-1 text-xs text-ink-soft">
              {body.length}/4000 · be specific, give us context, then ask if YTA.
            </div>
          </div>
          {error ? (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-accent text-background px-6 h-11 font-semibold hover:bg-accent-strong shadow-[0_0_22px_rgba(255,107,26,0.3)] hover:shadow-[0_0_32px_rgba(255,107,26,0.5)] disabled:opacity-60 transition-all"
          >
            {submitting ? "Asking Claude..." : "Submit for judgment →"}
          </button>
          <p className="text-xs text-ink-soft">
            Posting as <span className="font-medium text-ink">u/{name}</span>.
          </p>
        </form>
      )}
    </div>
  );
}

function NamePrompt({ onSet }: { onSet: (n: string) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="mt-8 rounded-xl border border-rule bg-paper p-6">
      <h2 className="font-semibold text-ink mb-1">First, pick a handle</h2>
      <p className="text-sm text-ink-soft mb-4">
        Whatever you want. Stored locally in your browser. No password, no email.
      </p>
      <div className="flex gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. throwaway42"
          className="flex-1 bg-background border border-rule rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = draft.trim().slice(0, 32);
              if (v) {
                setDisplayName(v);
                onSet(v);
              }
            }
          }}
        />
        <button
          onClick={() => {
            const v = draft.trim().slice(0, 32);
            if (v) {
              setDisplayName(v);
              onSet(v);
            }
          }}
          className="rounded-lg bg-ink text-paper px-4 font-medium hover:bg-accent-strong"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
