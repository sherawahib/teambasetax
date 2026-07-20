"use client";

import { useEffect, useRef } from "react";

const PARALLAX_SPEED = 0.5;

export default function FooterParallaxBackground() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const footer = img?.closest("footer");
    if (!img || !footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let raf = 0;

    const updateParallax = () => {
      const rect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Image shifts slower than footer content while scrolling into view.
      const offset = (viewportHeight - rect.bottom) * PARALLAX_SPEED;
      img.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <img
        ref={imgRef}
        src="/images/footer-bg.png"
        alt=""
        className="absolute left-0 w-full h-[130%] -top-[15%] object-cover object-center pointer-events-none select-none motion-reduce:transform-none will-change-transform"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/80" />
    </div>
  );
}
