"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Clock3, Mail, MapPin, Menu, Phone, ShieldCheck, X } from "lucide-react";
import Logo from "@/components/Logo";
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

  return (
    <header className="sticky top-0 z-50 bg-surface-elevated text-foreground border-b border-border shadow-md shadow-navy/10">
      {/* Advanced top bar */}
      <div className="hidden md:block relative overflow-hidden bg-gradient-to-r from-[#1f5c1a] via-navy to-[#3d9440] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 50%, rgba(255,255,255,0.22), transparent 28%), radial-gradient(circle at 88% 40%, rgba(99,194,85,0.35), transparent 32%)",
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
              className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-navy shadow-sm transition-all hover:bg-gold-light hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 bg-surface-elevated">
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          <Logo variant="default" />
        </div>

        <nav className="hidden lg:flex items-center gap-1 shrink-0">
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
                  <div className="absolute left-0 top-full w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-white shadow-xl">
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
          className="lg:hidden flex items-center justify-center rounded-lg p-3 text-navy hover:bg-surface min-h-11 min-w-11 shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain shadow-lg">
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
    </header>
  );
}
