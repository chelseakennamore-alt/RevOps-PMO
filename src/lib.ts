import type { Project, Status, Task, TaskStatus } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10);
export const TODAY = new Date().toISOString().slice(0, 10);

export const STATUS_META: Record<Status, { label: string; cls: string; dot: string }> = {
  on_track: { label: "On track", cls: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  at_risk: { label: "At risk", cls: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  off_track: { label: "Off track", cls: "bg-red-100 text-red-800", dot: "bg-red-500" },
  complete: { label: "Complete", cls: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  not_started: { label: "Not started", cls: "bg-slate-200 text-slate-700", dot: "bg-slate-400" },
};
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do", in_progress: "In progress", blocked: "Blocked", done: "Done",
};
export const TASK_STATUS_CLS: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700", in_progress: "bg-blue-100 text-blue-800",
  blocked: "bg-red-100 text-red-800", done: "bg-emerald-100 text-emerald-800",
};

export const allTasks = (p: Project): Task[] => p.phases.flatMap((ph) => ph.tasks);
export const progress = (p: Project) => {
  const t = allTasks(p);
  return t.length ? Math.round((t.filter((x) => x.status === "done").length / t.length) * 100) : 0;
};
export const isOverdue = (t: Task) => t.status !== "done" && !!t.due && t.due < TODAY;
export const fmt = (d: string) => !d ? "—" :
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const fmtShort = (d: string) => !d ? "—" :
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
export const addDays = (d: string, n: number) => {
  const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10);
};
export const nextTask = (p: Project): Task | undefined =>
  allTasks(p).filter((t) => t.status !== "done").sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"))[0];
