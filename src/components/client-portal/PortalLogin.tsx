"use client";

import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { PORTAL_DEMO } from "@/data/client-portal";
import { login, signup } from "@/lib/client-portal-store";
import type { PortalSession } from "@/types/client-portal";

type Props = {
  onLogin: (session: PortalSession) => void;
};

type Mode = "signin" | "signup";

export default function PortalLogin({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-border px-4 py-3 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-surface-elevated min-h-11";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.session) {
      setError(result.error ?? "Sign in failed.");
      return;
    }
    onLogin(result.session);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      confirmPassword,
    });
    setLoading(false);
    if (!result.session) {
      setError(result.error ?? "Sign up failed.");
      return;
    }
    onLogin(result.session);
  }

  function fillDemo() {
    setMode("signin");
    setEmail(PORTAL_DEMO.email);
    setPassword(PORTAL_DEMO.password);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-surface-elevated shadow-lg overflow-hidden">
        <div className="bg-navy px-6 py-8 text-center text-white">
          <h2 className="text-xl font-bold">Secure Client Portal</h2>
          <p className="mt-2 text-sm text-white/80">
            {mode === "signup"
              ? "Create your account with basic info — then complete your tax checklist profile."
              : "Sign in to manage documents, returns, and your tax checklist."}
          </p>
        </div>

        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors min-h-11 ${
              mode === "signin" ? "text-gold border-b-2 border-gold bg-gold/5" : "text-muted hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors min-h-11 ${
              mode === "signup" ? "text-gold border-b-2 border-gold bg-gold/5" : "text-muted hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="portal-email" className={labelClass}>
                Email Address
              </label>
              <input
                id="portal-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="portal-password" className={labelClass}>
                Password
              </label>
              <input
                id="portal-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <button type="button" onClick={fillDemo} className="w-full text-sm font-medium text-gold hover:underline">
              Use demo account ({PORTAL_DEMO.email})
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <p className="rounded-lg border border-gold/25 bg-gold/5 px-3 py-2 text-xs text-slate-700">
              Simple signup only: name, email, phone, and password. After signup you will complete the full Tax Client
              Checklist (details + document uploads).
            </p>

            <div>
              <label htmlFor="signup-name" className={labelClass}>
                Full Name *
              </label>
              <input
                id="signup-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className={labelClass}>
                Email Address *
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="signup-phone" className={labelClass}>
                Phone Number *
              </label>
              <input
                id="signup-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="(240) 555-0100"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className={labelClass}>
                Password * <span className="font-normal text-muted">(min. 6 characters)</span>
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="signup-confirm" className={labelClass}>
                Confirm Password *
              </label>
              <input
                id="signup-confirm"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-xs text-muted">
              By signing up you agree to our{" "}
              <a href="/privacy-policy" className="text-gold hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms-of-use" className="text-gold hover:underline">
                Terms of Use
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
