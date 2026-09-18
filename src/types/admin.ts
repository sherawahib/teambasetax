export type AdminSection =
  | "dashboard"
  | "inbox"
  | "feedback"
  | "messages"
  | "documents"
  | "tax-returns"
  | "appointments"
  | "billing"
  | "irs-legal"
  | "clients";

export type AdminSession = {
  email: string;
  token: string;
  loggedInAt: string;
};
