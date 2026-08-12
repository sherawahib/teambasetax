import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  deletePortalClient,
  getPortalClientDetail,
  listPortalClients,
} from "@/lib/portal-clients-store";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();

  if (id) {
    const detail = await getPortalClientDetail(id);
    if (!detail) return NextResponse.json({ error: "Client not found." }, { status: 404 });
    return NextResponse.json(detail);
  }

  const clients = await listPortalClients();
  return NextResponse.json({ clients });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing client id." }, { status: 400 });
    }
    const ok = await deletePortalClient(body.id);
    if (!ok) return NextResponse.json({ error: "Client not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
