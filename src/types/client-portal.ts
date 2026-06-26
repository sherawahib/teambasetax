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
};

export type DocumentCategory =
  | "W-2 & Income"
  | "1099 Forms"
  | "Receipts & Expenses"
  | "Business Records"
  | "Prior Returns"
  | "Legal & IRS"
  | "Other";

export type PortalDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  size: number;
  uploadedAt: string;
  taxYear: number;
  status: "received" | "reviewing" | "approved" | "needs-action";
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
