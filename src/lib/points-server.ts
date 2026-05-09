import "server-only";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { users, pointsLedger } from "@/db/schema";
import type { PointsReason } from "./points";

export class InsufficientPointsError extends Error {
  constructor(public have: number, public need: number) {
    super(`Need 🔥${need}, have 🔥${have}`);
  }
}

export function adjustPoints(opts: {
  userId: string;
  delta: number;
  reason: PointsReason;
  refId?: string;
}): { balance: number } {
  const { userId, delta, reason, refId } = opts;

  return db.transaction((tx) => {
    const user = tx.select().from(users).where(eq(users.id, userId)).get();
    if (!user) throw new Error("user not found");

    if (delta < 0 && user.roastPoints + delta < 0) {
      throw new InsufficientPointsError(user.roastPoints, -delta);
    }

    tx.insert(pointsLedger)
      .values({
        id: nanoid(12),
        userId,
        delta,
        reason,
        refId,
      })
      .run();

    tx.update(users)
      .set({ roastPoints: sql`${users.roastPoints} + ${delta}` })
      .where(eq(users.id, userId))
      .run();

    return { balance: user.roastPoints + delta };
  });
}
