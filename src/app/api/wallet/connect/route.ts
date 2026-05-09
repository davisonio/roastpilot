import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateHandle } from "@/lib/handle";
import { checkProofOfHumanity, POH_DEMO_MODE } from "@/lib/poh";
import { POINTS } from "@/lib/points";
import { adjustPoints } from "@/lib/points-server";
import { setSession } from "@/lib/session";

const Input = z.object({
  walletAddress: z.string().min(32).max(64),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Input.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid wallet" }, { status: 400 });
  }
  const { walletAddress } = parsed.data;

  let user = db
    .select()
    .from(users)
    .where(eq(users.walletAddress, walletAddress))
    .get();

  if (!user) {
    // First time: create user, run POH, give starting points.
    const poh = await checkProofOfHumanity(walletAddress);
    let handle: string;
    let attempts = 0;
    while (true) {
      handle = generateHandle();
      const exists = db.select().from(users).where(eq(users.handleSol, handle)).get();
      if (!exists) break;
      if (++attempts > 8) {
        handle = `${handle.replace(".sol", "")}${Date.now() % 9999}.sol`;
        break;
      }
    }

    const newId = nanoid(12);
    db.insert(users)
      .values({
        id: newId,
        walletAddress,
        handleSol: handle,
        pohVerified: poh.verified,
        paidSignup: false, // pay-to-signup is currently a stub; flip when wired
        roastPoints: 0,
      })
      .run();

    // Grant the signup bonus through the ledger so it shows in history.
    adjustPoints({
      userId: newId,
      delta: POINTS.signupBonus,
      reason: "signupBonus",
    });

    user = db.select().from(users).where(eq(users.id, newId)).get()!;
  }

  await setSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      handleSol: user.handleSol,
      walletAddress: user.walletAddress,
      pohVerified: user.pohVerified,
      paidSignup: user.paidSignup,
      roastPoints: user.roastPoints,
      pohDemoMode: POH_DEMO_MODE,
    },
  });
}
