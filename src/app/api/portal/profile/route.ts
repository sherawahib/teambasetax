import { NextResponse } from "next/server";
import { getClientProfile, saveClientProfile } from "@/lib/portal-clients-store";
import type { ClientTaxProfile } from "@/types/client-portal";

export async function GET(request: Request) {
  try {
    const email = new URL(request.url).searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    const profile = await getClientProfile(email);
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
    const body = (await request.json()) as {
      email?: string;
      profile?: ClientTaxProfile;
    };
    if (!body.email?.trim() || !body.profile) {
      return NextResponse.json({ error: "Email and profile are required." }, { status: 400 });
    }
    const result = await saveClientProfile(body.email.trim(), body.profile);
    if (!result) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
