"use client";

/** Spanish voices of this device, Spain first. */
export function spanishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const rank = (v: SpeechSynthesisVoice) => (v.lang.toLowerCase().replace("_", "-") === "es-es" ? 0 : 1);
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("es"))
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

/** The chosen voice if this device has it, otherwise the best Spanish (Spain) voice. */
export function spanishVoice(preferred = "auto"): SpeechSynthesisVoice | null {
  const voices = spanishVoices();
  if (preferred !== "auto") {
    const chosen = voices.find((v) => v.name === preferred);
    if (chosen) return chosen;
  }
  return voices[0] ?? null;
}
