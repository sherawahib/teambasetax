"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const HEADLINES = [
  { main: "Smart Tax", accent: "Solutions" },
  { main: "Personalized", accent: "Service" },
  { main: "Guaranteed", accent: "Accuracy" },
];

const DISPLAY_MS = 3200;
const TRANSITION_MS = 700;

export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    let swapTimer: ReturnType<typeof setTimeout> | undefined;

    const cycleTimer = setInterval(() => {
      setPhase("out");
      swapTimer = setTimeout(() => {
        setIndex((current) => (current + 1) % HEADLINES.length);
        setPhase("in");
      }, TRANSITION_MS);
    }, DISPLAY_MS);

    return () => {
      clearInterval(cycleTimer);
      if (swapTimer) clearTimeout(swapTimer);
    };
  }, []);

  const headline = HEADLINES[index];
  const visible = phase === "in";

  return (
    <section className="relative overflow-hidden text-white min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[600px] flex items-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-navy/75" aria-hidden />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20 lg:py-28 w-full">
        <div className="max-w-3xl animate-fade-in-up flex flex-col gap-5 sm:gap-6">
          <p className="text-gold font-semibold tracking-wide uppercase text-sm">
            Germantown, MD · Maryland & DMV Area
          </p>

          <div className="min-h-[2.75rem] sm:min-h-[3.25rem] md:min-h-[4rem] lg:min-h-[4.75rem] flex items-center overflow-hidden">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all ease-in-out motion-reduce:transition-none ${
                visible
                  ? "opacity-100 translate-y-0 blur-0"
                  : "opacity-0 translate-y-6 blur-[2px]"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
              aria-live="polite"
            >
              {headline.main}{" "}
              <span className="text-gold">{headline.accent}</span>
            </h1>
          </div>

          <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
            Complete individual and business tax services. Thorough, accurate tax preparation with transparent pricing
            and personalized consultations.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-white hover:bg-gold-light transition-colors shadow-lg w-full sm:w-auto min-h-11"
            >
              Our Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto min-h-11"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
