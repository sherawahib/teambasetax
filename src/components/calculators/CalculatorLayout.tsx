"use client";

import { CALCULATOR_DISCLAIMER, LOCAL_CALCULATOR_NOTE } from "@/lib/calculators/format";
import { ShieldCheck } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function CalculatorLayout({ title, description, children }: Props) {
  return (
    <div className="mx-auto max-w-4xl w-full min-w-0">
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-navy/25 bg-surface px-3 sm:px-4 py-3 text-xs sm:text-sm text-foreground">
        <ShieldCheck className="h-5 w-5 shrink-0 text-navy mt-0.5" />
        <p>{LOCAL_CALCULATOR_NOTE}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface-elevated shadow-sm overflow-hidden">
        <div className="bg-navy px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {description && <p className="text-sm text-white mt-1">{description}</p>}
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
      <p className="mt-6 text-xs text-muted leading-relaxed">{CALCULATOR_DISCLAIMER}</p>
    </div>
  );
}

export function CalcField({
  label,
  id,
  type = "number",
  value,
  onChange,
  suffix,
  step,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export function CalcResult({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-4 ${highlight ? "bg-gold/10 border border-gold/30" : "bg-surface border border-border"}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className={`text-xl font-bold mt-1 ${highlight ? "text-foreground" : "text-navy"}`}>{value}</p>
    </div>
  );
}

export function CalcSelect({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-surface-elevated"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
