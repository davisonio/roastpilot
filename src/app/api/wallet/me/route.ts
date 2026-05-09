import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      id: user.id,
      handleSol: user.handleSol,
      walletAddress: user.walletAddress,
      email: user.email,
      pohVerified: user.pohVerified,
      roasterVerified: user.roasterVerified,
      roastPoints: user.roastPoints,
      roastsWon: user.roastsWon,
    },
  });
}
