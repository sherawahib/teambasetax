"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { StarRatingDisplay } from "@/components/StarRating";
import { formatDate, formatDateTime } from "@/lib/client-portal-store";
import {
  deleteFeedback,
  deletePortalItem,
  deleteClient,
  fetchAdminClients,
  fetchAdminPortalData,
  fetchAdminTestimonials,
  sendAdminReply,
  updatePortalItem,
} from "@/lib/admin-store";
import type { ServerPortalData } from "@/lib/portal-server-store";
import type { Testimonial } from "@/types/testimonial";
import { AdminCard, DeleteButton, StatusBadge } from "./admin-ui";

type ViewProps = { onRefresh: () => void; refreshKey: number };

export function AdminDashboardView({ refreshKey }: ViewProps) {
  const [portal, setPortal] = useState<ServerPortalData | null>(null);
  const [feedback, setFeedback] = useState<{ count: number; averageRating: number } | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminPortalData(), fetchAdminTestimonials()]).then(([p, t]) => {
      setPortal(p);
      setFeedback({ count: t.count, averageRating: t.averageRating });
    });
  }, [refreshKey]);

  if (!portal || !feedback) return <p className="text-sm text-muted p-4">Loading dashboard…</p>;

  const unread = portal.messages.filter((m) => !m.read && m.from === "client").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted mt-1">Overview of client portal activity and feedback.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Client Feedback", value: feedback.count },
          { label: "Avg Rating", value: feedback.averageRating.toFixed(1) },
          { label: "Documents", value: portal.documents.length },
          { label: "Unread Messages", value: unread },
        ].map((s) => (
          <div key={s.label} className="min-w-0 rounded-xl border border-border bg-surface-elevated p-3 shadow-sm sm:p-4">
            <p className="line-clamp-2 text-xs font-medium text-muted">{s.label}</p>
            <p className="mt-1 break-words text-xl font-bold text-foreground sm:text-2xl">{s.value}</p>
          </div>
        ))}
      </div>
      <AdminCard title="Quick Links">
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/resources/client-portal" className="text-gold font-medium hover:underline">
            View Client Portal →
          </Link>
          <Link href="/contact/share-testimonial" className="text-gold font-medium hover:underline">
            Share Testimonial Page →
          </Link>
        </div>
      </AdminCard>
    </div>
  );
}

export function AdminFeedbackView({ onRefresh, refreshKey }: ViewProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminTestimonials().then((d) => setTestimonials(d.testimonials));
  }, [refreshKey]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this feedback from the website carousel?")) return;
    setDeleting(id);
    try {
      await deleteFeedback(id);
      onRefresh();
    } catch {
      alert("Could not remove feedback.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Client Feedback</h2>
        <p className="text-sm text-muted mt-1">Manage testimonials on the homepage. Remove spam or inappropriate reviews.</p>
      </div>

      {testimonials.length === 0 ? (
        <AdminCard title="No Feedback">
          <p className="text-sm text-muted">No client reviews yet.</p>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <AdminCard key={t.id} title={t.name}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <StarRatingDisplay rating={t.rating} size="md" />
                  <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-xs text-muted">
                    {t.service}
                    {t.location ? ` · ${t.location}` : ""} · {formatDate(t.createdAt)}
                    {t.email ? ` · ${t.email}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={deleting === t.id}
                  onClick={() => handleDelete(t.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors min-h-11 shrink-0 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting === t.id ? "Removing…" : "Remove Feedback"}
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminMessagesView({ onRefresh, refreshKey }: ViewProps) {
  const [messages, setMessages] = useState<ServerPortalData["messages"]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    fetchAdminPortalData().then((d) => setMessages(d.messages));
  }, [refreshKey]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    await sendAdminReply(subject.trim(), body.trim());
    setSubject("");
    setBody("");
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await deletePortalItem("messages", id);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Client Messages</h2>
        <p className="text-sm text-muted mt-1">View client messages and send firm replies.</p>
      </div>

      <AdminCard title="Reply to Client">
        <form onSubmit={handleReply} className="space-y-3 max-w-xl">
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
            placeholder="Your reply…"
            rows={4}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated resize-y"
            required
          />
          <button type="submit" className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light min-h-11">
            Send Reply
          </button>
        </form>
      </AdminCard>

      <AdminCard title="All Messages">
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{m.subject}</p>
                <p className="text-xs text-gold mt-0.5">
                  {m.from === "firm" ? "Firm" : "Client"} · {formatDateTime(m.sentAt)}
                </p>
                <p className="text-sm text-slate-600 mt-2">{m.body}</p>
              </div>
              <DeleteButton onClick={() => handleDelete(m.id)} />
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

export function AdminDocumentsView({ onRefresh, refreshKey }: ViewProps) {
  const [documents, setDocuments] = useState<ServerPortalData["documents"]>([]);

  useEffect(() => {
    fetchAdminPortalData().then((d) => setDocuments(d.documents));
  }, [refreshKey]);

  async function setStatus(id: string, status: string) {
    await updatePortalItem("documents", id, { status });
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document record?")) return;
    await deletePortalItem("documents", id);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Client Documents</h2>
        <p className="text-sm text-muted mt-1">Review uploaded files and update review status.</p>
      </div>
      <AdminCard title="Document Library">
        <div className="space-y-3 md:hidden">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-border p-3">
              <p className="break-words text-sm font-medium text-foreground">{doc.name}</p>
              <p className="mt-1 text-xs text-muted">{doc.category}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <select
                  value={doc.status}
                  onChange={(e) => setStatus(doc.id, e.target.value)}
                  className="min-h-11 rounded border border-border bg-surface-elevated px-2 py-1 text-base sm:text-sm"
                >
                  {["received", "reviewing", "approved", "needs-action"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <DeleteButton onClick={() => handleDelete(doc.id)} />
              </div>
            </div>
          ))}
        </div>
        <div className="-mx-4 hidden overflow-x-auto px-4 md:block sm:mx-0 sm:px-0">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="pb-2 font-medium">File</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{doc.name}</td>
                  <td className="py-3 text-muted">{doc.category}</td>
                  <td className="py-3">
                    <select
                      value={doc.status}
                      onChange={(e) => setStatus(doc.id, e.target.value)}
                      className="rounded border border-border px-2 py-1 text-xs bg-surface-elevated"
                    >
                      {["received", "reviewing", "approved", "needs-action"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <DeleteButton onClick={() => handleDelete(doc.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

export function AdminTaxReturnsView({ onRefresh, refreshKey }: ViewProps) {
  const [returns, setReturns] = useState<ServerPortalData["taxReturns"]>([]);

  useEffect(() => {
    fetchAdminPortalData().then((d) => setReturns(d.taxReturns));
  }, [refreshKey]);

  async function setStatus(year: number, status: string) {
    await updatePortalItem("taxReturns", String(year), { status, lastUpdated: new Date().toISOString() });
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tax Returns</h2>
        <p className="text-sm text-muted mt-1">Update return preparation and filing status.</p>
      </div>
      <div className="space-y-4">
        {returns.map((ret) => (
          <AdminCard key={ret.year} title={`Tax Year ${ret.year} — ${ret.type}`}>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={ret.status} />
              <select
                value={ret.status}
                onChange={(e) => setStatus(ret.year, e.target.value)}
                className="rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated min-h-11"
              >
                {["not-started", "in-progress", "review", "filed", "accepted"].map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted">Preparer: {ret.preparer}</span>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

export function AdminAppointmentsView({ onRefresh, refreshKey }: ViewProps) {
  const [appointments, setAppointments] = useState<ServerPortalData["appointments"]>([]);

  useEffect(() => {
    fetchAdminPortalData().then((d) => setAppointments(d.appointments));
  }, [refreshKey]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this appointment?")) return;
    await deletePortalItem("appointments", id);
    onRefresh();
  }

  async function setStatus(id: string, status: string) {
    await updatePortalItem("appointments", id, { status });
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Appointments</h2>
        <p className="text-sm text-muted mt-1">Manage scheduled client consultations.</p>
      </div>
      <div className="space-y-3">
        {appointments.map((a) => (
          <AdminCard key={a.id} title={a.title}>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span>
                {formatDate(a.date)} at {a.time}
              </span>
              <span className="text-muted">{a.type}</span>
              <select
                value={a.status}
                onChange={(e) => setStatus(a.id, e.target.value)}
                className="rounded border border-border px-2 py-1 text-xs bg-surface-elevated"
              >
                {["scheduled", "completed", "cancelled"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <DeleteButton onClick={() => handleDelete(a.id)} />
            </div>
            {a.notes && <p className="text-sm text-muted mt-2">{a.notes}</p>}
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

export function AdminBillingView({ onRefresh, refreshKey }: ViewProps) {
  const [invoices, setInvoices] = useState<ServerPortalData["invoices"]>([]);

  useEffect(() => {
    fetchAdminPortalData().then((d) => setInvoices(d.invoices));
  }, [refreshKey]);

  async function setStatus(id: string, status: string) {
    await updatePortalItem("invoices", id, { status });
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice?")) return;
    await deletePortalItem("invoices", id);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Billing & Invoices</h2>
        <p className="text-sm text-muted mt-1">Update payment status and manage invoices.</p>
      </div>
      <div className="space-y-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-surface-elevated"
          >
            <div>
              <p className="font-medium">{inv.description}</p>
              <p className="text-sm text-muted">
                Due {formatDate(inv.dueDate)} · ${inv.amount.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={inv.status}
                onChange={(e) => setStatus(inv.id, e.target.value)}
                className="rounded border border-border px-2 py-1 text-xs bg-surface-elevated min-h-9"
              >
                {["paid", "due", "overdue", "pending"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <DeleteButton onClick={() => handleDelete(inv.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminIrsLegalView({ onRefresh, refreshKey }: ViewProps) {
  const [notices, setNotices] = useState<ServerPortalData["irsNotices"]>([]);
  const [cases, setCases] = useState<ServerPortalData["legalCases"]>([]);

  useEffect(() => {
    fetchAdminPortalData().then((d) => {
      setNotices(d.irsNotices);
      setCases(d.legalCases);
    });
  }, [refreshKey]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">IRS & Legal Cases</h2>
        <p className="text-sm text-muted mt-1">Track IRS notices and representation cases.</p>
      </div>
      <AdminCard title="IRS Notices">
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{n.noticeNumber}</p>
                <p className="break-words text-sm text-slate-600">{n.topic}</p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end">
                <StatusBadge status={n.status} />
                <DeleteButton
                  onClick={async () => {
                    await deletePortalItem("irsNotices", n.id);
                    onRefresh();
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
      <AdminCard title="Legal Cases">
        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-sm">{c.title}</p>
                <p className="break-words text-xs text-muted">
                  {c.category} · {c.nextStep}
                </p>
              </div>
              <DeleteButton
                onClick={async () => {
                  await deletePortalItem("legalCases", c.id);
                  onRefresh();
                }}
              />
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

export function AdminClientsView({ onRefresh, refreshKey }: ViewProps) {
  const [clients, setClients] = useState<import("@/types/client-portal").PortalUser[]>([]);

  useEffect(() => {
    fetchAdminClients().then((d) => setClients(d.clients));
  }, [refreshKey]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this client account?")) return;
    await deleteClient(id);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Client Accounts</h2>
        <p className="text-sm text-muted mt-1">Registered client portal users.</p>
      </div>
      <AdminCard title={`Registered Clients (${clients.length})`}>
        {clients.length === 0 ? (
          <p className="text-sm text-muted">No registered clients yet.</p>
        ) : (
          <ul className="space-y-2">
            {clients.map((c) => (
              <li key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-border">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="break-all text-xs text-muted">{c.email}</p>
                  <p className="text-xs text-muted">{c.phone} · {c.accountType} · Since {c.clientSince}</p>
                </div>
                {c.id !== "client-demo" && (
                  <DeleteButton onClick={() => handleDelete(c.id)} label="Remove Account" />
                )}
              </li>
            ))}
          </ul>
        )}
        <Link href="/resources/client-portal" className="inline-block mt-4 text-sm text-gold font-medium hover:underline">
          Open Client Portal →
        </Link>
      </AdminCard>
    </div>
  );
}
