import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { ResultsPoller } from "@/components/exam/results-poller";
import { Bar, Note, PageTitle, Section } from "@/components/ui/primitives";
import { personLabel, tenseName } from "@/lib/conjugation/labels";
import { formatDate, formatScore } from "@/lib/format";
import { translator, type MessageKey } from "@/lib/i18n/messages";
import { loc } from "@/lib/i18n/types";
import { EXAM_PARTS, type ExamPartKey, type ItemCorrection } from "@/server/exam/types";
import { tzHint } from "@/server/http";
import { examResults } from "@/server/services/exam";
import { getProfile } from "@/server/services/profile";
import { HttpError } from "@/server/services/session";

const CATEGORY_KEYS = new Set(["wrong_person", "wrong_tense", "ending", "irregular", "accent", "stem_change", "pronoun", "other", "grammar", "conjugation", "vocabulary", "orthography", "alternative", "style", "approximate"]);

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile(await tzHint());
  const lang = profile.uiLang;
  const t = translator(lang);
  let r: Awaited<ReturnType<typeof examResults>>;
  try {
    r = await examResults(id);
  } catch (err) {
    if (err instanceof HttpError) notFound();
    throw err;
  }
  const title = r.kind === "monthly" ? t("overview.monthlyExam", { n: r.number }) : t("overview.weeklyExam", { n: r.number });
  const cat = (c: string | null) => {
    if (!c) return null;
    if (c.startsWith("dictation:")) return `${t("exam.parts.dictation")}${t("common.colon")}${t(`exam.dictationErrors.${c.slice(10)}` as MessageKey).toLowerCase()}`;
    return CATEGORY_KEYS.has(c) ? t(`study.categories.${c}` as MessageKey) : c;
  };

  if (r.status !== "graded" || !r.grading) {
    return (
      <div className="enter flex flex-col gap-6">
        <PageTitle aside={formatDate(r.weekOf, lang)}>{title}</PageTitle>
        <div>
          <h2 className="text-[20px] font-medium">{t("exam.grading")}</h2>
          <p className="mt-2 text-[15px] text-ink-2">{t("exam.gradingNote")}</p>
        </div>
        <ResultsPoller examId={id} />
      </div>
    );
  }

  const g = r.grading;
  const content = r.content!;
  const delta = r.score !== null && g.previousScore !== null ? r.score - g.previousScore : null;
  const categories = Object.entries(g.categories).sort((a, b) => b[1] - a[1]);

  const itemRows = (part: ExamPartKey, items: ItemCorrection[], prompt: (i: number) => React.ReactNode) => (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <li key={it.id} className="grid grid-cols-[28px_1fr_auto] gap-3 py-3">
          <span className="tabular text-[13px] text-ink-3">{i + 1}</span>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="text-[15px]">{prompt(i)}</div>
            <div className="text-[15px]">
              <span className="text-ink-3">{t("common.yourAnswer")}{t("common.colon")}</span>
              <span className={it.correct ? "text-positive" : "text-negative"} lang="es">
                {it.answer || "–"}
              </span>
            </div>
            {!it.correct && (
              <div className="text-[15px]">
                <span className="text-ink-3">{part === "translation" ? t("exam.corrected") : t("common.expected")}{t("common.colon")}</span>
                <span lang="es">{it.expected}</span>
              </div>
            )}
            {(it.category || it.explanation) && !it.correct && (
              <div className="text-[14px] text-ink-2">
                {cat(it.category) && <span className="mr-2 font-medium">{cat(it.category)}.</span>}
                {it.explanation}
              </div>
            )}
          </div>
          <span className="tabular text-[14px] text-ink-2">
            {formatScore(it.points)}/{formatScore(it.maxPoints)}
          </span>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="enter flex flex-col gap-10">
      <div>
        <Link href="/exam" className="text-[14px] text-ink-3 hover:text-ink">
          {t("exam.title")}
        </Link>
        <div className="mt-2">
          <PageTitle aside={formatDate(r.weekOf, lang)}>{title}</PageTitle>
        </div>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="tabular text-[44px] font-semibold tracking-[-0.02em]">{formatScore(r.score)}</span>
          <span className="text-[17px] text-ink-3">/ {r.maxScore}</span>
          {delta !== null && <span className="text-[15px] text-ink-2">{t("exam.previous", { delta: `${delta >= 0 ? "+" : ""}${formatScore(Math.round(delta * 10) / 10)}` })}</span>}
        </div>
        {g.provisional && (
          <div className="mt-3">
            <Note tone="caution">{t("exam.provisional")}</Note>
          </div>
        )}
      </div>

      <Section title={t("exam.bySection")}>
        <ul className="flex flex-col gap-4">
          {EXAM_PARTS.map((p) => {
            const s = g.parts[p];
            return (
              <li key={p} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[160px_1fr_90px]">
                <span className="text-[15px]">{t(`exam.parts.${p}`)}</span>
                <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-1 sm:col-start-2">
                  <Bar value={s.score === null ? 0 : s.score / s.max} />
                </span>
                <span className="tabular text-right text-[15px] text-ink-2">{s.score === null ? t("exam.notGraded") : `${formatScore(s.score)} / ${s.max}`}</span>
              </li>
            );
          })}
        </ul>
      </Section>

      {categories.length > 0 && (
        <Section title={t("exam.errorAnalysis")}>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {categories.map(([c, n]) => (
              <li key={c} className="flex justify-between border-b border-line py-1.5 text-[15px]">
                <span>{cat(c)}</span>
                <span className="tabular text-ink-2">{n}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {g.recommendations.length > 0 && (
        <Section title={t("exam.recommended")}>
          <ul className="flex flex-col gap-2">
            {g.recommendations.map((rec) => (
              <li key={rec.conceptId}>
                <Link href={rec.conceptId.startsWith("c-") ? `/conjugation/${rec.conceptId}` : `/grammar/${rec.conceptId}`} className="text-[16px] hover:underline">
                  {loc(rec.title, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={`${t("exam.corrections")}${t("common.colon")}${t("exam.parts.dictation")}`}>
        {g.dictation && (
          <div className="flex flex-col gap-4">
            <p className="text-[17px] leading-loose" lang="es">
              {g.dictation.tokens.map((tok, i, all) => {
                const text = tok.ref ?? tok.hyp ?? "";
                const prev = i > 0 ? (all[i - 1]!.ref ?? all[i - 1]!.hyp ?? "") : "";
                // Spanish spacing: none before closing punctuation, none after ¿ ¡ « (.
                const space = i > 0 && !/^[.,;:!?…»)]$/.test(text) && !/^[¿¡«(]$/.test(prev) ? " " : "";
                return (
                  <Fragment key={i}>
                    {space}
                    {tok.type === null ? (
                      <span>{text}</span>
                    ) : tok.ref === null ? (
                      <span className="text-negative line-through decoration-negative/60">{text}</span>
                    ) : (
                      <span title={tok.hyp ? `${t("common.yourAnswer")}${t("common.colon")}${tok.hyp}` : undefined} className="text-negative underline decoration-negative/50 decoration-2 underline-offset-4">
                        {text}
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </p>
            <ul className="flex flex-col gap-1 text-[14px] text-ink-2">
              {g.dictation.tokens
                .filter((tok) => tok.type && tok.type !== "punctuation")
                .slice(0, 40)
                .map((tok, i) => (
                  <li key={i}>
                    <span className="text-ink">{tok.ref ?? "–"}</span>
                    <span className="mx-2 text-ink-3">{tok.hyp ?? "–"}</span>
                    <span className="text-ink-3">{t(`exam.dictationErrors.${tok.type}` as MessageKey)}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title={`${t("exam.corrections")}${t("common.colon")}${t("exam.parts.conjugation")}`}>
        {itemRows("conjugation", g.parts.conjugation.items, (i) => {
          const c = content.conjugation[i];
          if (!c) return null;
          return c.type === "direct" ? (
            <span>
              <span className="font-medium">{c.verb}</span> <span className="text-ink-2">{c.subject ?? (c.person !== null ? personLabel(c.person, c.tense ?? undefined) : "")}</span>{" "}
              {c.tense && <span className="text-ink-3">{tenseName(c.tense)}</span>}
            </span>
          ) : (
            <span lang="es">
              {c.before} ___ <span className="text-ink-3">({c.verb})</span> {c.after}
            </span>
          );
        })}
      </Section>

      <Section title={`${t("exam.corrections")}${t("common.colon")}${t("exam.parts.grammar")}`}>
        {g.parts.grammar.notes.includes("ai-unavailable") && <div className="mb-3"><Note>{t("exam.pendingAi")}</Note></div>}
        {itemRows("grammar", g.parts.grammar.items, (i) => {
          const q = content.grammar[i];
          if (!q) return null;
          return <span lang="es">{q.es ?? (q.instruction ? loc(q.instruction, lang) : "")}</span>;
        })}
      </Section>

      <Section title={`${t("exam.corrections")}${t("common.colon")}${t("exam.parts.translation")}`}>
        {g.parts.translation.notes.includes("approximate") && <div className="mb-3"><Note>{t("study.categories.approximate")}</Note></div>}
        {itemRows("translation", g.parts.translation.items, (i) => content.translation[i]?.source)}
      </Section>

      <Section title={`${t("exam.corrections")}${t("common.colon")}${t("exam.parts.writing")}`}>
        <div className="flex flex-col gap-6">
          <p className="text-[16px] leading-relaxed text-ink-2">{content.writing.prompt}</p>
          {g.writing && g.writing.criteria.length > 0 ? (
            <>
              <table className="w-full text-[15px]">
                <tbody>
                  {g.writing.criteria.map((c) => (
                    <tr key={c.key} className="border-t border-line align-top">
                      <td className="w-36 py-2.5">{t(`exam.criteria.${c.key}` as MessageKey)}</td>
                      <td className="py-2.5 text-ink-2">{c.comment}</td>
                      <td className="tabular w-16 py-2.5 text-right">{formatScore(c.score)}/6</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {g.writing.summary && <p className="text-[15px] leading-relaxed">{g.writing.summary}</p>}
              {g.writing.errors.length > 0 && (
                <ul className="flex flex-col gap-2 text-[15px]">
                  {g.writing.errors.map((e, i) => (
                    <li key={i}>
                      <span className="text-negative line-through decoration-negative/50">{e.original}</span>
                      <span className="mx-2 text-ink-3">→</span>
                      <span className="text-positive">{e.correction}</span>
                      <span className="ml-2 text-ink-2">{e.explanation}</span>
                    </li>
                  ))}
                </ul>
              )}
              {g.writing.corrected && (
                <div>
                  <h3 className="mb-2 text-[14px] font-medium text-ink-2">{t("exam.corrected")}</h3>
                  <p className="whitespace-pre-wrap text-[16px] leading-relaxed" lang="es">
                    {g.writing.corrected}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <Note>{t("exam.pendingAi")}</Note>
              {r.responses.writing && (
                <p className="whitespace-pre-wrap text-[16px] leading-relaxed" lang="es">
                  {r.responses.writing}
                </p>
              )}
            </>
          )}
        </div>
      </Section>
    </div>
  );
}
