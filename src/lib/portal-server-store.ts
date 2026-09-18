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
import { prisma } from "@/lib/prisma";

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

const MAX_FILE_BYTES = 4 * 1024 * 1024;

type ClientRef = { name: true; email: true };

function clientLabel(client?: { name: string; email: string } | null) {
  return client ? `${client.name} (${client.email})` : undefined;
}

function mapDocument(
  d: {
    id: string;
    clientId: string;
    name: string;
    category: string;
    size: number;
    taxYear: number;
    status: string;
    checklistItemId: string | null;
    mimeType: string;
    fileData: string | null;
    uploadedAt: Date;
    client?: { name: string; email: string } | null;
  },
): PortalDocument {
  return {
    id: d.id,
    clientId: d.clientId,
    clientName: clientLabel(d.client),
    name: d.name,
    category: d.category as PortalDocument["category"],
    size: d.size,
    taxYear: d.taxYear,
    status: d.status as PortalDocument["status"],
    checklistItemId: d.checklistItemId ?? undefined,
    mimeType: d.mimeType,
    hasFile: Boolean(d.fileData),
    uploadedAt: d.uploadedAt.toISOString(),
  };
}

export async function readPortalData(clientId?: string): Promise<ServerPortalData> {
  const where = clientId ? { clientId } : undefined;
  const includeClient = { client: { select: { name: true, email: true } satisfies ClientRef } };

  const [documents, taxReturns, messages, appointments, invoices, irsNotices, legalCases, checklist] =
    await Promise.all([
      prisma.portalDocument.findMany({
        where,
        orderBy: { uploadedAt: "desc" },
        include: includeClient,
      }),
      prisma.portalTaxReturn.findMany({
        where,
        orderBy: { year: "desc" },
        include: includeClient,
      }),
      prisma.portalMessage.findMany({
        where,
        orderBy: { sentAt: "desc" },
        include: includeClient,
      }),
      prisma.portalAppointment.findMany({
        where,
        orderBy: { date: "desc" },
        include: includeClient,
      }),
      prisma.portalInvoice.findMany({
        where,
        orderBy: { dueDate: "desc" },
        include: includeClient,
      }),
      prisma.portalIrsNotice.findMany({
        where,
        orderBy: { issueDate: "desc" },
        include: includeClient,
      }),
      prisma.portalLegalCase.findMany({
        where,
        orderBy: { openedDate: "desc" },
        include: includeClient,
      }),
      prisma.portalChecklistItem.findMany({
        where,
        orderBy: { itemKey: "asc" },
      }),
    ]);

  return {
    documents: documents.map(mapDocument),
    taxReturns: taxReturns.map((t) => ({
      id: t.id,
      clientId: t.clientId,
      clientName: clientLabel(t.client),
      year: t.year,
      type: t.type,
      status: t.status as TaxReturnStatus["status"],
      filedDate: t.filedDate ?? undefined,
      refundEstimate: t.refundEstimate ?? undefined,
      preparer: t.preparer,
      lastUpdated: t.lastUpdated.toISOString(),
    })),
    messages: messages.map((m) => ({
      id: m.id,
      clientId: m.clientId,
      clientName: clientLabel(m.client),
      from: m.from as PortalMessage["from"],
      subject: m.subject,
      body: m.body,
      sentAt: m.sentAt.toISOString(),
      read: m.read,
    })),
    appointments: appointments.map((a) => ({
      id: a.id,
      clientId: a.clientId,
      clientName: clientLabel(a.client),
      title: a.title,
      date: a.date,
      time: a.time,
      type: a.type as PortalAppointment["type"],
      status: a.status as PortalAppointment["status"],
      notes: a.notes ?? undefined,
    })),
    invoices: invoices.map((i) => ({
      id: i.id,
      clientId: i.clientId,
      clientName: clientLabel(i.client),
      description: i.description,
      amount: i.amount,
      dueDate: i.dueDate,
      status: i.status as PortalInvoice["status"],
      taxYear: i.taxYear ?? undefined,
    })),
    irsNotices: irsNotices.map((n) => ({
      id: n.id,
      clientId: n.clientId,
      clientName: clientLabel(n.client),
      noticeNumber: n.noticeNumber,
      issueDate: n.issueDate,
      topic: n.topic,
      status: n.status as IrsNotice["status"],
      responseDue: n.responseDue ?? undefined,
      assignedTo: n.assignedTo,
    })),
    legalCases: legalCases.map((c) => ({
      id: c.id,
      clientId: c.clientId,
      clientName: clientLabel(c.client),
      title: c.title,
      category: c.category as LegalCase["category"],
      status: c.status as LegalCase["status"],
      openedDate: c.openedDate,
      nextStep: c.nextStep,
    })),
    checklist: checklist.map((c) => ({
      id: c.id,
      itemKey: c.itemKey,
      label: c.label,
      category: c.category,
      done: c.done,
    })),
  };
}

export async function listClientDocuments(clientId: string): Promise<PortalDocument[]> {
  const rows = await prisma.portalDocument.findMany({
    where: { clientId },
    orderBy: { uploadedAt: "desc" },
  });
  return rows.map(mapDocument);
}

export async function addServerDocument(doc: {
  clientId: string;
  name: string;
  category: string;
  size: number;
  taxYear: number;
  checklistItemId?: string;
  mimeType?: string;
  fileData?: string;
}): Promise<PortalDocument> {
  if (!doc.clientId?.trim()) throw new Error("clientId is required");
  if (doc.fileData && Buffer.byteLength(doc.fileData, "utf8") > MAX_FILE_BYTES * 1.4) {
    throw new Error("File too large (max 4MB)");
  }

  const row = await prisma.portalDocument.create({
    data: {
      id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      clientId: doc.clientId,
      name: doc.name,
      category: doc.category,
      size: doc.size,
      taxYear: doc.taxYear,
      status: "received",
      checklistItemId: doc.checklistItemId ?? null,
      mimeType: doc.mimeType ?? "application/octet-stream",
      fileData: doc.fileData ?? null,
    },
  });
  return mapDocument(row);
}

export async function getDocumentFile(id: string) {
  return prisma.portalDocument.findUnique({
    where: { id },
    select: { id: true, name: true, mimeType: true, fileData: true, clientId: true },
  });
}

export async function addServerMessage(msg: {
  clientId: string;
  from: PortalMessage["from"];
  subject: string;
  body: string;
  read?: boolean;
}) {
  if (!msg.clientId?.trim()) throw new Error("clientId is required");
  const row = await prisma.portalMessage.create({
    data: {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      clientId: msg.clientId,
      from: msg.from,
      subject: msg.subject,
      body: msg.body,
      read: msg.read ?? msg.from === "client",
    },
    include: { client: { select: { name: true, email: true } } },
  });
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: clientLabel(row.client),
    from: row.from as PortalMessage["from"],
    subject: row.subject,
    body: row.body,
    sentAt: row.sentAt.toISOString(),
    read: row.read,
  };
}

export async function addServerTaxReturn(input: {
  clientId: string;
  year: number;
  type: string;
  status: string;
  preparer: string;
  filedDate?: string;
  refundEstimate?: string;
}) {
  const row = await prisma.portalTaxReturn.create({
    data: {
      id: `tr-${input.clientId}-${input.year}`,
      clientId: input.clientId,
      year: input.year,
      type: input.type,
      status: input.status,
      preparer: input.preparer,
      filedDate: input.filedDate ?? null,
      refundEstimate: input.refundEstimate ?? null,
    },
  });
  return row;
}

export async function addServerAppointment(input: {
  clientId: string;
  title: string;
  date: string;
  time: string;
  type: string;
  status?: string;
  notes?: string;
}) {
  return prisma.portalAppointment.create({
    data: {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      clientId: input.clientId,
      title: input.title,
      date: input.date,
      time: input.time,
      type: input.type,
      status: input.status ?? "scheduled",
      notes: input.notes ?? null,
    },
  });
}

export async function addServerInvoice(input: {
  clientId: string;
  description: string;
  amount: number;
  dueDate: string;
  status?: string;
  taxYear?: number;
}) {
  return prisma.portalInvoice.create({
    data: {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      clientId: input.clientId,
      description: input.description,
      amount: input.amount,
      dueDate: input.dueDate,
      status: input.status ?? "pending",
      taxYear: input.taxYear ?? null,
    },
  });
}

export async function seedClientChecklist(
  clientId: string,
  items: { id: string; label: string; category: string; done?: boolean }[],
) {
  await prisma.portalChecklistItem.createMany({
    data: items.map((item) => ({
      id: `${clientId}__${item.id}`,
      clientId,
      itemKey: item.id,
      label: item.label,
      category: item.category,
      done: Boolean(item.done),
    })),
    skipDuplicates: true,
  });
}

export async function deletePortalItem(type: keyof ServerPortalData, id: string): Promise<boolean> {
  try {
    switch (type) {
      case "documents":
        await prisma.portalDocument.delete({ where: { id } });
        break;
      case "taxReturns":
        await prisma.portalTaxReturn.delete({ where: { id } });
        break;
      case "messages":
        await prisma.portalMessage.delete({ where: { id } });
        break;
      case "appointments":
        await prisma.portalAppointment.delete({ where: { id } });
        break;
      case "invoices":
        await prisma.portalInvoice.delete({ where: { id } });
        break;
      case "irsNotices":
        await prisma.portalIrsNotice.delete({ where: { id } });
        break;
      case "legalCases":
        await prisma.portalLegalCase.delete({ where: { id } });
        break;
      case "checklist":
        await prisma.portalChecklistItem.delete({ where: { id } });
        break;
      default:
        return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function updatePortalItem(
  type: keyof ServerPortalData,
  id: string,
  updates: Record<string, unknown>,
): Promise<boolean> {
  try {
    switch (type) {
      case "documents":
        await prisma.portalDocument.update({ where: { id }, data: updates as { status?: string } });
        break;
      case "taxReturns":
        await prisma.portalTaxReturn.update({
          where: { id },
          data: {
            ...(updates as object),
            lastUpdated: updates.lastUpdated ? new Date(String(updates.lastUpdated)) : new Date(),
          } as { status?: string; lastUpdated?: Date },
        });
        break;
      case "messages":
        await prisma.portalMessage.update({ where: { id }, data: updates as { read?: boolean } });
        break;
      case "appointments":
        await prisma.portalAppointment.update({ where: { id }, data: updates as { status?: string } });
        break;
      case "invoices":
        await prisma.portalInvoice.update({ where: { id }, data: updates as { status?: string } });
        break;
      case "irsNotices":
        await prisma.portalIrsNotice.update({ where: { id }, data: updates as { status?: string } });
        break;
      case "legalCases":
        await prisma.portalLegalCase.update({ where: { id }, data: updates as { status?: string } });
        break;
      case "checklist":
        await prisma.portalChecklistItem.update({ where: { id }, data: updates as { done?: boolean } });
        break;
      default:
        return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Mark checklist by template key (tc-p1) for a client */
export async function setChecklistDoneByKey(clientId: string, itemKey: string, done: boolean) {
  const id = `${clientId}__${itemKey}`;
  try {
    await prisma.portalChecklistItem.update({ where: { id }, data: { done } });
    return true;
  } catch {
    // fallback: try matching itemKey
    const row = await prisma.portalChecklistItem.findFirst({ where: { clientId, itemKey } });
    if (!row) return false;
    await prisma.portalChecklistItem.update({ where: { id: row.id }, data: { done } });
    return true;
  }
}

export { MAX_FILE_BYTES };
