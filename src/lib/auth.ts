import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "hh_session";
const SESSION_DAYS = 14;

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set to a long random string");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

export async function readSessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const fullName =
      typeof payload.fullName === "string" ? payload.fullName : null;
    const role = payload.role === "ADMIN" || payload.role === "CUSTOMER"
      ? payload.role
      : null;
    if (!sub || !email || !fullName || !role) return null;
    return { id: sub, email, fullName, role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(
    SESSION_COOKIE,
    token,
    sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60),
  );
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", sessionCookieOptions(0));
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await readSessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, fullName: true, role: true },
  });
  return user;
}

export async function requireUser(): Promise<
  { user: SessionUser } | { response: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user };
}

export async function requireAdmin(): Promise<
  { user: SessionUser } | { response: NextResponse }
> {
  const result = await requireUser();
  if ("response" in result) return result;
  if (result.user.role !== "ADMIN") {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return result;
}

/** Server pages under /dashboard — redirect guests and non-admins. */
export async function requireAdminPage(
  nextPath = "/dashboard",
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}

export function publicUser(user: SessionUser) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}
