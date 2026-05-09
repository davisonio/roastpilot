import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/store";
import { VerdictBadge } from "@/components/VerdictBadge";
import { CommentSection } from "./CommentSection";
import { LiveVerdictPanel } from "./LiveVerdictPanel";
import { VERDICT_LABELS } from "@/lib/verdicts";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fresh?: string }>;
}) {
  const { id } = await params;
  const { fresh } = await searchParams;
  const post = getPost(id);
  if (!post) notFound();

  const tally = post.comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.verdict] = (acc[c.verdict] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-6 pt-10 pb-20">
      <Link href="/" className="text-sm text-ink-soft hover:text-accent inline-block mb-6">
        ← back to the docket
      </Link>

      <article>
        {post.isPinned ? (
          <span className="inline-block bg-accent text-background text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(255,107,26,0.45)]">
            Live demo · pinned
          </span>
        ) : null}
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] tracking-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-2.5 text-sm text-ink-soft">
          <span>
            posted by <span className="font-medium text-ink">u/{post.authorName}</span>
          </span>
          <span>·</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
        <div className="mt-6 prose-like text-ink leading-relaxed whitespace-pre-wrap">
          {post.body}
        </div>
      </article>

      <div className="gavel-rule my-10" />

      <section className="rounded-2xl border border-rule bg-paper p-6 noise-texture relative heat-glow-1">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-ink-soft">
            Claude&rsquo;s verdict
          </h2>
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            Opus 4.6, judging in your stead
          </span>
        </div>
        {post.aiVerdict && post.aiResponse ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <VerdictBadge verdict={post.aiVerdict} size="lg" />
              <span className="text-base text-ink font-medium">
                {VERDICT_LABELS[post.aiVerdict]}
              </span>
            </div>
            <div className="text-ink leading-relaxed whitespace-pre-wrap">{post.aiResponse}</div>
          </div>
        ) : (
          <LiveVerdictPanel postId={post.id} autoStart={Boolean(fresh)} />
        )}
      </section>

      <div className="gavel-rule my-10" />

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-ink-soft">
            The court of public opinion
          </h2>
          <div className="flex gap-2">
            {Object.entries(tally).map(([v, n]) => (
              <span
                key={v}
                className="text-[11px] uppercase tracking-[0.14em] text-ink-soft border border-rule rounded-full px-2 py-0.5"
              >
                {n} × {v}
              </span>
            ))}
          </div>
        </div>
        <CommentSection postId={post.id} postAuthorName={post.authorName} comments={post.comments} />
      </section>
    </div>
  );
}
