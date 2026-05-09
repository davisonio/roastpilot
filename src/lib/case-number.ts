// Case numbers are human-friendly displays for submissions.
// Start at 71849 to match the mockup; increment from the max in the table.

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";

const FLOOR = 71849;

export function nextCaseNumber(): number {
  const row = db
    .select({ max: sql<number | null>`max(${submissions.caseNumber})` })
    .from(submissions)
    .get();
  const current = row?.max ?? 0;
  return Math.max(FLOOR, current + 1);
}
