"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, LockKeyhole } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/images/hero/slide-1.png",
    alt: "Professional tax preparation with digital tax tools",
    eyebrow: "Individual & Business Tax Services",
    main: "Smart Tax",
    accent: "Solutions",
    description:
      "Strategic tax preparation designed to protect your income, reduce surprises, and keep every filing accurate.",
  },
  {
    src: "/images/hero/slide-2.png",
    alt: "Corporate tax planning and financial analysis",
    eyebrow: "Guidance Built Around You",
    main: "Personalized",
    accent: "Service",
    description:
      "One-on-one support and practical financial guidance tailored to your goals, business, and family.",
  },
  {
    src: "/images/hero/slide-3.png",
    alt: "Tax planning with coins and city skyline",
    eyebrow: "Careful Review. Confident Filing.",
    main: "Guaranteed",
    accent: "Accuracy",
    description:
      "Thorough preparation and a detail-focused review process help ensure your return is complete and dependable.",
  },
];

const AUTO_MS = 5000;
const TRANSITION_MS = 800;

export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const [textPhase, setTextPhase] = useState<"in" | "out">("in");
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [motionOff, setMotionOff] = useState(false);

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
    const syncMotion = () => {
      const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const widgetReduce = document.documentElement.classList.contains("a11y-reduce-motion");
      setMotionOff(prefersReduce || widgetReduce);
    };
    syncMotion();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", syncMotion);
    const obs = new MutationObserver(syncMotion);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mq.removeEventListener("change", syncMotion);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (paused || motionOff) return;
    const timer = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [next, paused, motionOff]);

  const slide = SLIDES[index];
  const textVisible = textPhase === "in";

  return (
    <section
      className="relative flex min-h-[min(620px,100svh)] w-full items-center overflow-hidden bg-[#071008] text-white sm:min-h-[640px] lg:h-[clamp(640px,76vh,780px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setProgressKey((k) => k + 1);
      }}
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
          {/* Blurred ambient layer fills wide screens without exposing empty bands. */}
          <Image
            src={item.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="scale-110 object-cover object-center opacity-35 blur-xl"
          />

          {/* Primary artwork is always fully visible and never cropped. */}
          <div className="absolute inset-y-0 right-0 w-full opacity-70 sm:w-[88%] lg:w-[68%] lg:opacity-100">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 68vw, 100vw"
              className="object-contain object-right"
            />
          </div>
        </div>
      ))}

      <div
        className="absolute inset-0 z-[2] bg-gradient-to-r from-[#061007] via-[#08120a]/95 43% to-[#08120a]/15 82%"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-transparent to-black/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="flex max-w-2xl flex-col">
          <div
            className={`mb-6 transition-all duration-500 ${
              textVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold-light/30 bg-gold-light/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-light backdrop-blur-md sm:px-3.5 sm:text-xs sm:tracking-[0.17em]">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              {slide.eyebrow}
            </span>
          </div>

          <div className="flex min-h-[6.5rem] items-center overflow-hidden sm:min-h-[9rem] lg:min-h-[10.5rem]">
            <h1
              className={`text-4xl font-bold leading-[0.98] tracking-[-0.04em] transition-all ease-out motion-reduce:transition-none sm:text-6xl lg:text-7xl ${
                textVisible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-8 opacity-0 blur-[3px]"
              }`}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
              aria-live="polite"
            >
              <span className="block text-white">{slide.main}</span>
              <span className="block bg-gradient-to-r from-gold-light to-[#a7e89b] bg-clip-text text-transparent">
                {slide.accent}
              </span>
            </h1>
          </div>

          <p
            className={`mt-4 max-w-xl text-base leading-7 text-white/[0.78] transition-all delay-100 duration-500 sm:mt-5 sm:text-lg sm:leading-8 ${
              textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {slide.description}
          </p>

          <div
            className={`mt-6 flex flex-col gap-3 transition-all delay-150 duration-500 sm:mt-8 sm:flex-row ${
              textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-light px-6 py-3 text-sm font-bold text-[#112413] shadow-[0_12px_35px_rgba(99,194,85,0.3)] transition-all hover:-translate-y-0.5 hover:bg-white sm:w-auto"
            >
              Explore Our Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/resources/client-portal"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/15 sm:w-auto"
            >
              <LockKeyhole className="h-4 w-4 text-gold-light" />
              Secure Client Portal
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/65 sm:mt-7">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-light shadow-[0_0_8px_rgba(99,194,85,0.8)]" />
              Transparent pricing
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-light shadow-[0_0_8px_rgba(99,194,85,0.8)]" />
              Personalized consultations
            </span>
          </div>
        </div>
      </div>

      {/* Professional control dock */}
      <div className="absolute inset-x-0 bottom-4 z-20 px-4 sm:bottom-5 sm:px-8 lg:bottom-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-5">
          <div className="hidden items-center gap-2 sm:flex">
            {SLIDES.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active}
                  className="relative h-1.5 w-14 overflow-hidden rounded-full bg-white/20 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
                >
                  {active && (
                    <span
                      key={progressKey}
                      className={`absolute inset-y-0 left-0 bg-gold-light ${
                        paused || motionOff ? "w-full" : "hero-progress-bar motion-reduce:w-full"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center overflow-hidden rounded-2xl border border-white/20 bg-black/35 shadow-[0_15px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex h-12 min-w-24 items-center justify-center gap-1 border-r border-white/15 px-4 text-xs font-semibold tracking-[0.12em]">
              <span className="text-gold-light">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-white/30">/</span>
              <span className="text-white/55">{String(SLIDES.length).padStart(2, "0")}</span>
            </div>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="group flex h-12 w-12 items-center justify-center border-r border-white/15 text-white/75 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-light"
            >
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="group flex h-12 w-12 items-center justify-center text-white/75 transition-all hover:bg-gold-light hover:text-[#112413] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-light"
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
