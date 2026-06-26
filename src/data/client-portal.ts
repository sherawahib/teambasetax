import type { ChecklistItem, DocumentCategory, PortalSection } from "@/types/client-portal";

export const PORTAL_DEMO = {
  email: "demo@client.com",
  password: "demo1234",
};

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "W-2 & Income",
  "1099 Forms",
  "Receipts & Expenses",
  "Business Records",
  "Prior Returns",
  "Legal & IRS",
  "Other",
];

export const PORTAL_NAV: { id: PortalSection; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "documents", label: "Documents" },
  { id: "tax-returns", label: "Tax Returns" },
  { id: "messages", label: "Messages" },
  { id: "appointments", label: "Appointments" },
  { id: "billing", label: "Billing & Payments" },
  { id: "irs-legal", label: "IRS & Legal" },
  { id: "advisory", label: "Financial Advisory" },
  { id: "checklists", label: "Checklists" },
  { id: "calendar", label: "Tax Calendar" },
  { id: "profile", label: "Profile & Settings" },
];

export const SEED_CHECKLIST: ChecklistItem[] = [
  { id: "c1", label: "Gather W-2s from all employers", category: "Income", done: true },
  { id: "c2", label: "Collect 1099-NEC / 1099-MISC forms", category: "Income", done: true },
  { id: "c3", label: "Mortgage interest statement (1098)", category: "Deductions", done: false },
  { id: "c4", label: "Property tax receipts", category: "Deductions", done: false },
  { id: "c5", label: "Charitable contribution records", category: "Deductions", done: false },
  { id: "c6", label: "Medical expense receipts (if itemizing)", category: "Deductions", done: false },
  { id: "c7", label: "Childcare provider tax ID (Form 2441)", category: "Credits", done: false },
  { id: "c8", label: "Education expenses (1098-T)", category: "Credits", done: false },
  { id: "c9", label: "Business income & expense ledger", category: "Business", done: false },
  { id: "c10", label: "Quarterly estimated tax payments made", category: "Business", done: false },
  { id: "c11", label: "Retirement contribution statements", category: "Planning", done: false },
  { id: "c12", label: "Prior-year return copy", category: "General", done: true },
];

export const TAX_DEADLINES = [
  { date: "2026-01-15", title: "Q4 Estimated Tax Payment (2025)", type: "federal" },
  { date: "2026-01-31", title: "W-2 & 1099-NEC due to recipients", type: "federal" },
  { date: "2026-03-16", title: "S-Corp & Partnership returns (Form 1120-S / 1065)", type: "federal" },
  { date: "2026-04-15", title: "Individual Tax Return Due (Form 1040)", type: "federal" },
  { date: "2026-04-15", title: "Q1 Estimated Tax Payment", type: "federal" },
  { date: "2026-04-15", title: "C-Corp Return Due (Form 1120)", type: "federal" },
  { date: "2026-06-15", title: "Q2 Estimated Tax Payment", type: "federal" },
  { date: "2026-09-15", title: "Q3 Estimated Tax Payment", type: "federal" },
  { date: "2026-10-15", title: "Extended Individual Return Due", type: "federal" },
  { date: "2026-04-15", title: "Maryland Individual Return Due", type: "state" },
];

export const ADVISORY_RESOURCES = [
  {
    title: "Retirement Planning",
    description: "401(k), IRA, Roth conversion, and RMD strategies.",
    href: "/services/retirement-planning-services",
  },
  {
    title: "Estate Tax Planning",
    description: "Gifting, trusts, and wealth transfer strategies.",
    href: "/services/estate-tax-planning",
  },
  {
    title: "Business Entity Selection",
    description: "LLC, S-Corp, and C-Corp tax efficiency analysis.",
    href: "/services/business-entity-selection",
  },
  {
    title: "Management Advisory",
    description: "Budgeting, cash flow, and profitability reviews.",
    href: "/services/management-advisory",
  },
  {
    title: "Financial Calculators",
    description: "13 interactive tools for tax and financial planning.",
    href: "/resources/financial-calculators",
  },
  {
    title: "Record Retention Guide",
    description: "How long to keep tax and financial records.",
    href: "/resources/record-retention-guide",
  },
];

export const LEGAL_RESOURCES = [
  { title: "Taxpayer Rights", href: "/resources/taxpayer-rights", description: "Know your rights before the IRS." },
  { title: "IRS Representation", href: "/services/irs-representation", description: "Audit defense and dispute resolution." },
  { title: "IRS Publications", href: "/resources/irs-publications", description: "Official IRS guidance library." },
  { title: "IRS Forms", href: "/resources/irs-forms", description: "Download federal tax forms." },
  { title: "Tax Appointment Checklist", href: "/resources/tax-appointment-checklist", description: "Prepare for your consultation." },
  { title: "Privacy Policy", href: "/privacy-policy", description: "How we protect your data." },
  { title: "Terms of Use", href: "/terms-of-use", description: "Portal and service terms." },
];

export const STATUS_COLORS: Record<string, string> = {
  "not-started": "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-800",
  review: "bg-amber-100 text-amber-800",
  filed: "bg-emerald-100 text-emerald-800",
  accepted: "bg-green-100 text-green-800",
  received: "bg-slate-100 text-slate-700",
  reviewing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  "needs-action": "bg-red-100 text-red-800",
  open: "bg-red-100 text-red-800",
  "in-representation": "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  active: "bg-amber-100 text-amber-800",
  monitoring: "bg-blue-100 text-blue-800",
  closed: "bg-slate-100 text-slate-700",
  paid: "bg-green-100 text-green-800",
  due: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  pending: "bg-slate-100 text-slate-700",
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-slate-100 text-slate-600",
};
