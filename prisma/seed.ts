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
    text: "I was overwhelmed by an IRS notice. They took over communication and resolved it professionally. Would use again.",
    recommend: true,
    createdAt: new Date("2025-08-02T16:45:00.000Z"),
  },
  {
    id: "seed-5",
    name: "Angela M.",
    email: "",
    rating: 5,
    service: "Tax Planning",
    location: "Bethesda, MD",
    text: "Clear advice year-round, not just at tax time. Helped us structure our household finances better.",
    recommend: true,
    createdAt: new Date("2025-07-19T11:20:00.000Z"),
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

  const demoSalt = "demo-salt-teambase";
  await prisma.portalClient.upsert({
    where: { email: "demo@client.com" },
    update: {
      profileComplete: true,
      name: "Demo Client",
      phone: "(240) 555-0199",
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

  const clientId = "client-demo";

  // Clear and reseed demo-owned portal rows
  await prisma.portalDocument.deleteMany({ where: { clientId } });
  await prisma.portalMessage.deleteMany({ where: { clientId } });
  await prisma.portalTaxReturn.deleteMany({ where: { clientId } });
  await prisma.portalAppointment.deleteMany({ where: { clientId } });
  await prisma.portalInvoice.deleteMany({ where: { clientId } });
  await prisma.portalIrsNotice.deleteMany({ where: { clientId } });
  await prisma.portalLegalCase.deleteMany({ where: { clientId } });
  await prisma.portalChecklistItem.deleteMany({ where: { clientId } });

  await prisma.portalDocument.createMany({
    data: [
      {
        id: "d1",
        clientId,
        name: "W2_Employer_2025.pdf",
        category: "W-2 & Income",
        size: 245000,
        taxYear: 2025,
        status: "approved",
        mimeType: "application/pdf",
        uploadedAt: new Date("2026-01-28T10:00:00.000Z"),
      },
      {
        id: "d2",
        clientId,
        name: "1099-NEC_Freelance_2025.pdf",
        category: "1099 Forms",
        size: 189000,
        taxYear: 2025,
        status: "reviewing",
        mimeType: "application/pdf",
        uploadedAt: new Date("2026-02-03T14:30:00.000Z"),
      },
    ],
  });

  await prisma.portalTaxReturn.createMany({
    data: [
      {
        id: `tr-${clientId}-2025`,
        clientId,
        year: 2025,
        type: "Individual (1040)",
        status: "in-progress",
        preparer: "Michael Reis, EA",
        lastUpdated: new Date("2026-02-12T16:00:00.000Z"),
      },
      {
        id: `tr-${clientId}-2024`,
        clientId,
        year: 2024,
        type: "Individual (1040)",
        status: "accepted",
        filedDate: "2025-04-02",
        refundEstimate: "$1,240 refund",
        preparer: "Michael Reis, EA",
        lastUpdated: new Date("2025-05-15T11:00:00.000Z"),
      },
    ],
  });

  await prisma.portalMessage.create({
    data: {
      id: "m1",
      clientId,
      from: "firm",
      subject: "2025 Tax Documents Received",
      body: "We received your W-2 and 1099-NEC. Please upload remaining deduction documents.",
      sentAt: new Date("2026-02-04T11:30:00.000Z"),
      read: true,
    },
  });

  await prisma.portalAppointment.create({
    data: {
      id: "a1",
      clientId,
      title: "2025 Tax Return Review",
      date: "2026-03-05",
      time: "2:00 PM",
      type: "In-Office",
      status: "scheduled",
      notes: "Bring photo ID and remaining documents.",
    },
  });

  await prisma.portalInvoice.createMany({
    data: [
      {
        id: "inv1",
        clientId,
        description: "2024 Individual Tax Preparation",
        amount: 385,
        dueDate: "2025-04-01",
        status: "paid",
        taxYear: 2024,
      },
      {
        id: "inv2",
        clientId,
        description: "2025 Individual Tax Preparation (estimate)",
        amount: 425,
        dueDate: "2026-04-15",
        status: "pending",
        taxYear: 2025,
      },
    ],
  });

  await prisma.portalIrsNotice.create({
    data: {
      id: "n1",
      clientId,
      noticeNumber: "CP2000",
      issueDate: "2026-01-18",
      topic: "Income discrepancy — unreported 1099 income",
      status: "in-representation",
      responseDue: "2026-03-18",
      assignedTo: "Michael Reis, EA",
    },
  });

  await prisma.portalLegalCase.create({
    data: {
      id: "lc1",
      clientId,
      title: "CP2000 Underreported Income Response",
      category: "Audit",
      status: "active",
      openedDate: "2026-01-20",
      nextStep: "Firm preparing response — due March 18, 2026",
    },
  });

  await prisma.portalChecklistItem.createMany({
    data: SEED_CHECKLIST.map((item) => ({
      id: `${clientId}__${item.id}`,
      clientId,
      itemKey: item.id,
      label: item.label,
      category: item.category,
      done: false,
    })),
  });

  // Ensure every existing non-demo client has a checklist
  const clients = await prisma.portalClient.findMany({ where: { id: { not: clientId } } });
  for (const c of clients) {
    const count = await prisma.portalChecklistItem.count({ where: { clientId: c.id } });
    if (count === 0) {
      await prisma.portalChecklistItem.createMany({
        data: SEED_CHECKLIST.map((item) => ({
          id: `${c.id}__${item.id}`,
          clientId: c.id,
          itemKey: item.id,
          label: item.label,
          category: item.category,
          done: false,
        })),
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
