import { anthropic } from "./anthropic";

const PROMPT = `
You are a pre-publish content filter for Roastpilot, a roast-as-a-service platform.

You return strictly: APPROVE or BLOCK:<reason>.

BLOCK if the submission contains any of:
- A real full name of a non-public person (first + last)
- A specific home address, phone number, or email
- Sexual content involving anyone described as under 18
- A direct threat of violence against a named individual
- Content that solicits harm against a protected class

Otherwise APPROVE. Be permissive on rude behavior, conflict, drama, profanity, and roast-style writing.

Output only "APPROVE" or "BLOCK:<short reason>". No other words.
`.trim();

export const MODERATION_MODEL = "claude-haiku-4-5-20251001";

export async function moderate(
  body: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const resp = await anthropic.messages.create({
    model: MODERATION_MODEL,
    max_tokens: 60,
    system: [
      {
        type: "text",
        text: PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: body }],
  });

  const text =
    resp.content[0]?.type === "text" ? resp.content[0].text.trim() : "";

  if (text.toUpperCase().startsWith("APPROVE")) return { ok: true };
  const reason = text.startsWith("BLOCK:")
    ? text.slice("BLOCK:".length).trim()
    : "blocked";
  return { ok: false, reason };
}
