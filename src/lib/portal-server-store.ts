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

export async function readPortalData(): Promise<ServerPortalData> {
  const [documents, taxReturns, messages, appointments, invoices, irsNotices, legalCases, checklist] =
    await Promise.all([
      prisma.portalDocument.findMany({ orderBy: { uploadedAt: "desc" } }),
      prisma.portalTaxReturn.findMany({ orderBy: { year: "desc" } }),
      prisma.portalMessage.findMany({ orderBy: { sentAt: "desc" } }),
      prisma.portalAppointment.findMany({ orderBy: { date: "desc" } }),
      prisma.portalInvoice.findMany({ orderBy: { dueDate: "desc" } }),
      prisma.portalIrsNotice.findMany({ orderBy: { issueDate: "desc" } }),
      prisma.portalLegalCase.findMany({ orderBy: { openedDate: "desc" } }),
      prisma.portalChecklistItem.findMany({ orderBy: { id: "asc" } }),
    ]);

  return {
    documents: documents.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category as PortalDocument["category"],
      size: d.size,
      taxYear: d.taxYear,
      status: d.status as PortalDocument["status"],
      uploadedAt: d.uploadedAt.toISOString(),
    })),
    taxReturns: taxReturns.map((t) => ({
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
      from: m.from as PortalMessage["from"],
      subject: m.subject,
      body: m.body,
      sentAt: m.sentAt.toISOString(),
      read: m.read,
    })),
    appointments: appointments.map((a) => ({
      id: a.id,
      title: a.title,
      date: a.date,
      time: a.time,
      type: a.type as PortalAppointment["type"],
      status: a.status as PortalAppointment["status"],
      notes: a.notes ?? undefined,
    })),
    invoices: invoices.map((i) => ({
      id: i.id,
      description: i.description,
      amount: i.amount,
      dueDate: i.dueDate,
      status: i.status as PortalInvoice["status"],
      taxYear: i.taxYear ?? undefined,
    })),
    irsNotices: irsNotices.map((n) => ({
      id: n.id,
      noticeNumber: n.noticeNumber,
      issueDate: n.issueDate,
      topic: n.topic,
      status: n.status as IrsNotice["status"],
      responseDue: n.responseDue ?? undefined,
      assignedTo: n.assignedTo,
    })),
    legalCases: legalCases.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category as LegalCase["category"],
      status: c.status as LegalCase["status"],
      openedDate: c.openedDate,
      nextStep: c.nextStep,
    })),
    checklist: checklist.map((c) => ({
      id: c.id,
      label: c.label,
      category: c.category,
      done: c.done,
    })),
  };
}

export async function addServerDocument(doc: Omit<PortalDocument, "id" | "uploadedAt" | "status">) {
  const row = await prisma.portalDocument.create({
    data: {
      id: `d-${Date.now()}`,
      name: doc.name,
      category: doc.category,
      size: doc.size,
      taxYear: doc.taxYear,
      status: "received",
    },
  });
  return {
    id: row.id,
    name: row.name,
    category: row.category as PortalDocument["category"],
    size: row.size,
    taxYear: row.taxYear,
    status: row.status as PortalDocument["status"],
    uploadedAt: row.uploadedAt.toISOString(),
  };
}

export async function addServerMessage(msg: Omit<PortalMessage, "id" | "sentAt">) {
  const row = await prisma.portalMessage.create({
    data: {
      id: `m-${Date.now()}`,
      from: msg.from,
      subject: msg.subject,
      body: msg.body,
      read: msg.read,
    },
  });
  return {
    id: row.id,
    from: row.from as PortalMessage["from"],
    subject: row.subject,
    body: row.body,
    sentAt: row.sentAt.toISOString(),
    read: row.read,
  };
}

export async function deletePortalItem(type: keyof ServerPortalData, id: string): Promise<boolean> {
  try {
    switch (type) {
      case "documents":
        await prisma.portalDocument.delete({ where: { id } });
        break;
      case "taxReturns":
        await prisma.portalTaxReturn.delete({ where: { year: Number(id) } });
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
          where: { year: Number(id) },
          data: {
            ...updates,
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
