import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { roastRequests, payments } from "@/db/schema";
import { stripeClient, STRIPE_ENABLED } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!STRIPE_ENABLED)
    return NextResponse.redirect(new URL("/?error=stripe-disabled", req.url));
  const stripe = stripeClient()!;

  const url = new URL(req.url);
  const requestId = url.searchParams.get("request");
  const sessionId = url.searchParams.get("session_id");
  if (!requestId || !sessionId)
    return NextResponse.redirect(new URL("/?error=missing", req.url));

  const request = db
    .select()
    .from(roastRequests)
    .where(eq(roastRequests.id, requestId))
    .get();
  if (!request)
    return NextResponse.redirect(new URL("/?error=not-found", req.url));

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const paid = session.payment_status === "paid";

  if (paid) {
    db.update(roastRequests)
      .set({
        paymentStatus: "paid",
        paymentProvider: "stripe",
        paymentRef: sessionId,
      })
      .where(eq(roastRequests.id, requestId))
      .run();

    db.insert(payments)
      .values({
        id: nanoid(12),
        requestId,
        provider: "stripe",
        externalRef: sessionId,
        amountCents: session.amount_total ?? request.bountyCents,
        currency: "usd",
        status: "paid",
        rawPayload: JSON.stringify({
          payment_status: session.payment_status,
          payment_intent: session.payment_intent,
        }),
      })
      .run();
  }

  const dest = paid ? `/r/${requestId}?paid=1` : `/r/${requestId}?paid=0`;
  return NextResponse.redirect(new URL(dest, req.url));
}
