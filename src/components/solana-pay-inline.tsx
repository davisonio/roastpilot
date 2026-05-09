"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SolanaPayInline({
  requestId,
  bountyCents,
}: {
  requestId: string;
  bountyCents: number;
}) {
  const router = useRouter();
  const [tx, setTx] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const treasury = process.env.NEXT_PUBLIC_SOLANA_TREASURY ?? "<set NEXT_PUBLIC_SOLANA_TREASURY>";
  const sol = (bountyCents / 100 / 150).toFixed(3);

  async function verify() {
    if (!tx.trim()) {
      setError("Paste your transaction signature.");
      return;
    }
    setError(null);
    setVerifying(true);
    const res = await fetch("/api/payments/solana/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ requestId, txSignature: tx.trim() }),
    });
    setVerifying(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Verification failed.");
      return;
    }
    router.replace(`/r/${requestId}?paid=1`);
  }

  return (
    <section className="card-lg border-ember p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-mute">Pay with Solana</p>
      <p className="mt-2 text-sm text-ink">
        Send <span className="font-medium tnum">{sol} SOL</span> on devnet to:
      </p>
      <code className="mt-2 block break-all rounded-md bg-soft px-3 py-2 text-[12px] text-ink">{treasury}</code>
      <p className="mt-3 text-xs text-mute">Then paste the transaction signature below.</p>
      <input
        value={tx}
        onChange={(e) => setTx(e.target.value)}
        placeholder="5TYx... (signature)"
        className="mt-2 w-full rounded-xl border border-rule bg-paper p-3 text-[13px] text-ink placeholder:text-mute focus:border-ember focus:outline-none"
      />
      <button
        onClick={verify}
        disabled={verifying || !tx.trim()}
        className="mt-3 w-full rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ember-deep disabled:cursor-not-allowed disabled:bg-mute"
      >
        {verifying ? "Verifying…" : "Verify payment"}
      </button>
      {error && <p className="mt-2 text-sm text-yta">{error}</p>}
    </section>
  );
}
