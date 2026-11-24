import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Project, Task } from "./types";
import { seedProjects } from "./data/seed";
import { uid, TODAY } from "./lib";

const KEY = "revops-pmo-v1";

interface Store {
  projects: Project[];
  addProject: () => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addPhase: (pid: string, name: string) => void;
  renamePhase: (pid: string, phid: string, name: string) => void;
  deletePhase: (pid: string, phid: string) => void;
  addTask: (pid: string, phid: string) => void;
  updateTask: (pid: string, phid: string, tid: string, patch: Partial<Task>) => void;
  deleteTask: (pid: string, phid: string, tid: string) => void;
  resetData: () => void;
  people: string[];
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => { const s = useContext(Ctx); if (!s) throw new Error("no store"); return s; };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
    return seedProjects();
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(projects)); }, [projects]);

  const mapP = (id: string, fn: (p: Project) => Project) =>
    setProjects((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));

  const people = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => { s.add(p.owner); p.phases.forEach((ph) => ph.tasks.forEach((t) => s.add(t.owner))); });
    return [...s].filter(Boolean).sort();
  }, [projects]);

  const value: Store = {
    projects, people,
    addProject: () => {
      const id = uid();
      setProjects((ps) => [...ps, { id, name: "New project", description: "", owner: "", status: "not_started",
        start: TODAY, end: TODAY, nextSteps: "", phases: [] }]);
      return id;
    },
    updateProject: (id, patch) => mapP(id, (p) => ({ ...p, ...patch })),
    deleteProject: (id) => setProjects((ps) => ps.filter((p) => p.id !== id)),
    addPhase: (pid, name) => mapP(pid, (p) => ({ ...p, phases: [...p.phases, { id: uid(), name, tasks: [] }] })),
    renamePhase: (pid, phid, name) => mapP(pid, (p) => ({ ...p, phases: p.phases.map((ph) => ph.id === phid ? { ...ph, name } : ph) })),
    deletePhase: (pid, phid) => mapP(pid, (p) => ({ ...p, phases: p.phases.filter((ph) => ph.id !== phid) })),
    addTask: (pid, phid) => mapP(pid, (p) => ({ ...p, phases: p.phases.map((ph) => ph.id === phid
      ? { ...ph, tasks: [...ph.tasks, { id: uid(), title: "New task", owner: p.owner, start: TODAY, due: TODAY, status: "todo" as const }] } : ph) })),
    updateTask: (pid, phid, tid, patch) => mapP(pid, (p) => ({ ...p, phases: p.phases.map((ph) => ph.id === phid
      ? { ...ph, tasks: ph.tasks.map((t) => (t.id === tid ? { ...t, ...patch } : t)) } : ph) })),
    deleteTask: (pid, phid, tid) => mapP(pid, (p) => ({ ...p, phases: p.phases.map((ph) => ph.id === phid
      ? { ...ph, tasks: ph.tasks.filter((t) => t.id !== tid) } : ph) })),
    resetData: () => setProjects(seedProjects()),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
