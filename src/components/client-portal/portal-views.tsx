"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  FileText,
  Send,
  Upload,
} from "lucide-react";
import { ADVISORY_RESOURCES, DOCUMENT_CATEGORIES, LEGAL_RESOURCES, TAX_DEADLINES } from "@/data/client-portal";
import {
  addDocument,
  formatDate,
  formatDateTime,
  formatFileSize,
  getPortalData,
  getSession,
  markMessagesRead,
  sendMessage,
  toggleChecklistItem,
  updateProfile,
} from "@/lib/client-portal-store";
import { contact, externalLinks } from "@/data/site";
import type { DocumentCategory, PortalSession } from "@/types/client-portal";
import { PortalCard, PortalViewProps, StatCard, StatusBadge } from "./portal-ui";

export function DashboardView({ onNavigate }: PortalViewProps) {
  const data = getPortalData();
  const session = getSession();
  const unread = data.messages.filter((m) => !m.read && m.from === "firm").length;
  const openNotices = data.irsNotices.filter((n) => n.status !== "resolved").length;
  const checklistDone = data.checklist.filter((c) => c.done).length;
  const upcoming = TAX_DEADLINES.filter((d) => new Date(d.date) >= new Date()).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Welcome back, {session?.user.name.split(" ")[0]}
        </h2>
        <p className="text-muted text-sm mt-1">Your secure hub for tax, financial, and legal client services.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Documents" value={data.documents.length} sub="Uploaded this season" />
        <StatCard label="Unread Messages" value={unread} sub="From your tax team" />
        <StatCard label="Open IRS Items" value={openNotices} sub="Being handled by firm" />
        <StatCard label="Checklist" value={`${checklistDone}/${data.checklist.length}`} sub="Items completed" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <PortalCard title="2025 Tax Return Status">
          {data.taxReturns[0] && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground">{data.taxReturns[0].type}</span>
        <StatusBadge status={data.taxReturns[0].status} />
              </div>
              <p className="text-sm text-muted">Preparer: {data.taxReturns[0].preparer}</p>
              <p className="text-sm text-muted">Last updated: {formatDate(data.taxReturns[0].lastUpdated)}</p>
              <button
                type="button"
                onClick={() => onNavigate("tax-returns")}
                className="text-sm text-gold font-medium hover:underline inline-flex items-center gap-1"
              >
                View all returns <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </PortalCard>

        <PortalCard title="Upcoming Deadlines">
          <ul className="space-y-3">
            {upcoming.map((d) => (
              <li key={d.date + d.title} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{d.title}</p>
                  <p className="text-muted text-xs capitalize">{d.type}</p>
                </div>
                <span className="text-gold font-semibold shrink-0">{formatDate(d.date)}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onNavigate("calendar")}
            className="mt-3 text-sm text-gold font-medium hover:underline"
          >
            Full tax calendar →
          </button>
        </PortalCard>
      </div>

      <PortalCard title="Quick Actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: "Upload Document", section: "documents" as const },
            { label: "Send Message", section: "messages" as const },
            { label: "Schedule Appointment", href: "/contact/request-appointment" },
            { label: "Make Payment", href: externalLinks.makePayment, external: true },
          ].map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className="rounded-lg border border-border px-3 py-3 text-sm font-medium text-center hover:border-gold hover:text-gold transition-colors min-h-11 flex items-center justify-center"
              >
                {action.label}
              </Link>
            ) : (
              <button
                key={action.label}
                type="button"
                onClick={() => onNavigate(action.section!)}
                className="rounded-lg border border-border px-3 py-3 text-sm font-medium hover:border-gold hover:text-gold transition-colors min-h-11"
              >
                {action.label}
              </button>
            ),
          )}
        </div>
      </PortalCard>
    </div>
  );
}

export function DocumentsView({ onRefresh }: PortalViewProps) {
  const [category, setCategory] = useState<DocumentCategory>("W-2 & Income");
  const [taxYear, setTaxYear] = useState(2025);
  const data = getPortalData();

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    addDocument({ name: file.name, category, size: file.size, taxYear, file });
    onRefresh();
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Document Center</h2>
        <p className="text-muted text-sm mt-1">Securely upload W-2s, 1099s, receipts, business records, and legal documents.</p>
      </div>

      <PortalCard title="Upload New Document">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tax Year</label>
            <select
              value={taxYear}
              onChange={(e) => setTaxYear(Number(e.target.value))}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            >
              {[2026, 2025, 2024, 2023].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-gold bg-surface px-4 py-8 cursor-pointer transition-colors">
          <Upload className="h-8 w-8 text-gold" />
          <span className="text-sm font-medium text-foreground">Click to upload or drag files here</span>
          <span className="text-xs text-muted">PDF, JPG, PNG, XLSX up to 25 MB</span>
          <input type="file" className="sr-only" onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx" />
        </label>
      </PortalCard>

      <PortalCard title="Your Documents">
        <div className="space-y-3 md:hidden">
          {data.documents.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-border p-3">
              <div className="flex min-w-0 items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatFileSize(doc.size)} · {doc.category}</p>
                </div>
                <StatusBadge status={doc.status} />
              </div>
              <p className="mt-2 text-xs text-muted">{doc.taxYear} · Uploaded {formatDate(doc.uploadedAt)}</p>
            </div>
          ))}
        </div>
        <div className="-mx-4 hidden overflow-x-auto px-4 md:block sm:mx-0 sm:px-0">
          <table className="w-full min-w-[540px] text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="pb-2 px-4 font-medium">File</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Year</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {data.documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 text-gold shrink-0" />
                      <span className="max-w-48 truncate font-medium text-foreground">{doc.name}</span>
                      <span className="shrink-0 text-xs text-muted">({formatFileSize(doc.size)})</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted">{doc.category}</td>
                  <td className="py-3 text-muted">{doc.taxYear}</td>
                  <td className="py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="py-3 text-muted">{formatDate(doc.uploadedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>
    </div>
  );
}

export function TaxReturnsView() {
  const data = getPortalData();
  const steps = ["not-started", "in-progress", "review", "filed", "accepted"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tax Returns</h2>
        <p className="text-muted text-sm mt-1">Track preparation, review, filing, and IRS acceptance status by tax year.</p>
      </div>

      <div className="space-y-4">
        {data.taxReturns.map((ret) => {
          const stepIndex = steps.indexOf(ret.status);
          return (
            <PortalCard key={ret.year} title={`Tax Year ${ret.year}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="font-medium">{ret.type}</span>
                <StatusBadge status={ret.status} />
              </div>
              <div className="flex gap-1 mb-4">
                {steps.map((step, i) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full ${i <= stepIndex ? "bg-gold" : "bg-slate-200"}`}
                    title={step}
                  />
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <p>
                  <span className="text-muted">Preparer:</span> {ret.preparer}
                </p>
                <p>
                  <span className="text-muted">Last updated:</span> {formatDate(ret.lastUpdated)}
                </p>
                {ret.filedDate && (
                  <p>
                    <span className="text-muted">Filed:</span> {formatDate(ret.filedDate)}
                  </p>
                )}
                {ret.refundEstimate && (
                  <p>
                    <span className="text-muted">Result:</span>{" "}
                    <span className="text-gold font-semibold">{ret.refundEstimate}</span>
                  </p>
                )}
              </div>
              {ret.status === "accepted" && (
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-gold font-medium hover:underline"
                >
                  <Download className="h-4 w-4" /> Download completed return (PDF)
                </button>
              )}
            </PortalCard>
          );
        })}
      </div>
    </div>
  );
}

export function MessagesView({ onRefresh }: PortalViewProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const data = getPortalData();

  useEffect(() => {
    markMessagesRead();
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    sendMessage(subject.trim(), body.trim());
    setSubject("");
    setBody("");
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Secure Messages</h2>
        <p className="text-muted text-sm mt-1">Communicate privately with your tax preparer and advisory team.</p>
      </div>

      <PortalCard title="Compose Message">
        <form onSubmit={handleSend} className="space-y-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            required
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Your message…"
            rows={4}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated resize-y min-h-[100px]"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light min-h-11"
          >
            <Send className="h-4 w-4" /> Send Message
          </button>
        </form>
      </PortalCard>

      <PortalCard title="Message History">
        <div className="space-y-4">
          {data.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-4 ${msg.from === "firm" ? "border-gold/30 bg-gold/5" : "border-border bg-surface"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="font-semibold text-foreground">{msg.subject}</p>
                <span className="text-xs text-muted">{formatDateTime(msg.sentAt)}</span>
              </div>
              <p className="text-xs text-gold font-medium mb-2">{msg.from === "firm" ? "TEAMBASED Tax Services" : "You"}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{msg.body}</p>
            </div>
          ))}
        </div>
      </PortalCard>
    </div>
  );
}

export function AppointmentsView() {
  const data = getPortalData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Appointments</h2>
          <p className="text-muted text-sm mt-1">View scheduled consultations and past meetings.</p>
        </div>
        <Link
          href="/contact/request-appointment"
          className="inline-flex items-center justify-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-light min-h-11"
        >
          Schedule New Appointment
        </Link>
      </div>

      <div className="space-y-4">
        {data.appointments.map((apt) => (
          <PortalCard key={apt.id} title={apt.title}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <StatusBadge status={apt.status} />
              <span className="text-sm text-muted flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(apt.date)} at {apt.time}
              </span>
              <span className="text-sm text-muted">{apt.type}</span>
            </div>
            {apt.notes && <p className="text-sm text-slate-600">{apt.notes}</p>}
          </PortalCard>
        ))}
      </div>
    </div>
  );
}

export function BillingView() {
  const data = getPortalData();
  const totalDue = data.invoices.filter((i) => i.status === "due" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Billing & Payments</h2>
        <p className="text-muted text-sm mt-1">Review invoices, payment history, and outstanding balances.</p>
      </div>

      <StatCard label="Balance Due" value={`$${totalDue.toFixed(2)}`} sub="Outstanding invoices" />

      <PortalCard title="Invoices">
        <div className="space-y-3">
          {data.invoices.map((inv) => (
            <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">{inv.description}</p>
                <p className="text-sm text-muted">Due {formatDate(inv.dueDate)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-foreground">${inv.amount.toFixed(2)}</span>
                <StatusBadge status={inv.status} />
                {(inv.status === "due" || inv.status === "pending") && (
                  <a
                    href={externalLinks.makePayment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-lg border border-gold/30 px-3 text-sm font-medium text-gold hover:bg-gold/5 sm:min-h-0 sm:w-auto sm:border-0 sm:px-0 sm:hover:underline"
                  >
                    Pay <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </PortalCard>

      <PortalCard title="Refund Tracker">
        <p className="text-sm text-slate-600 mb-3">Check your federal refund status directly with the IRS.</p>
        <a
          href={externalLinks.refundStatus}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-gold text-gold px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-white transition-colors"
        >
          Where&apos;s My Refund? <ExternalLink className="h-4 w-4" />
        </a>
      </PortalCard>
    </div>
  );
}

export function IrsLegalView() {
  const data = getPortalData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">IRS & Legal Center</h2>
        <p className="text-muted text-sm mt-1">Track notices, representation cases, and access legal resources.</p>
      </div>

      <PortalCard title="IRS Notices">
        {data.irsNotices.length === 0 ? (
          <p className="text-sm text-muted">No open IRS notices on your account.</p>
        ) : (
          <div className="space-y-4">
            {data.irsNotices.map((n) => (
              <div key={n.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-bold text-foreground">{n.noticeNumber}</span>
                  <StatusBadge status={n.status} />
                </div>
                <p className="text-sm text-foreground mb-1">{n.topic}</p>
                <div className="text-xs text-muted space-y-1">
                  <p>Issued: {formatDate(n.issueDate)}</p>
                  {n.responseDue && <p className="text-red-600 font-medium">Response due: {formatDate(n.responseDue)}</p>}
                  <p>Assigned to: {n.assignedTo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PortalCard>

      <PortalCard title="Legal & Representation Cases">
        <div className="space-y-4">
          {data.legalCases.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">{c.title}</span>
                <StatusBadge status={c.status} />
                <span className="text-xs rounded-full bg-navy/10 text-navy px-2 py-0.5">{c.category}</span>
              </div>
              <p className="text-sm text-muted mb-1">Opened {formatDate(c.openedDate)}</p>
              <p className="text-sm text-slate-600">{c.nextStep}</p>
            </div>
          ))}
        </div>
        <Link href="/services/irs-representation" className="mt-4 inline-flex text-sm text-gold font-medium hover:underline">
          Learn about IRS Representation →
        </Link>
      </PortalCard>

      <PortalCard title="Legal Resource Library">
        <div className="grid sm:grid-cols-2 gap-3">
          {LEGAL_RESOURCES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="rounded-lg border border-border p-3 hover:border-gold transition-colors"
            >
              <p className="font-medium text-foreground text-sm">{r.title}</p>
              <p className="text-xs text-muted mt-1">{r.description}</p>
            </Link>
          ))}
        </div>
      </PortalCard>
    </div>
  );
}

export function AdvisoryView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Financial Advisory</h2>
        <p className="text-muted text-sm mt-1">Planning tools, retirement strategies, and business advisory resources.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {ADVISORY_RESOURCES.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="rounded-xl border border-border bg-surface-elevated p-5 hover:border-gold hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">{r.title}</h3>
            <p className="text-sm text-muted mt-2">{r.description}</p>
            <span className="inline-flex items-center gap-1 text-sm text-gold font-medium mt-3">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <PortalCard title="Planning Topics We Cover">
        <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
          {[
            "Retirement & IRA/Roth strategies",
            "Estimated tax & safe harbor planning",
            "Business entity optimization",
            "Cash flow & budgeting advisory",
            "Estate & gift tax planning",
            "Investment tax efficiency",
            "Education credits & 529 planning",
            "Real estate & rental property taxes",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </PortalCard>
    </div>
  );
}

export function ChecklistsView({ onRefresh }: PortalViewProps) {
  const data = getPortalData();
  const categories = [...new Set(data.checklist.map((c) => c.category))];
  const done = data.checklist.filter((c) => c.done).length;
  const pct = Math.round((done / data.checklist.length) * 100);

  function toggle(id: string) {
    toggleChecklistItem(id);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tax Preparation Checklist</h2>
        <p className="text-muted text-sm mt-1">Track documents and tasks needed for your return.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface-elevated p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-bold text-gold">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {categories.map((cat) => (
        <PortalCard key={cat} title={cat}>
          <ul className="space-y-2">
            {data.checklist
              .filter((c) => c.category === cat)
              .map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="flex items-start gap-3 w-full text-left p-2 rounded-lg hover:bg-surface transition-colors min-h-11"
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? "text-muted line-through" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </PortalCard>
      ))}
    </div>
  );
}

export function CalendarView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tax Calendar</h2>
        <p className="text-muted text-sm mt-1">Federal and Maryland key dates for the current tax season.</p>
      </div>

      <PortalCard title="Upcoming Deadlines">
        <div className="space-y-3">
          {TAX_DEADLINES.map((d) => {
            const isPast = new Date(d.date) < new Date();
            return (
              <div
                key={d.date + d.title}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border ${isPast ? "border-border opacity-60" : "border-gold/30 bg-gold/5"}`}
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{d.title}</p>
                  <p className="text-xs text-muted capitalize">{d.type}</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${isPast ? "text-muted" : "text-gold"}`}>
                  {formatDate(d.date)}
                </span>
              </div>
            );
          })}
        </div>
        <Link href="/resources/tax-due-dates" className="mt-4 inline-flex text-sm text-gold font-medium hover:underline">
          View full tax due dates page →
        </Link>
      </PortalCard>
    </div>
  );
}

export function ProfileView({
  onSessionUpdate,
  onEditTaxProfile,
}: {
  onSessionUpdate: (s: PortalSession) => void;
  onEditTaxProfile?: () => void;
}) {
  const session = getSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [phone, setPhone] = useState(session?.user.phone ?? "");
  const [saved, setSaved] = useState(false);

  if (!session) return null;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const updated = updateProfile({ name: name.trim(), phone: phone.trim() });
    if (updated) {
      onSessionUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Profile & Settings</h2>
        <p className="text-muted text-sm mt-1">Manage your account and Tax Client Checklist profile.</p>
      </div>

      <PortalCard
        title="Tax Client Checklist Profile"
        action={
          onEditTaxProfile ? (
            <button
              type="button"
              onClick={onEditTaxProfile}
              className="text-sm font-semibold text-gold hover:underline"
            >
              {session.user.profileComplete ? "Update checklist profile" : "Complete profile"}
            </button>
          ) : undefined
        }
      >
        <p className="text-sm text-slate-600">
          Status:{" "}
          <span className={`font-semibold ${session.user.profileComplete ? "text-green-700" : "text-amber-700"}`}>
            {session.user.profileComplete ? "Complete" : "Incomplete — finish your details and document uploads"}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted">
          Includes personal info, income documents, business records, vehicle expenses, and client notes from our Tax
          Client Checklist.
        </p>
      </PortalCard>

      <PortalCard title="Account Details">
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              value={session.user.email}
              disabled
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-slate-100 text-muted min-h-11"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            />
          </div>
          <div className="text-sm text-muted space-y-1">
            <p>Client since: {session.user.clientSince}</p>
            <p>Account type: {session.user.accountType}</p>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light min-h-11"
          >
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </PortalCard>

      <PortalCard title="Support">
        <p className="text-sm text-slate-600 mb-3">Need help with your portal or tax matters?</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href={`mailto:${contact.email}`} className="text-gold font-medium hover:underline">
            {contact.email}
          </a>
          <a href={contact.phoneHref} className="text-gold font-medium hover:underline">
            {contact.phone}
          </a>
        </div>
      </PortalCard>
    </div>
  );
}
