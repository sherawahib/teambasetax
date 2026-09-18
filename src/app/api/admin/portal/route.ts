import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  addServerAppointment,
  addServerInvoice,
  addServerMessage,
  addServerTaxReturn,
  deletePortalItem,
  readPortalData,
  updatePortalItem,
  type ServerPortalData,
} from "@/lib/portal-server-store";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId")?.trim() || undefined;
  const data = await readPortalData(clientId);
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type: keyof ServerPortalData;
      id: string;
      updates: Record<string, unknown>;
    };

    if (!body.type || !body.id) {
      return NextResponse.json({ error: "Missing type or id." }, { status: 400 });
    }

    const ok = await updatePortalItem(body.type, body.id, body.updates ?? {});
    if (!ok) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { type: keyof ServerPortalData; id: string };
    if (!body.type || !body.id) {
      return NextResponse.json({ error: "Missing type or id." }, { status: 400 });
    }

    const ok = await deletePortalItem(body.type, body.id);
    if (!ok) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      action: "reply" | "tax-return" | "appointment" | "invoice";
      clientId?: string;
      subject?: string;
      message?: string;
      year?: number;
      type?: string;
      status?: string;
      preparer?: string;
      filedDate?: string;
      refundEstimate?: string;
      title?: string;
      date?: string;
      time?: string;
      notes?: string;
      description?: string;
      amount?: number;
      dueDate?: string;
      taxYear?: number;
    };

    if (!body.clientId?.trim()) {
      return NextResponse.json({ error: "clientId required." }, { status: 400 });
    }

    if (body.action === "reply") {
      if (!body.subject?.trim() || !body.message?.trim()) {
        return NextResponse.json({ error: "Invalid reply payload." }, { status: 400 });
      }
      const entry = await addServerMessage({
        clientId: body.clientId,
        from: "firm",
        subject: body.subject.trim(),
        body: body.message.trim(),
        read: false,
      });
      return NextResponse.json({ message: entry });
    }

    if (body.action === "tax-return") {
      if (!body.year || !body.type || !body.status || !body.preparer) {
        return NextResponse.json({ error: "Invalid tax return payload." }, { status: 400 });
      }
      const row = await addServerTaxReturn({
        clientId: body.clientId,
        year: body.year,
        type: body.type,
        status: body.status,
        preparer: body.preparer,
        filedDate: body.filedDate,
        refundEstimate: body.refundEstimate,
      });
      return NextResponse.json({ taxReturn: row });
    }

    if (body.action === "appointment") {
      if (!body.title || !body.date || !body.time || !body.type) {
        return NextResponse.json({ error: "Invalid appointment payload." }, { status: 400 });
      }
      const row = await addServerAppointment({
        clientId: body.clientId,
        title: body.title,
        date: body.date,
        time: body.time,
        type: body.type,
        status: body.status,
        notes: body.notes,
      });
      return NextResponse.json({ appointment: row });
    }

    if (body.action === "invoice") {
      if (!body.description || body.amount == null || !body.dueDate) {
        return NextResponse.json({ error: "Invalid invoice payload." }, { status: 400 });
      }
      const row = await addServerInvoice({
        clientId: body.clientId,
        description: body.description,
        amount: Number(body.amount),
        dueDate: body.dueDate,
        status: body.status,
        taxYear: body.taxYear,
      });
      return NextResponse.json({ invoice: row });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
