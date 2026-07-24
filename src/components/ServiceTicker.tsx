"use client";

import { CheckCircle2 } from "lucide-react";

const SERVICES = ["Tax Solution", "Tax Preparation", "Business Tax"] as const;

export default function ServiceTicker() {
  // Two identical halves for a seamless infinite loop
  const half = [...SERVICES, ...SERVICES, ...SERVICES];
  const items = [...half, ...half];

  return (
    <div
      className="relative overflow-hidden border-b border-gold-dark/40 bg-gradient-to-r from-[#060f1c] via-navy to-[#16325a] text-white"
      role="region"
      aria-label="Featured services"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.35), transparent 35%), radial-gradient(circle at 80% 50%, rgba(212,175,55,0.2), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/80 to-transparent" aria-hidden />

      <div className="relative overflow-hidden py-1.5 sm:py-2">
        <div className="service-ticker-track flex w-max items-center gap-6 sm:gap-8" aria-hidden>
          {items.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.1em] text-white sm:text-xs md:text-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold-light" />
              <span className="text-gold-light drop-shadow-[0_0_8px_rgba(212,175,55,0.45)]">{label}</span>
              <span className="ml-3 h-1 w-1 rounded-full bg-gold-light shadow-[0_0_6px_rgba(212,175,55,0.9)] sm:ml-5" />
            </span>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {SERVICES.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
}
