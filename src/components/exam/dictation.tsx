"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/core/api";
import { fromBase64 } from "@/lib/text";
import { useI18n } from "../i18n";
import { Button, TextArea } from "../ui/primitives";
import { spanishVoice } from "../voices";

interface Playback {
  full?: number;
  segments?: Record<string, number>;
}

const MAX_FULL = 2;
const MAX_SEGMENT = 3;

export function Dictation({
  examId,
  segments,
  encoded,
  voiceName,
  playback,
  onPlayback,
  value,
  onChange,
}: {
  examId: string;
  segments: number;
  encoded: string[];
  /** Preferred voice from the settings ("auto" picks the best Spanish (Spain) voice). */
  voiceName: string;
  playback: Playback;
  onPlayback: (p: Playback) => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState<string | null>(null);
  const [voiceMissing, setVoiceMissing] = useState(false);
  const texts = useRef<string[]>(encoded.map(fromBase64));

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setVoiceMissing(true);
      return;
    }
    const check = () => setVoiceMissing(!spanishVoice(voiceName));
    check();
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
  }, [voiceName]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function speak(text: string, slow: boolean): Promise<void> {
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      const v = spanishVoice(voiceName);
      if (v) u.voice = v;
      u.lang = v?.lang ?? "es-ES";
      u.rate = slow ? 0.78 : 0.92;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function play(mode: "full" | "segment", index = 0) {
    if (playing || !("speechSynthesis" in window)) return;
    let res: { allowed: boolean; playback: Playback };
    try {
      res = await api.exam.play(examId, mode, index);
    } catch {
      return;
    }
    onPlayback(res.playback);
    if (!res.allowed) return;
    setPlaying(mode === "full" ? "full" : String(index));
    const list = mode === "full" ? Array.from({ length: segments }, (_, i) => i) : [index];
    for (const i of list) {
      await speak(texts.current[i] ?? "", mode === "segment");
      if (mode === "full") await new Promise((r) => setTimeout(r, 350));
    }
    setPlaying(null);
  }

  const fullLeft = MAX_FULL - (playback.full ?? 0);

  return (
    <div className="flex flex-col gap-6">
      {voiceMissing && <p className="text-[14px] text-caution">{t("exam.noVoice")}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" onClick={() => play("full")} disabled={!!playing || fullLeft <= 0}>
          {t("exam.playText")}
        </Button>
        <span className="text-[14px] text-ink-3">{t("exam.playsLeft", { n: Math.max(0, fullLeft) })}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: segments }, (_, i) => {
          const left = MAX_SEGMENT - (playback.segments?.[String(i)] ?? 0);
          return (
            <button
              key={i}
              type="button"
              onClick={() => play("segment", i)}
              disabled={!!playing || left <= 0}
              className="flex h-11 items-center gap-2 rounded-lg border border-line-strong px-3 text-[14px] transition-colors hover:bg-subtle disabled:opacity-40"
              aria-label={`${t("exam.segment", { n: i + 1 })}, ${t("exam.playsLeft", { n: left })}`}
            >
              <span className={playing === String(i) ? "font-medium text-accent" : ""}>{i + 1}</span>
              <span className="tabular text-ink-3">{left}</span>
            </button>
          );
        })}
      </div>
      <TextArea rows={9} value={value} onChange={(e) => onChange(e.target.value)} lang="es" aria-label={t("exam.parts.dictation")} />
    </div>
  );
}
