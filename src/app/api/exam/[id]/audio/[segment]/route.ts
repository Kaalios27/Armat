import { errorResponse } from "@/server/http";
import { dictationSegment } from "@/server/services/exam";
import { synthesize } from "@/server/tts";

export const maxDuration = 60;

export async function GET(req: Request, ctx: { params: Promise<{ id: string; segment: string }> }) {
  try {
    const { id, segment } = await ctx.params;
    const slow = new URL(req.url).searchParams.get("slow") === "1";
    const text = await dictationSegment(id, Number(segment));
    const audio = await synthesize(text, slow);
    return new Response(new Uint8Array(audio.data), {
      headers: { "content-type": audio.mime, "cache-control": "private, max-age=3600" },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
