"use client";

import { useRef, useState } from "react";
import type { Lang } from "@/lib/i18n/types";
import { useI18n } from "../i18n";
import { Button, TextInput, cn } from "../ui/primitives";
import { AccentBar, Feedback, headword, posLabel, relativeDue, useKey } from "./shared";

export interface WordPayload {
  itemId: string;
  lemma: string;
  pos: string;
  gender: string | null;
  example: string | null;
  tags: string[];
  translations: Record<Lang, { main: string; alternatives: string[]; note: string | null; exampleTranslation: string | null }>;
}

interface CardPayload extends WordPayload {
  format: "recognize" | "produce" | "cloze";
  direction: string;
  practice: boolean;
  cloze: { before: string; after: string } | null;
  isNew: boolean;
}

interface VocabResult {
  verdict: "correct" | "accent" | "wrong" | "alternative";
  correct: boolean;
  expected?: string;
  note?: string | null;
  nextDueAt?: string;
  overridden?: boolean;
}

function Meaning({ word, lang, large = false }: { word: WordPayload; lang: Lang; large?: boolean }) {
  const tr = word.translations[lang];
  return (
    <div className={cn("text-ink", large ? "text-[24px] font-medium tracking-[-0.01em]" : "text-[19px]")}>
      {tr.main}
      {tr.alternatives.length > 0 && <span className="text-ink-2">{`, ${tr.alternatives.slice(0, 3).join(", ")}`}</span>}
    </div>
  );
}

function Details({ word, lang }: { word: WordPayload; lang: Lang }) {
  const { t } = useI18n();
  const tr = word.translations[lang];
  const ff = word.tags.includes(lang === "en" ? "ff-en" : "ff-fr");
  return (
    <div className="mt-5 flex flex-col gap-3">
      {word.example && (
        <div>
          <p className="text-[17px] leading-relaxed text-ink">{word.example}</p>
          {tr.exampleTranslation && <p className="text-[15px] leading-relaxed text-ink-2">{tr.exampleTranslation}</p>}
        </div>
      )}
      {(tr.note || ff) && (
        <p className={cn("text-[14px] leading-relaxed", ff ? "text-caution" : "text-ink-2")}>
          {ff && <span className="font-medium">{t("vocab.falseFriend")}. </span>}
          {tr.note}
        </p>
      )}
    </div>
  );
}

export function VocabIntro({ word, onContinue, busy }: { word: WordPayload; onContinue: () => void; busy: boolean }) {
  const { t, lang } = useI18n();
  useKey(["Enter", " "], (e) => {
    e.preventDefault();
    if (!busy) onContinue();
  });
  return (
    <div className="enter">
      <div className="mb-6 text-[13px] font-medium text-accent">{t("study.newWord")}</div>
      <div className="text-[40px] font-medium leading-tight tracking-[-0.02em] sm:text-[46px]">{headword(word.lemma, word.pos, word.gender)}</div>
      <div className="mt-1 text-[14px] text-ink-3">{posLabel(word.pos, word.gender, lang)}</div>
      <div className="mt-6">
        <Meaning word={word} lang={lang} large />
      </div>
      <Details word={word} lang={lang} />
      <div className="mt-8">
        <Button size="lg" onClick={onContinue} disabled={busy} autoFocus>
          {t("common.continue")}
        </Button>
      </div>
    </div>
  );
}

export function VocabCard({
  card,
  result,
  busy,
  onSubmit,
  onContinue,
  onOverride,
}: {
  card: CardPayload;
  result: VocabResult | null;
  busy: boolean;
  onSubmit: (body: { answer?: string; rating?: number; responseMs: number }) => void;
  onContinue: () => void;
  onOverride: () => void;
}) {
  const { t, lang } = useI18n();
  const shownAt = useRef(Date.now());
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const responseMs = () => Date.now() - shownAt.current;

  // Recognition: reveal, then self-rate.
  useKey([" ", "Enter"], (e) => {
    if (card.format !== "recognize" || revealed) return;
    e.preventDefault();
    setRevealed(true);
  }, { enabled: card.format === "recognize" && !revealed });
  useKey(["1", "2", "3", "4"], (e) => {
    if (busy || result) return;
    onSubmit({ rating: Number(e.key), responseMs: responseMs() });
  }, { enabled: card.format === "recognize" && revealed && !result });
  useKey(["Enter"], (e) => {
    e.preventDefault();
    onContinue();
  }, { enabled: card.format === "recognize" && !!result });

  if (card.format === "recognize") {
    return (
      <div className="enter">
        {card.practice && <div className="mb-6 text-[13px] text-ink-3">{t("study.practice")}</div>}
        <div className="text-[40px] font-medium leading-tight tracking-[-0.02em] sm:text-[46px]">{headword(card.lemma, card.pos, card.gender)}</div>
        <div className="mt-1 text-[14px] text-ink-3">{posLabel(card.pos, card.gender, lang)}</div>
        {!revealed ? (
          <div className="mt-10">
            <Button size="lg" variant="secondary" onClick={() => setRevealed(true)} autoFocus>
              {t("study.showAnswer")}
            </Button>
          </div>
        ) : (
          <div className="reveal mt-6">
            <Meaning word={card} lang={lang} large />
            <Details word={card} lang={lang} />
            {!result ? (
              <div className="mt-8 grid grid-cols-4 gap-2 sm:max-w-[480px]">
                {[
                  { r: 1, k: "study.again" as const },
                  { r: 2, k: "study.hard" as const },
                  { r: 3, k: "study.good" as const },
                  { r: 4, k: "study.easy" as const },
                ].map(({ r, k }) => (
                  <Button key={r} variant={r === 3 ? "primary" : "secondary"} disabled={busy} onClick={() => onSubmit({ rating: r, responseMs: responseMs() })} className="flex-col gap-0 py-1">
                    <span>{t(k)}</span>
                  </Button>
                ))}
                <div className="col-span-4 hidden text-[12px] text-ink-3 sm:block">1 2 3 4</div>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-4">
                <Button onClick={onContinue} autoFocus>
                  {t("common.continue")}
                </Button>
                {relativeDue(result.nextDueAt, t) && <span className="text-[14px] text-ink-3">{t("study.nextReview", { when: relativeDue(result.nextDueAt, t)! })}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy || result) return;
    onSubmit({ answer, responseMs: responseMs() });
  };
  const verdictLabel = result
    ? result.verdict === "accent"
      ? t("study.categories.accent")
      : result.verdict === "alternative"
        ? t("study.acceptedAlternative")
        : null
    : null;

  return (
    <div className="enter">
      {card.practice && <div className="mb-6 text-[13px] text-ink-3">{t("study.practice")}</div>}
      {card.format === "cloze" && card.cloze ? (
        <>
          <div className="mb-4 text-[14px] text-ink-2">{t("study.fillTheBlank")}</div>
          <p className="text-[24px] leading-snug tracking-[-0.01em]">
            {card.cloze.before}
            <span className="mx-1 inline-block min-w-16 border-b-2 border-ink-3 align-baseline">&nbsp;</span>
            {card.cloze.after}
          </p>
          <div className="mt-3">
            <Meaning word={card} lang={lang} />
          </div>
        </>
      ) : (
        <>
          <Meaning word={card} lang={lang} large />
          <div className="mt-1 text-[14px] text-ink-3">{posLabel(card.pos, card.gender, lang)}</div>
        </>
      )}
      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        <TextInput
          ref={inputRef}
          large
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t("study.typeSpanish")}
          readOnly={!!result}
          autoFocus
          lang="es"
          aria-label={t("study.typeSpanish")}
          className={cn(result && (result.correct ? "border-positive" : "border-negative"))}
        />
        {!result && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AccentBar target={inputRef} onInsert={setAnswer} />
            <Button type="submit" disabled={busy || !answer.trim()}>
              {t("common.check")}
            </Button>
          </div>
        )}
      </form>
      {result && (
        <Feedback
          correct={result.correct}
          label={verdictLabel}
          overridden={result.overridden}
          expected={
            <span>
              {card.format === "cloze" ? result.expected : headword(card.lemma, card.pos, card.gender)}
            </span>
          }
          onContinue={onContinue}
          onOverride={result.correct ? null : onOverride}
        >
          {result.note && <p>{result.note}</p>}
          {card.example && card.format !== "cloze" && <p className="text-ink">{card.example}</p>}
          {relativeDue(result.nextDueAt, t) && !card.practice && <p className="text-[14px] text-ink-3">{t("study.nextReview", { when: relativeDue(result.nextDueAt, t)! })}</p>}
        </Feedback>
      )}
    </div>
  );
}
