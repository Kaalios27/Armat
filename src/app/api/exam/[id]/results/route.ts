import { after } from "next/server";
import { handler, tzHint } from "@/server/http";
import { examResults, runExamGrading } from "@/server/services/exam";

export const maxDuration = 120;

export const GET = handler<{ id: string }>(async (_req, { id }) => {
  const r = await examResults(id);
  // Resume grading that was interrupted (for example by a cold start).
  if (r.status === "submitted" && r.submittedAt && Date.now() - new Date(r.submittedAt).getTime() > 90_000) {
    const tz = await tzHint();
    after(() => runExamGrading(id, tz));
  }
  return r;
});
