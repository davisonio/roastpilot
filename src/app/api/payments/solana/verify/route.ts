import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { db } from "@/db";
import { roastRequests, payments } from "@/db/schema";

export const runtime = "nodejs";

const Input = z.object({
  requestId: z.string(),
  txSignature: z.string().min(40),
});

const SOL_USD_FALLBACK = 150; // demo conversion when no oracle is wired

export async function POST(req: Request) {
  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid" }, { status: 400 });

  const request = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.id, parsed.data.requestId))
    .get();
  if (!request)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  if (request.paymentStatus === "paid")
    return NextResponse.json({ ok: true, alreadyPaid: true });

  const conn = new Connection(
    process.env.SOLANA_RPC ?? clusterApiUrl("devnet"),
    "confirmed",
  );

  // Verify the transaction exists and is confirmed; we trust the user that it
  // pays the right treasury for the right amount in the demo. A production
  // build should parse instructions, decode SystemProgram.transfer, match
  // recipient against the configured treasury, and verify lamports.
  const tx = await conn.getTransaction(parsed.data.txSignature, {
    maxSupportedTransactionVersion: 0,
  });
  if (!tx) {
    return NextResponse.json(
      { error: "transaction not found on-chain" },
      { status: 422 },
    );
  }

  db.update(roastRequests)
    .set({
      paymentStatus: "paid",
      paymentProvider: "solana",
      paymentRef: parsed.data.txSignature,
      currency: "sol",
    })
    .where(eq(roastRequests.id, request.id))
    .run();

  db.insert(payments)
    .values({
      id: nanoid(12),
      requestId: request.id,
      provider: "solana",
      externalRef: parsed.data.txSignature,
      amountCents: Math.round(SOL_USD_FALLBACK * 100), // approx, demo
      currency: "sol",
      status: "paid",
    })
    .run();

  return NextResponse.json({ ok: true });
}
