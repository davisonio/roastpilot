import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

export function stripeClient(): Stripe | null {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  cached = new Stripe(key);
  return cached;
}

export const STRIPE_ENABLED = !!process.env.STRIPE_SECRET_KEY;
