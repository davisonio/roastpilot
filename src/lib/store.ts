// Data access layer — backed by Supabase.
// All functions are async and call the server-side client.

import { db } from "./supabase";
import type { Verdict } from "./verdicts";

export type Comment = {
  id: string;
  postId: string;
  authorName: string;
  verdict: Verdict;
  body: string;
  ignitions: number;
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

function mapPost(row: Record<string, unknown>, comments: Comment[] = []): Post {
  return {
    id: row.id as string,
    authorName: row.author_name as string,
    title: row.title as string,
    body: row.body as string,
    aiVerdict: (row.ai_verdict as Verdict) ?? null,
    aiResponse: (row.ai_response as string) ?? null,
    isPinned: row.is_pinned as boolean,
    isSeed: true,
    createdAt: new Date(row.created_at as string),
    comments,
  };
}

function mapComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    postId: row.post_id as string,
    authorName: row.author_name as string,
    verdict: row.verdict as Verdict,
    body: row.body as string,
    ignitions: (row.ignitions as number) ?? 0,
    isSeed: true,
    createdAt: new Date(row.created_at as string),
  };
}

export async function getPinned(): Promise<Post | null> {
  const { data } = await db
    .from("posts")
    .select("*, comments(*)")
    .eq("is_pinned", true)
    .order("created_at", { referencedTable: "comments", ascending: true })
    .maybeSingle();
  if (!data) return null;
  const comments = ((data.comments as Record<string, unknown>[]) ?? []).map(mapComment);
  return mapPost(data as unknown as Record<string, unknown>, comments);
}

export async function listFeed(): Promise<Post[]> {
  const { data } = await db
    .from("posts")
    .select("*, comments(count)")
    .eq("is_pinned", false)
    .order("created_at", { ascending: false })
    .limit(50);
  if (!data) return [];
  return (data as unknown as Record<string, unknown>[]).map((row) => {
    const countRow = (row.comments as { count: number }[])?.[0];
    const count = countRow?.count ?? 0;
    return {
      ...mapPost(row),
      comments: Array(count).fill(null) as Comment[], // length only, no data
    };
  });
}

export async function getPost(id: string): Promise<Post | null> {
  const { data } = await db
    .from("posts")
    .select("*, comments(*)")
    .eq("id", id)
    .order("created_at", { referencedTable: "comments", ascending: true })
    .maybeSingle();
  if (!data) return null;
  const comments = ((data.comments as Record<string, unknown>[]) ?? []).map(mapComment);
  return mapPost(data as unknown as Record<string, unknown>, comments);
}

export async function createPost(input: {
  title: string;
  body: string;
  authorName: string;
}): Promise<Post> {
  const { data, error } = await db
    .from("posts")
    .insert({
      author_name: input.authorName,
      title: input.title,
      body: input.body,
    })
    .select()
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create post");
  return mapPost(data as unknown as Record<string, unknown>);
}

export async function setVerdict(id: string, verdict: Verdict, response: string) {
  await db
    .from("posts")
    .update({ ai_verdict: verdict, ai_response: response })
    .eq("id", id);
}

export async function addComment(
  postId: string,
  c: { authorName: string; verdict: Verdict; body: string },
): Promise<Comment | null> {
  const { data, error } = await db
    .from("comments")
    .insert({
      post_id: postId,
      author_name: c.authorName,
      verdict: c.verdict,
      body: c.body,
    })
    .select()
    .single();
  if (error || !data) return null;
  return mapComment(data as unknown as Record<string, unknown>);
}

export async function igniteComment(commentId: string): Promise<number | null> {
  const { data: before } = await db
    .from("comments")
    .select("ignitions")
    .eq("id", commentId)
    .single();
  if (!before) return null;
  const next = ((before as { ignitions: number }).ignitions ?? 0) + 1;
  await db.from("comments").update({ ignitions: next }).eq("id", commentId);
  return next;
}

export async function getLeaderboard(): Promise<
  Array<{ handle: string; ignitions: number; commentCount: number }>
> {
  const { data } = await db
    .from("comments")
    .select("author_name, ignitions");
  if (!data) return [];
  const map = new Map<string, { ignitions: number; commentCount: number }>();
  for (const row of data as { author_name: string; ignitions: number }[]) {
    const entry = map.get(row.author_name) ?? { ignitions: 0, commentCount: 0 };
    entry.ignitions += row.ignitions;
    entry.commentCount += 1;
    map.set(row.author_name, entry);
  }
  return Array.from(map.entries())
    .map(([handle, d]) => ({ handle, ...d }))
    .sort((a, b) => b.ignitions - a.ignitions)
    .slice(0, 20);
}
