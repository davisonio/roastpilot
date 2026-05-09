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
      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-3">
          Roast as a Service
        </p>
        <h1 className="font-bold text-ink leading-[1.05] tracking-tight text-[44px] sm:text-[56px] max-w-3xl">
          Tell us what you did. We&rsquo;ll tell you if you&rsquo;re the asshole.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Post a dilemma. <strong className="text-ink">Claude Opus</strong> drops a verdict in
          seconds. The court of public opinion piles on after. Trustpilot, but for being told you
          suck.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-paper px-5 h-11 font-semibold hover:bg-accent-strong transition-colors"
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
      className="block group rounded-2xl border-2 border-accent/60 bg-paper p-6 hover:border-accent transition-colors relative overflow-hidden"
    >
      <span className="absolute -top-3 left-5 bg-accent text-paper text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full">
        Live demo · pinned
      </span>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold text-ink leading-tight group-hover:text-accent-strong transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-ink-soft line-clamp-3">{post.body}</p>
          <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
            <span className="font-medium text-ink">u/{post.authorName}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
            <span>·</span>
            <span>{post._count.comments} human verdicts</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {post.aiVerdict ? (
            <VerdictBadge verdict={post.aiVerdict} size="lg" showLabel />
          ) : (
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-accent border border-accent rounded-full px-3 py-1">
              Awaiting Claude →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function PostRow({ post }: { post: FeedPost }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block group rounded-xl border border-rule bg-paper p-5 hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ink leading-tight group-hover:text-accent-strong transition-colors">
            {post.title}
          </h3>
          <p className="mt-1.5 text-sm text-ink-soft line-clamp-2">{post.body}</p>
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
