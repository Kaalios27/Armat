import { errorResponse } from "@/server/http";
import { exportAll } from "@/server/services/export";

export async function GET() {
  try {
    const data = await exportAll();
    const date = new Date().toISOString().slice(0, 10);
    return new Response(JSON.stringify(data, null, 1), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="armat-export-${date}.json"`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
