import { createHash, randomBytes } from "crypto";

export function hashPassword(password: string, salt: string) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

export function newSalt() {
  return randomBytes(16).toString("hex");
}
