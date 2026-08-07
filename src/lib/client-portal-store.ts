"use client";

import type {
  ChecklistItem,
  ClientTaxProfile,
  IrsNotice,
  LegalCase,
  PortalAppointment,
  PortalDocument,
  PortalInvoice,
  PortalMessage,
  PortalSession,
  PortalUser,
  TaxReturnStatus,
} from "@/types/client-portal";
import { SEED_CHECKLIST } from "@/data/client-portal";

const SESSION_KEY = "tbts-portal-session";
const DATA_KEY = "tbts-portal-data-v2";

type PortalData = {
  documents: PortalDocument[];
  taxReturns: TaxReturnStatus[];
  messages: PortalMessage[];
  appointments: PortalAppointment[];
  invoices: PortalInvoice[];
  irsNotices: IrsNotice[];
  legalCases: LegalCase[];
  checklist: ChecklistItem[];
};

let serverCache: PortalData | null = null;

function seedData(): PortalData {
  return {
    documents: [
      {
        id: "d1",
        name: "W2_Employer_2025.pdf",
        category: "W-2 & Income",
        size: 245000,
        uploadedAt: "2026-01-28T10:00:00.000Z",
        taxYear: 2025,
        status: "approved",
      },
      {
        id: "d2",
        name: "1099-NEC_Freelance_2025.pdf",
        category: "1099 Forms",
        size: 189000,
        uploadedAt: "2026-02-03T14:30:00.000Z",
        taxYear: 2025,
        status: "reviewing",
      },
      {
        id: "d3",
        name: "Business_Expenses_Q4.xlsx",
        category: "Business Records",
        size: 520000,
        uploadedAt: "2026-02-10T09:15:00.000Z",
        taxYear: 2025,
        status: "received",
      },
    ],
    taxReturns: [
      {
        year: 2025,
        type: "Individual (1040)",
        status: "in-progress",
        preparer: "Michael Reis, EA",
        lastUpdated: "2026-02-12T16:00:00.000Z",
      },
      {
        year: 2024,
        type: "Individual (1040)",
        status: "accepted",
        filedDate: "2025-04-02",
        refundEstimate: "$1,240 refund",
        preparer: "Michael Reis, EA",
        lastUpdated: "2025-05-15T11:00:00.000Z",
      },
      {
        year: 2023,
        type: "Individual (1040)",
        status: "accepted",
        filedDate: "2024-03-28",
        preparer: "Michael Reis, EA",
        lastUpdated: "2024-04-20T09:00:00.000Z",
      },
    ],
    messages: [
      {
        id: "m1",
        from: "firm",
        subject: "2025 Tax Documents Received",
        body: "We received your W-2 and 1099-NEC. Please upload your mortgage interest statement (1098) and any charitable contribution receipts when available.",
        sentAt: "2026-02-04T11:30:00.000Z",
        read: true,
      },
      {
        id: "m2",
        from: "firm",
        subject: "Estimated Tax Reminder — Q1 Due April 15",
        body: "Based on your 2025 income projections, your Q1 estimated payment may be required. Reply here or call us to review your safe harbor amounts.",
        sentAt: "2026-02-14T09:00:00.000Z",
        read: false,
      },
    ],
    appointments: [
      {
        id: "a1",
        title: "2025 Tax Return Review",
        date: "2026-03-05",
        time: "2:00 PM",
        type: "In-Office",
        status: "scheduled",
        notes: "Bring photo ID and any remaining deduction documents.",
      },
      {
        id: "a2",
        title: "Retirement Planning Consultation",
        date: "2026-01-22",
        time: "10:30 AM",
        type: "Virtual",
        status: "completed",
      },
    ],
    invoices: [
      {
        id: "inv1",
        description: "2024 Individual Tax Preparation",
        amount: 385,
        dueDate: "2025-04-01",
        status: "paid",
        taxYear: 2024,
      },
      {
        id: "inv2",
        description: "2025 Individual Tax Preparation (estimate)",
        amount: 425,
        dueDate: "2026-04-15",
        status: "pending",
        taxYear: 2025,
      },
      {
        id: "inv3",
        description: "IRS Notice CP2000 Response",
        amount: 275,
        dueDate: "2026-02-28",
        status: "due",
      },
    ],
    irsNotices: [
      {
        id: "n1",
        noticeNumber: "CP2000",
        issueDate: "2026-01-18",
        topic: "Income discrepancy — unreported 1099 income",
        status: "in-representation",
        responseDue: "2026-03-18",
        assignedTo: "Michael Reis, EA",
      },
    ],
    legalCases: [
      {
        id: "lc1",
        title: "CP2000 Underreported Income Response",
        category: "Audit",
        status: "active",
        openedDate: "2026-01-20",
        nextStep: "Firm preparing response with supporting documentation — due March 18, 2026",
      },
    ],
    checklist: SEED_CHECKLIST.map((item) => ({ ...item })),
  };
}

function readData(): PortalData {
  if (typeof window === "undefined") return seedData();
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) {
    const seeded = seedData();
    localStorage.setItem(DATA_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw) as PortalData;
}

function writeData(data: PortalData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function getSession(): PortalSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as PortalSession) : null;
}

export function saveSession(session: PortalSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  readData();
}

export async function login(email: string, password: string): Promise<{ session: PortalSession | null; error?: string }> {
  try {
    const res = await fetch("/api/portal/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { session: null, error: data.error ?? "Sign in failed." };
    }
    const session: PortalSession = { user: data.user, loggedInAt: data.loggedInAt };
    saveSession(session);
    await fetchPortalDataFromServer();
    return { session };
  } catch {
    return { session: null, error: "Unable to connect. Please try again." };
  }
}

export async function signup(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): Promise<{ session: PortalSession | null; error?: string }> {
  try {
    const res = await fetch("/api/portal/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      return { session: null, error: data.error ?? "Sign up failed." };
    }
    const session: PortalSession = { user: data.user, loggedInAt: data.loggedInAt };
    saveSession(session);
    await fetchPortalDataFromServer();
    return { session };
  } catch {
    return { session: null, error: "Unable to connect. Please try again." };
  }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getPortalData(): PortalData {
  if (serverCache) return serverCache;
  return readData();
}

export async function fetchPortalDataFromServer(): Promise<PortalData> {
  try {
    const res = await fetch("/api/portal");
    if (res.ok) {
      serverCache = (await res.json()) as PortalData;
      return serverCache;
    }
  } catch {
    /* use local fallback */
  }
  return readData();
}

export function clearPortalCache() {
  serverCache = null;
}

export function savePortalData(data: PortalData) {
  writeData(data);
}

export function addDocument(
  doc: Omit<PortalDocument, "id" | "uploadedAt" | "status"> & { checklistItemId?: string },
) {
  const data = readData();
  const newDoc: PortalDocument = {
    ...doc,
    id: `d${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    status: "received",
  };
  data.documents.unshift(newDoc);

  if (doc.checklistItemId) {
    data.checklist = data.checklist.map((item) =>
      item.id === doc.checklistItemId ? { ...item, done: true } : item,
    );
  }

  writeData(data);

  fetch("/api/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "document",
      name: doc.name,
      category: doc.category,
      size: doc.size,
      taxYear: doc.taxYear,
    }),
  }).then(() => {
    if (doc.checklistItemId) {
      return fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checklist", id: doc.checklistItemId, done: true }),
      });
    }
  }).then(() => fetchPortalDataFromServer());

  return newDoc;
}

export async function loadTaxProfile(email: string): Promise<ClientTaxProfile | null> {
  try {
    const res = await fetch(`/api/portal/profile?email=${encodeURIComponent(email)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile as ClientTaxProfile;
  } catch {
    return null;
  }
}

export async function saveTaxProfile(
  email: string,
  profile: ClientTaxProfile,
): Promise<{ session: PortalSession | null; profile: ClientTaxProfile | null; error?: string }> {
  try {
    const res = await fetch("/api/portal/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, profile }),
    });
    const data = await res.json();
    if (!res.ok) return { session: null, profile: null, error: data.error ?? "Save failed." };
    const current = getSession();
    if (current) {
      const session: PortalSession = {
        ...current,
        user: { ...current.user, ...data.user },
      };
      saveSession(session);
      return { session, profile: data.profile };
    }
    return { session: null, profile: data.profile };
  } catch {
    return { session: null, profile: null, error: "Unable to save profile." };
  }
}

export function sendMessage(subject: string, body: string) {
  const data = readData();
  const msg: PortalMessage = {
    id: `m${Date.now()}`,
    from: "client",
    subject,
    body,
    sentAt: new Date().toISOString(),
    read: true,
  };
  data.messages.unshift(msg);
  writeData(data);

  fetch("/api/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "message", subject, text: body }),
  }).then(() => fetchPortalDataFromServer());

  return msg;
}

export function markMessagesRead() {
  const data = readData();
  data.messages = data.messages.map((m) => ({ ...m, read: true }));
  writeData(data);
}

export function toggleChecklistItem(id: string) {
  const data = readData();
  data.checklist = data.checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
  writeData(data);
  return data.checklist;
}

export function updateProfile(updates: Partial<Pick<PortalUser, "name" | "phone">>) {
  const session = getSession();
  if (!session) return null;
  const updated = { ...session, user: { ...session.user, ...updates } };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
