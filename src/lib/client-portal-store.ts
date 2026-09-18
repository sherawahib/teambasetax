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
const DATA_KEY = "tbts-portal-data-v3";

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

/** Empty workspace — real data always comes from the server per client */
function emptyData(): PortalData {
  return {
    documents: [],
    taxReturns: [],
    messages: [],
    appointments: [],
    invoices: [],
    irsNotices: [],
    legalCases: [],
    checklist: SEED_CHECKLIST.map((item) => ({ ...item, done: false })),
  };
}

function readData(): PortalData {
  if (typeof window === "undefined") return emptyData();
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) {
    const seeded = emptyData();
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
    const session = getSession();
    const qs = session?.user?.id
      ? `?clientId=${encodeURIComponent(session.user.id)}`
      : session?.user?.email
        ? `?email=${encodeURIComponent(session.user.email)}`
        : "";
    const res = await fetch(`/api/portal${qs}`);
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function addDocument(
  doc: Omit<PortalDocument, "id" | "uploadedAt" | "status"> & {
    checklistItemId?: string;
    file?: File;
  },
) {
  const session = getSession();
  const data = readData();
  const newDoc: PortalDocument = {
    ...doc,
    clientId: session?.user.id,
    id: `d${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    status: "received",
    hasFile: Boolean(doc.file),
  };
  data.documents.unshift(newDoc);

  if (doc.checklistItemId) {
    data.checklist = data.checklist.map((item) => {
      const key = item.itemKey || item.id;
      const match =
        item.id === doc.checklistItemId ||
        key === doc.checklistItemId ||
        item.id.endsWith(`__${doc.checklistItemId}`);
      return match ? { ...item, done: true } : item;
    });
  }

  writeData(data);

  void (async () => {
    let fileData: string | undefined;
    if (doc.file) {
      try {
        if (doc.file.size > 4 * 1024 * 1024) {
          console.warn("File exceeds 4MB; uploading metadata only.");
        } else {
          fileData = await fileToBase64(doc.file);
        }
      } catch {
        /* metadata-only fallback */
      }
    }

    await fetch("/api/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "document",
        clientId: session?.user.id,
        email: session?.user.email,
        name: doc.name,
        category: doc.category,
        size: doc.size,
        taxYear: doc.taxYear,
        checklistItemId: doc.checklistItemId,
        mimeType: doc.file?.type || "application/octet-stream",
        fileData,
      }),
    });

    await fetchPortalDataFromServer();
  })();

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
  const session = getSession();
  const data = readData();
  const msg: PortalMessage = {
    id: `m${Date.now()}`,
    clientId: session?.user.id,
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
    body: JSON.stringify({
      action: "message",
      clientId: session?.user.id,
      email: session?.user.email,
      subject,
      text: body,
    }),
  }).then(() => fetchPortalDataFromServer());

  return msg;
}

export function markMessagesRead() {
  const data = readData();
  data.messages = data.messages.map((m) => ({ ...m, read: true }));
  writeData(data);
  if (serverCache) {
    serverCache = { ...serverCache, messages: data.messages };
  }
}

export function toggleChecklistItem(id: string) {
  const session = getSession();
  const data = getPortalData();
  const next = data.checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
  const updatedItem = next.find((item) => item.id === id);
  const patched = { ...data, checklist: next };
  writeData(patched);
  serverCache = patched;

  const itemKey = updatedItem?.itemKey || (id.includes("__") ? id.split("__").pop()! : id);
  fetch("/api/portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "checklist",
      clientId: session?.user.id,
      email: session?.user.email,
      itemKey,
      id,
      done: updatedItem?.done,
    }),
  }).then(() => fetchPortalDataFromServer());

  return next;
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
