export function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-border bg-surface">
        <h3 className="font-semibold text-foreground text-sm sm:text-base">{title}</h3>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

export function DeleteButton({ onClick, label = "Remove" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline min-h-9 px-2"
    >
      {label}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "in-progress": "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    received: "bg-slate-100 text-slate-700",
    reviewing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    paid: "bg-green-100 text-green-800",
    due: "bg-amber-100 text-amber-800",
    pending: "bg-slate-100 text-slate-700",
    scheduled: "bg-blue-100 text-blue-800",
    active: "bg-amber-100 text-amber-800",
    "in-representation": "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${colors[status] ?? "bg-slate-100 text-slate-700"}`}>
      {status.replace(/-/g, " ")}
    </span>
  );
}
