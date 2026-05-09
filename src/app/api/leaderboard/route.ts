import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const rows = db
    .select({
      id: users.id,
      handleSol: users.handleSol,
      walletAddress: users.walletAddress,
      pohVerified: users.pohVerified,
      roasterVerified: users.roasterVerified,
      roastPoints: users.roastPoints,
      roastsWon: users.roastsWon,
    })
    .from(users)
    .orderBy(desc(users.roastPoints))
    .limit(100)
    .all();

  return NextResponse.json({ leaders: rows });
}
