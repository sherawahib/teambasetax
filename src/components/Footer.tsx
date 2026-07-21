import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/Logo";
import FooterParallaxBackground from "@/components/FooterParallaxBackground";
import { contact, navigation } from "@/data/site";
import NewsletterSignup from "./NewsletterSignup";

const quickActions = [
  {
    label: "Book a Consultation",
    href: "/contact/request-appointment",
    icon: CalendarDays,
  },
  {
    label: "Client Portal",
    href: "/resources/client-portal",
    icon: LockKeyhole,
  },
  {
    label: "Make a Payment",
    href: "https://tbtaxservice.com/resources/make-a-payment/",
    icon: CreditCard,
    external: true,
  },
];

const resourceLinks = [
  { label: "Financial Calculators", href: "/resources/financial-calculators" },
  { label: "Frequently Asked Questions", href: "/resources/faq" },
  { label: "Tax Rates", href: "/resources/tax-rates" },
  { label: "Tax Due Dates", href: "/resources/tax-due-dates" },
  { label: "Where Is My Refund?", href: "https://www.irs.gov/refunds", external: true },
];

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "group flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] leading-5 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white";
  const content = (
    <>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gold-light/65 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-light" />
      <span className="flex-1">{label}</span>
      {external && (
        <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default function Footer() {
  const services = navigation.find((n) => n.label === "Services")?.children ?? [];

  return (
    <footer className="relative overflow-hidden border-t border-white/15 text-white">
      <FooterParallaxBackground />

      <div className="pointer-events-none absolute -left-24 top-36 z-[1] h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-10 z-[1] h-80 w-80 rounded-full bg-navy-light/20 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:py-12 md:py-16">
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/35 via-transparent to-gold/20"
            aria-hidden
          />
          <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-light/30 bg-gold-light/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted Tax Guidance
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to make tax season simpler?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                Get accurate, personalized support for individual and business taxes throughout Maryland and the DMV.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact/request-appointment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-light px-6 py-3 text-sm font-bold text-[#142616] shadow-[0_10px_30px_rgba(99,194,85,0.3)] transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Schedule Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={contact.phoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-black/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-gold-light/50 hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-gold-light" />
                {contact.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
          <div className="min-w-0 rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-md xl:col-span-3">
            <Logo variant="footer" onDark />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              Smart tax solutions, personalized service, and dependable accuracy for individuals and businesses.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="group flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white/85 transition-all hover:border-gold-light/35 hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-light/15 text-gold-light">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="min-w-0 break-all">{contact.email}</span>
              </a>
              <a
                href={contact.phoneHref}
                className="group flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white/85 transition-all hover:border-gold-light/35 hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-light/15 text-gold-light">
                  <Phone className="h-4 w-4" />
                </span>
                <span>{contact.phone}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${contact.mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm leading-5 text-white/85 transition-all hover:border-gold-light/35 hover:bg-white/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-light/15 text-gold-light">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>{contact.address}</span>
              </a>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-md sm:p-6 xl:col-span-3">
            <h3 className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 font-semibold text-white">
              <span className="flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-gold-light" />
                Services
              </span>
              <span className="rounded-full bg-white/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                Explore
              </span>
            </h3>
            <ul className="mt-3 space-y-0.5">
              {services.flatMap((s) =>
                s.children
                  ? s.children.filter((c) => c.href).map((c) => (
                      <li key={c.label}>
                        <FooterLink href={c.href!} label={c.label} />
                      </li>
                    ))
                  : s.href
                    ? [
                        <li key={s.label}>
                          <FooterLink href={s.href} label={s.label} />
                        </li>,
                      ]
                    : [],
              )}
            </ul>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-md sm:p-6 xl:col-span-3">
            <h3 className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 font-semibold text-white">
              <span className="flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-gold-light" />
                Resources
              </span>
              <span className="rounded-full bg-white/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                Tools
              </span>
            </h3>
            <ul className="mt-3 space-y-0.5">
              {resourceLinks.map((resource) => (
                <li key={resource.label}>
                  <FooterLink {...resource} />
                </li>
              ))}
            </ul>

            <Link
              href="/resources/financial-calculators"
              className="mt-6 flex min-h-12 items-center gap-3 rounded-xl border border-gold-light/25 bg-gold-light/10 px-3.5 py-2.5 text-sm font-semibold text-gold-light transition-all hover:border-gold-light/50 hover:bg-gold-light/15"
            >
              <Calculator className="h-5 w-5" />
              105 Free Calculators
            </Link>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/15 bg-gradient-to-br from-white/12 to-black/25 p-6 backdrop-blur-md xl:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-light">Stay Informed</p>
                <h3 className="mt-1 text-xl font-bold text-white">Tax Newsletter</h3>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-light/25 bg-gold-light/10 text-gold-light">
                <Mail className="h-5 w-5" />
              </span>
            </div>
            <p className="mb-5 mt-3 text-sm leading-6 text-white/65">
              Practical tax tips, deadlines, and financial insights delivered to your inbox.
            </p>
            <NewsletterSignup compact />
            <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold-light" />
              No spam. Unsubscribe anytime.
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {quickActions.map(({ label, href, icon: Icon, external }) => {
            const className =
              "group flex min-h-14 items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-gold-light/40 hover:bg-white/10";
            const content = (
              <>
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-light/15 text-gold-light">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  {label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-light" />
              </>
            );

            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <Link key={label} href={href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-white/15 pt-6 text-center text-xs text-white/55 md:flex-row md:text-left">
          <p className="break-words">
            © {new Date().getFullYear()} TEAMBASED Tax Services. All rights reserved.
          </p>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
            </span>
            Serving Maryland &amp; the DMV Area
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end">
            <Link href="/accessibility" className="transition-colors hover:text-gold-light">
              Accessibility
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-gold-light">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="transition-colors hover:text-gold-light">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
