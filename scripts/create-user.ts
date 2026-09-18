import { PrismaClient } from "@prisma/client";
import { hashPassword, newSalt } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = "michael@awsvision.com";
  const password = "michael1234";
  const salt = newSalt();

  const user = await prisma.portalClient.upsert({
    where: { email },
    update: {
      name: "Michael",
      phone: "(240) 780-6910",
      accountType: "Both",
      salt,
      passwordHash: hashPassword(password, salt),
    },
    create: {
      id: "client-michael-awsvision",
      name: "Michael",
      email,
      phone: "(240) 780-6910",
      accountType: "Both",
      clientSince: String(new Date().getFullYear()),
      salt,
      passwordHash: hashPassword(password, salt),
    },
  });

  console.log("User ready:", user.email, user.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
