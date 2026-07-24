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
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d36]/80 via-black/40 to-[#060f1c]/85" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
