import type { AdminSection } from "@/types/admin";

export const ADMIN_NAV: { id: AdminSection; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "feedback", label: "Client Feedback" },
  { id: "messages", label: "Messages" },
  { id: "documents", label: "Documents" },
  { id: "tax-returns", label: "Tax Returns" },
  { id: "appointments", label: "Appointments" },
  { id: "billing", label: "Billing" },
  { id: "irs-legal", label: "IRS & Legal" },
  { id: "clients", label: "Client Accounts" },
];
