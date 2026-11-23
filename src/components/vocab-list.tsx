"use client";

import { useMemo, useState } from "react";
import { stripAllDiacritics } from "@/lib/text";
import { useI18n } from "./i18n";
import { headword, relativeDue } from "./study/shared";
import { TextInput, cn } from "./ui/primitives";

interface Word {
  id: string;
  lemma: string;
  pos: string;
  gender: string | null;
  main: string;
  falseFriend: boolean;
  state: number;
  stability: number;
  lapses: number;
  nextDue: string | null;
}

export function WordList({ words }: { words: Word[] }) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = stripAllDiacritics(q.trim().toLowerCase());
    if (!n) return words;
    return words.filter((w) => stripAllDiacritics(`${w.lemma} ${w.main}`.toLowerCase()).includes(n));
  }, [q, words]);
  const status = (s: number) => (s === 0 ? t("vocab.statusNew") : s === 2 ? t("vocab.statusReview") : t("vocab.statusLearning"));
  const when = (iso: string | null) => (!iso ? "–" : new Date(iso).getTime() <= Date.now() ? t("vocab.dueNow") : (relativeDue(iso, t) ?? "–"));
  return (
    <div className="flex flex-col gap-4">
      <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("vocab.search")} className="sm:max-w-[320px]" aria-label={t("vocab.search")} />
      <table className="w-full text-[15px]">
        <thead>
          <tr className="text-left text-[13px] text-ink-3">
            <th className="py-2 pr-4 font-normal">{t("vocab.word")}</th>
            <th className="py-2 pr-4 font-normal">{t("vocab.meaning")}</th>
            <th className="hidden py-2 pr-4 font-normal sm:table-cell">{t("vocab.status")}</th>
            <th className="hidden py-2 font-normal sm:table-cell">{t("vocab.nextReview")}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 400).map((w) => (
            <tr key={w.id} className="border-t border-line align-top">
              <td className="py-2 pr-4 font-medium" lang="es">
                {headword(w.lemma, w.pos, w.gender)}
              </td>
              <td className="py-2 pr-4 text-ink-2">
                {w.main}
                {w.falseFriend && <span className="ml-2 text-[12px] text-caution">{t("vocab.falseFriend")}</span>}
              </td>
              <td className={cn("hidden py-2 pr-4 sm:table-cell", w.lapses > 1 ? "text-caution" : "text-ink-2")}>{status(w.state)}</td>
              <td className="hidden py-2 text-ink-3 sm:table-cell">{when(w.nextDue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
