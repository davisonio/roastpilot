import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { roastRequests, roasts } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { POINTS, pointsForRank } from "@/lib/points";
import { adjustPoints, bumpRoastsWon } from "@/lib/points-server";

const Input = z.object({
  rank1: z.string(),
  rank2: z.string(),
  rank3: z.string(),
});

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const me = await currentUser();
  if (!me)
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const request = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.id, id))
    .get();
  if (!request)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  if (request.requesterId !== me.id)
    return NextResponse.json(
      { error: "only the requester can judge this case" },
      { status: 403 },
    );
  if (request.status !== "open")
    return NextResponse.json(
      { error: "already judged" },
      { status: 400 },
    );

  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid" },
      { status: 400 },
    );
  }
  const ids = [parsed.data.rank1, parsed.data.rank2, parsed.data.rank3];
  if (new Set(ids).size !== 3) {
    return NextResponse.json(
      { error: "pick three distinct roasts" },
      { status: 400 },
    );
  }

  const allRoasts = db
    .select()
    .from(roasts)
    .where(eq(roasts.requestId, id))
    .all();
  const byId = new Map(allRoasts.map((r) => [r.id, r]));
  for (const ix of ids) {
    if (!byId.has(ix))
      return NextResponse.json(
        { error: `roast ${ix} not on this case` },
        { status: 400 },
      );
  }

  const seeded = request.paymentStatus === "seeded";
  const ranks: { rank: 1 | 2 | 3; id: string }[] = [
    { rank: 1, id: ids[0] },
    { rank: 2, id: ids[1] },
    { rank: 3, id: ids[2] },
  ];

  for (const r of ranks) {
    const award = pointsForRank(request.bountyCents, r.rank, { seeded });
    db.update(roasts)
      .set({ rank: r.rank, pointsAwarded: award })
      .where(eq(roasts.id, r.id))
      .run();

    const roast = byId.get(r.id)!;
    adjustPoints({
      userId: roast.roasterId,
      delta: award,
      reason: r.rank === 1 ? "rank1" : r.rank === 2 ? "rank2" : "rank3",
      refId: r.id,
    });
    if (r.rank === 1) bumpRoastsWon(roast.roasterId);
  }

  db.update(roastRequests)
    .set({
      status: "judged",
      judgedAt: new Date(),
    })
    .where(eq(roastRequests.id, id))
    .run();

  return NextResponse.json({ ok: true });
}
