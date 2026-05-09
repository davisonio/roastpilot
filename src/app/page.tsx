import Link from "next/link";
import { getPinned, listFeed } from "@/lib/store";
import { VerdictBadge } from "@/components/VerdictBadge";
import { VerdictGlossary } from "@/components/VerdictGlossary";
import type { Verdict } from "@/lib/verdicts";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export default async function Home() {
  const pinned = getPinned();
  const posts = listFeed();

  return (
    <div className="mx-auto max-w-5xl px-6 pt-10 pb-20">
      <section className="mb-12">
        <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-4 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,107,26,0.8)]" />
          Roast as a Service
        </p>
        <h1 className="font-display font-semibold text-ink leading-[1.05] tracking-tight text-[46px] sm:text-[64px] max-w-3xl animate-breathe">
          Tell us what you did. We&rsquo;ll tell you if you&rsquo;re the asshole.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft leading-relaxed">
          Post a dilemma. <strong className="text-ink font-semibold">Claude Opus</strong> drops a verdict in
          seconds. The court of public opinion piles on after. Trustpilot, but for being told you
          suck.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-background px-6 h-12 font-semibold hover:bg-accent-strong shadow-[0_0_22px_rgba(255,107,26,0.35)] hover:shadow-[0_0_32px_rgba(255,107,26,0.55)] transition-all"
          >
            Submit your dilemma →
          </Link>
          <span className="text-sm text-ink-soft">
            {posts.length + (pinned ? 1 : 0)} posts on the docket today
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div>
          {pinned ? (
            <PinnedCard
              post={{
                id: pinned.id,
                title: pinned.title,
                body: pinned.body,
                authorName: pinned.authorName,
                aiVerdict: pinned.aiVerdict,
                createdAt: pinned.createdAt,
                _count: { comments: pinned.comments.length },
              }}
            />
          ) : null}

          <h2 className="mt-10 mb-3 text-sm font-semibold tracking-wide text-ink-soft uppercase">
            Recent dilemmas
          </h2>
          <ul className="grid gap-3">
            {posts.length === 0 && !pinned ? (
              <li className="rounded-xl border border-dashed border-rule p-8 text-center text-ink-soft">
                No posts yet. Be the first to confess.
              </li>
            ) : (
              posts.map((p) => (
                <li key={p.id}>
                  <PostRow
                    post={{
                      id: p.id,
                      title: p.title,
                      body: p.body,
                      authorName: p.authorName,
                      aiVerdict: p.aiVerdict,
                      createdAt: p.createdAt,
                      _count: { comments: p.comments.length },
                    }}
                  />
                </li>
              ))
            )}
          </ul>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <VerdictGlossary />
          <div className="rounded-xl border border-rule bg-paper p-5 text-sm">
            <h3 className="font-semibold text-ink text-sm tracking-wide mb-2">House rules</h3>
            <ul className="space-y-1.5 text-ink-soft list-disc list-inside">
              <li>Pick a handle to post or comment.</li>
              <li>Claude rules first. Humans rule loudest.</li>
              <li>You can&rsquo;t comment on your own dilemma.</li>
              <li>Be honest. Verdicts get spicy.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

type FeedPost = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  aiVerdict: Verdict | null;
  createdAt: Date;
  _count: { comments: number };
};

function PinnedCard({ post }: { post: FeedPost }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block group rounded-2xl border border-accent/40 bg-paper p-6 noise-texture hover:border-accent/80 transition-heat relative heat-glow-1 hover:heat-glow-2"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          Live demo · pinned
        </span>
        {post.aiVerdict ? (
          <VerdictBadge verdict={post.aiVerdict} />
        ) : (
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-accent border border-accent/60 rounded-full px-2.5 py-1">
            Awaiting Claude →
          </span>
        )}
      </div>
      <h3 className="font-display text-[28px] sm:text-3xl font-semibold text-ink leading-[1.15] group-hover:text-accent transition-colors max-w-3xl">
        {post.title}
      </h3>
      <p className="mt-3 text-ink-soft line-clamp-2 leading-relaxed max-w-3xl">{post.body}</p>
      <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
        <span className="font-medium text-ink">u/{post.authorName}</span>
        <span>·</span>
        <span>{timeAgo(post.createdAt)}</span>
        <span>·</span>
        <span>{post._count.comments} human verdicts</span>
      </div>
    </Link>
  );
}

function PostRow({ post }: { post: FeedPost }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block group rounded-xl border border-rule bg-paper p-5 noise-texture hover:border-accent/70 hover:-translate-y-0.5 transition-heat relative"
    >
      <div className="flex items-start justify-between gap-5 relative">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm text-ink-soft line-clamp-2 leading-relaxed">{post.body}</p>
          <div className="mt-2.5 flex items-center gap-2.5 text-xs text-ink-soft">
            <span className="font-medium text-ink">u/{post.authorName}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            <span>·</span>
            <span>{post._count.comments} replies</span>
          </div>
        </div>
        <div className="shrink-0">
          {post.aiVerdict ? (
            <VerdictBadge verdict={post.aiVerdict} />
          ) : (
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-ink-soft border border-rule rounded-full px-2 py-0.5">
              No verdict
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
