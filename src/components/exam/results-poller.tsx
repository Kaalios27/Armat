"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Refreshes the results page until grading finishes. */
export function ResultsPoller({ examId }: { examId: string }) {
  const router = useRouter();
  useEffect(() => {
    const id = window.setInterval(async () => {
      const res = await fetch(`/api/exam/${examId}/results`);
      if (res.ok && ((await res.json()) as { status: string }).status === "graded") router.refresh();
    }, 3000);
    return () => window.clearInterval(id);
  }, [examId, router]);
  return null;
}
