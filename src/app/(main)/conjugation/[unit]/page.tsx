import { notFound } from "next/navigation";
import { CONJUGATION_UNITS } from "@/content";
import { getUnit } from "@/content/conjugation";
import { UnitView } from "./view";

export const dynamicParams = false;

export function generateStaticParams() {
  return CONJUGATION_UNITS.map((u) => ({ unit: u.id }));
}

export default async function UnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = await params;
  if (!getUnit(unit)) notFound();
  return <UnitView unitId={unit} />;
}
