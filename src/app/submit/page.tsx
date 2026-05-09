"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useSession } from "@/components/wallet-providers";
import { POINTS } from "@/lib/points";
import { CATEGORIES, type Category } from "@/db/schema";
import { cn } from "@/lib/cn";

type Severity = "house" | "nuclear";

const CATEGORY_LABEL: Record<Category, string> = {
  relationships: "Relationships",
  family: "Family",
  work: "Work",
  money: "Money",
  friends: "Friends",
  petty: "Petty",
  other: "Other",
};

export default function SubmitPage() {
  const router = useRouter();
  const { user, refresh } = useSession();
  const { setVisible } = useWalletModal();
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<Severity>("house");
  const [category, setCategory] = useState<Category>("relationships");
  const [streaming, setStreaming] = useState(false);
  const [opinion, setOpinion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const cost = severity === "nuclear" ? -POINTS.submitNuclear : -POINTS.submitHouse;
  const enoughPoints = !!user && user.roastPoints >= cost;

  async function submit() {
    if (!user) {
      setVisible(true);
      return;
    }
    if (body.trim().length < 40) {
      setError("Tell us more — 40 characters minimum.");
      return;
    }
    if (!enoughPoints) {
      setError(`Not enough Roastpoints. Need 🔥${cost}.`);
      return;
    }
    setError(null);
    setOpinion("");
    setStreaming(true);

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body, severity, category }),
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
    let acc = "";
    let submissionId: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      acc += decoder.decode(value, { stream: true });
      if (!submissionId) {
        const m = acc.match(/^__id:([^\n]+)\n/);
        if (m) {
          submissionId = m[1];
          acc = acc.slice(m[0].length);
        }
      }
      if (acc.includes("__error:")) {
        const [, errMsg] = acc.split("__error:");
        setError(errMsg?.trim() ?? "Stream error.");
        break;
      }
      const opinionMatch = acc.match(/"opinion"\s*:\s*"((?:[^"\\]|\\.)*)/);
      if (opinionMatch) {
        try {
          setOpinion(JSON.parse(`"${opinionMatch[1]}"`));
        } catch {}
      }
    }

    setStreaming(false);
    refresh();
    if (submissionId) {
      setTimeout(
        () => startTransition(() => router.push(`/v/${submissionId}`)),
        1200,
      );
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="display text-5xl text-ink">Submit a situation.</h1>
        <p className="mt-2 text-mute">
          Write what happened. The bench will return a written opinion. Verified
          humans will then disagree with it.
        </p>

        <section className="card-lg mt-8 p-6 md:p-8">
          <Field label="Category">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition",
                    category === c
                      ? "bg-ink text-paper"
                      : "border border-rule bg-card text-mute hover:text-ink",
                  )}
                >
                  {CATEGORY_LABEL[c]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="The situation" hint={`${body.length} / 4000 · 40 minimum`}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={streaming}
              rows={9}
              placeholder="On Sunday I told my sister that…"
              className="w-full resize-y rounded-xl border border-rule bg-paper p-4 text-[15px] text-ink placeholder:text-mute focus:border-ember focus:outline-none"
            />
          </Field>

          <Field label="Severity">
            <div className="grid grid-cols-2 gap-3">
              <SeverityCard
                active={severity === "house"}
                onClick={() => setSeverity("house")}
                title="House"
                desc="Cutting but composed. Earned."
                cost={POINTS.submitHouse * -1}
                tone="house"
              />
              <SeverityCard
                active={severity === "nuclear"}
                onClick={() => setSeverity("nuclear")}
                title="Nuclear"
                desc="Gloves off. Same hard floor on protected groups."
                cost={POINTS.submitNuclear * -1}
                tone="nuclear"
              />
            </div>
          </Field>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
            <div className="text-sm text-mute">
              {user ? (
                <span>
                  Balance: <span className="font-medium text-ink tnum">🔥 {user.roastPoints.toLocaleString()}</span>
                  {" · "}
                  This costs{" "}
                  <span className="font-medium text-ink tnum">🔥 {cost}</span>
                </span>
              ) : (
                <span>Connect a wallet to spend Roastpoints.</span>
              )}
            </div>
            <button
              onClick={submit}
              disabled={
                streaming ||
                (!!user && body.trim().length < 40) ||
                (!!user && !enoughPoints)
              }
              className="rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white hover:bg-ember-deep disabled:cursor-not-allowed disabled:bg-mute"
            >
              {streaming
                ? "the bench is deliberating…"
                : !user
                  ? "Connect wallet"
                  : `Submit · 🔥 ${cost}`}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-yta">{error}</p>}
        </section>

        {(streaming || opinion) && (
          <section className="card-lg mt-6 p-6 md:p-8">
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
              The opinion <span aria-hidden>✨</span>
            </p>
            <p
              className={cn(
                "mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink",
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

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-mute">
          {label}
        </span>
        {hint && <span className="text-xs text-mute tnum">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SeverityCard({
  active,
  onClick,
  title,
  desc,
  cost,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  cost: number;
  tone: "house" | "nuclear";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition",
        active
          ? tone === "house"
            ? "border-ink bg-paper"
            : "border-ember bg-[color:var(--color-ember-soft)]"
          : "border-rule bg-card hover:border-ink",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-ink">{title}</span>
        <span className="text-xs text-mute tnum">🔥 {cost}</span>
      </div>
      <p className="mt-1 text-xs text-mute">{desc}</p>
    </button>
  );
}
