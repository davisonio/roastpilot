import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions, SEVERITIES } from "@/db/schema";
import { moderate, streamVerdict } from "@/lib/verdict";

const InputSchema = z.object({
  body: z.string().trim().min(40, "tell us more").max(4000, "too long"),
  severity: z.enum(SEVERITIES).default("house"),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = InputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid input" },
      { status: 400 },
    );
  }
  const { body, severity } = parsed.data;

  const mod = await moderate(body);
  if (!mod.ok) {
    return NextResponse.json(
      { error: "blocked", reason: mod.reason },
      { status: 422 },
    );
  }

  const id = nanoid(10);
  db.insert(submissions)
    .values({ id, body, severity, moderationStatus: "approved" })
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
