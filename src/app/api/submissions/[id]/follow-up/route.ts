import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { submissions, followUps } from "@/db/schema";
import { currentUser } from "@/lib/session";
import { POINTS } from "@/lib/points";
import { adjustPoints, InsufficientPointsError } from "@/lib/points-server";
import { anthropic, VERDICT_MODEL } from "@/lib/anthropic";

const Input = z.object({
  kind: z.enum(["plead", "ask"]),
  prompt: z.string().trim().min(10).max(2000),
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

  const body = await req.json().catch(() => null);
  const parsed = Input.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid input" },
      { status: 400 },
    );
  }
  const { kind, prompt } = parsed.data;

  const submission = db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .get();
  if (!submission)
    return NextResponse.json({ error: "case not found" }, { status: 404 });

  const cost = kind === "plead" ? POINTS.pleadYourCase : POINTS.askFollowUp;

  try {
    adjustPoints({
      userId: me.id,
      delta: cost,
      reason: kind === "plead" ? "pleadYourCase" : "askFollowUp",
      refId: id,
    });
  } catch (err) {
    if (err instanceof InsufficientPointsError) {
      return NextResponse.json(
        { error: err.message },
        { status: 402 },
      );
    }
    throw err;
  }

  const sysPlead = `You are the bench of Roastpilot. The submitter has now provided new information after your initial verdict. Briefly acknowledge what shifts and re-rule in 4-6 sentences. Stay composed. End with a clear updated verdict tag (NTA/YTA/ESH/NAH).`;
  const sysAsk = `You are the bench of Roastpilot. The submitter is asking a sharper question about a detail of their case. Answer in 3-5 sentences. Be direct, witty, and reference the original facts where relevant.`;

  const original = `Original submission:\n"""\n${submission.body}\n"""\n\nOriginal verdict: ${submission.aiVerdict ?? "unset"}\nOriginal opinion: ${submission.aiRoast ?? "—"}`;

  const userMsg =
    kind === "plead"
      ? `${original}\n\nNew context from the submitter:\n"""\n${prompt}\n"""`
      : `${original}\n\nFollow-up question from the submitter:\n"""\n${prompt}\n"""`;

  const resp = await anthropic.messages.create({
    model: VERDICT_MODEL,
    max_tokens: 600,
    system: kind === "plead" ? sysPlead : sysAsk,
    messages: [{ role: "user", content: userMsg }],
  });

  const aiResponse =
    resp.content[0]?.type === "text" ? resp.content[0].text.trim() : "";

  const followUpId = nanoid(12);
  db.insert(followUps)
    .values({
      id: followUpId,
      submissionId: id,
      kind,
      prompt,
      aiResponse,
    })
    .run();

  return NextResponse.json({ id: followUpId, aiResponse });
}
