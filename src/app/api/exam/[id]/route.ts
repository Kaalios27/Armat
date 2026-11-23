import { handler } from "@/server/http";
import { examForTaking } from "@/server/services/exam";

export const GET = handler<{ id: string }>(async (_req, { id }) => examForTaking(id));
