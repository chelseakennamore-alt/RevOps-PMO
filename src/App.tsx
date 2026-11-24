import { useState } from "react";
import Overview from "./components/Overview";
import ProjectDetail from "./components/ProjectDetail";
import CalendarView from "./components/CalendarView";
import ExecSummary from "./components/ExecSummary";

type View = "overview" | "calendar" | "exec";
const TABS: { id: View; label: string }[] = [
  { id: "overview", label: "Portfolio" }, { id: "calendar", label: "Calendar" }, { id: "exec", label: "Exec Summary" },
];

export default function App() {
  const [view, setView] = useState<View>("overview");
  const [projectId, setProjectId] = useState<string | null>(null);
  const open = (id: string) => { setProjectId(id); setView("overview"); };

  return (
    <div className="min-h-screen">
      <header className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="text-lg font-semibold text-indigo-700">RevOps PMO</div>
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => { setView(t.id); setProjectId(null); }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${view === t.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        {view === "overview" && (projectId
          ? <ProjectDetail id={projectId} onBack={() => setProjectId(null)} />
          : <Overview onOpen={open} />)}
        {view === "calendar" && <CalendarView onOpen={open} />}
        {view === "exec" && <ExecSummary onOpen={open} />}
      </main>
    </div>
  );
}
