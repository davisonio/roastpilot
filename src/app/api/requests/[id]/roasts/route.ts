import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roastRequests, roasts } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { moderate } from "@/lib/moderation";
import { POINTS } from "@/lib/points";
import { adjustPoints } from "@/lib/points-server";

const Input = z.object({
  body: z.string().trim().min(20, "say more").max(2000, "shorter"),
});

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const me = await currentUser();
  if (!me)
    return NextResponse.json({ error: "Connect a wallet first." }, { status: 401 });
  if (!me.roasterVerified) {
    return NextResponse.json(
      { error: "Verify as a roaster first." },
      { status: 403 },
    );
  }

  const request = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.id, id))
    .get();
  if (!request)
    return NextResponse.json({ error: "request not found" }, { status: 404 });
  if (request.status !== "open")
    return NextResponse.json(
      { error: "this case is no longer open" },
      { status: 400 },
    );

  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid" },
      { status: 400 },
    );
  }

  const mod = await moderate(parsed.data.body);
  if (!mod.ok) {
    return NextResponse.json(
      { error: "blocked", reason: mod.reason },
      { status: 422 },
    );
  }

  const roastId = nanoid(12);
  db.insert(roasts)
    .values({
      id: roastId,
      requestId: id,
      roasterId: me.id,
      body: parsed.data.body,
    })
    .run();

  // Participation reward
  adjustPoints({
    userId: me.id,
    delta: POINTS.participation,
    reason: "participation",
    refId: roastId,
  });

  return NextResponse.json({ id: roastId });
}
