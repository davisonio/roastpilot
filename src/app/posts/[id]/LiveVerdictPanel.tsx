"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { VerdictBadge } from "@/components/VerdictBadge";
import { VERDICT_LABELS, type Verdict } from "@/lib/verdicts";

export function LiveVerdictPanel({
  postId,
  autoStart = false,
}: {
  postId: string;
  autoStart?: boolean;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [streamed, setStreamed] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  async function run() {
    if (running) return;
    setRunning(true);
    setError(null);
    setStreamed("");
    setVerdict(null);
    setResponse(null);

    try {
      const res = await fetch(`/api/posts/${postId}/verdict`, { method: "POST" });
      if (!res.ok || !res.body) {
        const t = await res.text();
        throw new Error(t || "Verdict request failed");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const ev of events) {
          if (!ev.startsWith("data:")) continue;
          const json = ev.slice(5).trim();
          if (!json) continue;
          const parsed = JSON.parse(json) as
            | { delta: string }
            | { done: { verdict: Verdict; response: string } }
            | { error: string };
          if ("delta" in parsed) setStreamed((s) => s + parsed.delta);
          else if ("done" in parsed) {
            setVerdict(parsed.done.verdict);
            setResponse(parsed.done.response);
          } else if ("error" in parsed) {
            setError(parsed.error);
          }
        }
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      startedRef.current = true;
      void run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (verdict && response) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <VerdictBadge verdict={verdict} size="lg" />
          <span className="text-base text-ink font-medium">{VERDICT_LABELS[verdict]}</span>
        </div>
        <div className="text-ink leading-relaxed whitespace-pre-wrap">{response}</div>
      </div>
    );
  }

  if (running || streamed) {
    return (
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-accent font-semibold mb-2 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
          Claude is deliberating live...
        </div>
        <pre className="text-ink whitespace-pre-wrap font-sans leading-relaxed">{streamed}</pre>
        {error ? (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-ink-soft mb-4">
        No verdict yet. Hit the button — Claude Opus deliberates live, on stream.
      </p>
      <button
        onClick={run}
        className="inline-flex items-center gap-2 rounded-full bg-accent text-paper px-5 h-10 font-semibold hover:bg-accent-strong transition-colors"
      >
        Drop the gavel →
      </button>
      {error ? (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      ) : null}
    </div>
  );
}
