import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roastRequests } from "@/db/schema";

const FLOOR = 71849;

export function nextCaseNumber(): number {
  const row = db
    .select({ max: sql<number | null>`max(${roastRequests.caseNumber})` })
    .from(roastRequests)
    .get();
  const current = row?.max ?? 0;
  return Math.max(FLOOR, current + 1);
}
