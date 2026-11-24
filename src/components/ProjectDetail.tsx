import { useState } from "react";
import { useStore } from "../store";
import { Btn, Card, ProgressBar, TaskBadge, inputCls } from "./ui";
import { STATUS_META, TASK_STATUS_LABEL, isOverdue, progress } from "../lib";
import type { Status, TaskStatus } from "../types";

export default function ProjectDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const s = useStore();
  const p = s.projects.find((x) => x.id === id);
  const [newPhase, setNewPhase] = useState("");
  if (!p) return <div>Project not found. <Btn onClick={onBack}>Back</Btn></div>;
  const up = (patch: Parameters<typeof s.updateProject>[1]) => s.updateProject(p.id, patch);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Btn onClick={onBack}>← All projects</Btn>
        <Btn variant="danger" onClick={() => { if (confirm(`Delete "${p.name}"?`)) { s.deleteProject(p.id); onBack(); } }}>Delete project</Btn>
      </div>

      <Card className="space-y-3">
        <input className={`${inputCls} w-full text-xl font-semibold`} value={p.name} onChange={(e) => up({ name: e.target.value })} />
        <textarea className={`${inputCls} w-full`} rows={2} placeholder="Description" value={p.description} onChange={(e) => up({ description: e.target.value })} />
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-xs text-slate-500">Owner
            <input className={`${inputCls} mt-1 w-full`} list="people" value={p.owner} onChange={(e) => up({ owner: e.target.value })} /></label>
          <label className="text-xs text-slate-500">Status
            <select className={`${inputCls} mt-1 w-full`} value={p.status} onChange={(e) => up({ status: e.target.value as Status })}>
              {(Object.keys(STATUS_META) as Status[]).map((k) => <option key={k} value={k}>{STATUS_META[k].label}</option>)}</select></label>
          <label className="text-xs text-slate-500">Start
            <input type="date" className={`${inputCls} mt-1 w-full`} value={p.start} onChange={(e) => up({ start: e.target.value })} /></label>
          <label className="text-xs text-slate-500">Target end
            <input type="date" className={`${inputCls} mt-1 w-full`} value={p.end} onChange={(e) => up({ end: e.target.value })} /></label>
        </div>
        <label className="block text-xs text-slate-500">Next steps (shown in exec summary)
          <textarea className={`${inputCls} mt-1 w-full`} rows={2} value={p.nextSteps} onChange={(e) => up({ nextSteps: e.target.value })} /></label>
        <div><div className="mb-1 text-xs text-slate-500">Progress {progress(p)}% (tasks done)</div><ProgressBar value={progress(p)} /></div>
      </Card>
      <datalist id="people">{s.people.map((n) => <option key={n} value={n} />)}</datalist>

      <div className="space-y-4">
        {p.phases.map((ph) => (
          <Card key={ph.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input className={`${inputCls} flex-1 font-semibold`} value={ph.name} onChange={(e) => s.renamePhase(p.id, ph.id, e.target.value)} />
              <Btn onClick={() => s.addTask(p.id, ph.id)}>+ Task</Btn>
              <Btn variant="danger" onClick={() => { if (confirm(`Delete phase "${ph.name}" and its tasks?`)) s.deletePhase(p.id, ph.id); }}>Delete</Btn>
            </div>
            {ph.tasks.length > 0 && (
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-1">Task</th><th>Owner</th><th>Start</th><th>Due</th><th>Status</th><th /></tr></thead>
                <tbody>{ph.tasks.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="py-1.5 pr-2"><input className={`${inputCls} w-full min-w-48`} value={t.title}
                      onChange={(e) => s.updateTask(p.id, ph.id, t.id, { title: e.target.value })} /></td>
                    <td className="pr-2"><input className={`${inputCls} w-36`} list="people" value={t.owner}
                      onChange={(e) => s.updateTask(p.id, ph.id, t.id, { owner: e.target.value })} /></td>
                    <td className="pr-2"><input type="date" className={inputCls} value={t.start}
                      onChange={(e) => s.updateTask(p.id, ph.id, t.id, { start: e.target.value })} /></td>
                    <td className="pr-2"><input type="date" className={`${inputCls} ${isOverdue(t) ? "border-red-400 text-red-600" : ""}`} value={t.due}
                      onChange={(e) => s.updateTask(p.id, ph.id, t.id, { due: e.target.value })} /></td>
                    <td className="pr-2"><select className={inputCls} value={t.status}
                      onChange={(e) => s.updateTask(p.id, ph.id, t.id, { status: e.target.value as TaskStatus })}>
                      {(Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).map((k) => <option key={k} value={k}>{TASK_STATUS_LABEL[k]}</option>)}</select>
                      <span className="ml-2 hidden lg:inline"><TaskBadge status={t.status} /></span></td>
                    <td><button className="text-slate-400 hover:text-red-600" title="Delete task" onClick={() => s.deleteTask(p.id, ph.id, t.id)}>✕</button></td>
                  </tr>))}</tbody></table></div>
            )}
          </Card>
        ))}
        <Card className="flex gap-2">
          <input className={`${inputCls} flex-1`} placeholder="New phase name…" value={newPhase} onChange={(e) => setNewPhase(e.target.value)} />
          <Btn variant="primary" onClick={() => { if (newPhase.trim()) { s.addPhase(p.id, newPhase.trim()); setNewPhase(""); } }}>+ Add phase</Btn>
        </Card>
      </div>
    </div>
  );
}
