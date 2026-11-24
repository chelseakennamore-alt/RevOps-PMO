import { useStore } from "../store";
import { Btn, Card, ProgressBar, StatusBadge } from "./ui";
import { STATUS_META, TODAY, addDays, allTasks, fmt, fmtShort, isOverdue, nextTask, progress } from "../lib";
import type { Status } from "../types";

export default function ExecSummary({ onOpen }: { onOpen: (id: string) => void }) {
  const { projects } = useStore();
  const n = projects.length;
  const count = (s: Status) => projects.filter((p) => p.status === s).length;
  const avg = n ? Math.round(projects.reduce((a, p) => a + progress(p), 0) / n) : 0;
  const tasks = projects.flatMap((p) => allTasks(p).map((t) => ({ ...t, project: p.name, pid: p.id })));
  const overdue = tasks.filter(isOverdue);
  const upcoming = tasks.filter((t) => t.status !== "done" && t.due >= TODAY && t.due <= addDays(TODAY, 14)).sort((a, b) => a.due.localeCompare(b.due));
  const attention = projects.filter((p) => p.status === "at_risk" || p.status === "off_track");
  const order: Status[] = ["off_track", "at_risk", "on_track", "not_started", "complete"];
  const sorted = [...projects].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

  const headline = count("not_started") === n
    ? `${n} projects are loaded; none have started yet. Add owners, dates and status to populate this summary.`
    : attention.length === 0
    ? `All ${n} projects are healthy.`
    : `${count("on_track") + count("complete")} of ${n} projects are on track or complete; ${attention.length} need attention.`;

  return (
    <div className="space-y-5">
      <div className="no-print flex justify-end"><Btn onClick={() => window.print()}>Print / Save as PDF</Btn></div>
      <div>
        <h1 className="text-2xl font-semibold">RevOps Portfolio — Executive Summary</h1>
        <p className="text-sm text-slate-500">As of {fmt(TODAY)}</p>
        <p className="mt-2 text-lg">{headline}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card><div className="text-3xl font-semibold">{n}</div><div className="text-sm text-slate-500">Active projects</div></Card>
        <Card><div className="text-3xl font-semibold">{avg}%</div><div className="text-sm text-slate-500">Avg. task completion</div></Card>
        <Card><div className={`text-3xl font-semibold ${overdue.length ? "text-red-600" : ""}`}>{overdue.length}</div><div className="text-sm text-slate-500">Overdue tasks</div></Card>
        <Card><div className="text-3xl font-semibold">{upcoming.length}</div><div className="text-sm text-slate-500">Tasks due in 14 days</div></Card>
      </div>

      <Card>
        <div className="mb-2 text-sm font-semibold">Health distribution</div>
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
          {order.map((s) => count(s) > 0 && <div key={s} className={STATUS_META[s].dot} style={{ width: `${(count(s) / n) * 100}%` }} title={`${STATUS_META[s].label}: ${count(s)}`} />)}
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
          {order.map((s) => <span key={s} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${STATUS_META[s].dot}`} />{STATUS_META[s].label}: {count(s)}</span>)}
        </div>
      </Card>

      {attention.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <h2 className="mb-2 font-semibold">Needs attention</h2>
          <ul className="space-y-2 text-sm">{attention.map((p) => (
            <li key={p.id}><b>{p.name}</b> <StatusBadge status={p.status} /> — {p.nextSteps || "No next steps recorded."}</li>))}</ul>
        </Card>
      )}

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="p-3">Project</th><th>Status</th><th>Owner</th><th>Progress</th><th>Target</th><th>Next steps</th></tr></thead>
          <tbody>{sorted.map((p) => { const nt = nextTask(p); return (
            <tr key={p.id} className="border-t border-slate-100 align-top">
              <td className="p-3"><button className="no-print-link text-left font-medium text-indigo-700 hover:underline" onClick={() => onOpen(p.id)}>{p.name}</button>
                <div className="text-xs text-slate-500">{p.description}</div></td>
              <td className="py-3"><StatusBadge status={p.status} /></td><td className="py-3">{p.owner}</td>
              <td className="w-32 py-3 pr-4"><div className="mb-1 text-xs">{progress(p)}%</div><ProgressBar value={progress(p)} /></td>
              <td className="py-3">{fmtShort(p.end)}</td>
              <td className="py-3 pr-3">{p.nextSteps}{nt && <div className="mt-1 text-xs text-slate-500">Next task: {nt.title} ({nt.owner}, {fmtShort(nt.due)})</div>}</td>
            </tr>); })}</tbody>
        </table>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Coming up — next 14 days</h2>
        {upcoming.length === 0 ? <p className="text-sm text-slate-500">Nothing due.</p> :
          <ul className="grid gap-x-8 gap-y-1 text-sm md:grid-cols-2">{upcoming.map((t) => (
            <li key={t.id}><span className="text-slate-500">{fmtShort(t.due)}</span> · {t.title} <span className="text-slate-500">— {t.project}, {t.owner}</span></li>))}</ul>}
      </Card>
    </div>
  );
}
