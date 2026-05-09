import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions, SEVERITIES, CATEGORIES } from "@/db/schema";
import { moderate, streamVerdict } from "@/lib/verdict";
import { currentUser } from "@/lib/session";
import { POINTS } from "@/lib/points";
import { adjustPoints, InsufficientPointsError } from "@/lib/points-server";
import { nextCaseNumber } from "@/lib/case-number";

const InputSchema = z.object({
  body: z.string().trim().min(40, "tell us more").max(4000, "too long"),
  severity: z.enum(SEVERITIES).default("house"),
  category: z.enum(CATEGORIES).default("other"),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) {
    return NextResponse.json(
      { error: "Connect a wallet first." },
      { status: 401 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = InputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid input" },
      { status: 400 },
    );
  }
  const { body, severity, category } = parsed.data;

  const cost = severity === "nuclear" ? POINTS.submitNuclear : POINTS.submitHouse;

  // 1. Charge Roastpoints up front
  try {
    adjustPoints({
      userId: me.id,
      delta: cost,
      reason: severity === "nuclear" ? "submitNuclear" : "submitHouse",
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

  // 2. Pre-publish moderation
  const mod = await moderate(body);
  if (!mod.ok) {
    // Refund, since the submission never actually happened.
    adjustPoints({
      userId: me.id,
      delta: -cost,
      reason: "manual",
    });
    return NextResponse.json(
      { error: "blocked", reason: mod.reason },
      { status: 422 },
    );
  }

  const id = nanoid(10);
  const caseNumber = nextCaseNumber();
  db.insert(submissions)
    .values({
      id,
      caseNumber,
      body,
      severity,
      category,
      moderationStatus: "approved",
      submitterId: me.id,
    })
    .run();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`__id:${id}\n`));
      try {
        const parsedVerdict = await streamVerdict(body, severity, (delta) => {
          controller.enqueue(encoder.encode(delta));
        });
        if (parsedVerdict) {
          db.update(submissions)
            .set({
              aiVerdict: parsedVerdict.verdict,
              aiRoast: parsedVerdict.opinion,
              aiReasoning: JSON.stringify(parsedVerdict.reasoning),
              aiConfidence: parsedVerdict.confidence,
            })
            .where(eq(submissions.id, id))
            .run();
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n__error:${(err as Error).message}\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
