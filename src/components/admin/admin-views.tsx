"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { StarRatingDisplay } from "@/components/StarRating";
import { formatDate, formatDateTime } from "@/lib/client-portal-store";
import {
  deleteFeedback,
  deletePortalItem,
  deleteClient,
  deleteSubmission,
  downloadAdminDocument,
  fetchAdminClientDetail,
  fetchAdminClients,
  fetchAdminPortalData,
  fetchAdminSubmissions,
  fetchAdminTestimonials,
  createAdminTaxReturn,
  markSubmissionRead,
  sendAdminReply,
  updatePortalItem,
} from "@/lib/admin-store";
import type { FormSubmissionRecord } from "@/lib/form-submissions-store";
import type { PortalClientDetail } from "@/lib/portal-clients-store";
import type { ServerPortalData } from "@/lib/portal-server-store";
import type { Testimonial } from "@/types/testimonial";
import { AdminCard, DeleteButton, StatusBadge } from "./admin-ui";

type ViewProps = { onRefresh: () => void; refreshKey: number };

export function AdminDashboardView({ refreshKey }: ViewProps) {
  const [portal, setPortal] = useState<ServerPortalData | null>(null);
  const [feedback, setFeedback] = useState<{ count: number; averageRating: number } | null>(null);
  const [inboxUnread, setInboxUnread] = useState(0);

  useEffect(() => {
    Promise.all([fetchAdminPortalData(), fetchAdminTestimonials(), fetchAdminSubmissions()]).then(
      ([p, t, s]) => {
        setPortal(p);
        setFeedback({ count: t.count, averageRating: t.averageRating });
        setInboxUnread(s.unread);
      },
    );
  }, [refreshKey]);

  if (!portal || !feedback) return <p className="text-sm text-muted p-4">Loading dashboard…</p>;

  const unread = portal.messages.filter((m) => !m.read && m.from === "client").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted mt-1">
          Notifications go to michael.reis@teambasedtax.com — submissions also appear in Form Inbox.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: "Form Inbox (new)", value: inboxUnread },
          { label: "Client Feedback", value: feedback.count },
          { label: "Avg Rating", value: feedback.averageRating.toFixed(1) },
          { label: "Documents", value: portal.documents.length },
          { label: "Unread Portal Msgs", value: unread },
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

const TYPE_LABEL: Record<string, string> = {
  contact: "Contact form",
  appointment: "Appointment request",
  newsletter: "Newsletter signup",
};

export function AdminInboxView({ onRefresh, refreshKey }: ViewProps) {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState<"all" | "contact" | "appointment" | "newsletter">("all");

  useEffect(() => {
    fetchAdminSubmissions().then((d) => {
      setSubmissions(d.submissions);
      setUnread(d.unread);
    });
  }, [refreshKey]);

  const visible = filter === "all" ? submissions : submissions.filter((s) => s.type === filter);

  async function markRead(id: string) {
    await markSubmissionRead(id, true);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    await deleteSubmission(id);
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Form Inbox</h2>
        <p className="text-sm text-muted mt-1">
          Website contact, appointment, and newsletter submissions. Email copies also go to{" "}
          <span className="text-foreground font-medium">michael.reis@teambasedtax.com</span>.
          {unread > 0 ? ` · ${unread} unread` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "contact", "appointment", "newsletter"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium min-h-11 ${
              filter === f ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted"
            }`}
          >
            {f === "all" ? "All" : TYPE_LABEL[f]}
          </button>
        ))}
      </div>

      <AdminCard title={`Submissions (${visible.length})`}>
        {visible.length === 0 ? (
          <p className="text-sm text-muted">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {visible.map((s) => (
              <li
                key={s.id}
                className={`rounded-lg border p-3 sm:p-4 ${
                  s.read ? "border-border bg-surface" : "border-gold/40 bg-gold/5"
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {!s.read && <span className="mr-2 text-gold">●</span>}
                      {s.subject || TYPE_LABEL[s.type] || s.type}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {TYPE_LABEL[s.type] || s.type} · {s.name} · {s.email}
                      {s.phone ? ` · ${s.phone}` : ""} · {formatDateTime(s.createdAt)}
                    </p>
                    {s.type === "contact" && typeof s.payload.message === "string" && (
                      <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{s.payload.message}</p>
                    )}
                    {s.type === "appointment" && (
                      <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                        {Object.entries(s.payload)
                          .filter(([, v]) => v !== "" && v != null)
                          .slice(0, 12)
                          .map(([k, v]) => (
                            <p key={k}>
                              <span className="font-medium">{k}:</span>{" "}
                              {Array.isArray(v) ? v.join(", ") : String(v)}
                            </p>
                          ))}
                      </div>
                    )}
                    {s.type === "newsletter" && (
                      <p className="mt-2 text-sm text-slate-700">Subscribed with {s.email}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {!s.read && (
                      <button
                        type="button"
                        onClick={() => markRead(s.id)}
                        className="rounded border border-border px-3 py-2 text-xs font-medium min-h-11 hover:border-gold"
                      >
                        Mark read
                      </button>
                    )}
                    <a
                      href={`mailto:${s.email}`}
                      className="inline-flex items-center rounded border border-border px-3 py-2 text-xs font-medium min-h-11 hover:border-gold"
                    >
                      Reply
                    </a>
                    <DeleteButton onClick={() => handleDelete(s.id)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
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
  const [clients, setClients] = useState<import("@/types/client-portal").PortalUser[]>([]);
  const [clientId, setClientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAdminPortalData(), fetchAdminClients()]).then(([d, c]) => {
      setMessages(d.messages);
      setClients(c.clients);
      if (!clientId && c.clients[0]) setClientId(c.clients[0].id);
    });
  }, [refreshKey]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!clientId || !subject.trim() || !body.trim()) {
      setError("Select a client and enter subject + message.");
      return;
    }
    try {
      await sendAdminReply(subject.trim(), body.trim(), clientId);
      setSubject("");
      setBody("");
      onRefresh();
    } catch {
      setError("Failed to send reply.");
    }
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
        <p className="text-sm text-muted mt-1">Messages are per client. Pick a client to send a firm reply.</p>
      </div>

      <AdminCard title="Reply to Client">
        <form onSubmit={handleReply} className="space-y-3 max-w-xl">
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            required
          >
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light min-h-11">
            Send Reply
          </button>
        </form>
      </AdminCard>

      <AdminCard title={`All Messages (${messages.length})`}>
        {messages.length === 0 ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">{m.subject}</p>
                  <p className="text-xs text-gold mt-0.5">
                    {m.clientName || "Client"} · {m.from === "firm" ? "Firm" : "Client"} · {formatDateTime(m.sentAt)}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">{m.body}</p>
                </div>
                <DeleteButton onClick={() => handleDelete(m.id)} />
              </div>
            ))}
          </div>
        )}
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

  async function handleDownload(id: string, name: string) {
    try {
      await downloadAdminDocument(id, name);
    } catch {
      alert("File not available for download (metadata only).");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Client Documents</h2>
        <p className="text-sm text-muted mt-1">Review uploaded files by client and update review status.</p>
      </div>
      <AdminCard title="Document Library">
        {documents.length === 0 ? (
          <p className="text-sm text-muted">No documents uploaded yet.</p>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-lg border border-border p-3">
                  <p className="break-words text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="mt-1 text-xs text-muted">{doc.clientName || "Unknown client"}</p>
                  <p className="mt-1 text-xs text-muted">{doc.category} · TY {doc.taxYear}</p>
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
                    <div className="flex gap-2">
                      {doc.hasFile && (
                        <button
                          type="button"
                          onClick={() => handleDownload(doc.id, doc.name)}
                          className="inline-flex min-h-11 items-center gap-1 rounded border border-border px-2 text-xs font-medium hover:border-gold"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                      )}
                      <DeleteButton onClick={() => handleDelete(doc.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="-mx-4 hidden overflow-x-auto px-4 md:block sm:mx-0 sm:px-0">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="pb-2 font-medium">Client</th>
                    <th className="pb-2 font-medium">File</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-muted text-xs max-w-[160px] truncate">{doc.clientName || "—"}</td>
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
                        <div className="flex items-center gap-2">
                          {doc.hasFile && (
                            <button
                              type="button"
                              onClick={() => handleDownload(doc.id, doc.name)}
                              className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </button>
                          )}
                          <DeleteButton onClick={() => handleDelete(doc.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </AdminCard>
    </div>
  );
}

export function AdminTaxReturnsView({ onRefresh, refreshKey }: ViewProps) {
  const [returns, setReturns] = useState<ServerPortalData["taxReturns"]>([]);
  const [clients, setClients] = useState<import("@/types/client-portal").PortalUser[]>([]);
  const [form, setForm] = useState({
    clientId: "",
    year: String(new Date().getFullYear()),
    type: "Individual (1040)",
    status: "in-progress",
    preparer: "Michael Reis, EA",
  });

  useEffect(() => {
    Promise.all([fetchAdminPortalData(), fetchAdminClients()]).then(([d, c]) => {
      setReturns(d.taxReturns);
      setClients(c.clients);
      if (!form.clientId && c.clients[0]) setForm((f) => ({ ...f, clientId: c.clients[0].id }));
    });
  }, [refreshKey]);

  async function setStatus(id: string, status: string) {
    await updatePortalItem("taxReturns", id, { status, lastUpdated: new Date().toISOString() });
    onRefresh();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId) return;
    await createAdminTaxReturn({
      clientId: form.clientId,
      year: Number(form.year),
      type: form.type,
      status: form.status,
      preparer: form.preparer,
    });
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tax Returns</h2>
        <p className="text-sm text-muted mt-1">Create and update returns for each client.</p>
      </div>

      <AdminCard title="Add Tax Return">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 max-w-3xl">
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            required
          >
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            required
          />
          <input
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            required
          />
          <input
            value={form.preparer}
            onChange={(e) => setForm({ ...form, preparer: e.target.value })}
            className="rounded-lg border border-border px-3 py-2.5 text-sm bg-surface-elevated min-h-11"
            required
          />
          <button type="submit" className="sm:col-span-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white min-h-11 w-fit">
            Create Return
          </button>
        </form>
      </AdminCard>

      <div className="space-y-4">
        {returns.length === 0 ? (
          <p className="text-sm text-muted">No tax returns yet. Create one for a client above.</p>
        ) : (
          returns.map((ret) => (
            <AdminCard key={ret.id} title={`${ret.clientName || "Client"} — Tax Year ${ret.year}`}>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={ret.status} />
                <select
                  value={ret.status}
                  onChange={(e) => setStatus(ret.id, e.target.value)}
                  className="rounded-lg border border-border px-3 py-2 text-sm bg-surface-elevated min-h-11"
                >
                  {["not-started", "in-progress", "review", "filed", "accepted"].map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-muted">{ret.type} · {ret.preparer}</span>
              </div>
            </AdminCard>
          ))
        )}
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
              <span className="text-gold text-xs font-medium">{a.clientName || "Client"}</span>
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
              <p className="text-xs text-gold mt-0.5">{inv.clientName || "Client"}</p>
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

function ProfileField({ label, value }: { label: string; value?: string | number | boolean | null }) {
  const display =
    value === undefined || value === null || value === ""
      ? "—"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 break-words text-sm text-foreground">{display}</p>
    </div>
  );
}

export function AdminClientsView({ onRefresh, refreshKey }: ViewProps) {
  const [clients, setClients] = useState<import("@/types/client-portal").PortalUser[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PortalClientDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminClients().then((d) => setClients(d.clients));
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    setLoadingDetail(true);
    setDetailError(null);
    fetchAdminClientDetail(selectedId)
      .then(setDetail)
      .catch(() => setDetailError("Failed to load client details."))
      .finally(() => setLoadingDetail(false));
  }, [selectedId, refreshKey]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this client account and all their documents?")) return;
    await deleteClient(id);
    if (selectedId === id) setSelectedId(null);
    onRefresh();
  }

  async function handleDocStatus(id: string, status: string) {
    await updatePortalItem("documents", id, { status });
    onRefresh();
  }

  async function handleDocDelete(id: string) {
    if (!confirm("Delete this document?")) return;
    await deletePortalItem("documents", id);
    onRefresh();
  }

  async function handleDownload(id: string, name: string) {
    try {
      await downloadAdminDocument(id, name);
    } catch {
      alert("File not available for download.");
    }
  }

  if (selectedId) {
    const p = detail?.profile;
    const u = detail?.user;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mb-2 inline-flex items-center gap-1 text-sm text-gold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to clients
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {u?.name || "Client profile"}
            </h2>
            <p className="text-sm text-muted mt-1">
              Full tax checklist profile and uploaded documents for this client.
            </p>
          </div>
          {u && u.id !== "client-demo" && (
            <DeleteButton onClick={() => handleDelete(u.id)} label="Remove Account" />
          )}
        </div>

        {loadingDetail && <p className="text-sm text-muted">Loading client details…</p>}
        {detailError && <p className="text-sm text-red-600">{detailError}</p>}

        {detail && u && p && (
          <>
            <AdminCard title="Account">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ProfileField label="Name" value={u.name} />
                <ProfileField label="Email" value={u.email} />
                <ProfileField label="Phone" value={u.phone} />
                <ProfileField label="Account type" value={u.accountType} />
                <ProfileField label="Client since" value={u.clientSince} />
                <ProfileField label="Profile complete" value={u.profileComplete} />
                <ProfileField label="Registered" value={formatDateTime(detail.createdAt)} />
                <ProfileField label="Profile updated" value={p.updatedAt ? formatDateTime(p.updatedAt) : "—"} />
              </div>
            </AdminCard>

            <AdminCard title="Personal / Tax ID">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ProfileField label="Taxpayer name" value={p.taxpayerFullName} />
                <ProfileField label="Spouse name" value={p.spouseFullName} />
                <ProfileField label="Dependents" value={p.dependents} />
                <ProfileField label="Mailing address" value={p.mailingAddress} />
                <ProfileField label="City" value={p.city} />
                <ProfileField label="State" value={p.state} />
                <ProfileField label="ZIP" value={p.zip} />
                <ProfileField label="Taxpayer SSN" value={p.taxpayerSsn} />
                <ProfileField label="Spouse SSN" value={p.spouseSsn} />
                <ProfileField label="Dependents SSN" value={p.dependentsSsn} />
                <ProfileField label="Taxpayer DOB" value={p.taxpayerDob} />
                <ProfileField label="Spouse DOB" value={p.spouseDob} />
                <ProfileField label="Dependents DOB" value={p.dependentsDob} />
              </div>
            </AdminCard>

            <AdminCard title="Business">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ProfileField label="Business name" value={p.businessName} />
                <ProfileField label="Business address" value={p.businessAddress} />
                <ProfileField label="EIN" value={p.ein} />
                <ProfileField label="Principal activity" value={p.principalActivity} />
                <ProfileField label="Income notes" value={p.businessIncomeNotes} />
              </div>
            </AdminCard>

            <AdminCard title="Vehicle">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ProfileField label="Make" value={p.vehicleMake} />
                <ProfileField label="Model" value={p.vehicleModel} />
                <ProfileField label="Year" value={p.vehicleYear} />
                <ProfileField label="Purchase date" value={p.purchaseDate} />
                <ProfileField label="Purchase amount" value={p.purchaseAmount} />
                <ProfileField label="Total miles" value={p.totalMiles} />
                <ProfileField label="Business miles" value={p.businessMiles} />
                <ProfileField label="Registration date" value={p.registrationDate} />
                <ProfileField label="Registration cost" value={p.registrationCost} />
              </div>
            </AdminCard>

            <AdminCard title="Client notes">
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {p.clientNotes?.trim() || "—"}
              </p>
            </AdminCard>

            <AdminCard title={`Documents (${detail.documents.length})`}>
              {detail.documents.length === 0 ? (
                <p className="text-sm text-muted">This client has not uploaded any documents yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted">
                          {doc.category} · TY {doc.taxYear} · {formatDate(doc.uploadedAt)}
                          {doc.checklistItemId ? ` · checklist ${doc.checklistItemId}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={doc.status}
                          onChange={(e) => handleDocStatus(doc.id, e.target.value)}
                          className="min-h-11 rounded border border-border bg-surface-elevated px-2 py-1 text-sm"
                        >
                          {["received", "reviewing", "approved", "needs-action"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {doc.hasFile && (
                          <button
                            type="button"
                            onClick={() => handleDownload(doc.id, doc.name)}
                            className="inline-flex min-h-11 items-center gap-1 rounded border border-border px-2 text-xs font-medium hover:border-gold"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </button>
                        )}
                        <DeleteButton onClick={() => handleDocDelete(doc.id)} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard title={`Messages (${detail.messages.length})`}>
              {detail.messages.length === 0 ? (
                <p className="text-sm text-muted">No messages with this client yet.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.messages.map((m) => (
                    <li key={m.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-medium">{m.subject}</p>
                      <p className="text-xs text-muted">
                        {m.from === "firm" ? "Firm" : "Client"} · {formatDateTime(m.sentAt)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{m.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard title={`Tax Returns (${detail.taxReturns.length})`}>
              {detail.taxReturns.length === 0 ? (
                <p className="text-sm text-muted">No returns assigned yet. Add from Tax Returns section.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.taxReturns.map((ret) => (
                    <li key={ret.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">TY {ret.year} — {ret.type}</p>
                        <p className="text-xs text-muted">{ret.preparer}</p>
                      </div>
                      <StatusBadge status={ret.status} />
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard title={`Appointments (${detail.appointments.length})`}>
              {detail.appointments.length === 0 ? (
                <p className="text-sm text-muted">No appointments for this client.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.appointments.map((a) => (
                    <li key={a.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted">
                        {a.date} {a.time} · {a.type} · {a.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard title={`Invoices (${detail.invoices.length})`}>
              {detail.invoices.length === 0 ? (
                <p className="text-sm text-muted">No invoices for this client.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.invoices.map((inv) => (
                    <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">{inv.description}</p>
                        <p className="text-xs text-muted">Due {inv.dueDate}</p>
                      </div>
                      <p className="text-sm font-semibold">${inv.amount.toFixed(2)} · {inv.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard title={`Checklist progress (${detail.checklist.filter((c) => c.done).length}/${detail.checklist.length})`}>
              <div className="grid gap-1 sm:grid-cols-2">
                {detail.checklist.slice(0, 20).map((c) => (
                  <p key={c.id} className={`text-xs ${c.done ? "text-emerald-700" : "text-muted"}`}>
                    {c.done ? "✓" : "○"} {c.label}
                  </p>
                ))}
                {detail.checklist.length > 20 && (
                  <p className="text-xs text-muted sm:col-span-2">+{detail.checklist.length - 20} more items</p>
                )}
              </div>
            </AdminCard>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Client Accounts</h2>
        <p className="text-sm text-muted mt-1">
          Open any client to see their full tax profile and uploaded documents.
        </p>
      </div>
      <AdminCard title={`Registered Clients (${clients.length})`}>
        {clients.length === 0 ? (
          <p className="text-sm text-muted">No registered clients yet.</p>
        ) : (
          <ul className="space-y-2">
            {clients.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className="min-w-0 flex-1 text-left hover:opacity-90"
                >
                  <p className="font-medium text-sm text-foreground">{c.name}</p>
                  <p className="break-all text-xs text-muted">{c.email}</p>
                  <p className="text-xs text-muted">
                    {c.phone} · {c.accountType} · Since {c.clientSince} ·{" "}
                    {c.profileComplete ? (
                      <span className="text-emerald-700">Profile complete</span>
                    ) : (
                      <span className="text-amber-700">Profile incomplete</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gold">View full profile & documents →</p>
                </button>
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
