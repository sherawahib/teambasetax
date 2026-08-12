import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getDocumentFile } from "@/lib/portal-server-store";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const doc = await getDocumentFile(id);
  if (!doc?.fileData) {
    return NextResponse.json({ error: "File not available." }, { status: 404 });
  }

  const bytes = Buffer.from(doc.fileData, "base64");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.name)}"`,
      "Content-Length": String(bytes.length),
    },
  });
}
