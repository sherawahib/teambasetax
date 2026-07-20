"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/images/hero/slide-1.png",
    alt: "Professional tax preparation with digital tax tools",
    main: "Smart Tax",
    accent: "Solutions",
  },
  {
    src: "/images/hero/slide-2.png",
    alt: "Corporate tax planning and financial analysis",
    main: "Personalized",
    accent: "Service",
  },
  {
    src: "/images/hero/slide-3.png",
    alt: "Tax planning with coins and city skyline",
    main: "Guaranteed",
    accent: "Accuracy",
  },
];

const AUTO_MS = 5000;
const TRANSITION_MS = 800;

export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const [textPhase, setTextPhase] = useState<"in" | "out">("in");
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    setTextPhase("out");
    window.setTimeout(() => {
      setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
      setTextPhase("in");
    }, TRANSITION_MS / 2);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [next, paused]);

  const slide = SLIDES[index];
  const textVisible = textPhase === "in";

  return (
    <section
      className="relative overflow-hidden text-white min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[600px] flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage banner"
    >
      {SLIDES.map((item, i) => (
        <div
          key={item.src}
          className={`absolute inset-0 transition-all ease-in-out motion-reduce:transition-none ${
            i === index
              ? "opacity-100 scale-100 z-[1]"
              : "opacity-0 scale-105 z-0 pointer-events-none"
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
          aria-hidden={i !== index}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Dark overlay so banner text stays prominent */}
      <div className="absolute inset-0 z-[2] bg-black/65" aria-hidden />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-r from-black/75 via-black/45 to-black/55"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20 lg:py-28 w-full">
        <div className="max-w-3xl flex flex-col gap-5 sm:gap-6">
          <p className="text-gold font-semibold tracking-wide uppercase text-sm">
            Germantown, MD · Maryland & DMV Area
          </p>

          <div className="min-h-[2.75rem] sm:min-h-[3.25rem] md:min-h-[4rem] lg:min-h-[4.75rem] flex items-center overflow-hidden">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all ease-in-out motion-reduce:transition-none drop-shadow-md ${
                textVisible
                  ? "opacity-100 translate-y-0 blur-0"
                  : "opacity-0 translate-y-6 blur-[2px]"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
              aria-live="polite"
            >
              {slide.main}{" "}
              <span className="text-gold">{slide.accent}</span>
            </h1>
          </div>

          <p className="text-lg text-white/95 leading-relaxed max-w-2xl drop-shadow-sm">
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto min-h-11"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-2 sm:pl-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:border-white/50 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-2 sm:pr-4">
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:border-white/50 transition-all"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-20 flex justify-center gap-2.5">
        {SLIDES.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-gold" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
