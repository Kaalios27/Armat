/**
 * Weekly calendar: study Monday to Saturday, examination on Sunday, a
 * cumulative examination every fourth Sunday.
 */
import { addDays, diffDays, weekday } from "./clock";

export type DayKind = "study" | "exam";
export type ExamKind = "weekly" | "monthly";

export function isSunday(date: string): boolean {
  return weekday(date) === 0;
}

/**
 * Sunday is examination day once the program has started on an earlier day.
 * On the very first day of the program any day, Sunday included, starts study.
 */
export function dayKind(date: string, startedOn: string | null): DayKind {
  return isSunday(date) && !!startedOn && startedOn < date ? "exam" : "study";
}

/** The first examination Sunday: the first Sunday strictly after the start date. */
export function firstExamSunday(startedOn: string): string {
  let d = addDays(startedOn, 1);
  while (!isSunday(d)) d = addDays(d, 1);
  return d;
}

/** The Sunday on or after `date`. */
export function sundayOnOrAfter(date: string): string {
  let d = date;
  while (!isSunday(d)) d = addDays(d, 1);
  return d;
}

/** The most recent Sunday strictly before `date`. */
export function previousSunday(date: string): string {
  let d = addDays(date, -1);
  while (!isSunday(d)) d = addDays(d, -1);
  return d;
}

export function examNumber(sunday: string, startedOn: string): number {
  return Math.floor(diffDays(firstExamSunday(startedOn), sunday) / 7) + 1;
}

export function examKind(number: number): ExamKind {
  return number > 0 && number % 4 === 0 ? "monthly" : "weekly";
}

/** The study days covered by an exam: Monday to Saturday before it (clipped to the start date). */
export function examWindow(sunday: string, startedOn: string | null): { from: string; to: string } {
  const from = addDays(sunday, -6);
  return { from: startedOn && startedOn > from ? startedOn : from, to: addDays(sunday, -1) };
}

/** The four-week window of a monthly exam. */
export function monthlyWindow(sunday: string, startedOn: string | null): { from: string; to: string } {
  const from = addDays(sunday, -27);
  return { from: startedOn && startedOn > from ? startedOn : from, to: addDays(sunday, -1) };
}

/** The exam that concerns `today`: today's on Sunday, otherwise the next one. */
export function upcomingExamSunday(today: string, startedOn: string | null): string | null {
  if (!startedOn) return null;
  const first = firstExamSunday(startedOn);
  const next = sundayOnOrAfter(today);
  return next < first ? first : next;
}

/** A missed exam can be taken late during the following six days. */
export function lateExamSunday(today: string, startedOn: string | null): string | null {
  if (!startedOn || isSunday(today)) return null;
  const prev = previousSunday(today);
  return prev >= firstExamSunday(startedOn) ? prev : null;
}
