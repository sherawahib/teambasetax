import { NextResponse } from "next/server";
import { DOCUMENT_CATEGORIES } from "@/data/client-portal";
import {
  addServerDocument,
  addServerMessage,
  MAX_FILE_BYTES,
  readPortalData,
  setChecklistDoneByKey,
  updatePortalItem,
} from "@/lib/portal-server-store";
import { ensureClientChecklist } from "@/lib/portal-clients-store";
import { getPortalAuth } from "@/lib/portal-session";
import type { DocumentCategory } from "@/types/client-portal";

export async function GET(request: Request) {
  const auth = getPortalAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
  }

  await ensureClientChecklist(auth.id);
  const data = await readPortalData(auth.id);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const auth = getPortalAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
    }

    const clientId = auth.id;
    const body = (await request.json()) as {
      action: "document" | "message" | "checklist";
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
      itemKey?: string;
      done?: boolean;
    };

    if (body.action === "document") {
      if (!body.name?.trim() || !body.category || !DOCUMENT_CATEGORIES.includes(body.category)) {
        return NextResponse.json({ error: "Invalid document data." }, { status: 400 });
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

      if (body.checklistItemId) {
        await setChecklistDoneByKey(clientId, body.checklistItemId, true);
      }
      return NextResponse.json({ document: doc });
    }

    if (body.action === "message") {
      if (!body.subject?.trim() || !body.text?.trim()) {
        return NextResponse.json({ error: "Invalid message data." }, { status: 400 });
      }
      const msg = await addServerMessage({
        clientId,
        from: "client",
        subject: body.subject.trim(),
        body: body.text.trim(),
        read: false,
      });
      try {
        const { notifyAdmin } = await import("@/lib/email");
        const { prisma } = await import("@/lib/prisma");
        const client = await prisma.portalClient.findUnique({ where: { id: clientId } });
        await notifyAdmin({
          subject: `Portal message: ${body.subject.trim()}`,
          replyTo: client?.email,
          text: [
            "New client portal message",
            "",
            `Client: ${client?.name || "Unknown"} (${client?.email || clientId})`,
            `Subject: ${body.subject.trim()}`,
            "",
            body.text.trim(),
            "",
            "Also visible in Admin Portal → Messages.",
          ].join("\n"),
        });
      } catch (err) {
        console.error("Portal message notify failed:", err);
      }
      return NextResponse.json({ message: msg });
    }

    if (body.action === "checklist") {
      const key = body.itemKey || body.id;
      if (!key) {
        return NextResponse.json({ error: "Checklist item key required." }, { status: 400 });
      }
      const itemKey = key.includes("__") ? key.split("__").pop()! : key;
      const ok = await setChecklistDoneByKey(clientId, itemKey, Boolean(body.done));
      if (!ok) {
        const ok2 = await updatePortalItem("checklist", key, { done: Boolean(body.done) });
        if (!ok2) return NextResponse.json({ error: "Checklist update failed." }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
