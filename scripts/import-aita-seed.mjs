#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REDDIT_BASE = "https://www.reddit.com";
const DEFAULTS = {
  subreddit: "AmItheAsshole",
  time: "month",
  limit: 100,
  comments: 3,
  out: "data/aita-seed.json",
  delayMs: 2500,
  retries: 6,
};

const USER_AGENT =
  "roastpilot-local-seed-importer/0.1 by local-dev; contact: local-only";

const args = parseArgs(process.argv.slice(2));
const options = {
  subreddit: args.subreddit ?? DEFAULTS.subreddit,
  time: args.time ?? DEFAULTS.time,
  limit: numberArg(args.limit, DEFAULTS.limit),
  comments: numberArg(args.comments, DEFAULTS.comments),
  out: args.out ?? DEFAULTS.out,
  delayMs: numberArg(args.delay, DEFAULTS.delayMs),
  retries: numberArg(args.retries, DEFAULTS.retries),
};

const verdictPattern = /\b(NTA|YTA|ESH|NAH|INFO)\b/i;
const removedText = new Set(["[deleted]", "[removed]", ""]);

const unsafePatterns = [
  {
    name: "contact-info",
    pattern:
      /(?:\b[\w.+-]+@[\w-]+\.[\w.-]+\b|\b(?:\+?\d[\s().-]*){8,}\d\b|https?:\/\/\S+)/i,
  },
  {
    name: "street-address",
    pattern:
      /\b\d{1,6}\s+[A-Z0-9][\w.'-]*(?:\s+[A-Z0-9][\w.'-]*){0,5}\s+(?:street|st|road|rd|avenue|ave|drive|dr|lane|ln|court|ct|boulevard|blvd|way)\b/i,
  },
  {
    name: "minor-sexual-content",
    pattern:
      /\b(?:underage|minor|child|kid|teen|teenager|13|14|15|16|17)\b[\s\S]{0,120}\b(?:sex|sexual|nude|nudes|porn|assault|molest|rape)\b/i,
  },
  {
    name: "sexual-violence",
    pattern: /\b(?:rape|raped|rapist|sexual assault|molest|molested|incest)\b/i,
  },
  {
    name: "self-harm",
    pattern:
      /\b(?:suicide|suicidal|self[-\s]?harm|kill myself|killed myself|cutting myself)\b/i,
  },
  {
    name: "explicit-slur",
    pattern:
      /\b(?:fag|faggot|tranny|retard|retarded|nigger|nigga|kike|chink|spic|gook)\b/i,
  },
  {
    name: "protected-class-attack",
    pattern:
      /\b(?:all|every|those)\s+(?:women|men|gay|trans|black|white|asian|muslim|jewish|disabled|autistic)\s+(?:are|people are)\s+(?:trash|animals|vermin|inferior|evil)\b/i,
  },
];

main().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const postsUrl = new URL(
    `/r/${options.subreddit}/top.json`,
    REDDIT_BASE,
  );
  postsUrl.searchParams.set("t", options.time);
  postsUrl.searchParams.set("limit", String(options.limit));
  postsUrl.searchParams.set("raw_json", "1");

  console.log(`Fetching top ${options.limit} from r/${options.subreddit}...`);
  const listing = await redditJson(postsUrl);
  const postChildren = listing?.data?.children ?? [];

  const imported = [];
  const rejected = [];

  for (const [index, child] of postChildren.entries()) {
    const post = normalizePost(child?.data);

    if (!post) {
      rejected.push({ source: "unknown", reason: "invalid-post" });
      continue;
    }

    const postSafety = safetyCheck(`${post.title}\n\n${post.body}`);
    if (!postSafety.ok) {
      rejected.push({
        id: post.redditId,
        title: post.title,
        reason: postSafety.reason,
        sourceUrl: post.sourceUrl,
      });
      continue;
    }

    await sleep(options.delayMs);
    let comments;
    try {
      comments = await fetchTopComments(post.permalink, options.comments);
    } catch (error) {
      rejected.push({
        id: post.redditId,
        title: post.title,
        reason: `comments-fetch-failed: ${error.message}`,
        sourceUrl: post.sourceUrl,
      });
      continue;
    }

    imported.push({
      ...post,
      replies: comments.accepted,
      rejectedReplies: comments.rejected,
    });

    const processed = index + 1;
    if (processed % 10 === 0 || processed === postChildren.length) {
      console.log(
        `Processed ${processed}/${postChildren.length}: kept ${imported.length}, rejected ${rejected.length}.`,
      );
    }
  }

  const payload = {
    meta: {
      source: "reddit",
      subreddit: options.subreddit,
      listing: "top",
      time: options.time,
      requestedPosts: options.limit,
      requestedRepliesPerPost: options.comments,
      fetchedAt: new Date().toISOString(),
      notes: [
        "Local development seed only.",
        "Authors are intentionally omitted.",
        "Content is filtered heuristically; review before public use.",
      ],
    },
    posts: imported,
    rejectedPosts: rejected,
  };

  const outPath = path.resolve(process.cwd(), options.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(
    `Wrote ${imported.length} posts to ${options.out}; rejected ${rejected.length} posts.`,
  );
}

function normalizePost(post) {
  if (!post || post.is_self !== true) return null;
  if (post.over_18 || post.spoiler) return null;
  if (post.removed_by_category || post.removed_by) return null;
  if (post.locked || post.stickied) return null;

  const body = cleanText(post.selftext);
  const title = cleanText(post.title);

  if (removedText.has(body.toLowerCase()) || removedText.has(title.toLowerCase())) {
    return null;
  }

  return {
    redditId: post.id,
    sourceUrl: `${REDDIT_BASE}${post.permalink}`,
    permalink: post.permalink,
    title,
    body,
    score: post.score ?? 0,
    upvoteRatio: post.upvote_ratio ?? null,
    commentCount: post.num_comments ?? 0,
    createdAt: new Date((post.created_utc ?? 0) * 1000).toISOString(),
  };
}

async function fetchTopComments(permalink, maxComments) {
  const commentsUrl = new URL(`${permalink}.json`, REDDIT_BASE);
  commentsUrl.searchParams.set("sort", "top");
  commentsUrl.searchParams.set("limit", "20");
  commentsUrl.searchParams.set("depth", "1");
  commentsUrl.searchParams.set("raw_json", "1");

  const thread = await redditJson(commentsUrl);
  const comments = thread?.[1]?.data?.children ?? [];
  const accepted = [];
  const rejected = [];

  for (const child of comments) {
    if (accepted.length >= maxComments) break;
    if (child.kind !== "t1") continue;

    const comment = child.data;
    if (!comment || comment.stickied || comment.collapsed_because_crowd_control) {
      continue;
    }

    const body = cleanText(comment.body);
    if (removedText.has(body.toLowerCase())) {
      rejected.push({ id: comment?.id, reason: "deleted-or-removed" });
      continue;
    }

    const safety = safetyCheck(body);
    if (!safety.ok) {
      rejected.push({ id: comment?.id, reason: safety.reason });
      continue;
    }

    accepted.push({
      redditId: comment.id,
      body,
      score: comment.score ?? 0,
      verdict: body.match(verdictPattern)?.[1]?.toUpperCase() ?? null,
      sourceUrl: `${REDDIT_BASE}${comment.permalink}`,
      createdAt: new Date((comment.created_utc ?? 0) * 1000).toISOString(),
    });
  }

  return { accepted, rejected };
}

async function redditJson(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });

  if (response.status === 429 && attempt < options.retries) {
    const retryAfter = Number(response.headers.get("retry-after"));
    const backoffMs = Number.isFinite(retryAfter)
      ? retryAfter * 1000
      : attempt * 5000;
    console.log(
      `Reddit rate-limited ${url.pathname}; retrying in ${Math.round(backoffMs / 1000)}s (${attempt}/${options.retries}).`,
    );
    await sleep(backoffMs);
    return redditJson(url, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Reddit returned ${response.status} for ${url.pathname}: ${body.slice(0, 180)}`,
    );
  }

  return response.json();
}

function safetyCheck(text) {
  for (const { name, pattern } of unsafePatterns) {
    if (pattern.test(text)) {
      return { ok: false, reason: name };
    }
  }

  return { ok: true };
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;

    const [key, inlineValue] = arg.slice(2).split("=");
    parsed[key] = inlineValue ?? argv[index + 1] ?? true;

    if (inlineValue === undefined && argv[index + 1]?.startsWith("--") === false) {
      index += 1;
    }
  }

  return parsed;
}

function numberArg(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
