import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// On Vercel (and any read-only fs), the bundled roastpilot.db lives next to
// the serverless function. Open it read-only so reads work; writes will throw,
// which is intentional for the deployed demo.
const isVercel = !!process.env.VERCEL;
const dbPath =
  process.env.DATABASE_URL ??
  (isVercel
    ? path.join(process.cwd(), "roastpilot.db")
    : "roastpilot.db");

const sqlite = new Database(dbPath, {
  readonly: isVercel,
  fileMustExist: isVercel,
});

if (!isVercel) {
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
}

export const db = drizzle(sqlite, { schema });
export { schema };
