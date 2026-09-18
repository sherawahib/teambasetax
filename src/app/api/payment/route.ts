import { NextResponse } from "next/server";
import { escapeHtml, isSmtpConfigured, notifyAdmin, sendMail } from "@/lib/email";
import { createFormSubmission } from "@/lib/form-submissions-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      invoiceNumber?: string;
      amount?: string;
      method?: string;
      notes?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const phone = body.phone?.trim() || "";
    const amount = body.amount?.trim() || "";
    const method = body.method?.trim() || "";
    const invoiceNumber = body.invoiceNumber?.trim() || "";
    const notes = body.notes?.trim() || "";

    if (!name || !email || !phone || !amount || !method) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    await createFormSubmission({
      type: "payment",
      name,
      email,
      phone,
      subject: `Payment request: $${amount} — ${name}`,
      payload: { invoiceNumber, amount, method, notes },
    });

    let emailed = false;
    if (isSmtpConfigured()) {
      try {
        await notifyAdmin({
          subject: `Payment request: $${amount} from ${name}`,
          replyTo: email,
          text: [
            "New payment request (teambasedtax.com)",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Invoice #: ${invoiceNumber || "—"}`,
            `Amount: $${amount}`,
            `Method: ${method}`,
            `Notes: ${notes || "—"}`,
            "",
            "Also saved in Admin Portal → Form Inbox.",
          ].join("\n"),
          html: `
            <h2>New payment request</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Invoice:</strong> ${escapeHtml(invoiceNumber || "—")}</p>
            <p><strong>Amount:</strong> $${escapeHtml(amount)}</p>
            <p><strong>Method:</strong> ${escapeHtml(method)}</p>
            <p><strong>Notes:</strong> ${escapeHtml(notes || "—")}</p>
          `,
        });
        try {
          await sendMail({
            to: email,
            subject: "Payment request received — TeamBased Tax",
            text: `Hi ${name},\n\nWe received your payment request for $${amount}. Our team will follow up shortly.\n\n— TeamBased Tax\n(240) 780-6910`,
          });
        } catch {
          /* optional */
        }
        emailed = true;
      } catch (err) {
        console.error("Payment email failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      emailed,
      ...(!emailed ? { warning: "Saved in admin inbox; email delivery pending." } : {}),
    });
  } catch (err) {
    console.error("Payment request failed:", err);
    return NextResponse.json({ error: "Unable to submit payment request right now." }, { status: 500 });
  }
}
