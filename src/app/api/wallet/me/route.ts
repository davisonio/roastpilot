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
      pohVerified: user.pohVerified,
      roastPoints: user.roastPoints,
    },
  });
}
