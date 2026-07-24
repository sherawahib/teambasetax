import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  /** Optional override; defaults to city skyline banner */
  imageSrc?: string;
};

const DEFAULT_HEADER_IMAGE = "/images/page-header-bg.jpg";

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  imageSrc = DEFAULT_HEADER_IMAGE,
}: Props) {
  return (
    <section className="relative isolate flex min-h-[240px] w-full items-center overflow-hidden border-b border-white/15 bg-[#060f1c] text-white sm:min-h-[280px] md:min-h-[320px]">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="object-cover object-center opacity-80"
      />

      {/* Layered cinematic treatment keeps copy legible over any page image. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#060f1c]/98 via-[#0b1d36]/92 48% to-[#c9a227]/35"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      {/* Decorative depth, hidden from assistive technology. */}
      <div
        className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10 bg-gold-light/10 blur-sm"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 right-[8%] h-72 w-72 rounded-full border-[36px] border-white/[0.06]"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/80 to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0 max-w-4xl">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="mb-5 inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-xs text-white/80 shadow-lg backdrop-blur-md sm:text-sm"
              >
                {breadcrumbs.map((crumb, i) => (
                  <span key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gold-light" aria-hidden />}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="rounded-sm text-white/80 transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="truncate font-medium text-white" aria-current="page">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light sm:text-xs">
              <span className="h-px w-8 bg-gold-light sm:w-12" aria-hidden />
              Professional Tax &amp; Advisory
            </div>
            <h1 className="max-w-4xl text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-white drop-shadow-lg sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/80 drop-shadow-sm sm:text-base sm:leading-7 md:text-lg">
                {subtitle}
              </p>
            )}
          </div>

          <div className="hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-white/90 shadow-xl backdrop-blur-md md:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-light/15 text-gold-light ring-1 ring-gold-light/30">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-gold-light">Trusted Guidance</span>
              <span className="mt-0.5 block text-xs text-white/75">Accurate. Secure. Personal.</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { DEFAULT_HEADER_IMAGE };
