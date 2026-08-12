import type { ClientTaxProfile, PortalDocument, PortalUser } from "@/types/client-portal";
import { emptyClientTaxProfile } from "@/types/client-portal";
import { hashPassword, newSalt } from "@/lib/password";
import { listClientDocuments } from "@/lib/portal-server-store";
import { prisma } from "@/lib/prisma";

export type PortalClientDetail = {
  user: PortalUser;
  profile: ClientTaxProfile;
  documents: PortalDocument[];
  createdAt: string;
};

function parseProfile(raw: string | null | undefined): ClientTaxProfile {
  try {
    if (!raw || raw === "{}") return emptyClientTaxProfile();
    return { ...emptyClientTaxProfile(), ...(JSON.parse(raw) as Partial<ClientTaxProfile>) };
  } catch {
    return emptyClientTaxProfile();
  }
}

function toPublicUser(client: {
  id: string;
  name: string;
  email: string;
  phone: string;
  clientSince: string;
  accountType: string;
  profileComplete?: boolean;
}): PortalUser {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    clientSince: client.clientSince,
    accountType: client.accountType as PortalUser["accountType"],
    profileComplete: Boolean(client.profileComplete),
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
  accountType?: PortalUser["accountType"];
}): Promise<PortalUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await findClientByEmail(email);
  if (existing) throw new Error("An account with this email already exists.");

  const accountType = input.accountType ?? "Individual";
  const salt = newSalt();
  const profile = emptyClientTaxProfile({ name: input.name.trim(), accountType });

  const client = await prisma.portalClient.create({
    data: {
      id: `client-${Date.now()}`,
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      accountType,
      clientSince: String(new Date().getFullYear()),
      salt,
      passwordHash: hashPassword(input.password, salt),
      profileComplete: false,
      profileData: JSON.stringify(profile),
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

export async function getClientProfile(email: string): Promise<ClientTaxProfile | null> {
  const client = await findClientByEmail(email);
  if (!client) return null;
  return parseProfile(client.profileData);
}

export async function saveClientProfile(
  email: string,
  profile: ClientTaxProfile,
): Promise<{ user: PortalUser; profile: ClientTaxProfile } | null> {
  const client = await findClientByEmail(email);
  if (!client) return null;

  const next: ClientTaxProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  const updated = await prisma.portalClient.update({
    where: { id: client.id },
    data: {
      name: next.taxpayerFullName.trim() || client.name,
      phone: client.phone,
      accountType: next.accountType,
      profileComplete: next.profileComplete,
      profileData: JSON.stringify(next),
    },
  });

  return { user: toPublicUser(updated), profile: next };
}

export async function getPortalClientDetail(id: string): Promise<PortalClientDetail | null> {
  const client = await prisma.portalClient.findUnique({ where: { id } });
  if (!client) return null;
  const documents = await listClientDocuments(client.id);
  return {
    user: toPublicUser(client),
    profile: parseProfile(client.profileData),
    documents,
    createdAt: client.createdAt.toISOString(),
  };
}

export async function deletePortalClient(id: string): Promise<boolean> {
  try {
    await prisma.portalClient.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
