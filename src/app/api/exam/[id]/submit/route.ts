import { after } from "next/server";
import type { ExamResponses } from "@/server/exam/types";
import { handler, readJson, tzHint } from "@/server/http";
import { runExamGrading, saveExam, submitExam } from "@/server/services/exam";

export const maxDuration = 120;

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ responses?: ExamResponses; elapsedMs?: number }>(req);
  await saveExam(id, { responses: body.responses, elapsedMs: body.elapsedMs });
  await submitExam(id);
  const tz = await tzHint();
  after(() => runExamGrading(id, tz));
  return { status: "submitted" };
});
