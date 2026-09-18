import { NextResponse } from "next/server";
import { escapeHtml, isSmtpConfigured, notifyAdmin, sendMail } from "@/lib/email";
import { createFormSubmission } from "@/lib/form-submissions-store";

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

    // Always persist for admin portal first
    await createFormSubmission({
      type: "contact",
      name,
      email,
      subject: `Contact from ${name}`,
      payload: { message },
    });

    let emailed = false;
    let emailError: string | undefined;
    if (isSmtpConfigured()) {
      try {
        await notifyAdmin({
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
            "",
            "Also saved in Admin Portal → Form Inbox.",
          ].join("\n"),
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
          `,
        });
        try {
          await sendMail({
            to: email,
            subject: "We received your message — TeamBased Tax",
            text: `Hi ${name},\n\nThank you for contacting TeamBased Tax Services. We received your message and will get back to you soon.\n\n— TeamBased Tax`,
          });
        } catch {
          /* confirmation optional */
        }
        emailed = true;
      } catch (err) {
        emailError = err instanceof Error ? err.message : "Email send failed";
        console.error("Contact email failed:", err);
      }
    } else {
      emailError = "SMTP not configured on server";
      console.error(emailError);
    }

    return NextResponse.json({
      ok: true,
      emailed,
      ...(emailError && !emailed ? { warning: "Saved in admin inbox; email delivery pending." } : {}),
    });
  } catch (err) {
    console.error("Contact submit failed:", err);
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}
