import { NextResponse } from "next/server";
import { DOCUMENT_CATEGORIES } from "@/data/client-portal";
import {
  addServerDocument,
  addServerMessage,
  MAX_FILE_BYTES,
  readPortalData,
  updatePortalItem,
} from "@/lib/portal-server-store";
import { findClientByEmail } from "@/lib/portal-clients-store";
import type { DocumentCategory } from "@/types/client-portal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId")?.trim() || undefined;
  const email = searchParams.get("email")?.trim().toLowerCase();

  let scopedClientId = clientId;
  if (!scopedClientId && email) {
    const client = await findClientByEmail(email);
    scopedClientId = client?.id;
  }

  const data = await readPortalData(scopedClientId);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action: "document" | "message" | "checklist";
      clientId?: string;
      email?: string;
      name?: string;
      category?: DocumentCategory;
      size?: number;
      taxYear?: number;
      checklistItemId?: string;
      mimeType?: string;
      fileData?: string;
      subject?: string;
      text?: string;
      id?: string;
      done?: boolean;
    };

    if (body.action === "document") {
      if (!body.name?.trim() || !body.category || !DOCUMENT_CATEGORIES.includes(body.category)) {
        return NextResponse.json({ error: "Invalid document data." }, { status: 400 });
      }

      let clientId = body.clientId?.trim();
      if (!clientId && body.email) {
        const client = await findClientByEmail(body.email);
        clientId = client?.id;
      }
      if (!clientId) {
        return NextResponse.json({ error: "Client id required to upload documents." }, { status: 400 });
      }

      if (body.fileData && Buffer.byteLength(body.fileData, "utf8") > MAX_FILE_BYTES * 1.4) {
        return NextResponse.json({ error: "File too large (max 4MB)." }, { status: 400 });
      }

      const doc = await addServerDocument({
        clientId,
        name: body.name.trim(),
        category: body.category,
        size: body.size ?? 0,
        taxYear: body.taxYear ?? new Date().getFullYear(),
        checklistItemId: body.checklistItemId,
        mimeType: body.mimeType,
        fileData: body.fileData,
      });
      return NextResponse.json({ document: doc });
    }

    if (body.action === "message") {
      if (!body.subject?.trim() || !body.text?.trim()) {
        return NextResponse.json({ error: "Invalid message data." }, { status: 400 });
      }
      const msg = await addServerMessage({
        from: "client",
        subject: body.subject.trim(),
        body: body.text.trim(),
        read: true,
      });
      return NextResponse.json({ message: msg });
    }

    if (body.action === "checklist") {
      if (!body.id) {
        return NextResponse.json({ error: "Checklist item id required." }, { status: 400 });
      }
      const ok = await updatePortalItem("checklist", body.id, { done: Boolean(body.done) });
      if (!ok) return NextResponse.json({ error: "Checklist update failed." }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
