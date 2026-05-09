import { NextResponse } from "next/server";
import { z } from "zod";
import { igniteComment } from "@/lib/store";

const Input = z.object({ commentId: z.string() });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await params;
  const body = await req.json().catch(() => null);
  const parsed = Input.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad input" }, { status: 400 });

  const count = igniteComment(parsed.data.commentId);
  if (count === null) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ ignitions: count });
}
