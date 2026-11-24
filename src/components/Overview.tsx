import { useMemo, useState } from "react";
import { useStore } from "../store";
import { Btn, Card, ProgressBar, StatusBadge, inputCls } from "./ui";
import { STATUS_META, fmtShort, nextTask, progress } from "../lib";
import type { Status } from "../types";

export default function Overview({ onOpen }: { onOpen: (id: string) => void }) {
  const { projects, addProject, resetData } = useStore();
  const [status, setStatus] = useState<Status | "all">("all");
  const [owner, setOwner] = useState("all");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"cards" | "table">("cards");

  const owners = useMemo(() => [...new Set(projects.map((p) => p.owner).filter(Boolean))].sort(), [projects]);
  const list = projects.filter((p) =>
    (status === "all" || p.status === status) && (owner === "all" || p.owner === owner) &&
    p.name.toLowerCase().includes(q.toLowerCase()));
  const count = (s: Status) => projects.filter((p) => p.status === s).length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div><h1 className="text-2xl font-semibold">Portfolio overview</h1>
          <p className="text-sm text-slate-500">{projects.length} revenue operations projects</p></div>
        <div className="flex gap-2">
          <Btn onClick={() => { if (confirm("Reset all data to the sample projects?")) resetData(); }}>Reset sample data</Btn>
          <Btn variant="primary" onClick={() => onOpen(addProject())}>+ New project</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {(Object.keys(STATUS_META) as Status[]).map((s) => (
          <Card key={s} onClick={() => setStatus(status === s ? "all" : s)} className={status === s ? "ring-2 ring-indigo-400" : ""}>
            <div className="text-2xl font-semibold">{count(s)}</div>
            <StatusBadge status={s} />
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input className={`${inputCls} w-56`} placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={inputCls} value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="all">All owners</option>{owners.map((o) => <option key={o}>{o}</option>)}
        </select>
        <div className="ml-auto flex gap-1">
          <Btn variant={mode === "cards" ? "primary" : "default"} onClick={() => setMode("cards")}>Cards</Btn>
          <Btn variant={mode === "table" ? "primary" : "default"} onClick={() => setMode("table")}>Table</Btn>
        </div>
      </div>

      {mode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const nt = nextTask(p);
            return (
              <Card key={p.id} onClick={() => onOpen(p.id)} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{p.name}</h3><StatusBadge status={p.status} />
                </div>
                <p className="line-clamp-2 text-sm text-slate-500">{p.description}</p>
                <div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Progress</span><span>{progress(p)}%</span></div>
                  <ProgressBar value={progress(p)} /></div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Owner: <b className="text-slate-700">{p.owner || "—"}</b></span>
                  <span>Target: {fmtShort(p.end)}</span>
                </div>
                {nt && <div className="rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-600">Next: {nt.title} · {fmtShort(nt.due)}</div>}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="p-3">Project</th><th>Status</th><th>Owner</th><th>Progress</th><th>Target</th><th>Next task</th></tr></thead>
            <tbody>{list.map((p) => { const nt = nextTask(p); return (
              <tr key={p.id} onClick={() => onOpen(p.id)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-medium">{p.name}</td><td><StatusBadge status={p.status} /></td><td>{p.owner}</td>
                <td className="w-40 pr-4"><ProgressBar value={progress(p)} /></td><td>{fmtShort(p.end)}</td>
                <td className="text-slate-600">{nt ? `${nt.title} (${fmtShort(nt.due)})` : "—"}</td></tr>); })}</tbody>
          </table>
        </Card>
      )}
      {list.length === 0 && <p className="py-10 text-center text-slate-500">No projects match your filters.</p>}
    </div>
  );
}
