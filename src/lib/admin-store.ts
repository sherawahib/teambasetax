"use client";

import { ADMIN_TOKEN } from "@/lib/admin-auth";
import type { AdminSession } from "@/types/admin";
import type { ServerPortalData } from "@/lib/portal-server-store";
import type { Testimonial } from "@/types/testimonial";

const SESSION_KEY = "tbts-admin-session";

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AdminSession) : null;
}

export function adminLogin(email: string, password: string): AdminSession | null {
  if (email === "admin@teambasedtax.com" && password === "admin2026") {
    const session: AdminSession = {
      email,
      token: ADMIN_TOKEN,
      loggedInAt: new Date().toISOString(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}

function authHeaders(): HeadersInit {
  const session = getAdminSession();
  return session ? { "x-admin-token": session.token, "Content-Type": "application/json" } : {};
}

export async function fetchAdminPortalData(): Promise<ServerPortalData> {
  const res = await fetch("/api/admin/portal", { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load portal data");
  return res.json();
}

export async function fetchAdminTestimonials(): Promise<{ testimonials: Testimonial[]; averageRating: number; count: number }> {
  const res = await fetch("/api/testimonials");
  return res.json();
}

export async function deleteFeedback(id: string) {
  const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Delete failed");
  }
  return res.json();
}

export async function deletePortalItem(type: keyof ServerPortalData, id: string) {
  const res = await fetch("/api/admin/portal", {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ type, id }),
  });
  if (!res.ok) throw new Error("Delete failed");
}

export async function updatePortalItem(type: keyof ServerPortalData, id: string, updates: Record<string, unknown>) {
  const res = await fetch("/api/admin/portal", {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ type, id, updates }),
  });
  if (!res.ok) throw new Error("Update failed");
}

export async function fetchAdminClients() {
  const res = await fetch("/api/admin/clients", { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load clients");
  return res.json() as Promise<{ clients: import("@/types/client-portal").PortalUser[] }>;
}

export async function deleteClient(id: string) {
  const res = await fetch("/api/admin/clients", {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Delete failed");
}

export async function sendAdminReply(subject: string, message: string) {
  const res = await fetch("/api/admin/portal", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ action: "reply", subject, message }),
  });
  if (!res.ok) throw new Error("Reply failed");
  return res.json();
}
