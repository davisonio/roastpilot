// Proof of Human integration.
//
// In production, this hits the Solana POH API (verify-humanity-poh skill).
// In dev / when POH_API_KEY is unset, we run in DEMO mode: every connecting
// wallet is auto-verified with a clear console warning. This keeps the
// experience working end-to-end before keys are wired in.

const DEMO_MODE = !process.env.POH_API_KEY;

export type PohResult = {
  verified: boolean;
  source: "poh" | "demo";
  reason?: string;
};

export async function checkProofOfHumanity(
  walletAddress: string,
): Promise<PohResult> {
  if (DEMO_MODE) {
    if (typeof window === "undefined") {
      console.warn(
        "[POH] DEMO mode — auto-verifying wallet. Set POH_API_KEY to enable real Proof of Human.",
      );
    }
    return { verified: true, source: "demo" };
  }

  // TODO when POH_API_KEY is provided:
  // - Call POH API: GET /v1/wallet/{address}
  // - Parse response, return { verified, source: "poh" }
  // - Handle rate limits / 4xx / 5xx
  try {
    const res = await fetch(
      `https://api.proofofhuman.xyz/v1/wallet/${walletAddress}`,
      { headers: { Authorization: `Bearer ${process.env.POH_API_KEY}` } },
    );
    if (!res.ok) return { verified: false, source: "poh", reason: `${res.status}` };
    const data = (await res.json()) as { verified: boolean };
    return { verified: data.verified, source: "poh" };
  } catch (err) {
    return { verified: false, source: "poh", reason: (err as Error).message };
  }
}

export const POH_DEMO_MODE = DEMO_MODE;
