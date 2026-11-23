import { NextResponse } from "next/server";
import { authMode, checkPassword, clearLoginFailures, createSessionToken, loginAllowed, recordLoginFailure, SESSION_COOKIE, SESSION_MAX_AGE } from "@/server/auth";

export async function POST(req: Request) {
  const mode = authMode();
  if (mode === "misconfigured") return NextResponse.json({ error: "misconfigured" }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!loginAllowed(ip)) return NextResponse.json({ error: "too_many" }, { status: 429 });
  let password = "";
  try {
    password = String(((await req.json()) as { password?: string }).password ?? "");
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (mode === "enabled" && !(await checkPassword(password))) {
    recordLoginFailure(ip);
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "wrong" }, { status: 401 });
  }
  clearLoginFailures(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
