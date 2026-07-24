"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = { compact?: boolean };

export default function NewsletterSignup({ compact }: Props) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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
      <button
        type="submit"
        className={`flex min-h-11 items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${compact ? "bg-gold-light text-navy hover:bg-white" : "bg-navy text-white hover:bg-navy-light"}`}
      >
        <Send className="h-4 w-4" />
        Subscribe
      </button>
    </form>
  );
}
