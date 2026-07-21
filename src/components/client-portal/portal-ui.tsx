import type { PortalSection } from "@/types/client-portal";

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const colors: Record<string, string> = {
    "not-started": "bg-slate-100 text-slate-700",
    "in-progress": "bg-blue-100 text-blue-800",
    review: "bg-amber-100 text-amber-800",
    filed: "bg-emerald-100 text-emerald-800",
    accepted: "bg-green-100 text-green-800",
    received: "bg-slate-100 text-slate-700",
    reviewing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    "needs-action": "bg-red-100 text-red-800",
    open: "bg-red-100 text-red-800",
    "in-representation": "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-800",
    active: "bg-amber-100 text-amber-800",
    monitoring: "bg-blue-100 text-blue-800",
    closed: "bg-slate-100 text-slate-700",
    paid: "bg-green-100 text-green-800",
    due: "bg-amber-100 text-amber-800",
    overdue: "bg-red-100 text-red-800",
    pending: "bg-slate-100 text-slate-700",
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[status] ?? "bg-slate-100 text-slate-700"}`}>
      {label}
    </span>
  );
}

export function PortalCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border bg-surface">
        <h3 className="font-semibold text-foreground text-sm sm:text-base">{title}</h3>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface-elevated p-3 shadow-sm sm:p-5">
      <p className="line-clamp-2 text-xs font-medium text-muted sm:text-sm">{label}</p>
      <p className="mt-1 break-words text-xl font-bold text-foreground sm:text-3xl">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export type PortalViewProps = {
  onNavigate: (section: PortalSection) => void;
  refreshKey: number;
  onRefresh: () => void;
};
