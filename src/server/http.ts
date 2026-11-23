import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AIUnavailableError } from "./ai/provider";
import { HttpError } from "./services/session";

export async function tzHint(): Promise<string | undefined> {
  return (await cookies()).get("tz")?.value;
}

export async function readJson<T>(req: Request): Promise<T> {
  // sendBeacon posts text/plain; parse the raw text either way.
  const text = await req.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export function errorResponse(err: unknown): NextResponse {
  if (err instanceof HttpError) return NextResponse.json({ error: err.message }, { status: err.status });
  if (err instanceof AIUnavailableError) return NextResponse.json({ error: err.message, reason: err.reason }, { status: 503 });
  console.error(err);
  return NextResponse.json({ error: "Internal error" }, { status: 500 });
}

type Ctx<P> = { params: Promise<P> };

export function handler<P = Record<string, string>>(fn: (req: Request, params: P) => Promise<unknown>) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      const data = await fn(req, await ctx.params);
      if (data instanceof Response) return data;
      return NextResponse.json(data ?? { ok: true });
    } catch (err) {
      return errorResponse(err);
    }
  };
}
