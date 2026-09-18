import { createHmac, timingSafeEqual } from "crypto";

const DAY_MS = 24 * 60 * 60 * 1000;
const TOKEN_TTL_MS = 30 * DAY_MS;

function secret() {
  return (
    process.env.PORTAL_SESSION_SECRET?.trim() ||
    process.env.ADMIN_API_TOKEN?.trim() ||
    "tbts-portal-dev-secret-change-in-production"
  );
}

export type PortalTokenPayload = {
  id: string;
  email: string;
  exp: number;
};

export function createPortalToken(user: { id: string; email: string }): string {
  const payload: PortalTokenPayload = {
    id: user.id,
    email: user.email.toLowerCase(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyPortalToken(token: string | null | undefined): PortalTokenPayload | null {
  if (!token?.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as PortalTokenPayload;
    if (!payload?.id || !payload?.email || !payload?.exp) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Resolve authenticated portal client from request headers */
export function getPortalAuth(request: Request): PortalTokenPayload | null {
  const header =
    request.headers.get("x-portal-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  return verifyPortalToken(header.trim() || undefined);
}
