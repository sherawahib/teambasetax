"use client";

export default function FooterParallaxBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/footer-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/75" />
    </div>
  );
}
