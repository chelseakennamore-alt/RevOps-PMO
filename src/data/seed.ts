import type { Phase, Project } from "../types";

const NAMES = [
  "Gong Forecasts", "Ignite Territory Planning", "Insurance Cosell", "Datamarts", "BDR Management",
  "Discounts and Approvals", "Lean Layer", "QBR List", "6 Data Unlocks", "RevOps Ticketing Queue",
  "Qualified", "Clay", "Multiyear Contracts", "Competitive Deals",
];

const SKELETON: [string, [string, string]][] = [
  ["Discovery & Design", ["Define scope & goals", "Document requirements"]],
  ["Build & Configure", ["Build / configure", "Test & validate"]],
  ["Launch & Adoption", ["Roll out", "Train & measure"]],
];

const build = (name: string, idx: number): Project => {
  const phases: Phase[] = SKELETON.map(([phaseName, tasks], p) => ({
    id: `p${idx}-ph${p}`, name: phaseName,
    tasks: tasks.map((title, k) => ({ id: `p${idx}-t${p * 2 + k}`, title, owner: "", start: "", due: "", status: "todo" as const })),
  }));
  return { id: `proj-${idx + 1}`, name, description: "", owner: "", status: "not_started", start: "", end: "", nextSteps: "", phases };
};

export const seedProjects = (): Project[] => NAMES.map(build);
