import { PrismaClient } from "@prisma/client";

/** Wipe legacy global portal rows before multi-tenant schema push */
const prisma = new PrismaClient();

async function main() {
  const tables = [
    "PortalDocument",
    "PortalMessage",
    "PortalTaxReturn",
    "PortalAppointment",
    "PortalInvoice",
    "PortalIrsNotice",
    "PortalLegalCase",
    "PortalChecklistItem",
  ];
  for (const table of tables) {
    try {
      const n = await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
      console.log(`Cleared ${table}:`, n);
    } catch (e) {
      console.log(`Skip ${table}:`, e instanceof Error ? e.message : e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
