import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  addServerMessage,
  deletePortalItem,
  readPortalData,
  updatePortalItem,
  type ServerPortalData,
} from "@/lib/portal-server-store";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readPortalData();
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
    const body = (await request.json()) as { action: "reply"; subject: string; message: string };
    if (body.action !== "reply" || !body.subject?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Invalid reply payload." }, { status: 400 });
    }

    const entry = await addServerMessage({
      from: "firm",
      subject: body.subject.trim(),
      body: body.message.trim(),
      read: false,
    });
    return NextResponse.json({ message: entry });
  } catch {
    return NextResponse.json({ error: "Reply failed." }, { status: 500 });
  }
}
