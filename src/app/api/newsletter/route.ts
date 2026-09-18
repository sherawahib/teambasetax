import { NextResponse } from "next/server";
import { escapeHtml, sendMail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
    };

    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    const email = body.email?.trim() || "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await sendMail({
      subject: `Newsletter signup: ${firstName} ${lastName}`,
      replyTo: email,
      text: [
        "New newsletter signup",
        "",
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
      ].join("\n"),
      html: `
        <h2>New newsletter signup</h2>
        <p><strong>Name:</strong> ${escapeHtml(`${firstName} ${lastName}`)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter email failed:", err);
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
  }
}
