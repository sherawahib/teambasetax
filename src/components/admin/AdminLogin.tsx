"use client";

import { useState } from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import { ADMIN_DEMO } from "@/lib/admin-auth";
import { adminLogin } from "@/lib/admin-store";
import type { AdminSession } from "@/types/admin";

type Props = { onLogin: (session: AdminSession) => void };

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const session = adminLogin(email.trim(), password);
    if (!session) {
      setError("Invalid admin credentials.");
      return;
    }
    onLogin(session);
  }

  function fillDemo() {
    setEmail(ADMIN_DEMO.email);
    setPassword(ADMIN_DEMO.password);
  }

  const inputClass =
    "w-full rounded-lg border border-border px-4 py-3 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-surface-elevated min-h-11";

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-surface-elevated shadow-lg overflow-hidden">
        <div className="bg-black px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
            <ShieldCheck className="h-7 w-7 text-gold" />
          </div>
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <p className="text-sm text-white/70 mt-2">Manage clients, feedback, documents, and portal content</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors min-h-11"
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          <button type="button" onClick={fillDemo} className="w-full text-sm text-gold font-medium hover:underline">
            Use demo admin ({ADMIN_DEMO.email})
          </button>
        </form>
      </div>
    </div>
  );
}
