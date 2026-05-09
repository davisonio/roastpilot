// Seed roast_requests + roasts + users from data/aita-seed.json (the JSON file
// produced by scripts/import-aita-seed.mjs).
//
// Each AITA post becomes a `judged` roast_request whose top 3 Reddit
// comments become ranked roasts. A pool of synthetic verified roasters
// is created and assigned the seeded roasts; each roaster's roastPoints
// reflects the sum of awards on those wins, which seeds the leaderboard.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { db } from "../src/db";
import {
  users,
  roastRequests,
  roasts,
  payments,
  pointsLedger,
  type Category,
  type Verdict,
} from "../src/db/schema";
import { generateHandle } from "../src/lib/handle";
import { pointsForRank } from "../src/lib/points";

type SeedReply = {
  redditId: string;
  body: string;
  score: number;
  verdict: Verdict | null;
  sourceUrl: string;
};

type SeedPost = {
  redditId: string;
  sourceUrl: string;
  permalink: string;
  title: string;
  body: string;
  score: number;
  upvoteRatio: number | null;
  commentCount: number;
  createdAt: string;
  replies: SeedReply[];
};

type SeedFile = {
  meta: { fetchedAt: string; subreddit: string };
  posts: SeedPost[];
};

const NUM_ROASTERS = 36;
const FLOOR_CASE_NUMBER = 71849;

function fakeWalletAddress(seed: string): string {
  const base = "abcdefghijklmnopqrstuvwxyz123456789";
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  let out = "";
  for (let i = 0; i < 36; i++) {
    s = (s * 1103515245 + 12345) | 0;
    out += base[Math.abs(s) % base.length];
  }
  return out;
}

function pickCategory(text: string): Category {
  const t = text.toLowerCase();
  if (/wedding|sister|brother|mom|dad|family|in-?law|aunt|uncle|cousin/.test(t))
    return "family";
  if (/boyfriend|girlfriend|fiance|spouse|husband|wife|partner|date|dating/.test(t))
    return "relationships";
  if (/coworker|boss|office|job|manager|colleague|hr|workplace|salary/.test(t))
    return "work";
  if (/money|cash|loan|rent|inheritance|bills|venmo|paypal|owe/.test(t))
    return "money";
  if (/friend|roommate|housemate/.test(t)) return "friends";
  if (/spite|petty|deliberately|on purpose/.test(t)) return "petty";
  return "other";
}

function bountyFor(post: SeedPost): number {
  // Bigger bounty for higher-engagement posts so the leaderboard math is
  // varied. Cap at $25 so seeds can't dominate. (cents)
  const tier = post.score > 30000 ? 25_00 : post.score > 15000 ? 15_00 : post.score > 5000 ? 10_00 : 5_00;
  return tier;
}

async function main() {
  const filePath = path.resolve(process.cwd(), "data/aita-seed.json");
  const raw = await readFile(filePath, "utf-8");
  const seed = JSON.parse(raw) as SeedFile;
  console.log(`[seed-aita] loaded ${seed.posts.length} posts`);

  // ---- reset relevant tables ---------------------------------------------
  console.log("[seed-aita] resetting...");
  db.delete(payments).run();
  db.delete(roasts).run();
  db.delete(roastRequests).run();
  db.delete(pointsLedger).run();
  db.delete(users).run();

  // ---- create synthetic roasters -----------------------------------------
  console.log(`[seed-aita] creating ${NUM_ROASTERS} synthetic roasters...`);
  const usedHandles = new Set<string>();
  const roasterIds: string[] = [];
  for (let i = 0; i < NUM_ROASTERS; i++) {
    let handle: string;
    do {
      handle = generateHandle();
    } while (usedHandles.has(handle));
    usedHandles.add(handle);

    const id = nanoid(12);
    roasterIds.push(id);
    db.insert(users)
      .values({
        id,
        walletAddress: fakeWalletAddress(`roaster-${i}`),
        handleSol: handle,
        pohVerified: true,
        roasterVerified: true,
        roastPoints: 0,
        roastsWon: 0,
      })
      .run();
  }

  // ---- create requests + ranked roasts -----------------------------------
  console.log("[seed-aita] inserting requests + ranked roasts...");
  let caseNumber = FLOOR_CASE_NUMBER;
  let inserted = 0;

  for (const post of seed.posts) {
    if (post.replies.length < 3) continue; // need full top 3 for the demo

    const requestId = nanoid(10);
    const scenario = `${post.title}\n\n${post.body}`.trim();
    const bountyCents = bountyFor(post);
    const category = pickCategory(scenario);
    const verdictFromTopReply = post.replies[0]?.verdict ?? null;

    db.insert(roastRequests)
      .values({
        id: requestId,
        caseNumber,
        scenario,
        category,
        bountyCents,
        currency: "seed",
        paymentStatus: "seeded",
        paymentProvider: "seed",
        moderationStatus: "approved",
        status: "judged",
        judgedAt: new Date(post.createdAt),
        redditId: post.redditId,
        redditScore: post.score,
        redditUrl: post.sourceUrl,
        redditVerdict: verdictFromTopReply ?? undefined,
        createdAt: new Date(post.createdAt),
      })
      .run();

    const replies = post.replies.slice(0, 3);
    replies.forEach((reply, idx) => {
      const rank = (idx + 1) as 1 | 2 | 3;
      const roasterId = roasterIds[(inserted * 7 + idx * 11) % NUM_ROASTERS];
      const points = pointsForRank(bountyCents, rank, { seeded: true });
      const roastId = nanoid(12);

      db.insert(roasts)
        .values({
          id: roastId,
          requestId,
          roasterId,
          body: reply.body,
          embers: Math.max(0, Math.round(reply.score / 50)),
          rank,
          pointsAwarded: points,
          redditScore: reply.score,
          redditId: reply.redditId,
        })
        .run();

      db.insert(pointsLedger)
        .values({
          id: nanoid(12),
          userId: roasterId,
          delta: points,
          reason: rank === 1 ? "rank1" : rank === 2 ? "rank2" : "rank3",
          refId: roastId,
        })
        .run();
    });

    inserted += 1;
    caseNumber += 1;
  }

  // ---- aggregate leaderboard updates -------------------------------------
  console.log("[seed-aita] aggregating points + roasts won...");
  for (const id of roasterIds) {
    const all = db.select().from(roasts).all();
    const mine = all.filter((r) => r.roasterId === id);
    const points = mine.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const wins = mine.filter((r) => r.rank === 1).length;
    db.update(users)
      .set({ roastPoints: points, roastsWon: wins })
      .where(eq(users.id, id))
      .run();
  }

  console.log(`[seed-aita] done — ${inserted} requests with 3 ranked roasts each`);
}

import { eq } from "drizzle-orm";
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
