import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { eq, desc, and } from "drizzle-orm";
import { db } from "@/db";
import {
  roastRequests,
  CATEGORIES,
  CURRENCIES,
  REQUEST_STATUSES,
} from "@/db/schema";
import { moderate } from "@/lib/moderation";
import { generateAiSuggestion } from "@/lib/ai-suggestion";
import { nextCaseNumber } from "@/lib/case-number";
import { currentUser } from "@/lib/session";

export const runtime = "nodejs";

const Input = z.object({
  scenario: z.string().trim().min(40, "tell us more").max(4000, "too long"),
  category: z.enum(CATEGORIES).default("other"),
  bountyCents: z.number().int().min(0).max(50_000).default(0),
  currency: z.enum(CURRENCIES).default("usd"),
  requesterEmail: z.string().email().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Input.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "invalid input" },
      { status: 400 },
    );
  }
  const { scenario, category, bountyCents, currency, requesterEmail } =
    parsed.data;

  const me = await currentUser();
  if (!me && !requesterEmail) {
    return NextResponse.json(
      { error: "Connect a wallet or provide an email." },
      { status: 401 },
    );
  }

  // 1. Pre-publish moderation
  const mod = await moderate(scenario);
  if (!mod.ok) {
    return NextResponse.json(
      { error: "blocked", reason: mod.reason },
      { status: 422 },
    );
  }

  // 2. Generate the AI reference roast (best-effort; missing-key won't block)
  let aiSuggestion: string | null = null;
  try {
    aiSuggestion = await generateAiSuggestion(scenario);
  } catch {
    aiSuggestion = null;
  }

  // 3. Create the request. Free/seed bounties go straight to "open & paid".
  const id = nanoid(10);
  const caseNumber = nextCaseNumber();
  const isFree = bountyCents === 0;

  db.insert(roastRequests)
    .values({
      id,
      caseNumber,
      requesterId: me?.id ?? null,
      requesterEmail: requesterEmail ?? null,
      scenario,
      category,
      bountyCents,
      currency: isFree ? "seed" : currency,
      paymentStatus: isFree ? "seeded" : "pending",
      paymentProvider: isFree ? "seed" : null,
      aiSuggestion,
      status: "open",
    })
    .run();

  return NextResponse.json({
    id,
    caseNumber,
    paymentRequired: !isFree,
    aiSuggestion,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);

  const where =
    status && (REQUEST_STATUSES as readonly string[]).includes(status)
      ? and(
          eq(roastRequests.paymentStatus, "paid"),
          eq(roastRequests.status, status as (typeof REQUEST_STATUSES)[number]),
        )
      : undefined;

  const rows = db
    .select()
    .from(roastRequests)
    .where(where as never) // typed-as-any when undefined; drizzle ignores
    .orderBy(desc(roastRequests.createdAt))
    .limit(limit)
    .all();

  return NextResponse.json({ requests: rows });
}
