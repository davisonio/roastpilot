import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "../src/generated/prisma";
import { VERDICTS, type Verdict } from "../src/lib/verdicts";

const TARGET_TOTAL = Number(process.env.TARGET_TOTAL ?? 100);
const BATCH = 10;
const MODEL = "claude-sonnet-4-6";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY missing. Add it to .env then re-run.");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const prisma = new PrismaClient();

type GeneratedPost = {
  authorName: string;
  title: string;
  body: string;
  aiVerdict: Verdict;
  aiResponse: string;
  comments: { authorName: string; verdict: Verdict; body: string }[];
};

const SYSTEM = `You generate seed content for "Roastpilot", an Am I The Asshole platform.

Output ONE valid JSON array of ${BATCH} post objects. Each post object has this exact shape:

{
  "authorName": "<reddit-style throwaway handle, lowercase, underscores ok, no u/ prefix>",
  "title": "<starts with 'AITA for ...', under 120 chars, no surrounding quotes>",
  "body": "<2-4 short paragraphs, first-person, specific, vivid, ends with 'AITA?' or similar>",
  "aiVerdict": "<one of: YTA, NTA, ESH, NAH, INFO>",
  "aiResponse": "<2 short paragraphs, blunt Reddit AITA tone, judgmental but fair, no verdict-code prefix>",
  "comments": [
    {"authorName": "<handle>", "verdict": "<verdict code>", "body": "<1-3 sentences, distinct take>"},
    {"authorName": "<handle>", "verdict": "<verdict code>", "body": "<1-3 sentences, distinct take>"},
    {"authorName": "<handle>", "verdict": "<verdict code>", "body": "<1-3 sentences, distinct take>"}
  ]
}

Rules:
- Each post must be a different topic. Mix everyday life: family, weddings, roommates, work, food, pets, friendship, money, etiquette, neighbors, gym, dating.
- Avoid the topics you've already seen in your context.
- Tone: dry, funny, specific. NEVER use em-dashes (use commas, semicolons, or "—" written as a regular hyphen). NEVER use the word "wholesome".
- The 3 human comments must include at least 2 different verdicts (the crowd disagrees).
- Output ONLY the JSON array. No prose, no markdown, no code fences.`;

async function generateBatch(seenTitles: string[]): Promise<GeneratedPost[]> {
  const userMsg = `Generate ${BATCH} new AITA posts for the seed. Avoid topics that overlap with these existing titles:\n${seenTitles.map((t) => `- ${t}`).join("\n")}`;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{ role: "user", content: userMsg }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const json = extractJsonArray(text);
  const parsed = JSON.parse(json) as GeneratedPost[];

  for (const p of parsed) {
    if (!VERDICTS.includes(p.aiVerdict)) throw new Error(`Bad aiVerdict: ${p.aiVerdict}`);
    for (const c of p.comments) {
      if (!VERDICTS.includes(c.verdict)) throw new Error(`Bad comment verdict: ${c.verdict}`);
    }
  }
  return parsed;
}

function extractJsonArray(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("[")) return trimmed;
  const m = trimmed.match(/\[[\s\S]*\]/);
  if (!m) throw new Error(`No JSON array in model output: ${text.slice(0, 200)}`);
  return m[0];
}

async function main() {
  const existing = await prisma.post.count();
  console.log(`Currently ${existing} posts. Target: ${TARGET_TOTAL}.`);
  if (existing >= TARGET_TOTAL) {
    console.log("Already at target. Nothing to do.");
    return;
  }

  const seenTitles = (await prisma.post.findMany({ select: { title: true } })).map((p) => p.title);

  const needed = TARGET_TOTAL - existing;
  const batches = Math.ceil(needed / BATCH);
  console.log(`Generating ${batches} batches of ${BATCH}...`);

  for (let i = 0; i < batches; i++) {
    process.stdout.write(`  batch ${i + 1}/${batches}: `);
    try {
      const posts = await generateBatch(seenTitles.slice(0, 30));
      for (const post of posts) {
        const created = await prisma.post.create({
          data: {
            authorName: post.authorName.replace(/^u\//, "").slice(0, 32),
            title: post.title.slice(0, 200),
            body: post.body,
            aiVerdict: post.aiVerdict,
            aiResponse: post.aiResponse,
            isSeed: true,
          },
        });
        await prisma.comment.createMany({
          data: post.comments.map((c) => ({
            postId: created.id,
            authorName: c.authorName.replace(/^u\//, "").slice(0, 32),
            verdict: c.verdict,
            body: c.body,
            isSeed: true,
          })),
        });
        seenTitles.push(post.title);
      }
      console.log(`✓ ${posts.length} posts`);
    } catch (err) {
      console.log(`✗ ${(err as Error).message}`);
    }
  }

  const finalCount = await prisma.post.count();
  console.log(`Done. ${finalCount} posts in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
