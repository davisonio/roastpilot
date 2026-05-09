import { NextResponse } from "next/server";
import { createPost, setVerdict } from "@/lib/store";
import { generateVerdict } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json();
  const title = String(body.title ?? "").trim();
  const text = String(body.body ?? "").trim();
  const authorName = String(body.authorName ?? "").trim().slice(0, 32);

  if (!authorName) return NextResponse.json({ error: "Display name required" }, { status: 400 });
  if (title.length < 8) return NextResponse.json({ error: "Title too short" }, { status: 400 });
  if (text.length < 30) return NextResponse.json({ error: "Story too short" }, { status: 400 });

  const post = createPost({ title, body: text, authorName });

  generateVerdict(title, text)
    .then((result) => setVerdict(post.id, result.verdict, result.response))
    .catch((err) => console.error("Verdict generation failed:", err));

  return NextResponse.json({ id: post.id });
}
