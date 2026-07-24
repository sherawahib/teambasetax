"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Clock3, Mail, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import Logo from "@/components/Logo";
import ServiceTicker from "@/components/ServiceTicker";
import { contact, navigation, type NavItem } from "@/data/site";

function NavLink({ item, onNavigate, mobile }: { item: NavItem; onNavigate?: () => void; mobile?: boolean }) {
  if (!item.href) return null;

  const className = mobile
    ? "block px-4 py-3 text-sm text-foreground hover:bg-surface hover:text-navy transition-colors min-h-11"
    : "block px-4 py-2 text-sm text-foreground hover:bg-surface hover:text-navy transition-colors";

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

function DropdownMenu({ items, onNavigate, mobile }: { items: NavItem[]; onNavigate?: () => void; mobile?: boolean }) {
  return (
    <div className="py-2">
      {items.map((item) =>
        item.children ? (
          <div key={item.label} className="border-b border-border last:border-0">
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-navy">{item.label}</p>
            {item.children.map((child) =>
              child.children ? (
                <div key={child.label}>
                  <p className="px-4 py-1.5 text-xs font-medium text-muted">{child.label}</p>
                  {child.children.map((grandchild) => (
                    <NavLink key={grandchild.label} item={grandchild} onNavigate={onNavigate} mobile={mobile} />
                  ))}
                </div>
              ) : (
                <NavLink key={child.label} item={child} onNavigate={onNavigate} mobile={mobile} />
              ),
            )}
          </div>
        ) : (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} mobile={mobile} />
        ),
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Keeps layout from jumping when header becomes fixed */}
      <div
        className={`transition-[height] duration-300 ${scrolled ? "h-[108px] md:h-[112px]" : "h-0"}`}
        aria-hidden
      />

      <header
        className={`z-50 text-foreground transition-all duration-300 ease-out ${
          scrolled
            ? "fixed top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 md:left-5 md:right-5 lg:left-8 lg:right-8 rounded-2xl border border-navy/10 bg-white/80 shadow-[0_12px_40px_rgba(11,29,54,0.16)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/65"
            : "sticky top-0 bg-surface-elevated border-b border-border shadow-md shadow-navy/10"
        }`}
      >
        {/* Continuous service marquee — sits above the contact top bar */}
        <div className={scrolled ? "rounded-t-2xl overflow-hidden" : ""}>
          <ServiceTicker />
        </div>

        {/* Top bar — hides while floating */}
        <div
          className={`hidden md:block relative overflow-hidden bg-gradient-to-r from-[#060f1c] via-navy to-[#16325a] text-white transition-all duration-300 ${
            scrolled ? "max-h-0 opacity-0 pointer-events-none py-0" : "max-h-24 opacity-100"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12% 50%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 88% 40%, rgba(212,175,55,0.28), transparent 32%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/70 to-transparent"
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:border-gold-light/50 hover:bg-white/15"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-light/25 text-gold-light ring-1 ring-gold-light/40 transition-transform group-hover:scale-105">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{contact.email}</span>
              </a>

              <a
                href={contact.phoneHref}
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:border-gold-light/50 hover:bg-white/15"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-light/25 text-gold-light ring-1 ring-gold-light/40 transition-transform group-hover:scale-105">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <span>{contact.phone}</span>
              </a>

              <div className="hidden xl:inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-xs text-white/90">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span className="max-w-[280px] truncate">{contact.address}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-light">
                <Clock3 className="h-3.5 w-3.5" />
                Mon–Fri · 9am–5pm
              </div>
              <div className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-gold-light/30 bg-gold-light/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-light" />
                Secure Portal
              </div>
              <Link
                href="/resources/client-portal"
                className="inline-flex items-center rounded-full bg-gold-light px-3.5 py-1.5 text-xs font-bold text-navy shadow-sm transition-all hover:bg-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 ${
            scrolled ? "py-2.5 bg-transparent" : "py-3 bg-surface-elevated"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center">
            <Logo variant="default" />
          </div>

          <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Primary">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-navy transition-colors">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border/80 bg-white/95 shadow-xl backdrop-blur-md">
                      <DropdownMenu items={item.children} />
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-navy transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/contact/request-appointment"
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-all shadow-sm shadow-navy/25 hover:shadow-md whitespace-nowrap"
            >
              Schedule Appointment
            </Link>
          </div>

          <button
            className="lg:hidden flex items-center justify-center rounded-lg p-3 text-navy hover:bg-white/60 min-h-11 min-w-11 shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-primary-nav"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && !scrolled && (
          <div
            id="mobile-primary-nav"
            className="lg:hidden border-t border-border bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain shadow-lg rounded-b-2xl"
          >
            <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-2 text-sm">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-foreground hover:text-navy min-h-11">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="break-all">{contact.email}</span>
              </a>
              <a href={contact.phoneHref} className="flex items-center gap-2 text-foreground hover:text-navy min-h-11">
                <Phone className="h-4 w-4 shrink-0" />
                {contact.phone}
              </a>
              <p className="flex items-start gap-2 text-muted pb-1">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                {contact.address}
              </p>
            </div>
            {navigation.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-border">
                  <p className="px-4 py-3 text-sm font-semibold text-navy bg-surface">{item.label}</p>
                  <DropdownMenu items={item.children} onNavigate={() => setMobileOpen(false)} mobile />
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="block border-b border-border px-4 py-3 text-sm font-medium text-foreground hover:text-navy hover:bg-surface min-h-11"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="p-4 sticky bottom-0 bg-white border-t border-border">
              <Link
                href="/contact/request-appointment"
                className="block w-full rounded-lg bg-navy px-5 py-3.5 text-center text-sm font-semibold text-white min-h-11"
                onClick={() => setMobileOpen(false)}
              >
                Schedule Appointment
              </Link>
            </div>
          </div>
        )}

        {mobileOpen && scrolled && (
          <div
            id="mobile-primary-nav"
            className="lg:hidden border-t border-white/40 bg-white/90 backdrop-blur-xl max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-b-2xl"
          >
            <div className="border-b border-border/60 bg-white/60 px-4 py-3 text-sm">
              <a href={`mailto:${contact.email}`} className="flex min-h-11 items-center gap-2 text-foreground hover:text-navy">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="break-all">{contact.email}</span>
              </a>
              <a href={contact.phoneHref} className="flex min-h-11 items-center gap-2 text-foreground hover:text-navy">
                <Phone className="h-4 w-4 shrink-0" />
                {contact.phone}
              </a>
            </div>
            {navigation.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-border/60">
                  <p className="px-4 py-3 text-sm font-semibold text-navy bg-white/50">{item.label}</p>
                  <DropdownMenu items={item.children} onNavigate={() => setMobileOpen(false)} mobile />
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="block border-b border-border/60 px-4 py-3 text-sm font-medium text-foreground hover:text-navy min-h-11"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="p-4">
              <Link
                href="/contact/request-appointment"
                className="block w-full rounded-full bg-navy px-5 py-3.5 text-center text-sm font-semibold text-white min-h-11"
                onClick={() => setMobileOpen(false)}
              >
                Schedule Appointment
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
