/**
 * European Spanish speech synthesis for dictation. Azure Speech or Google
 * Cloud Text-to-Speech when configured; otherwise the browser's es-ES voice is
 * used on the device. Audio is cached so replays never trigger new requests.
 */
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { database } from "../db/client";
import { ttsCache } from "../db/schema";

type TtsProvider = "azure" | "google";

function provider(): TtsProvider | null {
  const p = (process.env.TTS_PROVIDER ?? "").toLowerCase();
  if (p === "azure" && process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) return "azure";
  if (p === "google" && process.env.GOOGLE_TTS_API_KEY) return "google";
  return null;
}

export function serverTtsAvailable(): boolean {
  return provider() !== null;
}

export function ttsDescription(): string {
  return provider() ?? "browser";
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function azure(text: string, slow: boolean): Promise<Buffer> {
  const voice = process.env.AZURE_SPEECH_VOICE || "es-ES-ElviraNeural";
  const ssml = `<speak version="1.0" xml:lang="es-ES"><voice xml:lang="es-ES" name="${escapeXml(voice)}"><prosody rate="${slow ? "-20%" : "-5%"}">${escapeXml(text)}</prosody></voice></speak>`;
  const res = await fetch(`https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY!,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "armat",
    },
    body: ssml,
  });
  if (!res.ok) throw new Error(`Azure TTS HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function google(text: string, slow: boolean): Promise<Buffer> {
  const res = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": process.env.GOOGLE_TTS_API_KEY! },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "es-ES", name: process.env.GOOGLE_TTS_VOICE || "es-ES-Neural2-A" },
      audioConfig: { audioEncoding: "MP3", speakingRate: slow ? 0.8 : 0.95 },
    }),
  });
  if (!res.ok) throw new Error(`Google TTS HTTP ${res.status}`);
  const json = (await res.json()) as { audioContent?: string };
  if (!json.audioContent) throw new Error("Google TTS returned no audio");
  return Buffer.from(json.audioContent, "base64");
}

export async function synthesize(text: string, slow = false): Promise<{ mime: string; data: Buffer }> {
  const p = provider();
  if (!p) throw new Error("Server text-to-speech is not configured");
  const key = createHash("sha256").update(`${p}|${slow}|${process.env.AZURE_SPEECH_VOICE ?? ""}|${process.env.GOOGLE_TTS_VOICE ?? ""}|${text}`).digest("hex");
  const db = await database();
  const hit = (await db.select().from(ttsCache).where(eq(ttsCache.key, key)))[0];
  if (hit) return { mime: hit.mime, data: Buffer.from(hit.data, "base64") };
  const data = p === "azure" ? await azure(text, slow) : await google(text, slow);
  await db.insert(ttsCache).values({ key, mime: "audio/mpeg", data: data.toString("base64") }).onConflictDoNothing();
  return { mime: "audio/mpeg", data };
}
