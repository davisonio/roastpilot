"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useSession } from "@/components/wallet-providers";

export default function BecomeARoaster() {
  const router = useRouter();
  const { user, refresh } = useSession();
  const { setVisible } = useWalletModal();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    if (!user) {
      setVisible(true);
      return;
    }
    setVerifying(true);
    setError(null);
    const res = await fetch("/api/roaster/verify", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setVerifying(false);
    if (!res.ok) {
      setError(data.error ?? "Verification failed.");
      return;
    }
    await refresh();
    router.push("/me");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="display text-5xl text-ink">Become a roaster.</h1>
        <p className="mt-3 text-mute">
          Roasters reply to open bounties. The requester picks the top 3. You earn 🔥 Roastpoints proportional to the bounty.
        </p>

        <ol className="mt-10 space-y-5">
          <Step n={1} done={!!user} title="Connect a Solana wallet">
            We use your wallet as your identity. Phantom, Solflare, anything Wallet Standard.
          </Step>
          <Step n={2} done={!!user?.roasterVerified} title="Verify you're human">
            We use Proof of Human (Solana POH). In dev mode this auto-passes;
            production needs <code className="rounded bg-soft px-1 py-0.5 text-xs">POH_API_KEY</code>.
          </Step>
          <Step n={3} done={false} title="Earn">
            Browse open cases, write sharper roasts than the AI suggestion, and
            cash in 🔥 points when you&apos;re picked.
          </Step>
        </ol>

        <div className="mt-10 flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => setVisible(true)}
              className="rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white hover:bg-ember-deep"
            >
              Connect wallet
            </button>
          ) : user.roasterVerified ? (
            <span className="text-verified font-medium">You&apos;re verified ✓</span>
          ) : (
            <button
              onClick={verify}
              disabled={verifying}
              className="rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white hover:bg-ember-deep disabled:bg-mute"
            >
              {verifying ? "Verifying…" : "Verify with POH"}
            </button>
          )}
          {error && <p className="text-sm text-yta">{error}</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Step({ n, done, title, children }: { n: number; done: boolean; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-medium ${done ? "bg-verified text-white" : "bg-soft text-mute"}`}>
        {done ? "✓" : n}
      </span>
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-mute">{children}</p>
      </div>
    </li>
  );
}
