/**
 * The app's actions, called directly by the interface: there is no server, everything runs
 * against the database in this browser. Results go through a JSON round trip so the interface
 * only receives plain data (dates as ISO strings), never live database objects.
 */
import type { ExamResponses } from "./exam/types";
import { assessWriting, ensureExam, examForTaking, examOverview, examResults, registerPlayback, runExamGeneration, runExamGrading, saveExam, startExam, submitExam } from "./services/exam";
import { exportAll, importAll, resetProgress } from "./services/export";
import { getProfile, updateProfile, type ProfilePatch } from "./services/profile";
import { answerItem, completeModule, ensureTodaySession, getSession, heartbeat, HttpError, nextItem, startSession } from "./services/session";
import { MODULES, moduleDurationMs, type AnswerBody, type ModuleKey, type ModuleState } from "./services/session-types";

function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const api = {
  profile: async () => plain(await getProfile()),
  updateProfile: (patch: ProfilePatch) => updateProfile(patch),

  session: {
    /** Today's session, started (none on exam days). */
    async today() {
      const t = await ensureTodaySession();
      if (!t.session) return null;
      const session = t.session.status === "planned" ? await startSession(t.session.id) : t.session;
      return plain(session);
    },
    next: async (id: string, module: ModuleKey, elapsedMs: number) => plain(await nextItem(id, MODULES.includes(module) ? module : "vocab", elapsedMs)),
    answer: async (id: string, itemId: string, body: AnswerBody, elapsedMs: number) => plain(await answerItem(id, itemId, body, elapsedMs)),
    /** A module ends when its time is used, or early only when no material is left. */
    async complete(id: string, module: ModuleKey, exhausted: boolean) {
      const session = await getSession(id);
      if (!session) throw new HttpError(404, "Session not found");
      const state = (session.modules as ModuleState[])[MODULES.indexOf(module)];
      if (!exhausted && (state?.elapsedMs ?? 0) < moduleDurationMs()) throw new HttpError(409, "Module time is not used yet");
      return plain(await completeModule(id, module));
    },
    heartbeat: (id: string, module: ModuleKey, elapsedMs: number) => heartbeat(id, module, elapsedMs),
  },

  exam: {
    overview: async () => plain(await examOverview()),
    /** Create this week's exam if needed and build its content (curated, so it is immediate). */
    async ensure(weekOf: string): Promise<{ id: string; status: string }> {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(weekOf)) throw new HttpError(400, "weekOf is required");
      const exam = await ensureExam(weekOf);
      if (exam.status === "generating" || exam.status === "failed") await runExamGeneration(exam.id);
      const e = await examForTaking(exam.id);
      return { id: e.id, status: e.status };
    },
    get: async (id: string) => plain(await examForTaking(id)),
    async start(id: string) {
      await startExam(id);
      return plain(await examForTaking(id));
    },
    async save(id: string, responses: ExamResponses, elapsedMs: number) {
      const res = await saveExam(id, { responses, elapsedMs });
      if (res.status === "submitted") await runExamGrading(id);
      return plain(res);
    },
    async submit(id: string, responses: ExamResponses, elapsedMs: number) {
      await saveExam(id, { responses, elapsedMs });
      await submitExam(id);
      await runExamGrading(id);
    },
    /** Results, grading the exam first if it was submitted but not graded (for example after a reload). */
    async results(id: string) {
      let r = await examResults(id);
      if (r.status === "submitted") {
        await runExamGrading(id);
        r = await examResults(id);
      }
      return plain(r);
    },
    play: async (id: string, mode: "full" | "segment", segment = 0) => plain(await registerPlayback(id, mode, segment)),
    assessWriting: async (id: string, scores: Record<string, number>) => plain(await assessWriting(id, scores)),
  },

  data: {
    exportAll: async () => plain(await exportAll()),
    importAll: (data: unknown) => importAll(data),
    resetProgress: () => resetProgress(),
  },
};

export { HttpError };
