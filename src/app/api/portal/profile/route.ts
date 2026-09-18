import { NextResponse } from "next/server";
import { getClientProfile, saveClientProfile } from "@/lib/portal-clients-store";
import { getPortalAuth } from "@/lib/portal-session";
import type { ClientTaxProfile } from "@/types/client-portal";

export async function GET(request: Request) {
  try {
    const auth = getPortalAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
    }
    const profile = await getClientProfile(auth.email);
    if (!profile) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = getPortalAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
    }
    const body = (await request.json()) as {
      email?: string;
      profile?: ClientTaxProfile;
    };
    if (!body.profile) {
      return NextResponse.json({ error: "Profile is required." }, { status: 400 });
    }
    // Always save against authenticated account — ignore spoofed email
    const result = await saveClientProfile(auth.email, body.profile);
    if (!result) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
