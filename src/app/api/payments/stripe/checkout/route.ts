import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roastRequests } from "@/db/schema";
import { stripeClient, STRIPE_ENABLED } from "@/lib/stripe";

export const runtime = "nodejs";

const Input = z.object({ requestId: z.string() });

export async function POST(req: Request) {
  if (!STRIPE_ENABLED) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }
  const stripe = stripeClient()!;

  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const request = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.id, parsed.data.requestId))
    .get();
  if (!request)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  if (request.bountyCents <= 0)
    return NextResponse.json(
      { error: "no bounty to pay" },
      { status: 400 },
    );
  if (request.paymentStatus === "paid") {
    return NextResponse.json({ url: null, alreadyPaid: true });
  }

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Roast bounty · Case #${request.caseNumber}`,
            description: request.scenario.slice(0, 220),
          },
          unit_amount: request.bountyCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/api/payments/stripe/return?request=${request.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/r/${request.id}?canceled=1`,
    metadata: { requestId: request.id, caseNumber: String(request.caseNumber) },
  });

  return NextResponse.json({ url: session.url });
}
