import { NextResponse } from "next/server";
import { registerPortalClient } from "@/lib/portal-clients-store";
import type { PortalUser } from "@/types/client-portal";

const ACCOUNT_TYPES: PortalUser["accountType"][] = ["Individual", "Business", "Both"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      accountType?: PortalUser["accountType"];
    };

    if (!body.name?.trim() || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!body.phone?.trim() || body.phone.trim().length < 7) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (body.password !== body.confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }
    if (!body.accountType || !ACCOUNT_TYPES.includes(body.accountType)) {
      return NextResponse.json({ error: "Please select an account type." }, { status: 400 });
    }

    const user = await registerPortalClient({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      accountType: body.accountType,
    });

    return NextResponse.json({
      user,
      loggedInAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign up failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
