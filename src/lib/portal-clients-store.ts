import { createHash, randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { PortalUser } from "@/types/client-portal";

export type StoredPortalClient = PortalUser & {
  passwordHash: string;
  salt: string;
  createdAt: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "portal-clients.json");

function hashPassword(password: string, salt: string) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function toPublicUser(client: StoredPortalClient): PortalUser {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    clientSince: client.clientSince,
    accountType: client.accountType,
  };
}

async function readClients(): Promise<StoredPortalClient[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as StoredPortalClient[];
  } catch {
    const demoSalt = "tbts-demo-salt";
    const seeded: StoredPortalClient[] = [
      {
        id: "client-demo",
        name: "Demo Client",
        email: "demo@client.com",
        phone: "(240) 555-0199",
        clientSince: "2021",
        accountType: "Individual",
        passwordHash: hashPassword("demo1234", demoSalt),
        salt: demoSalt,
        createdAt: "2021-01-15T10:00:00.000Z",
      },
    ];
    await writeClients(seeded);
    return seeded;
  }
}

async function writeClients(clients: StoredPortalClient[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(clients, null, 2), "utf8");
}

export async function listPortalClients(): Promise<PortalUser[]> {
  const clients = await readClients();
  return clients.map(toPublicUser);
}

export async function findClientByEmail(email: string): Promise<StoredPortalClient | null> {
  const clients = await readClients();
  return clients.find((c) => c.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function registerPortalClient(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  accountType: PortalUser["accountType"];
}): Promise<PortalUser> {
  const clients = await readClients();
  const email = input.email.trim().toLowerCase();

  if (clients.some((c) => c.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }

  const salt = randomBytes(16).toString("hex");
  const client: StoredPortalClient = {
    id: `client-${Date.now()}`,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    accountType: input.accountType,
    clientSince: String(new Date().getFullYear()),
    salt,
    passwordHash: hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
  };

  clients.push(client);
  await writeClients(clients);
  return toPublicUser(client);
}

export async function authenticatePortalClient(email: string, password: string): Promise<PortalUser | null> {
  const client = await findClientByEmail(email);
  if (!client) return null;
  const hash = hashPassword(password, client.salt);
  if (hash !== client.passwordHash) return null;
  return toPublicUser(client);
}

export async function deletePortalClient(id: string): Promise<boolean> {
  const clients = await readClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;
  await writeClients(filtered);
  return true;
}
