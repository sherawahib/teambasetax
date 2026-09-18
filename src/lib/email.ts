import nodemailer from "nodemailer";

/** Firm admin inbox — all website form notifications go here */
export const ADMIN_NOTIFY_EMAIL = "michael.reis@teambasedtax.com";

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export function getMailConfig() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secureEnv = process.env.SMTP_SECURE?.trim();
  const secure = secureEnv ? secureEnv === "true" : port === 465;
  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port,
    secure,
    user: required("SMTP_USER"),
    pass: required("SMTP_PASS").replace(/\s+/g, ""),
    fromName: process.env.SMTP_FROM_NAME?.trim() || "TeamBased Tax",
    fromEmail: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim(),
    to: ADMIN_NOTIFY_EMAIL,
  };
}

export function createTransport() {
  const cfg = getMailConfig();
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    requireTLS: !cfg.secure && cfg.port === 587,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

export async function sendMail(options: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  to?: string;
}) {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured on this server (set SMTP_USER and SMTP_PASS).");
  }
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

/** Always notify the firm admin (michael.reis@…) */
export async function notifyAdmin(options: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  return sendMail({ ...options, to: ADMIN_NOTIFY_EMAIL });
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
