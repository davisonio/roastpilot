import { getPost, setVerdict } from "@/lib/store";
import { streamVerdict } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const post = await getPost(id);
  if (!post) return new Response("Not found", { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamVerdict(post.title, post.body)) {
          if ("delta" in chunk) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: chunk.delta })}\n\n`));
          } else {
            await setVerdict(post.id, chunk.done.verdict, chunk.done.response);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: chunk.done })}\n\n`),
            );
          }
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Verdict failed.";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
