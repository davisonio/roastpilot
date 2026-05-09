import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Verdict tags — AITA-style.
export const VERDICTS = ["NTA", "YTA", "ESH", "NAH", "INFO"] as const;
export type Verdict = (typeof VERDICTS)[number];

// Severity dial on a submission.
export const SEVERITIES = ["house", "nuclear"] as const;
export type Severity = (typeof SEVERITIES)[number];

// Moderation outcome — pre-publish gate.
export const MODERATION_STATUSES = ["pending", "approved", "blocked"] as const;
export type ModerationStatus = (typeof MODERATION_STATUSES)[number];

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  handleSol: text("handle_sol").notNull().unique(), // generated .sol-style handle
  pohVerified: integer("poh_verified", { mode: "boolean" }).notNull().default(false),
  paidSignup: integer("paid_signup", { mode: "boolean" }).notNull().default(false),
  roastPoints: integer("roast_points").notNull().default(0),
  // ember reputation: count of takes that hit "top take" status
  emberReputation: integer("ember_reputation").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Categories shown on submit + Explore feed.
export const CATEGORIES = [
  "relationships",
  "family",
  "work",
  "money",
  "friends",
  "petty",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const submissions = sqliteTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    caseNumber: integer("case_number").notNull(), // human-friendly Case #
    body: text("body").notNull(),
    category: text("category", { enum: CATEGORIES }).notNull().default("other"),
    severity: text("severity", { enum: SEVERITIES }).notNull().default("house"),

    // Pre-publish moderation
    moderationStatus: text("moderation_status", { enum: MODERATION_STATUSES })
      .notNull()
      .default("pending"),
    moderationReason: text("moderation_reason"),

    // AI verdict (filled after streaming completes)
    aiVerdict: text("ai_verdict", { enum: VERDICTS }),
    aiRoast: text("ai_roast"),
    aiReasoning: text("ai_reasoning"), // JSON-encoded array of bullets
    aiConfidence: integer("ai_confidence"), // 0-100

    // Optional submitter wallet (anon submissions allowed)
    submitterId: text("submitter_id").references(() => users.id),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    createdIdx: index("submissions_created_idx").on(t.createdAt),
    moderationIdx: index("submissions_moderation_idx").on(t.moderationStatus),
  }),
);

export const TAKE_TAGS = ["funny", "helpful", "savage"] as const;
export type TakeTag = (typeof TAKE_TAGS)[number];

export const votes = sqliteTable(
  "votes",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    verdict: text("verdict", { enum: VERDICTS }).notNull(),
    take: text("take"), // optional one-line take
    takeTag: text("take_tag", { enum: TAKE_TAGS }), // funny | helpful | savage
    isCounterRoast: integer("is_counter_roast", { mode: "boolean" })
      .notNull()
      .default(false),
    embers: integer("embers").notNull().default(0), // ember count from reactions
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    submissionIdx: index("votes_submission_idx").on(t.submissionId),
    userIdx: index("votes_user_idx").on(t.userId),
  }),
);

// Plead-your-case follow-ups: submitter posts an update; AI re-judges.
export const followUps = sqliteTable("follow_ups", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["plead", "ask"] as const }).notNull(),
  prompt: text("prompt").notNull(),
  aiResponse: text("ai_response"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Append-only points ledger. balance = sum of deltas.
export const pointsLedger = sqliteTable(
  "points_ledger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(), // positive earn, negative spend
    reason: text("reason").notNull(),
    refId: text("ref_id"), // optional submission/vote id
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("ledger_user_idx").on(t.userId),
  }),
);

export const reactions = sqliteTable(
  "reactions",
  {
    id: text("id").primaryKey(),
    voteId: text("vote_id")
      .notNull()
      .references(() => votes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    voteIdx: index("reactions_vote_idx").on(t.voteId),
  }),
);
