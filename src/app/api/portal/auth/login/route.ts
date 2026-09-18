import { NextResponse } from "next/server";
import { authenticatePortalClient } from "@/lib/portal-clients-store";
import { createPortalToken } from "@/lib/portal-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email?.trim() || !body.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await authenticatePortalClient(body.email.trim(), body.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = createPortalToken(user);
    return NextResponse.json({
      user,
      token,
      loggedInAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Sign in failed." }, { status: 500 });
  }
}
