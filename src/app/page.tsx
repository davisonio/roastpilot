import Link from "next/link";
import { getPinned, listFeed } from "@/lib/store";
import { VerdictBadge } from "@/components/VerdictBadge";
import { VerdictGlossary } from "@/components/VerdictGlossary";
import { HandleBadge } from "@/components/HandleBadge";
import { heatLevel, heatGlowClass } from "@/lib/utils";
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
      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">
          Roast as a Service
        </p>
        <h1 className="font-display font-bold text-ink leading-[1.05] tracking-tight text-[44px] sm:text-[56px] max-w-3xl">
          Tell us what you did.<br />
          <span className="text-accent-bright">We&rsquo;ll tell you</span> if you&rsquo;re the asshole.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Post a dilemma. <strong className="text-ink">Claude Opus</strong> drops a verdict.
          The court of public opinion piles on after. Trustpilot, but for being told you suck.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-background px-5 h-11 font-semibold hover:bg-accent-strong shadow-[0_0_20px_rgba(255,107,26,0.35)] hover:shadow-[0_0_30px_rgba(255,107,26,0.5)] transition-all"
          >
            Submit your dilemma →
          </Link>
          <Link href="/leaderboard" className="text-sm text-ink-soft hover:text-accent transition-colors">
            🔥 {posts.reduce((s, p) => s + p.comments.length, 0)} verdicts on the board
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div>
          {pinned ? (
            <PinnedCard post={{
              id: pinned.id, title: pinned.title, body: pinned.body,
              authorName: pinned.authorName, aiVerdict: pinned.aiVerdict,
              createdAt: pinned.createdAt, commentCount: pinned.comments.length,
            }} />
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
                  <PostRow post={{
                    id: p.id, title: p.title, body: p.body,
                    authorName: p.authorName, aiVerdict: p.aiVerdict,
                    createdAt: p.createdAt, commentCount: p.comments.length,
                  }} />
                </li>
              ))
            )}
          </ul>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <VerdictGlossary />
          <div className="rounded-xl border border-rule bg-paper p-5 text-sm noise-texture">
            <h3 className="font-semibold text-ink text-sm tracking-wide mb-2">House rules</h3>
            <ul className="space-y-1.5 text-ink-soft list-disc list-inside">
              <li>Pick a handle to post or comment.</li>
              <li>Claude rules first. Humans rule loudest.</li>
              <li>You can&rsquo;t comment on your own dilemma.</li>
              <li>Ignite 🔥 the takes that nail it.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

type FeedPost = {
  id: string; title: string; body: string; authorName: string;
  aiVerdict: Verdict | null; createdAt: Date; commentCount: number;
};

function PinnedCard({ post }: { post: FeedPost }) {
  const level = heatLevel(post.commentCount);
  const glowClass = heatGlowClass(level);
  return (
    <Link
      href={`/posts/${post.id}`}
      className={`block group rounded-2xl border border-accent/40 bg-paper p-6 noise-texture hover:border-accent/80 transition-heat relative ${glowClass}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full">
          <span className="size-1.5 rounded-full bg-accent animate-pulse-soft" />
          Live demo · pinned
        </span>
        {post.aiVerdict ? (
          <VerdictBadge verdict={post.aiVerdict} />
        ) : (
          <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-accent border border-accent/60 rounded-full px-2.5 py-1">
            Awaiting Claude →
          </span>
        )}
        {post.commentCount > 0 && (
          <span className="text-[10px] text-ink-soft ml-auto">🔥 {post.commentCount} verdicts</span>
        )}
      </div>
      <h3 className="font-display text-[28px] sm:text-3xl font-semibold text-ink leading-[1.15] group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      <p className="mt-3 text-ink-soft line-clamp-2 leading-relaxed max-w-3xl">{post.body}</p>
      <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
        <HandleBadge name={post.authorName} size="sm" />
        <span>·</span>
        <span>{timeAgo(post.createdAt)}</span>
      </div>
    </Link>
  );
}

function PostRow({ post }: { post: FeedPost }) {
  const level = heatLevel(post.commentCount);
  const glowClass = heatGlowClass(level);
  const borderClass = level === 0 ? "border-rule" : "border-accent/20";
  return (
    <Link
      href={`/posts/${post.id}`}
      className={`block group rounded-xl border ${borderClass} bg-paper p-5 noise-texture hover:border-accent/60 hover:-translate-y-0.5 transition-heat relative ${glowClass}`}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm text-ink-soft line-clamp-2 leading-relaxed">{post.body}</p>
          <div className="mt-2.5 flex items-center gap-2.5 text-xs text-ink-soft">
            <HandleBadge name={post.authorName} size="sm" />
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            <span>·</span>
            <span>{post.commentCount} {post.commentCount === 1 ? "reply" : "replies"}</span>
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
