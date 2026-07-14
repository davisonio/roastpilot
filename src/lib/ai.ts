import Anthropic from "@anthropic-ai/sdk";
import type { Verdict } from "./verdicts";

const MODEL = "claude-opus-4-6";

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env to enable AI verdicts.");
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const SYSTEM_PROMPT = `You are the AI judge for "Roastpilot", an Am I The Asshole (AITA) style platform.

Read the post and return a JSON verdict in EXACTLY this format:
{"verdict": "YTA" | "NTA" | "ESH" | "NAH" | "INFO", "response": "<2 short paragraphs>"}

Verdict codes:
- YTA = You're The Asshole (the poster was in the wrong)
- NTA = Not The Asshole (the poster did nothing wrong)
- ESH = Everyone Sucks Here (everyone behaved badly)
- NAH = No Assholes Here (just a misunderstanding, nobody at fault)
- INFO = Not Enough Info to judge

Tone: Reddit AITA style. Blunt, judgmental, witty, fair. Call people out directly when they're wrong, defend them when they're not. Two short paragraphs max — first paragraph is the take, second is the why. Do NOT prefix the response with the verdict code; the code goes in the JSON field.

Output ONLY the raw JSON object. No markdown, no code fences, no preamble.`;

export type VerdictResult = { verdict: Verdict; response: string };

export async function generateVerdict(title: string, body: string): Promise<VerdictResult> {
  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Title: ${title}\n\n${body}`,
      },
    ],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const json = extractJson(text);
  const parsed = JSON.parse(json) as VerdictResult;
  return parsed;
}

export async function* streamVerdict(
  title: string,
  body: string,
): AsyncGenerator<{ delta: string } | { done: VerdictResult }> {
  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Title: ${title}\n\n${body}` }],
  });

  let full = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      full += event.delta.text;
      yield { delta: event.delta.text };
    }
  }

  const json = extractJson(full);
  const parsed = JSON.parse(json) as VerdictResult;
  yield { done: parsed };
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Could not parse JSON from model output: ${text.slice(0, 200)}`);
  return match[0];
}
