"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

function SliderNavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className={`group/nav relative z-20 hidden sm:flex items-center gap-0 overflow-hidden rounded-full border border-white/25 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:border-gold-light/60 hover:bg-navy/90 hover:shadow-[0_12px_40px_rgba(47,122,40,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 active:scale-95 ${
        isPrev ? "pl-1.5 pr-1.5 hover:pr-4" : "pl-1.5 pr-1.5 hover:pl-4"
      }`}
    >
      {/* Soft glow ring */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99,194,85,0.35), transparent 70%)",
        }}
        aria-hidden
      />

      {isPrev ? (
        <>
          <span className="relative flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-1 rounded-full bg-white/10 transition-transform duration-300 group-hover/nav:-translate-x-0.5 group-hover/nav:bg-gold-light/20" />
            <ChevronLeft className="relative h-6 w-6 transition-transform duration-300 group-hover/nav:-translate-x-1" />
          </span>
          <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] opacity-0 transition-all duration-300 group-hover/nav:max-w-[4.5rem] group-hover/nav:opacity-100 group-hover/nav:pr-3">
            Prev
          </span>
        </>
      ) : (
        <>
          <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] opacity-0 transition-all duration-300 group-hover/nav:max-w-[4.5rem] group-hover/nav:opacity-100 group-hover/nav:pl-3">
            Next
          </span>
          <span className="relative flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-1 rounded-full bg-white/10 transition-transform duration-300 group-hover/nav:translate-x-0.5 group-hover/nav:bg-gold-light/20" />
            <ChevronRight className="relative h-6 w-6 transition-transform duration-300 group-hover/nav:translate-x-1" />
          </span>
        </>
      )}
    </button>
  );
}

function MobileNavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className="sm:hidden relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-light/25 to-transparent opacity-80" aria-hidden />
      {isPrev ? <ChevronLeft className="relative h-5 w-5" /> : <ChevronRight className="relative h-5 w-5" />}
    </button>
  );
}

export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const [textPhase, setTextPhase] = useState<"in" | "out">("in");
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback((next: number) => {
    setTextPhase("out");
    window.setTimeout(() => {
      setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
      setTextPhase("in");
      setProgressKey((k) => k + 1);
    }, TRANSITION_MS / 2);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [next, paused]);

  useEffect(() => {
    if (!paused) setProgressKey((k) => k + 1);
  }, [paused]);

  const slide = SLIDES[index];
  const textVisible = textPhase === "in";

  return (
    <section
      className="relative w-full overflow-hidden text-white flex items-center aspect-[3/2] min-h-[280px] max-h-[min(70vh,720px)] sm:min-h-[320px] md:max-h-[min(75vh,780px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage banner"
    >
      {SLIDES.map((item, i) => (
        <div
          key={item.src}
          className={`absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none ${
            i === index
              ? "opacity-100 z-[1]"
              : "opacity-0 z-0 pointer-events-none"
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

      <div className="absolute inset-0 z-[2] bg-black/55" aria-hidden />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-r from-black/70 via-black/40 to-black/50"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:py-14 md:py-16 lg:py-20 w-full">
        <div className="max-w-3xl flex flex-col gap-5 sm:gap-6">
          <p className="text-gold-light font-semibold tracking-wide uppercase text-sm">
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
              <span className="text-gold-light">{slide.accent}</span>
            </h1>
          </div>

          <p className="text-lg text-white/95 leading-relaxed max-w-2xl drop-shadow-sm">
            Complete individual and business tax services. Thorough, accurate tax preparation with transparent pricing
            and personalized consultations.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors shadow-lg w-full sm:w-auto min-h-11"
            >
              Our Services
              <ChevronRight className="h-4 w-4" />
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

      {/* Advanced side nav */}
      <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-3 sm:pl-5 md:pl-8">
        <SliderNavButton direction="prev" onClick={prev} />
        <MobileNavButton direction="prev" onClick={prev} />
      </div>
      <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-3 sm:pr-5 md:pr-8">
        <SliderNavButton direction="next" onClick={next} />
        <MobileNavButton direction="next" onClick={next} />
      </div>

      {/* Advanced bottom controls: numbered pills + autoplay progress */}
      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-20 flex flex-col items-center gap-3 px-4">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/35 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {SLIDES.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item.src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                onClick={() => goTo(i)}
                className={`group/dot relative overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light ${
                  active
                    ? "h-10 min-w-[2.75rem] bg-navy px-3.5 text-white shadow-[inset_0_0_0_1px_rgba(99,194,85,0.55)]"
                    : "h-10 w-10 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {active && !paused && (
                  <span
                    key={progressKey}
                    className="absolute inset-y-0 left-0 bg-gold-light/30 hero-progress-bar motion-reduce:hidden"
                    aria-hidden
                  />
                )}
                <span className="relative z-[1] text-xs font-bold tracking-wide">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">
          Slide {index + 1} / {SLIDES.length}
        </p>
      </div>
    </section>
  );
}
