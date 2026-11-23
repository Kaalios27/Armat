"use client";

import { useState } from "react";
import type { Tense } from "@/lib/conjugation/types";
import { useI18n } from "./i18n";
import { ParadigmTable } from "./study/conj";

export function VerbLookup({ verbs, data }: { verbs: string[]; data: Record<string, Array<{ tense: Tense; forms: Array<string | null> }>> }) {
  const { t } = useI18n();
  const [verb, setVerb] = useState(verbs[0] ?? "");
  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 sm:max-w-[320px]">
        <span className="text-[13px] text-ink-3">{t("conjugation.lookUp")}</span>
        <select
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          className="h-11 rounded-lg border border-line-strong bg-surface px-3 text-[16px] outline-none focus:border-accent"
        >
          {verbs.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-8 sm:grid-cols-2">
        {(data[verb] ?? []).map((d) => (
          <ParadigmTable key={d.tense} verb={verb} tense={d.tense} forms={d.forms} />
        ))}
      </div>
    </div>
  );
}
