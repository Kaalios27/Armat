import { handler } from "@/server/http";
import { examForTaking, startExam } from "@/server/services/exam";

export const POST = handler<{ id: string }>(async (_req, { id }) => {
  await startExam(id);
  return examForTaking(id);
});
