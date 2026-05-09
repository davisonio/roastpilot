import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { reactions, votes, users } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { POINTS } from "@/lib/points";
import { adjustPoints } from "@/lib/points-server";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: voteId } = await ctx.params;
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const vote = db.select().from(votes).where(eq(votes.id, voteId)).get();
  if (!vote) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Idempotent — if user already reacted, return current count.
  const existing = db
    .select()
    .from(reactions)
    .where(sql`${reactions.voteId} = ${voteId} AND ${reactions.userId} = ${me.id}`)
    .get();
  if (existing) {
    return NextResponse.json({ embers: vote.embers });
  }

  db.insert(reactions)
    .values({ id: nanoid(12), voteId, userId: me.id })
    .run();

  db.update(votes)
    .set({ embers: sql`${votes.embers} + 1` })
    .where(eq(votes.id, voteId))
    .run();

  // Reward the take's author.
  if (vote.userId !== me.id) {
    try {
      adjustPoints({
        userId: vote.userId,
        delta: POINTS.fireReaction,
        reason: "fireReaction",
        refId: voteId,
      });
    } catch {
      // Don't fail the reaction if points credit fails.
    }
  }

  const after = db
    .select({ embers: votes.embers })
    .from(votes)
    .where(eq(votes.id, voteId))
    .get();

  return NextResponse.json({ embers: after?.embers ?? vote.embers + 1 });
}
