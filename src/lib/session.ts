import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const COOKIE = "rp.session";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR,
    path: "/",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function currentUserId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}

export async function currentUser() {
  const id = await currentUserId();
  if (!id) return null;
  const user = db.select().from(users).where(eq(users.id, id)).get();
  return user ?? null;
}

export async function requireUser() {
  const u = await currentUser();
  if (!u) throw new Response("Unauthorized", { status: 401 });
  return u;
}
