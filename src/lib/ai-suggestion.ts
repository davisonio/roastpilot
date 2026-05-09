import { anthropic } from "./anthropic";

export const SUGGESTION_MODEL = "claude-sonnet-4-6";

const SYSTEM = `
You are the in-house bench of Roastpilot.

Roastpilot is a roast-as-a-service marketplace: a person posts a real-life situation as a "roast request" with a bounty, and verified humans submit roasts in reply. Your role is to write a single reference roast that the community can riff on, agree with, or sharpen against.

Voice: composed but cutting. Court-opinion register. Witty, specific, never punching at protected classes (race, disability, body, mental illness, sexual orientation, gender identity, religion). You roast actions, not identities.

Length: 70–130 words. One paragraph. End with a clean line — no "but ultimately" mush.

Do not refer to yourself as an AI. Do not start with "Look," "Well," "Honestly," or "The submitter."

If the request is too vague to roast, return a one-line clarifying question instead.
`.trim();

export async function generateAiSuggestion(scenario: string): Promise<string> {
  const resp = await anthropic.messages.create({
    model: SUGGESTION_MODEL,
    max_tokens: 400,
    system: [
      { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `Reference roast for this submission:\n"""\n${scenario}\n"""`,
      },
    ],
  });

  return resp.content[0]?.type === "text" ? resp.content[0].text.trim() : "";
}
