"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = { compact?: boolean };

export default function NewsletterSignup({ compact }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(fd.get("firstName") || ""),
          lastName: String(fd.get("lastName") || ""),
          email: String(fd.get("email") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Subscription failed.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Unable to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={`text-center ${compact ? "" : "rounded-xl bg-gold/10 border border-gold/30 p-4"}`}>
        <p className={`text-sm ${compact ? "text-white" : "text-gold font-medium"}`}>
          Thank you for subscribing to our tax newsletter!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <p className="text-muted text-sm">Sign up for tax tips, deadlines, and insights delivered to your inbox.</p>
      )}
      <div className={compact ? "space-y-2" : "grid sm:grid-cols-2 gap-3"}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          className={`w-full rounded-lg border border-border px-3 py-3 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold min-h-11 ${compact ? "!bg-white/10 !border-white/20 !text-white placeholder:!text-white/60 focus:!border-gold-light" : "bg-surface-elevated text-foreground"}`}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          className={`w-full rounded-lg border border-border px-3 py-3 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold min-h-11 ${compact ? "!bg-white/10 !border-white/20 !text-white placeholder:!text-white/60 focus:!border-gold-light" : "bg-surface-elevated text-foreground"}`}
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className={`w-full rounded-lg border border-border px-3 py-3 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold min-h-11 ${compact ? "!bg-white/10 !border-white/20 !text-white placeholder:!text-white/60 focus:!border-gold-light" : "bg-surface-elevated text-foreground"}`}
      />
      {error && (
        <p className={`text-sm ${compact ? "text-red-200" : "text-red-600"}`}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`flex min-h-11 items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 ${compact ? "bg-gold-light text-navy hover:bg-white" : "bg-navy text-white hover:bg-navy-light"}`}
      >
        <Send className="h-4 w-4" />
        {loading ? "Submitting…" : "Subscribe"}
      </button>
    </form>
  );
}
