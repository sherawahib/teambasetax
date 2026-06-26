import { NextResponse } from "next/server";
import { addServerDocument, addServerMessage, readPortalData } from "@/lib/portal-server-store";
import type { DocumentCategory } from "@/types/client-portal";

const DOC_CATEGORIES: DocumentCategory[] = [
  "W-2 & Income",
  "1099 Forms",
  "Receipts & Expenses",
  "Business Records",
  "Prior Returns",
  "Legal & IRS",
  "Other",
];

export async function GET() {
  const data = await readPortalData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action: "document" | "message";
      name?: string;
      category?: DocumentCategory;
      size?: number;
      taxYear?: number;
      subject?: string;
      text?: string;
    };

    if (body.action === "document") {
      if (!body.name?.trim() || !body.category || !DOC_CATEGORIES.includes(body.category)) {
        return NextResponse.json({ error: "Invalid document data." }, { status: 400 });
      }
      const doc = await addServerDocument({
        name: body.name.trim(),
        category: body.category,
        size: body.size ?? 0,
        taxYear: body.taxYear ?? new Date().getFullYear(),
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

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
