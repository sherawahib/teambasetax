import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  countUnreadFormSubmissions,
  deleteFormSubmission,
  listFormSubmissions,
  markFormSubmissionRead,
} from "@/lib/form-submissions-store";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [submissions, unread] = await Promise.all([
    listFormSubmissions(),
    countUnreadFormSubmissions(),
  ]);
  return NextResponse.json({ submissions, unread });
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { id?: string; read?: boolean };
    if (!body.id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    const ok = await markFormSubmissionRead(body.id, body.read !== false);
    if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
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
    const body = (await request.json()) as { id?: string };
    if (!body.id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    const ok = await deleteFormSubmission(body.id);
    if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
