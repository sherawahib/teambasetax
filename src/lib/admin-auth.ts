export const ADMIN_DEMO = {
  email: "admin@teambasedtax.com",
  password: "admin2026",
};

/** Demo token — replace with env-based secret in production */
export const ADMIN_TOKEN = "tbts-admin-demo-token";

export function isAdminRequest(request: Request): boolean {
  const token = request.headers.get("x-admin-token");
  return token === ADMIN_TOKEN || token === process.env.ADMIN_API_TOKEN;
}

export function createAdminSession() {
  return { email: ADMIN_DEMO.email, token: ADMIN_TOKEN, loggedInAt: new Date().toISOString() };
}

export type AdminSession = ReturnType<typeof createAdminSession>;
