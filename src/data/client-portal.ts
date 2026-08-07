import type { ChecklistItem, DocumentCategory, PortalSection } from "@/types/client-portal";

export const PORTAL_DEMO = {
  email: "demo@client.com",
  password: "demo1234",
};

/** Document categories aligned with Tax Client Checklist */
export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "Personal ID",
  "Income - W-2",
  "Income - 1099",
  "Income - Retirement / Social Security",
  "Education",
  "Mortgage & Housing",
  "Business Records",
  "Vehicle Expenses",
  "Business Expenses",
  "Prior Returns",
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

/** Seeded from Tax Client Checklist (Word) — used for portal checklist + profile wizard */
export const SEED_CHECKLIST: ChecklistItem[] = [
  // Personal Information
  { id: "tc-p1", label: "Full names of taxpayer, spouse, and dependents", category: "Personal Information", done: false },
  { id: "tc-p2", label: "Current mailing address", category: "Personal Information", done: false },
  { id: "tc-p3", label: "Social Security numbers for all applicable individuals", category: "Personal Information", done: false },
  { id: "tc-p4", label: "Dates of birth for all applicable individuals", category: "Personal Information", done: false },
  { id: "tc-p5", label: "Copy of driver's license or state ID", category: "Personal Information", done: false },
  { id: "tc-p6", label: "Email address and phone number", category: "Personal Information", done: false },
  { id: "tc-p7", label: "Mortgage statement if you own a home", category: "Personal Information", done: false },
  { id: "tc-p8", label: "College tuition statements and education expense records", category: "Personal Information", done: false },
  // Income Documents
  { id: "tc-i1", label: "W-2 forms", category: "Income Documents", done: false },
  { id: "tc-i2", label: "1099-R forms for retirement income", category: "Income Documents", done: false },
  { id: "tc-i3", label: "1099-MISC forms", category: "Income Documents", done: false },
  { id: "tc-i4", label: "1099-NEC forms", category: "Income Documents", done: false },
  { id: "tc-i5", label: "1099-K forms", category: "Income Documents", done: false },
  { id: "tc-i6", label: "Social Security income statement", category: "Income Documents", done: false },
  { id: "tc-i7", label: "Year-end retirement account statements", category: "Income Documents", done: false },
  { id: "tc-i8", label: "Disability income documents, if applicable", category: "Income Documents", done: false },
  // Business Information
  { id: "tc-b1", label: "Business name and address", category: "Business Information", done: false },
  { id: "tc-b2", label: "Employer Identification Number (EIN)", category: "Business Information", done: false },
  { id: "tc-b3", label: "Principal business activity", category: "Business Information", done: false },
  { id: "tc-b4", label: "Business income from all sources", category: "Business Information", done: false },
  { id: "tc-b5", label: "Twelve months of business bank statements", category: "Business Information", done: false },
  { id: "tc-b6", label: "Official financial statement or profit and loss statement", category: "Business Information", done: false },
  { id: "tc-b7", label: "Copy of prior-year business tax return", category: "Business Information", done: false },
  { id: "tc-b8", label: "1099-MISC, 1099-NEC, and 1099-K forms received", category: "Business Information", done: false },
  // Vehicle Expenses
  { id: "tc-v1", label: "Vehicle make, model, and year", category: "Vehicle Expenses for Business Use", done: false },
  { id: "tc-v2", label: "Purchase date, purchase amount, and purchase contract", category: "Vehicle Expenses for Business Use", done: false },
  { id: "tc-v3", label: "Auto insurance records", category: "Vehicle Expenses for Business Use", done: false },
  { id: "tc-v4", label: "Total annual miles driven", category: "Vehicle Expenses for Business Use", done: false },
  { id: "tc-v5", label: "Total business miles driven", category: "Vehicle Expenses for Business Use", done: false },
  { id: "tc-v6", label: "Vehicle repairs and maintenance", category: "Vehicle Expenses for Business Use", done: false },
  { id: "tc-v7", label: "Vehicle registration date and registration cost", category: "Vehicle Expenses for Business Use", done: false },
  // Other Business Expenses
  { id: "tc-e1", label: "Advertising", category: "Other Business Expenses", done: false },
  { id: "tc-e2", label: "Commissions and fees", category: "Other Business Expenses", done: false },
  { id: "tc-e3", label: "Contract labor, including 1099 forms issued to contractors", category: "Other Business Expenses", done: false },
  { id: "tc-e4", label: "Legal and professional fees", category: "Other Business Expenses", done: false },
  { id: "tc-e5", label: "Rent", category: "Other Business Expenses", done: false },
  { id: "tc-e6", label: "Supplies and materials", category: "Other Business Expenses", done: false },
  { id: "tc-e7", label: "Travel and meals", category: "Other Business Expenses", done: false },
  { id: "tc-e8", label: "Utilities", category: "Other Business Expenses", done: false },
  { id: "tc-e9", label: "Health insurance", category: "Other Business Expenses", done: false },
  { id: "tc-e10", label: "Equipment purchased for business during the tax year", category: "Other Business Expenses", done: false },
  // Notes
  { id: "tc-n1", label: "Additional notes / major life or business changes", category: "Client Notes", done: false },
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
    description: "Interactive tools for tax and financial planning.",
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
