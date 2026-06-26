import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
};

export default function PageHeader({ title, subtitle, breadcrumbs }: Props) {
  return (
    <section className="relative bg-navy text-white overflow-hidden border-b border-white/15">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-10 md:py-14">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-1 text-sm text-white mb-5">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-base sm:text-lg text-white max-w-3xl">{subtitle}</p>}
      </div>
    </section>
  );
}
