import { prisma } from "@/lib/prisma";

export type FormSubmissionType = "contact" | "appointment" | "newsletter" | "payment";

export type FormSubmissionRecord = {
  id: string;
  type: FormSubmissionType;
  name: string;
  email: string;
  phone: string;
  subject: string;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};

function parsePayload(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function mapRow(row: {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  payload: string;
  read: boolean;
  createdAt: Date;
}): FormSubmissionRecord {
  return {
    id: row.id,
    type: row.type as FormSubmissionType,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    payload: parsePayload(row.payload),
    read: row.read,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createFormSubmission(input: {
  type: FormSubmissionType;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  payload: Record<string, unknown>;
}) {
  const row = await prisma.formSubmission.create({
    data: {
      id: `fs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: input.type,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || "",
      subject: input.subject?.trim() || "",
      payload: JSON.stringify(input.payload),
      read: false,
    },
  });
  return mapRow(row);
}

export async function listFormSubmissions(): Promise<FormSubmissionRecord[]> {
  const rows = await prisma.formSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapRow);
}

export async function countUnreadFormSubmissions(): Promise<number> {
  return prisma.formSubmission.count({ where: { read: false } });
}

export async function markFormSubmissionRead(id: string, read = true): Promise<boolean> {
  try {
    await prisma.formSubmission.update({ where: { id }, data: { read } });
    return true;
  } catch {
    return false;
  }
}

export async function deleteFormSubmission(id: string): Promise<boolean> {
  try {
    await prisma.formSubmission.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
