import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import { SEED_CHECKLIST } from "../src/data/client-portal";

const prisma = new PrismaClient();

function hashPassword(password: string, salt: string) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

const testimonials = [
  {
    id: "seed-1",
    name: "Maria L.",
    email: "",
    rating: 5,
    service: "Personal Tax Services",
    location: "Germantown, MD",
    text: "Michael and his team made tax season stress-free. They found deductions I missed for years and explained everything clearly. Highly recommend TEAMBASED Tax Services!",
    recommend: true,
    createdAt: new Date("2025-11-12T10:00:00.000Z"),
  },
  {
    id: "seed-2",
    name: "James R.",
    email: "",
    rating: 5,
    service: "Business Tax Services",
    location: "Rockville, MD",
    text: "Professional, responsive, and thorough. They handle our small business bookkeeping and taxes with accuracy we can trust. Worth every penny.",
    recommend: true,
    createdAt: new Date("2025-10-28T14:30:00.000Z"),
  },
  {
    id: "seed-3",
    name: "Patricia W.",
    email: "",
    rating: 5,
    service: "Retirement Planning",
    location: "Gaithersburg, MD",
    text: "They took time to understand my retirement goals and tax situation. Patient, knowledgeable, and never rushed. A true personalized experience.",
    recommend: true,
    createdAt: new Date("2025-09-15T09:15:00.000Z"),
  },
  {
    id: "seed-4",
    name: "David K.",
    email: "",
    rating: 4,
    service: "IRS Representation",
    location: "Frederick, MD",
    text: "When I received an IRS notice, they handled it quickly and kept me informed every step of the way. Resolved my issue without unnecessary stress.",
    recommend: true,
    createdAt: new Date("2025-08-20T16:45:00.000Z"),
  },
  {
    id: "seed-5",
    name: "Angela M.",
    email: "",
    rating: 5,
    service: "Personal Tax Services",
    location: "Clarksburg, MD",
    text: "First-time client discount was a nice surprise. They even offered a home visit for my mother. Exceptional service for seniors in our area.",
    recommend: true,
    createdAt: new Date("2025-07-08T11:20:00.000Z"),
  },
];

async function main() {
  console.log("Seeding Neon PostgreSQL database…");

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }

  const demoSalt = "tbts-demo-salt";
  await prisma.portalClient.upsert({
    where: { email: "demo@client.com" },
    update: {
      profileComplete: true,
    },
    create: {
      id: "client-demo",
      name: "Demo Client",
      email: "demo@client.com",
      phone: "(240) 555-0199",
      clientSince: "2021",
      accountType: "Individual",
      salt: demoSalt,
      passwordHash: hashPassword("demo1234", demoSalt),
      profileComplete: true,
      profileData: "{}",
      createdAt: new Date("2021-01-15T10:00:00.000Z"),
    },
  });

  const docs = [
    {
      id: "d1",
      clientId: "client-demo",
      name: "W2_Employer_2025.pdf",
      category: "W-2 & Income",
      size: 245000,
      taxYear: 2025,
      status: "approved",
      checklistItemId: null as string | null,
      mimeType: "application/pdf",
      fileData: null as string | null,
      uploadedAt: new Date("2026-01-28T10:00:00.000Z"),
    },
    {
      id: "d2",
      clientId: "client-demo",
      name: "1099-NEC_Freelance_2025.pdf",
      category: "1099 Forms",
      size: 189000,
      taxYear: 2025,
      status: "reviewing",
      checklistItemId: null as string | null,
      mimeType: "application/pdf",
      fileData: null as string | null,
      uploadedAt: new Date("2026-02-03T14:30:00.000Z"),
    },
  ];
  for (const d of docs) {
    await prisma.portalDocument.upsert({
      where: { id: d.id },
      update: {
        clientId: d.clientId,
        name: d.name,
        category: d.category,
        status: d.status,
      },
      create: d,
    });
  }

  const returns = [
    {
      year: 2025,
      type: "Individual (1040)",
      status: "in-progress",
      preparer: "Michael Reis, EA",
      lastUpdated: new Date("2026-02-12T16:00:00.000Z"),
    },
    {
      year: 2024,
      type: "Individual (1040)",
      status: "accepted",
      filedDate: "2025-04-02",
      refundEstimate: "$1,240 refund",
      preparer: "Michael Reis, EA",
      lastUpdated: new Date("2025-05-15T11:00:00.000Z"),
    },
  ];
  for (const r of returns) {
    await prisma.portalTaxReturn.upsert({ where: { year: r.year }, update: {}, create: r });
  }

  await prisma.portalMessage.upsert({
    where: { id: "m1" },
    update: {},
    create: {
      id: "m1",
      from: "firm",
      subject: "2025 Tax Documents Received",
      body: "We received your W-2 and 1099-NEC. Please upload remaining deduction documents.",
      sentAt: new Date("2026-02-04T11:30:00.000Z"),
      read: true,
    },
  });

  await prisma.portalAppointment.upsert({
    where: { id: "a1" },
    update: {},
    create: {
      id: "a1",
      title: "2025 Tax Return Review",
      date: "2026-03-05",
      time: "2:00 PM",
      type: "In-Office",
      status: "scheduled",
      notes: "Bring photo ID and remaining documents.",
    },
  });

  const invoices = [
    {
      id: "inv1",
      description: "2024 Individual Tax Preparation",
      amount: 385,
      dueDate: "2025-04-01",
      status: "paid",
      taxYear: 2024,
    },
    {
      id: "inv2",
      description: "2025 Individual Tax Preparation (estimate)",
      amount: 425,
      dueDate: "2026-04-15",
      status: "pending",
      taxYear: 2025,
    },
  ];
  for (const inv of invoices) {
    await prisma.portalInvoice.upsert({ where: { id: inv.id }, update: {}, create: inv });
  }

  await prisma.portalIrsNotice.upsert({
    where: { id: "n1" },
    update: {},
    create: {
      id: "n1",
      noticeNumber: "CP2000",
      issueDate: "2026-01-18",
      topic: "Income discrepancy — unreported 1099 income",
      status: "in-representation",
      responseDue: "2026-03-18",
      assignedTo: "Michael Reis, EA",
    },
  });

  await prisma.portalLegalCase.upsert({
    where: { id: "lc1" },
    update: {},
    create: {
      id: "lc1",
      title: "CP2000 Underreported Income Response",
      category: "Audit",
      status: "active",
      openedDate: "2026-01-20",
      nextStep: "Firm preparing response — due March 18, 2026",
    },
  });

  // Replace checklist with Tax Client Checklist items
  await prisma.portalChecklistItem.deleteMany({});
  for (const item of SEED_CHECKLIST) {
    await prisma.portalChecklistItem.create({ data: item });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
