"use client";

import { useState } from "react";
import { CreditCard, Send } from "lucide-react";

export default function PaymentRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || ""),
          invoiceNumber: String(fd.get("invoiceNumber") || ""),
          amount: String(fd.get("amount") || ""),
          method: String(fd.get("method") || ""),
          notes: String(fd.get("notes") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Unable to submit payment request.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Unable to submit. Please try again or call our office.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/10 p-6 text-center">
        <CreditCard className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-3 font-semibold text-gold">Payment request received</p>
        <p className="mt-1 text-sm text-muted">
          Our team will confirm and send a secure payment link or instructions shortly.
        </p>
      </div>
    );
  }

  const inputClass =
    "min-h-11 w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-base focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pay-name" className="mb-1 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input id="pay-name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="pay-email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="pay-email" name="email" type="email" required className={inputClass} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pay-phone" className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input id="pay-phone" name="phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="pay-invoice" className="mb-1 block text-sm font-medium text-slate-700">
            Invoice / statement #
          </label>
          <input id="pay-invoice" name="invoiceNumber" placeholder="Optional" className={inputClass} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pay-amount" className="mb-1 block text-sm font-medium text-slate-700">
            Amount (USD)
          </label>
          <input id="pay-amount" name="amount" type="text" required placeholder="e.g. 425.00" className={inputClass} />
        </div>
        <div>
          <label htmlFor="pay-method" className="mb-1 block text-sm font-medium text-slate-700">
            Preferred method
          </label>
          <select id="pay-method" name="method" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option value="Card / online link">Card / secure online link</option>
            <option value="ACH / bank transfer">ACH / bank transfer</option>
            <option value="Check by mail">Check by mail</option>
            <option value="Phone payment">Phone payment</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="pay-notes" className="mb-1 block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea id="pay-notes" name="notes" rows={3} className={`${inputClass} resize-y`} placeholder="Tax year, service, or other details" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {loading ? "Submitting…" : "Submit Payment Request"}
      </button>
    </form>
  );
}
