import { useMemo, useState } from "react";
import { useStore } from "../store";
import { Btn, Card, TaskBadge, inputCls } from "./ui";
import { TODAY, addDays, fmt, isOverdue } from "../lib";

const COLORS = ["bg-indigo-100 text-indigo-800", "bg-emerald-100 text-emerald-800", "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800", "bg-sky-100 text-sky-800", "bg-violet-100 text-violet-800", "bg-teal-100 text-teal-800", "bg-orange-100 text-orange-800"];

export default function CalendarView({ onOpen }: { onOpen: (id: string) => void }) {
  const { projects, people } = useStore();
  const [month, setMonth] = useState(() => TODAY.slice(0, 7));
  const [projectF, setProjectF] = useState("all");
  const [ownerF, setOwnerF] = useState("all");
  const [hideDone, setHideDone] = useState(false);

  const items = useMemo(() => projects.flatMap((p, i) => p.phases.flatMap((ph) => ph.tasks.map((t) => ({
    ...t, projectId: p.id, projectName: p.name, phase: ph.name, color: COLORS[i % COLORS.length] }))))
    .filter((t) => (projectF === "all" || t.projectId === projectF) && (ownerF === "all" || t.owner === ownerF) && (!hideDone || t.status !== "done")),
    [projects, projectF, ownerF, hideDone]);

  const [y, m] = month.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const gridStart = addDays(`${month}-01`, -first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const shift = (n: number) => { const d = new Date(y, m - 1 + n, 1); setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); };
  const byDay = (d: string) => items.filter((t) => t.due === d);
  const upcoming = items.filter((t) => t.status !== "done" && t.due >= TODAY && t.due <= addDays(TODAY, 30))
    .sort((a, b) => a.due.localeCompare(b.due));
  const overdue = items.filter(isOverdue).sort((a, b) => a.due.localeCompare(b.due));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-semibold">Calendar</h1><p className="text-sm text-slate-500">Tasks shown on their due date</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <select className={inputCls} value={projectF} onChange={(e) => setProjectF(e.target.value)}>
            <option value="all">All projects</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select className={inputCls} value={ownerF} onChange={(e) => setOwnerF(e.target.value)}>
            <option value="all">All owners</option>{people.map((o) => <option key={o}>{o}</option>)}</select>
          <label className="flex items-center gap-1 text-sm text-slate-600"><input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />Hide done</label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-1"><Btn onClick={() => shift(-1)}>‹</Btn><Btn onClick={() => setMonth(TODAY.slice(0, 7))}>Today</Btn><Btn onClick={() => shift(1)}>›</Btn></div>
            <div className="font-semibold">{first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div><div className="w-24" />
          </div>
          <div className="grid grid-cols-7 border-l border-t border-slate-200 text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="border-b border-r border-slate-200 bg-slate-50 p-1 text-center font-medium text-slate-500">{d}</div>)}
            {days.map((d) => {
              const ts = byDay(d); const inMonth = d.startsWith(month);
              return (
                <div key={d} className={`min-h-24 border-b border-r border-slate-200 p-1 ${inMonth ? "bg-white" : "bg-slate-50 text-slate-400"}`}>
                  <div className={`mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${d === TODAY ? "bg-indigo-600 text-white" : ""}`}>{Number(d.slice(8))}</div>
                  <div className="space-y-0.5">
                    {ts.slice(0, 3).map((t) => (
                      <button key={t.id} onClick={() => onOpen(t.projectId)} title={`${t.projectName} — ${t.title} (${t.owner})`}
                        className={`block w-full truncate rounded px-1 text-left ${t.color} ${t.status === "done" ? "line-through opacity-60" : ""} ${isOverdue(t) ? "ring-1 ring-red-400" : ""}`}>{t.title}</button>))}
                    {ts.length > 3 && <div className="px-1 text-slate-500">+{ts.length - 3} more</div>}
                  </div>
                </div>);
            })}
          </div>
        </Card>

        <div className="space-y-4">
          {overdue.length > 0 && <Card><h3 className="mb-2 text-sm font-semibold text-red-700">Overdue ({overdue.length})</h3>
            <ul className="space-y-2 text-sm">{overdue.slice(0, 6).map((t) => <Row key={t.id} t={t} onOpen={onOpen} />)}</ul></Card>}
          <Card><h3 className="mb-2 text-sm font-semibold">Next 30 days ({upcoming.length})</h3>
            <ul className="max-h-[520px] space-y-2 overflow-y-auto text-sm">
              {upcoming.map((t) => <Row key={t.id} t={t} onOpen={onOpen} />)}
              {upcoming.length === 0 && <li className="text-slate-500">Nothing due.</li>}</ul></Card>
        </div>
      </div>
    </div>
  );
}

function Row({ t, onOpen }: { t: { id: string; title: string; due: string; owner: string; projectName: string; projectId: string; status: any }; onOpen: (id: string) => void }) {
  return (
    <li className="cursor-pointer rounded-md p-1.5 hover:bg-slate-50" onClick={() => onOpen(t.projectId)}>
      <div className="flex justify-between gap-2"><span className="font-medium">{t.title}</span><TaskBadge status={t.status} /></div>
      <div className="text-xs text-slate-500">{t.projectName} · {t.owner} · {fmt(t.due)}</div>
    </li>);
}
