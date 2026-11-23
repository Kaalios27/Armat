import { notFound, redirect } from "next/navigation";
import { ExamRunner, type ExamState } from "@/components/exam/runner";
import { examForTaking } from "@/server/services/exam";
import { HttpError } from "@/server/services/session";

export const dynamic = "force-dynamic";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let exam: ExamState;
  try {
    exam = (await examForTaking(id)) as unknown as ExamState;
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) notFound();
    throw err;
  }
  if (exam.status === "submitted" || exam.status === "graded") redirect(`/exam/${id}/results`);
  return <ExamRunner initial={exam} />;
}
