import { NextResponse } from "next/server";
import { escapeHtml, sendMail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    await sendMail({
      subject: `Website contact: ${name}`,
      replyTo: email,
      text: [
        "New contact form submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    // Optional confirmation to visitor
    try {
      await sendMail({
        to: email,
        subject: "We received your message — TeamBased Tax",
        text: `Hi ${name},\n\nThank you for contacting TeamBased Tax Services. We received your message and will get back to you soon.\n\n— TeamBased Tax`,
      });
    } catch {
      /* firm notification already sent */
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email failed:", err);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}
