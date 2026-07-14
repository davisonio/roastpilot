import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateVerdict } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const text = String(body.body ?? "").trim();
  const authorName = String(body.authorName ?? "").trim().slice(0, 32);

  if (!authorName) return NextResponse.json({ error: "Display name required" }, { status: 400 });
  if (title.length < 8) return NextResponse.json({ error: "Title too short" }, { status: 400 });
  if (text.length < 30) return NextResponse.json({ error: "Story too short" }, { status: 400 });

  const post = await prisma.post.create({
    data: { title, body: text, authorName },
  });

  generateVerdict(title, text)
    .then((result) =>
      prisma.post.update({
        where: { id: post.id },
        data: { aiVerdict: result.verdict, aiResponse: result.response },
      }),
    )
    .catch((err) => console.error("Verdict generation failed:", err));

  return NextResponse.json({ id: post.id });
}
