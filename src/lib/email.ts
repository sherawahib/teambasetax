import nodemailer from "nodemailer";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export function getMailConfig() {
  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") === "true",
    user: required("SMTP_USER"),
    pass: required("SMTP_PASS").replace(/\s+/g, ""),
    fromName: process.env.SMTP_FROM_NAME?.trim() || "TeamBased Tax",
    fromEmail: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim(),
    to: process.env.MAIL_TO?.trim() || "michael.reis@teambasedtax.com",
  };
}

export function createTransport() {
  const cfg = getMailConfig();
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

export async function sendMail(options: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  to?: string;
}) {
  const cfg = getMailConfig();
  const transport = createTransport();
  await transport.sendMail({
    from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
    to: options.to || cfg.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text.replace(/\n/g, "<br/>"),
  });
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
