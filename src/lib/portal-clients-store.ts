import type { PortalUser } from "@/types/client-portal";
import { hashPassword, newSalt } from "@/lib/password";
import { prisma } from "@/lib/prisma";

function toPublicUser(client: {
  id: string;
  name: string;
  email: string;
  phone: string;
  clientSince: string;
  accountType: string;
}): PortalUser {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    clientSince: client.clientSince,
    accountType: client.accountType as PortalUser["accountType"],
  };
}

export async function listPortalClients(): Promise<PortalUser[]> {
  const clients = await prisma.portalClient.findMany({ orderBy: { createdAt: "desc" } });
  return clients.map(toPublicUser);
}

export async function findClientByEmail(email: string) {
  return prisma.portalClient.findUnique({ where: { email: email.toLowerCase() } });
}

export async function registerPortalClient(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  accountType: PortalUser["accountType"];
}): Promise<PortalUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await findClientByEmail(email);
  if (existing) throw new Error("An account with this email already exists.");

  const salt = newSalt();
  const client = await prisma.portalClient.create({
    data: {
      id: `client-${Date.now()}`,
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      accountType: input.accountType,
      clientSince: String(new Date().getFullYear()),
      salt,
      passwordHash: hashPassword(input.password, salt),
    },
  });
  return toPublicUser(client);
}

export async function authenticatePortalClient(email: string, password: string): Promise<PortalUser | null> {
  const client = await findClientByEmail(email);
  if (!client) return null;
  if (hashPassword(password, client.salt) !== client.passwordHash) return null;
  return toPublicUser(client);
}

export async function deletePortalClient(id: string): Promise<boolean> {
  try {
    await prisma.portalClient.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
