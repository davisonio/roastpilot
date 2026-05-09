"use client";

import { useState } from "react";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState<number | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; count?: number; error?: string };
      if (!res.ok || !data.ok) {
        setState("error");
        return;
      }
      setState("done");
      if (data.count) setCount(data.count);
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent animate-ember-breathe inline-block">🔥</span>
        <span className="text-ink-soft">
          You&rsquo;re on the list.
          {count && count > 1 ? (
            <span className="text-ink-faint"> {count} people waiting.</span>
          ) : null}
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 mt-1">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-52 bg-paper border border-rule rounded-full px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent/60 transition-colors"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="text-sm font-semibold px-4 py-2 rounded-full bg-paper border border-rule text-ink-soft hover:border-accent/60 hover:text-accent transition-all disabled:opacity-50"
      >
        {state === "loading" ? "…" : "Notify me"}
      </button>
      {state === "error" && (
        <span className="text-xs text-accent">Try again.</span>
      )}
    </form>
  );
}
