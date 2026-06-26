"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { StarRatingInput } from "@/components/StarRating";

const SERVICES = [
  "Personal Tax Services",
  "Business Tax Services",
  "Bookkeeping Services",
  "IRS Representation",
  "Retirement Planning",
  "Estate Tax Planning",
  "Other",
];

type FormState = {
  name: string;
  email: string;
  rating: number;
  service: string;
  location: string;
  text: string;
  recommend: boolean;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  rating: 0,
  service: "",
  location: "",
  text: "",
  recommend: false,
};

export default function TestimonialForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.rating < 1) next.rating = "Please select a star rating.";
    if (!form.service) next.service = "Please select a service.";
    if (!form.text.trim() || form.text.trim().length < 20) next.text = "Please write at least 20 characters.";
    if (!form.recommend) next.recommend = "Please confirm you would recommend us.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Unable to submit. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-gold/10 border border-gold/30 p-8 md:p-10 text-center">
        <p className="text-foreground font-semibold text-xl">Thank you for your feedback!</p>
        <p className="text-muted mt-2 max-w-md mx-auto">
          Your review has been submitted and will appear on our homepage shortly. We appreciate you sharing your
          experience with TEAMBASED Tax Services.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center mt-6 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white hover:bg-gold-light transition-colors min-h-11"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border px-4 py-3 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-surface-elevated min-h-11";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 shadow-sm">
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Share Your Experience</h2>
        <p className="text-sm text-muted mt-1">
          Rate our service and tell others about your experience — like a Google review.
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your Name *
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Jane D."
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="you@email.com"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Overall Rating *</label>
        <StarRatingInput
          value={form.rating}
          onChange={(rating) => setForm({ ...form, rating })}
          error={errors.rating}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="service" className={labelClass}>
            Service Used *
          </label>
          <select
            id="service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className={inputClass}
          >
            <option value="">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && <p className="text-xs text-red-600 mt-1">{errors.service}</p>}
        </div>
        <div>
          <label htmlFor="location" className={labelClass}>
            City / Area (optional)
          </label>
          <input
            id="location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className={inputClass}
            placeholder="Germantown, MD"
          />
        </div>
      </div>

      <div>
        <label htmlFor="text" className={labelClass}>
          Your Review *
        </label>
        <textarea
          id="text"
          rows={6}
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className={`${inputClass} resize-y min-h-[140px]`}
          placeholder="Tell us about your experience with our tax services, accuracy, communication, and results..."
        />
        <p className="text-xs text-muted mt-1">{form.text.length} characters (minimum 20)</p>
        {errors.text && <p className="text-xs text-red-600 mt-1">{errors.text}</p>}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.recommend}
          onChange={(e) => setForm({ ...form, recommend: e.target.checked })}
          className="mt-1 accent-navy h-4 w-4"
        />
        <span className="text-sm text-slate-600">
          I would recommend TEAMBASED Tax Services to friends, family, or colleagues. *
        </span>
      </label>
      {errors.recommend && <p className="text-xs text-red-600 -mt-2">{errors.recommend}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 w-full rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors min-h-11 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
