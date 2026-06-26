import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import FooterParallaxBackground from "@/components/FooterParallaxBackground";
import { contact, navigation } from "@/data/site";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  const services = navigation.find((n) => n.label === "Services")?.children ?? [];
  const resources = navigation.find((n) => n.label === "Resources")?.children ?? [];

  return (
    <footer className="relative border-t border-white/15 text-white overflow-hidden">
      <FooterParallaxBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo variant="footer" onDark />
            </div>
            <p className="text-sm text-white leading-relaxed mb-4">
              Smart Tax Solutions. Personalized Service. Guaranteed Accuracy. Serving Maryland and the DMV area.
            </p>
            <div className="space-y-2 text-sm text-white">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-white hover:text-gold transition-colors break-all">
                <Mail className="h-4 w-4 shrink-0" />
                {contact.email}
              </a>
              <a href={contact.phoneHref} className="flex items-center gap-2 text-white hover:text-gold transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                {contact.phone}
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                {contact.address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-white">
              {services.flatMap((s) =>
                s.children
                  ? s.children.filter((c) => c.href).map((c) => (
                      <li key={c.label}>
                        <Link href={c.href!} className="text-white hover:text-gold transition-colors">
                          {c.label}
                        </Link>
                      </li>
                    ))
                  : s.href
                    ? [
                        <li key={s.label}>
                          <Link href={s.href} className="text-white hover:text-gold transition-colors">
                            {s.label}
                          </Link>
                        </li>,
                      ]
                    : [],
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/resources/financial-calculators" className="text-white hover:text-gold transition-colors">
                  Financial Calculators
                </Link>
              </li>
              <li>
                <Link href="/resources/faq" className="text-white hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources/tax-rates" className="text-white hover:text-gold transition-colors">
                  Tax Rates
                </Link>
              </li>
              <li>
                <Link href="/resources/tax-due-dates" className="text-white hover:text-gold transition-colors">
                  Tax Due Dates
                </Link>
              </li>
              {resources
                .filter((r) => r.external && r.href)
                .slice(0, 3)
                .map((r) => (
                  <li key={r.label}>
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors">
                      {r.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Tax Newsletter</h3>
            <NewsletterSignup compact />
          </div>
        </div>

        <div className="mt-10 md:mt-12 border-t border-white/20 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white text-center md:text-left">
          <p className="text-white break-words">
            Copyright © {new Date().getFullYear()} TEAMBASED Tax Services and/or its licensors
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <Link href="/accessibility" className="text-white hover:text-gold transition-colors">
              Accessibility
            </Link>
            <Link href="/privacy-policy" className="text-white hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="text-white hover:text-gold transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
