import { notFound } from "next/navigation";
import { GRAMMAR_CONCEPTS } from "@/content";
import { ConceptView } from "./view";

export const dynamicParams = false;

export function generateStaticParams() {
  return GRAMMAR_CONCEPTS.map((c) => ({ concept: c.id }));
}

export default async function ConceptPage({ params }: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  if (!GRAMMAR_CONCEPTS.some((c) => c.id === concept)) notFound();
  return <ConceptView id={concept} />;
}
