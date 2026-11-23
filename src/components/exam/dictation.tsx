"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { Button, TextArea } from "../ui/primitives";

interface Playback {
  full?: number;
  segments?: Record<string, number>;
}

const MAX_FULL = 2;
const MAX_SEGMENT = 3;

function decode(b64: string): string {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function spanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === "es-ES") ?? voices.find((v) => v.lang.toLowerCase().startsWith("es-es")) ?? voices.find((v) => v.lang.toLowerCase().startsWith("es")) ?? null;
}

export function Dictation({
  examId,
  segments,
  tts,
  encoded,
  playback,
  onPlayback,
  value,
  onChange,
}: {
  examId: string;
  segments: number;
  tts: "server" | "browser";
  encoded: string[] | null;
  playback: Playback;
  onPlayback: (p: Playback) => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState<string | null>(null);
  const [voiceMissing, setVoiceMissing] = useState(false);
  const texts = useRef<string[]>(encoded ? encoded.map(decode) : []);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (tts !== "browser") return;
    const check = () => setVoiceMissing(!spanishVoice());
    check();
    window.speechSynthesis?.addEventListener?.("voiceschanged", check);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", check);
  }, [tts]);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    audio.current?.pause();
  }, []);

  function speak(text: string, slow: boolean): Promise<void> {
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      const v = spanishVoice();
      if (v) u.voice = v;
      u.lang = "es-ES";
      u.rate = slow ? 0.78 : 0.92;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  function playAudio(index: number, slow: boolean): Promise<void> {
    return new Promise((resolve) => {
      const a = new Audio(`/api/exam/${examId}/audio/${index}${slow ? "?slow=1" : ""}`);
      audio.current = a;
      a.onended = () => resolve();
      a.onerror = () => resolve();
      void a.play().catch(() => resolve());
    });
  }

  async function play(mode: "full" | "segment", index = 0) {
    if (playing) return;
    const res = await fetch(`/api/exam/${examId}/play`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode, segment: index }) });
    if (!res.ok) return;
    const json = (await res.json()) as { allowed: boolean; playback: Playback };
    onPlayback(json.playback);
    if (!json.allowed) return;
    setPlaying(mode === "full" ? "full" : String(index));
    const list = mode === "full" ? Array.from({ length: segments }, (_, i) => i) : [index];
    for (const i of list) {
      if (tts === "browser") await speak(texts.current[i] ?? "", mode === "segment");
      else await playAudio(i, mode === "segment");
      if (mode === "full") await new Promise((r) => setTimeout(r, 350));
    }
    setPlaying(null);
  }

  const fullLeft = MAX_FULL - (playback.full ?? 0);

  return (
    <div className="flex flex-col gap-6">
      {tts === "browser" && voiceMissing && <p className="text-[14px] text-caution">{t("exam.noVoice")}</p>}
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
