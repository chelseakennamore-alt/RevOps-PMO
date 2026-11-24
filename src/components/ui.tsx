import type { ReactNode } from "react";
import type { Status, TaskStatus } from "../types";
import { STATUS_META, TASK_STATUS_CLS, TASK_STATUS_LABEL } from "../lib";

export const StatusBadge = ({ status }: { status: Status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_META[status].cls}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[status].dot}`} />{STATUS_META[status].label}
  </span>
);
export const TaskBadge = ({ status }: { status: TaskStatus }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-medium ${TASK_STATUS_CLS[status]}`}>{TASK_STATUS_LABEL[status]}</span>
);
export const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-full rounded-full bg-slate-200">
    <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${value}%` }} />
  </div>
);
export const Card = ({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${onClick ? "cursor-pointer hover:border-indigo-300 hover:shadow" : ""} ${className}`}>{children}</div>
);
export const Btn = ({ children, onClick, variant = "default", className = "" }:
  { children: ReactNode; onClick?: () => void; variant?: "default" | "primary" | "danger"; className?: string }) => {
  const v = { default: "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    primary: "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700",
    danger: "border-red-200 bg-white text-red-600 hover:bg-red-50" }[variant];
  return <button onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${v} ${className}`}>{children}</button>;
};
export const inputCls = "rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none";
