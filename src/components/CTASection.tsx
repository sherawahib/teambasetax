import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { contact } from "@/data/site";

type Props = {
  title: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function CTASection({
  title,
  subtitle,
  primaryHref = "/contact/request-appointment",
  primaryLabel = "Schedule Appointment",
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <section className="bg-surface border-y border-border text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-16 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-muted max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>
        )}
        <div className="mx-auto mt-6 flex max-w-md flex-col items-stretch justify-center gap-3 sm:mt-8 sm:gap-4 md:max-w-none md:flex-row md:items-center">
          <Link
            href={primaryHref}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-navy-light md:w-auto"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-navy/30 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-surface-elevated md:w-auto"
            >
              {secondaryLabel}
            </Link>
          )}
          <a
            href={contact.phoneHref}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-navy/30 bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-surface-elevated md:w-auto"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
