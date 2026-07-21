"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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
      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors min-h-11"
      >
        <Send className="h-4 w-4" />
        Send Message
      </button>
    </form>
  );
}
