import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <section className="relative overflow-hidden border-b border-white/15 text-white min-h-[168px] sm:min-h-[192px] md:min-h-[220px]">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="object-cover object-center scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy/90 via-[#3d9440]/82 to-gold-dark/88"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-10 md:py-14">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-1 text-sm text-white/90 mb-5">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-white hover:text-gold transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-base sm:text-lg text-white/95 max-w-3xl drop-shadow-sm">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

export { DEFAULT_HEADER_IMAGE };
