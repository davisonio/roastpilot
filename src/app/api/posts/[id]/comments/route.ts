import { NextResponse } from "next/server";
import { addComment, getPost } from "@/lib/store";
import { VERDICTS, type Verdict } from "@/lib/verdicts";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const json = await req.json();
  const authorName = String(json.authorName ?? "").trim().slice(0, 32);
  const verdict = String(json.verdict ?? "") as Verdict;
  const body = String(json.body ?? "").trim();

  if (!authorName) return NextResponse.json({ error: "Display name required" }, { status: 400 });
  if (!VERDICTS.includes(verdict))
    return NextResponse.json({ error: "Pick a valid verdict" }, { status: 400 });
  if (body.length < 10)
    return NextResponse.json({ error: "Say more than that, at least 10 characters." }, { status: 400 });

  const post = getPost(id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  if (post.authorName.toLowerCase() === authorName.toLowerCase()) {
    return NextResponse.json(
      { error: "You can't render a verdict on your own dilemma. Nice try." },
      { status: 403 },
    );
  }

  const comment = addComment(post.id, { authorName, verdict, body });
  return NextResponse.json({ id: comment?.id });
}
