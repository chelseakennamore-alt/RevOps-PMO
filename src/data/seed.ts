import type { Phase, Project, Status, Task, TaskStatus } from "../types";
import { TODAY, addDays } from "../lib";

export const TEAM = [
  "Avery Chen", "Jordan Patel", "Morgan Reyes", "Taylor Brooks", "Riley Nguyen",
  "Casey Morgan", "Sam Okafor", "Dana Whitfield",
];

interface Spec {
  name: string; description: string; owner: string; status: Status;
  startOffset: number; duration: number; nextSteps: string;
  tasks: [string, string, string, string, string, string]; // 2 per phase
}

const PHASES = ["Discovery & Design", "Build & Configure", "Launch & Adoption"];

const SPECS: Spec[] = [
  { name: "CPQ Modernization", description: "Replace legacy quoting with a guided CPQ to speed deal desk and cut pricing errors.", owner: TEAM[0], status: "on_track", startOffset: -80, duration: 200,
    nextSteps: "Complete UAT with Deal Desk and finalize discount approval matrix.",
    tasks: ["Gather quoting requirements", "Define pricing & approval rules", "Configure product catalog", "Build approval workflows", "UAT with Deal Desk", "Rollout & training"] },
  { name: "Lead Routing Overhaul", description: "Rebuild lead-to-rep assignment for speed-to-lead and territory fairness.", owner: TEAM[1], status: "at_risk", startOffset: -60, duration: 120,
    nextSteps: "Resolve territory data gaps before the routing engine cutover.",
    tasks: ["Audit current routing", "Design routing logic", "Clean territory data", "Build routing flows", "Pilot with SDR team", "Full cutover"] },
  { name: "Forecasting Accuracy Program", description: "Standardize forecast categories and inspection cadence to improve forecast accuracy.", owner: TEAM[2], status: "on_track", startOffset: -45, duration: 150,
    nextSteps: "Publish forecast category definitions and begin weekly inspection pilot.",
    tasks: ["Baseline forecast accuracy", "Define forecast categories", "Build forecast dashboards", "Configure roll-ups", "Manager coaching sessions", "Quarterly accuracy review"] },
  { name: "Territory & Quota Planning FY27", description: "Design FY27 territories, capacity model and quota allocation.", owner: TEAM[3], status: "at_risk", startOffset: -70, duration: 90,
    nextSteps: "Finalize capacity model and align with Finance on quota totals.",
    tasks: ["Capacity modeling", "Account segmentation", "Territory assignment", "Quota allocation", "Leadership review", "Communicate to field"] },
  { name: "Sales Compensation Automation", description: "Automate commission calculation and statements to reduce manual effort and disputes.", owner: TEAM[4], status: "off_track", startOffset: -120, duration: 160,
    nextSteps: "Escalate vendor integration delay; agree on a revised go-live date.",
    tasks: ["Document comp plans", "Select tooling", "Build calculation rules", "Integrate with CRM & payroll", "Parallel run", "Go live"] },
  { name: "Data Enrichment & Hygiene", description: "Implement enrichment, dedupe and validation rules to improve CRM data quality.", owner: TEAM[5], status: "on_track", startOffset: -30, duration: 110,
    nextSteps: "Kick off dedupe of top 5,000 accounts.",
    tasks: ["Data quality audit", "Define field standards", "Configure enrichment", "Dedupe & merge rules", "Monitoring dashboard", "Ownership handoff"] },
  { name: "Customer Health Scoring", description: "Create a unified health score to drive proactive CS and renewal motions.", owner: TEAM[6], status: "on_track", startOffset: -20, duration: 130,
    nextSteps: "Validate score weights against last 12 months of churn.",
    tasks: ["Define health inputs", "Back-test model", "Build score in CRM", "Create CS playbooks", "Pilot with CS pod", "Roll out to all CSMs"] },
  { name: "Renewals Process Redesign", description: "Streamline renewal workflow with earlier triggers and clearer ownership.", owner: TEAM[7], status: "at_risk", startOffset: -50, duration: 100,
    nextSteps: "Agree renewal ownership model between Sales and CS.",
    tasks: ["Map current renewal process", "Design target process", "Automate renewal opps", "Build renewal reminders", "Pilot with one segment", "Scale to all segments"] },
  { name: "Marketing Attribution Model", description: "Implement multi-touch attribution to guide channel investment.", owner: TEAM[0], status: "not_started", startOffset: 21, duration: 140,
    nextSteps: "Confirm scope and budget; assign a project owner on the Marketing side.",
    tasks: ["Define attribution goals", "Choose model approach", "Instrument tracking", "Build attribution reports", "Validate with Marketing", "Publish & train"] },
  { name: "Partner Portal & Referral Tracking", description: "Launch a partner portal with deal registration and referral tracking.", owner: TEAM[1], status: "on_track", startOffset: -15, duration: 170,
    nextSteps: "Sign off on deal registration form and approval flow.",
    tasks: ["Partner requirements", "Portal design", "Build deal registration", "Referral reporting", "Partner pilot", "Partner launch"] },
  { name: "Revenue Dashboard & Reporting Hub", description: "Single source of truth for pipeline, bookings and retention metrics.", owner: TEAM[2], status: "on_track", startOffset: -90, duration: 130,
    nextSteps: "Ship executive dashboard v2 and retire legacy reports.",
    tasks: ["Metric definitions", "Data model design", "Build core dashboards", "Exec dashboard", "User training", "Retire legacy reports"] },
  { name: "Sales Onboarding & Enablement Tooling", description: "Standardize rep ramp with tooling, content and ramp tracking.", owner: TEAM[3], status: "complete", startOffset: -170, duration: 150,
    nextSteps: "Hand off to Enablement; schedule 90-day post-launch review.",
    tasks: ["Ramp requirements", "Content audit", "Configure ramp tracking", "Build learning paths", "Pilot cohort", "Full launch"] },
  { name: "Contract Lifecycle Management", description: "Adopt CLM to shorten legal turnaround and centralize contracts.", owner: TEAM[4], status: "at_risk", startOffset: -40, duration: 180,
    nextSteps: "Decide on vendor shortlist and secure Legal sponsor.",
    tasks: ["Contract workflow audit", "Vendor evaluation", "Template standardization", "CRM integration", "Legal pilot", "Org-wide rollout"] },
  { name: "Pricing & Packaging Operations", description: "Operationalize new pricing and packaging across systems and quotes.", owner: TEAM[5], status: "on_track", startOffset: -25, duration: 100,
    nextSteps: "Load new price books into sandbox and test quote generation.",
    tasks: ["Pricing requirements", "Price book design", "Configure price books", "Update quote templates", "Sales readiness", "Go live"] },
  { name: "RevOps Tech Stack Rationalization", description: "Inventory and consolidate RevOps tools to cut cost and complexity.", owner: TEAM[6], status: "not_started", startOffset: 35, duration: 120,
    nextSteps: "Compile tool inventory and gather contract renewal dates.",
    tasks: ["Tool inventory", "Usage & cost analysis", "Consolidation plan", "Vendor negotiations", "Migration execution", "Decommission & savings report"] },
];

const OWNER_ROTATION = (base: number, i: number) => TEAM[(base + i) % TEAM.length];

function build(spec: Spec, idx: number): Project {
  const start = addDays(TODAY, spec.startOffset);
  const end = addDays(start, spec.duration);
  const slice = spec.duration / 6;
  const ownerIdx = TEAM.indexOf(spec.owner);

  const phases: Phase[] = PHASES.map((name, p) => {
    const tasks: Task[] = [0, 1].map((k) => {
      const n = p * 2 + k;
      const tStart = addDays(start, Math.round(n * slice));
      const tDue = addDays(start, Math.round((n + 1) * slice) - 1);
      let status: TaskStatus;
      if (spec.status === "complete") status = "done";
      else if (spec.status === "not_started") status = "todo";
      else if (tDue < TODAY) status = "done";
      else if (tStart <= TODAY) status = "in_progress";
      else status = "todo";
      return { id: `p${idx}-t${n}`, title: spec.tasks[n], owner: OWNER_ROTATION(ownerIdx, n % 3 === 0 ? 0 : n), start: tStart, due: tDue, status };
    });
    return { id: `p${idx}-ph${p}`, name, tasks };
  });

  // reflect health on the current task
  const all = phases.flatMap((ph) => ph.tasks);
  const current = all.find((t) => t.status === "in_progress");
  if (current && spec.status === "off_track") { current.status = "blocked"; current.notes = "Blocked on vendor/integration dependency."; }
  if (current && spec.status === "at_risk" && idx % 2 === 0) { current.notes = "Dependency risk flagged."; }

  return { id: `proj-${idx + 1}`, name: spec.name, description: spec.description, owner: spec.owner,
    status: spec.status, start, end, nextSteps: spec.nextSteps, phases };
}

export const seedProjects = (): Project[] => SPECS.map(build);
