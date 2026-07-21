import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  Ear,
  Eye,
  Keyboard,
  Mail,
  MousePointerClick,
  Phone,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "TEAMBASED Tax Services accessibility commitment, WCAG 2.1 AA goals, and how to request assistance.",
};

const FEATURES = [
  {
    icon: Keyboard,
    title: "Keyboard access",
    text: "Primary navigation, forms, calculators, and the accessibility panel can be operated with a keyboard. A skip link jumps past the header to main content.",
  },
  {
    icon: Eye,
    title: "Visual adjustments",
    text: "Use the on-site Accessibility button to increase text size, enable high contrast, underline links, or switch to a more readable font.",
  },
  {
    icon: MousePointerClick,
    title: "Motion control",
    text: "Animations and the homepage carousel auto-play can be paused with Reduce Motion in the accessibility panel, or via your system prefers-reduced-motion setting.",
  },
  {
    icon: Ear,
    title: "Screen readers",
    text: "Pages use semantic HTML landmarks, labeled controls, and descriptive link text. Decorative images are hidden from assistive technology.",
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        title="Accessibility Statement"
        subtitle="Our commitment to an inclusive digital experience under the ADA and WCAG 2.1 AA."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Accessibility" }]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10 rounded-2xl border border-navy/20 bg-surface p-5 sm:p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              ADA &amp; WCAG commitment
            </div>
            <p className="text-base leading-7 text-foreground sm:text-lg">
              TEAMBASED Tax Services is committed to ensuring digital accessibility for people with disabilities. We
              continually improve the user experience for everyone and aim to conform to the{" "}
              <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> and applicable requirements of
              the <strong>Americans with Disabilities Act (ADA)</strong>.
            </p>
          </div>

          <div className="prose-content">
            <h2>How to use our accessibility tools</h2>
            <p>
              Look for the floating <strong>Accessibility</strong> button (bottom-right on every page). It opens a panel
              where you can:
            </p>
            <ul>
              <li>Increase or decrease text size (90%–150%)</li>
              <li>Turn on high-contrast colors</li>
              <li>Underline all links for clearer identification</li>
              <li>Reduce or stop motion and auto-sliding content</li>
              <li>Switch to a clearer, more spaced readable font</li>
            </ul>
            <p>Your choices are saved in this browser so they apply on your next visit.</p>

            <h2>What we provide</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-10">
            <h2>Standards &amp; compatibility</h2>
            <p>
              We design pages to work with current versions of major browsers (Chrome, Edge, Firefox, Safari) and common
              assistive technologies such as screen readers (NVDA, JAWS, VoiceOver) and browser zoom up to 200%. Form
              fields are labeled, error messages are associated with inputs where present, and touch targets are sized
              for mobile use.
            </p>

            <h2>Known limitations</h2>
            <p>
              Some third-party embeds (for example interactive maps or Street View) may offer limited accessibility
              controls outside our direct control. Where needed, we provide equivalent information — such as our full
              office address and phone number — in text form elsewhere on the page.
            </p>

            <h2>Feedback &amp; accommodation requests</h2>
            <p>
              If you experience difficulty accessing any part of this website, or need information in an alternative
              format, please contact us. We will work with you to provide the information or services you need in a
              timely manner.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-navy">
              <Accessibility className="h-5 w-5" aria-hidden />
              <h2 className="text-lg font-bold">Contact for accessibility help</h2>
            </div>
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${contact.email}?subject=Website%20Accessibility%20Request`}
                className="flex min-h-11 items-center gap-2 break-all font-medium text-foreground hover:text-navy"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                {contact.email}
              </a>
              <a
                href={contact.phoneHref}
                className="flex min-h-11 items-center gap-2 font-medium text-foreground hover:text-navy"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                {contact.phone}
              </a>
              <p className="text-muted">
                Office: {contact.address}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-light"
              >
                Contact form
              </Link>
              <Link
                href="/contact/request-appointment"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-navy/30 bg-white px-5 text-sm font-semibold text-navy hover:bg-surface"
              >
                Schedule appointment
              </Link>
            </div>
          </div>

          <p className="mt-8 text-xs text-muted">
            This statement was last reviewed on July 21, 2026. We review accessibility on an ongoing basis as the site
            evolves.
          </p>
        </div>
      </section>
    </>
  );
}
