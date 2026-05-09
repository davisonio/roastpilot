"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useSession } from "@/components/wallet-providers";
import { CATEGORIES, type Category } from "@/db/schema";
import { cn } from "@/lib/cn";

const CATEGORY_LABEL: Record<Category, string> = {
  relationships: "Relationships",
  family: "Family",
  work: "Work",
  money: "Money",
  friends: "Friends",
  petty: "Petty",
  other: "Other",
};

const PRESET_BOUNTIES = [0, 5, 10, 25, 50] as const;

export default function RequestPage() {
  const router = useRouter();
  const { user } = useSession();
  const { setVisible } = useWalletModal();

  const [scenario, setScenario] = useState("");
  const [category, setCategory] = useState<Category>("relationships");
  const [bountyDollars, setBountyDollars] = useState<number>(10);
  const [payWith, setPayWith] = useState<"stripe" | "solana" | "free">("stripe");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (scenario.trim().length < 40) {
      setError("Scenario needs at least 40 characters.");
      return;
    }
    if (payWith !== "free" && !user && !email) {
      setError("Connect a wallet, or provide an email so we can attach the bounty.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const cents = payWith === "free" ? 0 : Math.round(bountyDollars * 100);
      const createRes = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenario,
          category,
          bountyCents: cents,
          currency: payWith === "solana" ? "sol" : payWith === "free" ? "seed" : "usd",
          requesterEmail: !user && email ? email : undefined,
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) {
        setError(created.reason ?? created.error ?? "Could not create request.");
        setSubmitting(false);
        return;
      }
      const requestId = created.id as string;

      if (payWith === "free" || cents === 0) {
        router.push(`/r/${requestId}`);
        return;
      }

      if (payWith === "stripe") {
        const co = await fetch("/api/payments/stripe/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ requestId }),
        });
        const data = await co.json();
        if (!co.ok || !data.url) {
          setError(data.error ?? "Payment session failed.");
          setSubmitting(false);
          return;
        }
        window.location.href = data.url as string;
        return;
      }

      // Solana: route to detail with payWith=solana so the user can sign + submit tx hash
      router.push(`/r/${requestId}?pay=solana`);
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="display text-5xl text-ink">Request a roast.</h1>
        <p className="mt-2 text-mute">
          Describe your situation. Set a bounty. Verified humans compete to roast you best.
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

          <Field label="The situation" hint={`${scenario.length} / 4000 · 40 minimum`}>
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={submitting}
              rows={9}
              placeholder="On Sunday I told my sister that…"
              className="w-full resize-y rounded-xl border border-rule bg-paper p-4 text-[15px] text-ink placeholder:text-mute focus:border-ember focus:outline-none"
            />
          </Field>

          <Field label="Bounty">
            <div className="flex flex-wrap gap-2">
              {PRESET_BOUNTIES.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setBountyDollars(amount);
                    if (amount === 0) setPayWith("free");
                    else if (payWith === "free") setPayWith("stripe");
                  }}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm tnum",
                    bountyDollars === amount
                      ? "bg-ember text-white"
                      : "border border-rule bg-card text-ink hover:border-ink",
                  )}
                >
                  {amount === 0 ? "Free" : `$${amount}`}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-mute">
              Top 3 winners share the bounty as Roastpoints. 50% / 30% / 20%.
            </p>
          </Field>

          {bountyDollars > 0 && (
            <Field label="Pay with">
              <div className="grid grid-cols-2 gap-3">
                <PayCard
                  active={payWith === "stripe"}
                  onClick={() => setPayWith("stripe")}
                  title="Stripe"
                  desc="Card via Checkout"
                />
                <PayCard
                  active={payWith === "solana"}
                  onClick={() => setPayWith("solana")}
                  title="Solana"
                  desc="Send SOL on devnet"
                />
              </div>
            </Field>
          )}

          {!user && payWith !== "solana" && (
            <Field label="Email" hint="So we can match the payment to your case">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                className="w-full rounded-xl border border-rule bg-paper p-3 text-[15px] text-ink placeholder:text-mute focus:border-ember focus:outline-none"
              />
            </Field>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
            <p className="text-sm text-mute">
              {payWith === "free"
                ? "Free request: bounty pool is a token amount; great for testing."
                : payWith === "stripe"
                  ? `You'll be redirected to Stripe Checkout to pay $${bountyDollars}.`
                  : `You'll send ~${(bountyDollars / 150).toFixed(3)} SOL on the next page.`}
            </p>
            {!user && payWith !== "stripe" && (
              <button
                onClick={() => setVisible(true)}
                className="rounded-full border border-rule bg-card px-4 py-2 text-sm text-ink hover:border-ink"
              >
                Connect wallet
              </button>
            )}
            <button
              onClick={submit}
              disabled={submitting || scenario.trim().length < 40}
              className="rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white hover:bg-ember-deep disabled:cursor-not-allowed disabled:bg-mute"
            >
              {submitting
                ? "Working…"
                : payWith === "free"
                  ? "Post case"
                  : `Pay $${bountyDollars} & post`}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-yta">{error}</p>}
        </section>
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
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-mute">{label}</span>
        {hint && <span className="text-xs text-mute tnum">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function PayCard({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition",
        active ? "border-ember bg-[color:var(--color-ember-soft)]" : "border-rule bg-card hover:border-ink",
      )}
    >
      <div className="font-medium text-ink">{title}</div>
      <p className="mt-1 text-xs text-mute">{desc}</p>
    </button>
  );
}
