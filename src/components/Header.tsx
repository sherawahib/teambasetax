"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import Logo from "@/components/Logo";
import { contact, navigation, type NavItem } from "@/data/site";

function NavLink({ item, onNavigate, mobile }: { item: NavItem; onNavigate?: () => void; mobile?: boolean }) {
  if (!item.href) return null;

  const className = mobile
    ? "block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-gold transition-colors min-h-11"
    : "block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-gold transition-colors";

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
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold">{item.label}</p>
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
    <header className="sticky top-0 z-50 bg-black text-white border-b border-white/10 shadow-lg shadow-black/30">
      <div className="hidden md:block bg-navy border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm text-white">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 min-w-0">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-white hover:text-gold transition-colors min-w-0">
              <Mail className="h-3.5 w-3.5 shrink-0 text-white" />
              <span className="text-white break-all">{contact.email}</span>
            </a>
            <a href={contact.phoneHref} className="flex items-center gap-1.5 text-white hover:text-gold transition-colors shrink-0">
              <Phone className="h-3.5 w-3.5 text-white" />
              <span className="text-white">{contact.phone}</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-white min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-white" />
            <span className="text-white text-right">{contact.address}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          <Logo variant="default" onDark />
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
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white hover:text-gold transition-colors">
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
                className="px-3 py-2 text-sm font-medium text-white hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/contact/request-appointment"
            className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-light transition-colors shadow-sm whitespace-nowrap"
          >
            Schedule Appointment
          </Link>
        </div>

        <button
          className="lg:hidden flex items-center justify-center rounded-lg p-3 text-gold hover:bg-white/10 min-h-11 min-w-11 shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain shadow-lg">
          <div className="md:hidden border-b border-border bg-slate-50 px-4 py-3 space-y-2 text-sm">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-slate-700 hover:text-gold min-h-11">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="break-all">{contact.email}</span>
            </a>
            <a href={contact.phoneHref} className="flex items-center gap-2 text-slate-700 hover:text-gold min-h-11">
              <Phone className="h-4 w-4 shrink-0" />
              {contact.phone}
            </a>
            <p className="flex items-start gap-2 text-slate-600 pb-1">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              {contact.address}
            </p>
          </div>
          {navigation.map((item) =>
            item.children ? (
              <div key={item.label} className="border-b border-border">
                <p className="px-4 py-3 text-sm font-semibold text-gold bg-slate-50">{item.label}</p>
                <DropdownMenu items={item.children} onNavigate={() => setMobileOpen(false)} mobile />
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="block border-b border-border px-4 py-3 text-sm font-medium text-slate-700 hover:text-gold hover:bg-slate-50 min-h-11"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="p-4 sticky bottom-0 bg-white border-t border-border">
            <Link
              href="/contact/request-appointment"
              className="block w-full rounded-lg bg-gold px-5 py-3.5 text-center text-sm font-semibold text-white min-h-11"
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
