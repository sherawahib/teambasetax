import { NextResponse } from "next/server";
import { escapeHtml, sendMail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Required contact fields missing." }, { status: 400 });
    }

    const lines = Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`);

    await sendMail({
      subject: `Appointment request: ${firstName} ${lastName}`,
      replyTo: email,
      text: ["New appointment request", "", ...lines].join("\n"),
      html: `
        <h2>New appointment request</h2>
        <pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</pre>
      `,
    });

    try {
      await sendMail({
        to: email,
        subject: "Appointment request received — TeamBased Tax",
        text: `Hi ${firstName},\n\nWe received your appointment request and will contact you within 1 business day to confirm.\n\n— TeamBased Tax`,
      });
    } catch {
      /* ignore confirmation failure */
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Appointment email failed:", err);
    return NextResponse.json({ error: "Unable to submit appointment right now." }, { status: 500 });
  }
}
