/**
 * Single-learner access control: a password from APP_PASSWORD and an
 * HMAC-signed, HTTP-only session cookie. Uses Web Crypto so it runs in the
 * proxy and in route handlers alike.
 */

export const SESSION_COOKIE = "armat_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type AuthMode = "disabled" | "enabled" | "misconfigured";

/** Without APP_PASSWORD, access is open in development and refused in production. */
export function authMode(): AuthMode {
  const prod = process.env.NODE_ENV === "production";
  if (process.env.APP_PASSWORD) {
    if (prod && (process.env.SESSION_SECRET ?? "").length < 32) return "misconfigured";
    return "enabled";
  }
  return prod ? "misconfigured" : "disabled";
}

function secret(): string {
  return process.env.SESSION_SECRET || `dev-only:${process.env.APP_PASSWORD ?? ""}`;
}

const enc = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(nowMs = Date.now()): Promise<string> {
  const exp = Math.floor(nowMs / 1000) + SESSION_MAX_AGE;
  const payload = `v1.${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined | null, nowMs = Date.now()): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp * 1000 < nowMs) return false;
  return safeEqual(await hmac(`v1.${parts[1]}`), parts[2]!);
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.APP_PASSWORD ?? "";
  if (!expected) return false;
  // Compare digests so the comparison time does not depend on the password length.
  const [a, b] = await Promise.all([hmac(`pw:${input}`), hmac(`pw:${expected}`)]);
  return safeEqual(a, b);
}

// Basic in-memory rate limiting for login attempts (per instance).
const attempts = new Map<string, { count: number; resetAt: number }>();

export function loginAllowed(ip: string, nowMs = Date.now()): boolean {
  const e = attempts.get(ip);
  if (!e || e.resetAt < nowMs) return true;
  return e.count < 10;
}

export function recordLoginFailure(ip: string, nowMs = Date.now()): void {
  const e = attempts.get(ip);
  if (!e || e.resetAt < nowMs) attempts.set(ip, { count: 1, resetAt: nowMs + 15 * 60_000 });
  else e.count++;
}

export function clearLoginFailures(ip: string): void {
  attempts.delete(ip);
}
