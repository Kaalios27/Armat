"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import type { MessageKey } from "@/lib/i18n/messages";
import type { Lang, Localized } from "@/lib/i18n/types";
import { useI18n } from "../i18n";
import { Button, cn } from "../ui/primitives";

/** Register a keyboard shortcut while the component is mounted. Ignores typing in other fields unless allowed. */
export function useKey(keys: string[], handler: (e: KeyboardEvent) => void, opts: { enabled?: boolean; inInputs?: boolean } = {}) {
  const ref = useRef(handler);
  ref.current = handler;
  const { enabled = true, inInputs = false } = opts;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (!keys.includes(e.key) || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing && !inInputs) return;
      ref.current(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, inInputs, keys.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
}

const ACCENTS = ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"];

/** Inserts Spanish characters at the caret. Uses pointerdown + preventDefault so touch keyboards stay open. */
export function AccentBar({
  target,
  onInsert,
}: {
  /** The field to insert into, resolved at click time. */
  target: RefObject<HTMLInputElement | HTMLTextAreaElement | null> | (() => HTMLInputElement | HTMLTextAreaElement | null);
  onInsert: (value: string) => void;
}) {
  function insert(ch: string) {
    const el = typeof target === "function" ? target() : target.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const value = el.value.slice(0, start) + ch + el.value.slice(end);
    onInsert(value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  }
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden="true">
      {ACCENTS.map((ch) => (
        <button
          key={ch}
          type="button"
          tabIndex={-1}
          onPointerDown={(e) => {
            e.preventDefault();
            insert(ch);
          }}
          className="h-9 min-w-9 rounded-md border border-line px-2 text-[16px] text-ink-2 transition-colors hover:bg-subtle hover:text-ink active:bg-subtle"
        >
          {ch}
        </button>
      ))}
    </div>
  );
}

export function categoryKey(category: string | null | undefined): MessageKey | null {
  if (!category) return null;
  const known = [
    "wrong_person",
    "wrong_tense",
    "ending",
    "irregular",
    "accent",
    "stem_change",
    "pronoun",
    "other",
    "grammar",
    "conjugation",
    "vocabulary",
    "orthography",
    "alternative",
    "style",
    "approximate",
    "unverified",
  ];
  return known.includes(category) ? (`study.categories.${category}` as MessageKey) : null;
}

export function Feedback({
  correct,
  label,
  expected,
  children,
  onContinue,
  onOverride,
  overridden,
  extra,
}: {
  correct: boolean;
  label?: string | null;
  expected?: ReactNode;
  children?: ReactNode;
  onContinue: () => void;
  onOverride?: (() => void) | null;
  overridden?: boolean;
  extra?: ReactNode;
}) {
  const { t } = useI18n();
  useKey(["Enter"], (e) => {
    e.preventDefault();
    onContinue();
  }, { inInputs: true });
  return (
    <div className="enter mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cn("text-[17px] font-medium", correct ? "text-positive" : "text-negative")}>
          {overridden ? t("study.counted") : correct ? t("common.correct") : t("common.incorrect")}
        </span>
        {label && <span className="text-[14px] text-ink-2">{label}</span>}
      </div>
      {expected && <div className="mt-2 text-[20px] font-medium tracking-[-0.01em]">{expected}</div>}
      {children && <div className="mt-3 flex flex-col gap-2 text-[15px] leading-relaxed text-ink-2">{children}</div>}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={onContinue} autoFocus>
          {t("common.continue")}
        </Button>
        {!correct && onOverride && (
          <Button variant="ghost" onClick={onOverride}>
            {t("study.countAsCorrect")}
          </Button>
        )}
        {extra}
        <span className="ml-auto hidden text-[13px] text-ink-3 sm:inline">{t("study.keyboardHint")}</span>
      </div>
    </div>
  );
}

const POS: Record<string, Localized> = {
  v: { en: "verb", fr: "verbe" },
  n: { en: "noun", fr: "nom" },
  adj: { en: "adjective", fr: "adjectif" },
  adv: { en: "adverb", fr: "adverbe" },
  conj: { en: "conjunction", fr: "conjonction" },
  prep: { en: "preposition", fr: "préposition" },
  pron: { en: "pronoun", fr: "pronom" },
  det: { en: "determiner", fr: "déterminant" },
  expr: { en: "expression", fr: "expression" },
  interj: { en: "interjection", fr: "interjection" },
};
const GENDER: Record<string, Localized> = {
  m: { en: "masculine", fr: "masculin" },
  f: { en: "feminine", fr: "féminin" },
  mf: { en: "masculine or feminine", fr: "masculin ou féminin" },
};

export function posLabel(pos: string, gender: string | null, lang: Lang): string {
  const p = POS[pos]?.[lang] ?? pos;
  return gender && GENDER[gender] ? `${p}, ${GENDER[gender]![lang]}` : p;
}

/** Spanish headword with its article for nouns (la reunión, el agua, los apuntes). */
export function headword(lemma: string, pos: string, gender: string | null): string {
  if (pos !== "n" || !gender) return lemma;
  const plural = lemma.endsWith("s") && !lemma.endsWith("is");
  if (gender === "mf") return `el/la ${lemma}`;
  if (plural) return `${gender === "f" ? "las" : "los"} ${lemma}`;
  if (gender === "f" && /^(a|há|ha|á)/i.test(lemma) && ["agua", "aula", "arma", "área", "hambre", "águila", "alma", "hacha"].includes(lemma)) return `el ${lemma}`;
  return `${gender === "f" ? "la" : "el"} ${lemma}`;
}

export function relativeDue(iso: string | undefined, t: (k: MessageKey, v?: Record<string, string | number>) => string): string | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return null;
  const minutes = Math.round(diff / 60_000);
  if (minutes < 60) return t("study.inMinutes", { n: Math.max(1, minutes) });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t("study.inHours", { n: hours });
  const days = Math.round(hours / 24);
  return days === 1 ? t("study.tomorrow") : t("study.inDays", { n: days });
}
