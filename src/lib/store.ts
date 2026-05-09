import type { Verdict } from "./verdicts";
import { SEED_POSTS } from "@/data/seed";

export type Comment = {
  id: string;
  postId: string;
  authorName: string;
  verdict: Verdict;
  body: string;
  isSeed: boolean;
  createdAt: Date;
};

export type Post = {
  id: string;
  authorName: string;
  title: string;
  body: string;
  aiVerdict: Verdict | null;
  aiResponse: string | null;
  isPinned: boolean;
  isSeed: boolean;
  createdAt: Date;
  comments: Comment[];
};

type Store = { posts: Post[] };

const g = globalThis as unknown as { __roastpilotStore?: Store };

function init(): Store {
  const now = Date.now();
  const total = SEED_POSTS.length;
  const posts: Post[] = SEED_POSTS.map((sp, i) => {
    const id = `seed-${i}`;
    const createdAt = new Date(now - (total - i) * 7 * 60 * 1000);
    return {
      id,
      authorName: sp.authorName,
      title: sp.title,
      body: sp.body,
      aiVerdict: sp.aiVerdict ?? null,
      aiResponse: sp.aiResponse ?? null,
      isPinned: sp.isPinned ?? false,
      isSeed: true,
      createdAt,
      comments: sp.comments.map((c, ci) => ({
        id: `seed-${i}-c-${ci}`,
        postId: id,
        authorName: c.authorName,
        verdict: c.verdict,
        body: c.body,
        isSeed: true,
        createdAt: new Date(createdAt.getTime() + (ci + 1) * 60 * 1000),
      })),
    };
  });
  return { posts };
}

const store: Store = (g.__roastpilotStore ??= init());

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getPinned(): Post | null {
  return store.posts.find((p) => p.isPinned) ?? null;
}

export function listFeed(): Post[] {
  return store.posts
    .filter((p) => !p.isPinned)
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 50);
}

export function getPost(id: string): Post | null {
  return store.posts.find((p) => p.id === id) ?? null;
}

export function createPost(input: {
  title: string;
  body: string;
  authorName: string;
}): Post {
  const post: Post = {
    id: uid("p"),
    authorName: input.authorName,
    title: input.title,
    body: input.body,
    aiVerdict: null,
    aiResponse: null,
    isPinned: false,
    isSeed: false,
    createdAt: new Date(),
    comments: [],
  };
  store.posts.push(post);
  return post;
}

export function setVerdict(id: string, verdict: Verdict, response: string) {
  const p = store.posts.find((p) => p.id === id);
  if (!p) return;
  p.aiVerdict = verdict;
  p.aiResponse = response;
}

export function addComment(
  postId: string,
  c: { authorName: string; verdict: Verdict; body: string },
): Comment | null {
  const p = store.posts.find((p) => p.id === postId);
  if (!p) return null;
  const comment: Comment = {
    id: uid("c"),
    postId,
    authorName: c.authorName,
    verdict: c.verdict,
    body: c.body,
    isSeed: false,
    createdAt: new Date(),
  };
  p.comments.push(comment);
  return comment;
}
