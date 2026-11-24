export type Status = "on_track" | "at_risk" | "off_track" | "complete" | "not_started";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export interface Task {
  id: string;
  title: string;
  owner: string;
  start: string; // YYYY-MM-DD
  due: string;   // YYYY-MM-DD
  status: TaskStatus;
  notes?: string;
}
export interface Phase { id: string; name: string; tasks: Task[]; }
export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: Status;
  start: string;
  end: string;
  nextSteps: string;
  phases: Phase[];
}
