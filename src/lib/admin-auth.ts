export const ADMIN_DEMO = {
  email: "michael.reis@teambasedtax.com",
  password: "admin2026",
};

/** Also accept legacy admin email */
const ADMIN_EMAILS = new Set([
  "michael.reis@teambasedtax.com",
  "admin@teambasedtax.com",
]);

/** Demo token — replace with env-based secret in production */
export const ADMIN_TOKEN = "tbts-admin-demo-token";

export function isValidAdminLogin(email: string, password: string) {
  return ADMIN_EMAILS.has(email.trim().toLowerCase()) && password === ADMIN_DEMO.password;
}

export function isAdminRequest(request: Request): boolean {
  const token = request.headers.get("x-admin-token");
  return token === ADMIN_TOKEN || token === process.env.ADMIN_API_TOKEN;
}

export function createAdminSession(email = ADMIN_DEMO.email) {
  return {
    email: email.trim().toLowerCase(),
    token: ADMIN_TOKEN,
    loggedInAt: new Date().toISOString(),
  };
}

export type AdminSession = ReturnType<typeof createAdminSession>;
