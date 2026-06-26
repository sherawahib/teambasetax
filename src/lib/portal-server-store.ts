import { promises as fs } from "fs";
import path from "path";
import type {
  ChecklistItem,
  IrsNotice,
  LegalCase,
  PortalAppointment,
  PortalDocument,
  PortalInvoice,
  PortalMessage,
  TaxReturnStatus,
} from "@/types/client-portal";
import { SEED_CHECKLIST } from "@/data/client-portal";

export type ServerPortalData = {
  documents: PortalDocument[];
  taxReturns: TaxReturnStatus[];
  messages: PortalMessage[];
  appointments: PortalAppointment[];
  invoices: PortalInvoice[];
  irsNotices: IrsNotice[];
  legalCases: LegalCase[];
  checklist: ChecklistItem[];
};

const DATA_PATH = path.join(process.cwd(), "data", "portal-data.json");

function seedData(): ServerPortalData {
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
    ],
    messages: [
      {
        id: "m1",
        from: "firm",
        subject: "2025 Tax Documents Received",
        body: "We received your W-2 and 1099-NEC. Please upload remaining deduction documents.",
        sentAt: "2026-02-04T11:30:00.000Z",
        read: true,
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
        notes: "Bring photo ID and remaining documents.",
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
        nextStep: "Firm preparing response — due March 18, 2026",
      },
    ],
    checklist: SEED_CHECKLIST.map((item) => ({ ...item })),
  };
}

export async function readPortalData(): Promise<ServerPortalData> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as ServerPortalData;
  } catch {
    const seeded = seedData();
    await writePortalData(seeded);
    return seeded;
  }
}

export async function writePortalData(data: ServerPortalData) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function addServerDocument(doc: Omit<PortalDocument, "id" | "uploadedAt" | "status">) {
  const data = await readPortalData();
  const entry: PortalDocument = {
    ...doc,
    id: `d-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    status: "received",
  };
  data.documents.unshift(entry);
  await writePortalData(data);
  return entry;
}

export async function addServerMessage(msg: Omit<PortalMessage, "id" | "sentAt">) {
  const data = await readPortalData();
  const entry: PortalMessage = {
    ...msg,
    id: `m-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
  data.messages.unshift(entry);
  await writePortalData(data);
  return entry;
}

export async function deletePortalItem(type: keyof ServerPortalData, id: string): Promise<boolean> {
  const data = await readPortalData();
  const list = data[type];
  if (!Array.isArray(list)) return false;
  const filtered = list.filter((item: { id?: string; year?: number }) => {
    if ("id" in item && item.id) return item.id !== id;
    if ("year" in item && item.year !== undefined) return String(item.year) !== id;
    return true;
  });
  if (filtered.length === list.length) return false;
  (data as Record<string, unknown>)[type] = filtered;
  await writePortalData(data);
  return true;
}

export async function updatePortalItem(
  type: keyof ServerPortalData,
  id: string,
  updates: Record<string, unknown>,
): Promise<boolean> {
  const data = await readPortalData();
  const list = data[type];
  if (!Array.isArray(list)) return false;
  let found = false;
  const updated = list.map((item) => {
    const record = item as { id?: string; year?: number };
    const match = (record.id && record.id === id) || (record.year !== undefined && String(record.year) === id);
    if (match) {
      found = true;
      return { ...item, ...updates };
    }
    return item;
  });
  if (!found) return false;
  (data as Record<string, unknown>)[type] = updated;
  await writePortalData(data);
  return true;
}
