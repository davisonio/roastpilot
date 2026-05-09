import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const VERDICT_MODEL = "claude-sonnet-4-6";
export const MODERATION_MODEL = "claude-haiku-4-5-20251001";
