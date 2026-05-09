"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as Slider from "@radix-ui/react-slider";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { cn } from "@/lib/cn";

type Severity = "house" | "nuclear";

export default function SubmitPage() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<Severity>("house");
  const [streaming, setStreaming] = useState(false);
  const [opinion, setOpinion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function submit() {
    if (body.trim().length < 40) {
      setError("Tell us more — 40 characters minimum.");
      return;
    }
    setError(null);
    setOpinion("");
    setSubmissionId(null);
    setStreaming(true);

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body, severity }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.reason ?? data.error ?? "Submission failed.");
      setStreaming(false);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      setError("No response stream.");
      setStreaming(false);
      return;
    }
    const decoder = new TextDecoder();
    let buffer = "";
    let finalText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      if (!submissionId) {
        const m = buffer.match(/^__id:([^\n]+)\n/);
        if (m) {
          setSubmissionId(m[1]);
          buffer = buffer.slice(m[0].length);
        }
      }
      if (buffer.includes("__error:")) {
        const [, errMsg] = buffer.split("__error:");
        setError(errMsg?.trim() ?? "Stream error.");
        break;
      }

      finalText += buffer;
      // Show the streaming JSON's "opinion" content as it arrives by
      // greedily extracting it from the partial string.
      const opinionMatch = finalText.match(/"opinion"\s*:\s*"((?:[^"\\]|\\.)*)/);
      if (opinionMatch) {
        try {
          const decoded = JSON.parse(`"${opinionMatch[1]}"`);
          setOpinion(decoded);
        } catch {
          // Partial escape, ignore
        }
      }
      buffer = "";
    }

    setStreaming(false);
    if (submissionId) {
      // Give the user a beat to read, then route to the verdict page
      setTimeout(() => {
        startTransition(() => router.push(`/v/${submissionId}`));
      }, 1200);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="display text-5xl text-ink">Submit a situation.</h1>
        <p className="mt-4 text-mute">
          Write what happened. The bench will return a written opinion.
          Verified humans will then disagree with it.
        </p>

        <div className="mt-10">
          <label
            htmlFor="body"
            className="block text-xs uppercase tracking-widest text-mute"
          >
            The situation
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={streaming}
            rows={10}
            placeholder="On Sunday I told my sister that..."
            className="mt-2 block w-full resize-y border-0 border-b border-rule bg-transparent px-0 py-3 text-ink placeholder:text-mute/60 focus:border-ink focus:outline-none focus:ring-0"
          />
          <div className="mt-1 flex justify-between text-xs text-mute tnum">
            <span>{body.length} / 4000</span>
            <span>40 minimum</span>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-widest text-mute">
              Severity
            </span>
            <span className="text-sm">
              {severity === "house" ? (
                <span className="display text-lg">House style</span>
              ) : (
                <span className="display text-lg text-ember">Nuclear</span>
              )}
            </span>
          </div>
          <Slider.Root
            className="relative mt-4 flex h-5 w-full touch-none select-none items-center"
            value={[severity === "house" ? 0 : 1]}
            onValueChange={(v) => setSeverity(v[0] === 1 ? "nuclear" : "house")}
            min={0}
            max={1}
            step={1}
            disabled={streaming}
          >
            <Slider.Track className="relative h-px grow bg-rule">
              <Slider.Range
                className={cn(
                  "absolute h-px",
                  severity === "nuclear" ? "bg-ember" : "bg-ink",
                )}
              />
            </Slider.Track>
            <Slider.Thumb
              className={cn(
                "block h-3 w-3 rounded-none border focus:outline-none",
                severity === "nuclear"
                  ? "border-ember bg-ember"
                  : "border-ink bg-paper",
              )}
              aria-label="Severity"
            />
          </Slider.Root>
          <p className="mt-3 text-sm text-mute">
            {severity === "house"
              ? "Cutting but composed. Earned."
              : "Gloves off. Same hard floor on protected groups."}
          </p>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={submit}
            disabled={streaming || body.trim().length < 40}
            className={cn(
              "border border-ink bg-ink px-6 py-3 text-paper",
              "disabled:cursor-not-allowed disabled:bg-mute disabled:border-mute",
              "hover:bg-ember-deep hover:border-ember-deep",
            )}
          >
            {streaming ? "the bench is deliberating…" : "submit for verdict"}
          </button>
          {error && <p className="text-sm text-verdict-yta">{error}</p>}
        </div>

        {(streaming || opinion) && (
          <section className="mt-16">
            <hr className="rule" />
            <p className="mt-8 text-xs uppercase tracking-widest text-mute">
              The opinion
            </p>
            <p
              className={cn(
                "mt-4 whitespace-pre-wrap text-lg leading-relaxed text-ink",
                streaming && "caret",
              )}
            >
              {opinion || (streaming ? "…" : "")}
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
