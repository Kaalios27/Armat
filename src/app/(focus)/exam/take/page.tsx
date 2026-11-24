"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { PageError, useLoad } from "@/components/data";
import { ExamRunner, type ExamState } from "@/components/exam/runner";
import { api } from "@/core/api";

export default function ExamTakePage() {
  return (
    <Suspense fallback={null}>
      <TakeExam />
    </Suspense>
  );
}

function TakeExam() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const { data: exam, error, reload } = useLoad(() => api.exam.get(id), [id]);
  const done = exam?.status === "submitted" || exam?.status === "graded";
  useEffect(() => {
    if (done) router.replace(`/exam/results?id=${id}`);
  }, [done, id, router]);
  if (error) {
    return (
      <div className="mx-auto max-w-[620px] px-4 pt-10">
        <PageError onRetry={reload} />
      </div>
    );
  }
  if (!exam || done) return null;
  return <ExamRunner initial={exam as unknown as ExamState} />;
}
