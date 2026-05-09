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
  handle: text("handle").unique(), // optional — anon by default
  pohVerified: integer("poh_verified", { mode: "boolean" }).notNull().default(false),
  // ember reputation: count of takes that hit "top take" status
  emberReputation: integer("ember_reputation").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const submissions = sqliteTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    body: text("body").notNull(),
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
