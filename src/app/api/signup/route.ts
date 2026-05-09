import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();

  // Store in Vercel KV if configured, otherwise just log.
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.sadd("roastpilot:waitlist", normalized);
      const count = await kv.scard("roastpilot:waitlist");
      return NextResponse.json({ ok: true, count });
    } catch (err) {
      console.error("[signup] KV error:", err);
    }
  } else {
    console.log("[signup] no KV configured — email:", normalized);
  }

  return NextResponse.json({ ok: true, count: null });
}

export async function GET() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import("@vercel/kv");
      const count = await kv.scard("roastpilot:waitlist");
      return NextResponse.json({ count });
    } catch {
      return NextResponse.json({ count: 0 });
    }
  }
  return NextResponse.json({ count: 0 });
}
