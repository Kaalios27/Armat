import { after } from "next/server";
import type { ExamResponses } from "@/server/exam/types";
import { handler, readJson, tzHint } from "@/server/http";
import { runExamGrading, saveExam } from "@/server/services/exam";

export const maxDuration = 120;

export const POST = handler<{ id: string }>(async (req, { id }) => {
  const body = await readJson<{ responses?: ExamResponses; elapsedMs?: number }>(req);
  const res = await saveExam(id, { responses: body.responses, elapsedMs: body.elapsedMs });
  if (res.status === "submitted") {
    const tz = await tzHint();
    after(() => runExamGrading(id, tz));
  }
  return res;
});
