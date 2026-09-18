"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          message: String(fd.get("message") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to send message.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Unable to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-gold/10 border border-gold/30 p-6 text-center">
        <p className="text-gold font-semibold">Message sent successfully!</p>
        <p className="text-muted text-sm mt-1">We will get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Your Name (required)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="min-h-11 w-full rounded-lg border border-border px-4 py-2.5 text-base focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          Your Email (required)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="min-h-11 w-full rounded-lg border border-border px-4 py-2.5 text-base focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="min-h-11 w-full resize-y rounded-lg border border-border px-4 py-2.5 text-base focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold sm:text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors min-h-11 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
