import { anthropic, VERDICT_MODEL, MODERATION_MODEL } from "./anthropic";
import { systemPromptFor, MODERATION_PROMPT } from "./prompts";
import type { Severity, Verdict } from "@/db/schema";

export type ParsedVerdict = {
  verdict: Verdict;
  confidence: number;
  opinion: string;
  reasoning: string[];
};

export async function moderate(
  body: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const resp = await anthropic.messages.create({
    model: MODERATION_MODEL,
    max_tokens: 60,
    system: [
      {
        type: "text",
        text: MODERATION_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: body }],
  });

  const text =
    resp.content[0]?.type === "text" ? resp.content[0].text.trim() : "";

  if (text.startsWith("APPROVE")) return { ok: true };
  const reason = text.startsWith("BLOCK:")
    ? text.slice("BLOCK:".length).trim()
    : "blocked by moderation";
  return { ok: false, reason };
}

export function parseVerdictJson(raw: string): ParsedVerdict | null {
  // Strip code fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<ParsedVerdict>;
    if (!parsed.verdict || !parsed.opinion) return null;
    return {
      verdict: parsed.verdict,
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 60,
      opinion: parsed.opinion,
      reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : [],
    };
  } catch {
    return null;
  }
}

export async function streamVerdict(
  body: string,
  severity: Severity,
  onDelta: (chunk: string) => void,
): Promise<ParsedVerdict | null> {
  const stream = await anthropic.messages.stream({
    model: VERDICT_MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: systemPromptFor(severity),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Render verdict for the following submission. Output JSON only, in a code fence.\n\nSubmission:\n"""\n${body}\n"""`,
      },
    ],
  });

  let full = "";
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      full += event.delta.text;
      onDelta(event.delta.text);
    }
  }

  return parseVerdictJson(full);
}
