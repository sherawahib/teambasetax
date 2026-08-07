/** Tax Client Checklist profile + document types for portal onboarding */

export type PortalSection =
  | "dashboard"
  | "documents"
  | "tax-returns"
  | "messages"
  | "appointments"
  | "billing"
  | "irs-legal"
  | "advisory"
  | "checklists"
  | "calendar"
  | "profile";

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clientSince: string;
  accountType: "Individual" | "Business" | "Both";
  /** False until Tax Client Checklist profile wizard is finished */
  profileComplete: boolean;
};

export type DocumentCategory =
  | "Personal ID"
  | "Income - W-2"
  | "Income - 1099"
  | "Income - Retirement / Social Security"
  | "Education"
  | "Mortgage & Housing"
  | "Business Records"
  | "Vehicle Expenses"
  | "Business Expenses"
  | "Prior Returns"
  | "Other"
  // legacy categories kept for existing demo docs
  | "W-2 & Income"
  | "1099 Forms"
  | "Receipts & Expenses"
  | "Legal & IRS";

export type PortalDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  size: number;
  uploadedAt: string;
  taxYear: number;
  status: "received" | "reviewing" | "approved" | "needs-action";
  checklistItemId?: string;
};

export type TaxReturnStatus = {
  year: number;
  type: string;
  status: "not-started" | "in-progress" | "review" | "filed" | "accepted";
  filedDate?: string;
  refundEstimate?: string;
  preparer: string;
  lastUpdated: string;
};

export type PortalMessage = {
  id: string;
  from: "client" | "firm";
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
};

export type PortalAppointment = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "In-Office" | "Virtual" | "Phone" | "Home Visit";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
};

export type PortalInvoice = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "paid" | "due" | "overdue" | "pending";
  taxYear?: number;
};

export type IrsNotice = {
  id: string;
  noticeNumber: string;
  issueDate: string;
  topic: string;
  status: "open" | "in-representation" | "resolved";
  responseDue?: string;
  assignedTo: string;
};

export type LegalCase = {
  id: string;
  title: string;
  category: "Audit" | "Collection" | "Penalty" | "Appeal" | "Entity" | "Estate";
  status: "active" | "monitoring" | "closed";
  openedDate: string;
  nextStep: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  category: string;
  done: boolean;
};

export type PortalSession = {
  user: PortalUser;
  loggedInAt: string;
};

/** Full tax intake profile from Tax Client Checklist */
export type ClientTaxProfile = {
  accountType: PortalUser["accountType"];
  // Personal
  taxpayerFullName: string;
  spouseFullName: string;
  dependents: string;
  mailingAddress: string;
  city: string;
  state: string;
  zip: string;
  taxpayerSsn: string;
  spouseSsn: string;
  dependentsSsn: string;
  taxpayerDob: string;
  spouseDob: string;
  dependentsDob: string;
  // Business
  businessName: string;
  businessAddress: string;
  ein: string;
  principalActivity: string;
  businessIncomeNotes: string;
  // Vehicle
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  purchaseDate: string;
  purchaseAmount: string;
  totalMiles: string;
  businessMiles: string;
  registrationDate: string;
  registrationCost: string;
  // Notes
  clientNotes: string;
  // Progress
  completedSteps: string[];
  profileComplete: boolean;
  updatedAt: string;
};

export function emptyClientTaxProfile(defaults?: {
  name?: string;
  accountType?: PortalUser["accountType"];
}): ClientTaxProfile {
  return {
    accountType: defaults?.accountType ?? "Individual",
    taxpayerFullName: defaults?.name ?? "",
    spouseFullName: "",
    dependents: "",
    mailingAddress: "",
    city: "",
    state: "MD",
    zip: "",
    taxpayerSsn: "",
    spouseSsn: "",
    dependentsSsn: "",
    taxpayerDob: "",
    spouseDob: "",
    dependentsDob: "",
    businessName: "",
    businessAddress: "",
    ein: "",
    principalActivity: "",
    businessIncomeNotes: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    purchaseDate: "",
    purchaseAmount: "",
    totalMiles: "",
    businessMiles: "",
    registrationDate: "",
    registrationCost: "",
    clientNotes: "",
    completedSteps: [],
    profileComplete: false,
    updatedAt: new Date().toISOString(),
  };
}
