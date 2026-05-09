// Client-safe constants and types only. Server-side adjust/spend lives in
// `points-server.ts` (separated so client bundles don't pull in the SQLite
// driver via the db import).

export const POINTS = {
  signupBonus: 1000,
  submitHouse: -50,
  submitNuclear: -200,
  pleadYourCase: -75,
  askFollowUp: -100,
  topTakeReward: 25,
  fireReaction: 1,
  dailyLogin: 10,
} as const;

export type PointsReason = keyof typeof POINTS | "manual";
