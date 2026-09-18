import { NextResponse } from "next/server";
import { escapeHtml, isSmtpConfigured, notifyAdmin } from "@/lib/email";
import { createFormSubmission } from "@/lib/form-submissions-store";

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

    const name = `${firstName} ${lastName}`.trim();

    await createFormSubmission({
      type: "newsletter",
      name,
      email,
      subject: `Newsletter: ${name}`,
      payload: { firstName, lastName, email },
    });

    let emailed = false;
    if (isSmtpConfigured()) {
      try {
        await notifyAdmin({
          subject: `Newsletter signup: ${name}`,
          replyTo: email,
          text: [
            "New newsletter signup",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            "Also saved in Admin Portal → Form Inbox.",
          ].join("\n"),
          html: `
            <h2>New newsletter signup</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          `,
        });
        emailed = true;
      } catch (err) {
        console.error("Newsletter email failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      emailed,
      ...(!emailed ? { warning: "Saved in admin inbox; email delivery pending." } : {}),
    });
  } catch (err) {
    console.error("Newsletter submit failed:", err);
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
  }
}
