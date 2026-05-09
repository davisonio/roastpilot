// Client-safe constants and types only. Server-side adjust/spend lives in
// `points-server.ts`.

export const POINTS = {
  // signup
  signupBonus: 100,
  pohBonus: 50,

  // engagement
  participation: 1, // submit a roast
  fireReaction: 1, // someone fired your roast
  dailyLogin: 5,

  // selection multipliers — applied to bounty pool, not flat values
  rank1Share: 0.5,
  rank2Share: 0.3,
  rank3Share: 0.2,

  // floor for seed/free requests so leaderboard isn't hollow
  minPoolPoints: 30,
} as const;

export type PointsReason =
  | "signupBonus"
  | "pohBonus"
  | "participation"
  | "fireReaction"
  | "dailyLogin"
  | "rank1"
  | "rank2"
  | "rank3"
  | "manual";

/**
 * Turn a bounty (in cents) + rank into the points awarded.
 * 100 cents = 100 points pool. Top 3 split 50/30/20 of pool.
 * Seeded / $0 bounties get a minimum pool so the leaderboard reflects history.
 */
export function pointsForRank(
  bountyCents: number,
  rank: 1 | 2 | 3,
  opts: { seeded?: boolean } = {},
): number {
  const pool = Math.max(
    opts.seeded ? POINTS.minPoolPoints : POINTS.minPoolPoints,
    bountyCents,
  );
  const share =
    rank === 1
      ? POINTS.rank1Share
      : rank === 2
        ? POINTS.rank2Share
        : POINTS.rank3Share;
  return Math.round(pool * share);
}
