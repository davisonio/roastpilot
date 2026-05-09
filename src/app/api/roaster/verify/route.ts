import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { checkProofOfHumanity } from "@/lib/poh";
import { POINTS } from "@/lib/points";
import { adjustPoints } from "@/lib/points-server";

export const runtime = "nodejs";

export async function POST() {
  const me = await currentUser();
  if (!me)
    return NextResponse.json({ error: "Connect a wallet first." }, { status: 401 });

  if (me.roasterVerified) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const wallet = me.walletAddress;
  if (!wallet)
    return NextResponse.json(
      { error: "Wallet required to verify as a human roaster." },
      { status: 400 },
    );

  const poh = await checkProofOfHumanity(wallet);
  if (!poh.verified) {
    return NextResponse.json(
      { error: "Proof of Human did not pass.", source: poh.source },
      { status: 403 },
    );
  }

  db.update(users)
    .set({ pohVerified: true, roasterVerified: true })
    .where(eq(users.id, me.id))
    .run();

  adjustPoints({
    userId: me.id,
    delta: POINTS.pohBonus,
    reason: "pohBonus",
  });

  return NextResponse.json({ ok: true, source: poh.source });
}
