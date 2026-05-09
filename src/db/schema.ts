import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ---------- enums (string unions, kept here so client + server agree) -----

export const VERDICTS = ["NTA", "YTA", "ESH", "NAH", "INFO"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const REQUEST_STATUSES = ["open", "judged", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "refunded",
  "seeded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CURRENCIES = ["usd", "sol", "seed"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const PAYMENT_PROVIDERS = ["stripe", "solana", "seed"] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

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

// ---------- users ----------------------------------------------------------

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),

  // identity options — at least one is set:
  walletAddress: text("wallet_address").unique(), // Solana
  email: text("email").unique(), // Stripe-only requesters
  handleSol: text("handle_sol").notNull().unique(), // display handle

  // verification
  pohVerified: integer("poh_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  roasterVerified: integer("roaster_verified", { mode: "boolean" })
    .notNull()
    .default(false),

  // economy
  roastPoints: integer("roast_points").notNull().default(0),
  roastsWon: integer("roasts_won").notNull().default(0),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ---------- roast requests (the bounties) ---------------------------------

export const roastRequests = sqliteTable(
  "roast_requests",
  {
    id: text("id").primaryKey(),
    caseNumber: integer("case_number").notNull(),

    requesterId: text("requester_id").references(() => users.id),
    requesterEmail: text("requester_email"), // Stripe-only requesters

    scenario: text("scenario").notNull(),
    category: text("category", { enum: CATEGORIES })
      .notNull()
      .default("other"),

    // economy
    bountyCents: integer("bounty_cents").notNull().default(0),
    currency: text("currency", { enum: CURRENCIES }).notNull().default("usd"),
    paymentStatus: text("payment_status", { enum: PAYMENT_STATUSES })
      .notNull()
      .default("pending"),
    paymentProvider: text("payment_provider", { enum: PAYMENT_PROVIDERS }),
    paymentRef: text("payment_ref"),

    // AI assist surfaced to roasters as inspiration
    aiSuggestion: text("ai_suggestion"),

    // moderation
    moderationStatus: text("moderation_status", {
      enum: ["pending", "approved", "blocked"] as const,
    })
      .notNull()
      .default("approved"),
    moderationReason: text("moderation_reason"),

    // lifecycle
    status: text("status", { enum: REQUEST_STATUSES })
      .notNull()
      .default("open"),
    judgedAt: integer("judged_at", { mode: "timestamp" }),
    deadline: integer("deadline", { mode: "timestamp" }),

    // reddit-seed traceability (null for live requests)
    redditId: text("reddit_id"),
    redditVerdict: text("reddit_verdict", { enum: VERDICTS }),
    redditScore: integer("reddit_score"),
    redditUrl: text("reddit_url"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    statusIdx: index("requests_status_idx").on(t.status),
    paymentIdx: index("requests_payment_idx").on(t.paymentStatus),
    createdIdx: index("requests_created_idx").on(t.createdAt),
  }),
);

// ---------- roasts (the replies) -------------------------------------------

export const roasts = sqliteTable(
  "roasts",
  {
    id: text("id").primaryKey(),
    requestId: text("request_id")
      .notNull()
      .references(() => roastRequests.id, { onDelete: "cascade" }),
    roasterId: text("roaster_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    body: text("body").notNull(),
    embers: integer("embers").notNull().default(0),

    // selection
    rank: integer("rank"), // null until selected; 1, 2, 3 for top 3
    pointsAwarded: integer("points_awarded").notNull().default(0),

    // reddit metadata for seeded roasts
    redditScore: integer("reddit_score"),
    redditId: text("reddit_id"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    requestIdx: index("roasts_request_idx").on(t.requestId),
    roasterIdx: index("roasts_roaster_idx").on(t.roasterId),
    rankIdx: index("roasts_rank_idx").on(t.rank),
  }),
);

// ---------- payments (audit log) ------------------------------------------

export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    requestId: text("request_id")
      .notNull()
      .references(() => roastRequests.id, { onDelete: "cascade" }),
    provider: text("provider", { enum: PAYMENT_PROVIDERS }).notNull(),
    externalRef: text("external_ref").notNull(), // session id, tx sig, etc.
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency", { enum: CURRENCIES }).notNull(),
    status: text("status", { enum: PAYMENT_STATUSES }).notNull(),
    rawPayload: text("raw_payload"), // JSON snapshot of provider response
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    requestIdx: index("payments_request_idx").on(t.requestId),
  }),
);

// ---------- points ledger (append-only) -----------------------------------

export const pointsLedger = sqliteTable(
  "points_ledger",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    refId: text("ref_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => ({
    userIdx: index("ledger_user_idx").on(t.userId),
  }),
);
