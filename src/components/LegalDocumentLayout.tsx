import Link from "next/link";
import type { ReactNode } from "react";
import { Calendar, ChevronRight, FileText, Mail, Phone, Shield } from "lucide-react";
import { contact } from "@/data/site";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type Props = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  summary: string[];
  sections: LegalSection[];
  relatedLinks?: { label: string; href: string }[];
};

export default function LegalDocumentLayout({
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  summary,
  sections,
  relatedLinks = [],
}: Props) {
  return (
    <>
      <section className="bg-navy text-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-white mb-4">
            <Link href="/" className="text-white hover:text-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-medium">{title}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white mb-4">
                <Shield className="h-3.5 w-3.5" />
                Legal Document
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{title}</h1>
              <p className="mt-3 text-base text-white sm:text-lg">{subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold" />
                <span>
                  Effective: <strong className="text-white">{effectiveDate}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold" />
                <span>
                  Last updated: <strong className="text-white">{lastUpdated}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-surface">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
            <aside className="lg:sticky lg:top-28 space-y-6">
              <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">On this page</h2>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-start gap-2 rounded-lg px-2 py-2.5 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors min-h-11"
                    >
                      <span className="text-xs font-semibold text-gold mt-0.5">{index + 1}.</span>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              {relatedLinks.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-foreground mb-3">Related policies</h2>
                  <ul className="space-y-2">
                    {relatedLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm text-gold hover:underline font-medium">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl bg-navy text-white p-5">
                <h2 className="text-sm font-semibold text-white mb-2">Questions?</h2>
                <p className="text-xs text-white/90 mb-3">Contact our office for clarification on these policies.</p>
                <a href={`mailto:${contact.email}`} className="mb-2 flex items-center gap-2 break-all text-sm text-white transition-colors hover:text-gold">
                  <Mail className="h-4 w-4 shrink-0" />
                  {contact.email}
                </a>
                <a href={contact.phoneHref} className="flex items-center gap-2 text-sm text-white hover:text-gold transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />
                  {contact.phone}
                </a>
              </div>
            </aside>

            <div className="space-y-8">
              <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4 sm:p-6 md:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">Key points at a glance</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {summary.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-surface-elevated shadow-sm overflow-hidden">
                {sections.map((section, index) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className={`scroll-mt-28 px-4 py-6 sm:px-6 sm:py-8 md:px-8 ${index > 0 ? "border-t border-border" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-gold text-sm font-bold">
                        {index + 1}
                      </span>
                      <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                    </div>
                    <div className="prose-content legal-content">{section.content}</div>
                  </article>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-surface-elevated p-6 md:p-8 text-center">
                <p className="text-sm text-muted">
                  By continuing to use this website, you acknowledge that you have read and understood this document.
                  TEAMBASED Tax Services reserves the right to update these policies at any time.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium">
                  <Link href="/contact" className="text-gold hover:underline">
                    Contact Us
                  </Link>
                  <Link href="/accessibility" className="text-gold hover:underline">
                    Accessibility Statement
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
