/**
 * Time and calendar utilities. Learning days are local dates (YYYY-MM-DD) in
 * the learner's time zone. Tests replace the clock with setClock().
 */

let clockFn: () => Date = defaultClock;

function defaultClock(): Date {
  // A simulated date for development only (NEXT_PUBLIC_ARMAT_FAKE_NOW in .env.local).
  const fake = process.env.NODE_ENV !== "production" ? (process.env.NEXT_PUBLIC_ARMAT_FAKE_NOW ?? process.env.ARMAT_FAKE_NOW) : undefined;
  if (fake) {
    const base = Date.parse(fake);
    if (!Number.isNaN(base)) {
      // Fake start time that keeps flowing in real time.
      const started = (globalThis as { __armatClockStart?: number }).__armatClockStart ?? Date.now();
      (globalThis as { __armatClockStart?: number }).__armatClockStart = started;
      return new Date(base + (Date.now() - started));
    }
  }
  return new Date();
}

export function now(): Date {
  return clockFn();
}

export function setClock(fn: (() => Date) | null): void {
  clockFn = fn ?? defaultClock;
}

export function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function localDate(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

function parts(date: string): [number, number, number] {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return [y, m, d];
}

/** 0 = Sunday ... 6 = Saturday. */
export function weekday(date: string): number {
  const [y, m, d] = parts(date);
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = parts(date);
  return new Date(Date.UTC(y, m - 1, d + n, 12)).toISOString().slice(0, 10);
}

export function diffDays(a: string, b: string): number {
  const [y1, m1, d1] = parts(a);
  const [y2, m2, d2] = parts(b);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

function tzOffsetMs(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** The instant at which a local date starts in a time zone. */
export function startOfLocalDay(date: string, tz: string): Date {
  const [y, m, d] = parts(date);
  const guess = Date.UTC(y, m - 1, d, 0, 0, 0);
  const off = tzOffsetMs(new Date(guess), tz);
  let t = guess - off;
  const off2 = tzOffsetMs(new Date(t), tz);
  if (off2 !== off) t = guess - off2;
  return new Date(t);
}

export function endOfLocalDay(date: string, tz: string): Date {
  return startOfLocalDay(addDays(date, 1), tz);
}

export function minutes(n: number): number {
  return n * 60_000;
}
