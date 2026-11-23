import { NextResponse, type NextRequest } from "next/server";
import { authMode, SESSION_COOKIE, verifySessionToken } from "./server/auth";

const PUBLIC = ["/login", "/api/auth/login", "/api/health"];

/** Every page and API route requires the session cookie, except the login flow. */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();
  const mode = authMode();
  if (mode === "disabled") return NextResponse.next();
  const isApi = pathname.startsWith("/api/");
  if (mode === "misconfigured") {
    if (isApi) return NextResponse.json({ error: "Access control is not configured (APP_PASSWORD, SESSION_SECRET)." }, { status: 503 });
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
  if (isApi) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const url = new URL("/login", request.url);
  if (pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)"],
};
