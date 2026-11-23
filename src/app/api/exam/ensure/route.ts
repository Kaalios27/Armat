import { after } from "next/server";
import { handler, readJson, tzHint } from "@/server/http";
import { ensureExam, runExamGeneration } from "@/server/services/exam";
import { HttpError } from "@/server/services/session";

export const maxDuration = 120;

export const POST = handler(async (req) => {
  const body = await readJson<{ weekOf?: string }>(req);
  if (!body.weekOf || !/^\d{4}-\d{2}-\d{2}$/.test(body.weekOf)) throw new HttpError(400, "weekOf is required");
  const tz = await tzHint();
  const exam = await ensureExam(body.weekOf, tz);
  if (exam.status === "generating" || exam.status === "failed") after(() => runExamGeneration(exam.id, tz));
  return { id: exam.id, status: exam.status };
});
