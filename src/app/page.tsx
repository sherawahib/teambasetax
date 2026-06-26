import Link from "next/link";
import {
  ArrowRight,
  Award,
  Calculator,
  CheckCircle2,
  Heart,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import CTASection from "@/components/CTASection";
import ContactForm from "@/components/ContactForm";
import HomeHero from "@/components/HomeHero";
import OfficeMap from "@/components/OfficeMap";
import NewsletterSignup from "@/components/NewsletterSignup";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { calculators, contact, externalLinks } from "@/data/site";

const features = [
  {
    icon: TrendingUp,
    title: "Tax Savings & Solutions",
    description:
      "Our tax experts have the skills and know-how to make sure you meet all your tax obligations without paying a penny more than you owe. If you have tax problems, we'll help you resolve them and get a fresh start.",
  },
  {
    icon: Shield,
    title: "Integrity & Responsibility",
    description:
      "Trust is the cornerstone of a successful business or financial relationship. From providing honest advice based on sound analysis to saving trees with paperless options, we hold ourselves to the highest standards of client service.",
  },
  {
    icon: Heart,
    title: "Peace of Mind for the Future",
    description:
      "Whether it's family financial security or the ongoing growth of your business, long-term success comes only with in-depth analysis and careful planning. We have the knowledge and expertise to set you on a solid path toward your goals.",
  },
];

const quickLinks = [
  { label: "Secure Client Portal", href: "/resources/client-portal" },
  { label: "Where's My Refund?", href: externalLinks.refundStatus, external: true },
  { label: "Financial Calculators", href: "/resources/financial-calculators" },
  { label: "Make a Payment", href: externalLinks.makePayment, external: true },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="py-10 md:py-16 lg:py-20 bg-surface-elevated">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">About TEAMBASED Tax Services</h2>
              <div className="mt-6 space-y-4 prose-content">
                <h3 className="text-xl font-semibold text-foreground">Thorough, Accurate Tax Preparation</h3>
                <p>
                  At TEAMBASED Tax Services, we believe every detail matters when it comes to your taxes. That&apos;s why
                  we take a <strong>personalized, high-accuracy approach</strong> to tax preparation, bookkeeping, and
                  financial consulting for individuals and businesses throughout Maryland and the DMV area.
                </p>
                <p>
                  Unlike online tax software or high-cost law firms, we offer{" "}
                  <strong>comprehensive, hands-on service at a fair price</strong>—and we double-check every return to
                  ensure compliance and accuracy. Every return is thoroughly reviewed before submission, so our clients
                  don&apos;t have to worry about IRS errors or missed deductions.
                </p>
                <h3 className="text-xl font-semibold text-foreground">Transparent Pricing & Personalized Consultations</h3>
                <p>
                  We understand that tax preparation costs vary based on individual and business needs. Instead of
                  one-size-fits-all pricing, we offer <strong>customized estimates</strong> during your initial
                  consultation. We also provide <strong>first-time client discounts</strong>, as well as special pricing
                  for <strong>seniors, military personnel, and disabled individuals</strong>.
                </p>
                <h3 className="text-xl font-semibold text-foreground">Extra Mile Service—Even Home Visits</h3>
                <p>
                  For clients with mobility challenges, we go the extra mile—literally.{" "}
                  <strong>We offer home visits</strong> for disabled individuals, even traveling an hour or more when
                  needed. This level of dedication sets us apart from other tax services.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
                <Users className="h-10 w-10 text-gold shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Trusted by Hundreds of Clients</p>
                  <p className="text-sm text-muted">
                    Over 200 clients served annually with referrals at an all-time high.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-navy p-8 text-white">
                <Award className="h-10 w-10 text-gold mb-4" />
                <p className="text-lg font-semibold">National Association of Tax Professionals Member</p>
                <p className="text-white text-sm mt-2">
                  Committed to the highest standards of tax preparation and professional ethics.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: "200+", label: "Clients Served Annually" },
                  { value: "100%", label: "Returns Double-Checked" },
                  { value: "DMV", label: "Area Coverage" },
                  { value: "Home", label: "Visits Available" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border p-4 text-center bg-surface-elevated shadow-sm">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-foreground font-medium">
                📞 Most clients start with a phone call—give us a call today to get started!
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      <section className="py-10 md:py-16 bg-surface">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose Us</h2>
            <p className="text-muted mt-2 max-w-2xl mx-auto">
              Professional tax services built on trust, accuracy, and outstanding client care.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-surface-elevated p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-surface-elevated">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Financial Calculators</h2>
              <p className="text-muted mt-2">Self-help tools for tax planning, retirement, and mortgage analysis.</p>
            </div>
            <Link
              href="/resources/financial-calculators"
              className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-gold transition-colors"
            >
              View All Calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.slice(0, 6).map((calc) => (
              <Link
                key={calc.slug}
                href={`/resources/financial-calculators/${calc.slug}`}
                className="group rounded-xl border border-border p-5 hover:border-gold hover:shadow-md transition-all bg-surface-elevated"
              >
                <Calculator className="h-6 w-6 text-gold mb-3" />
                <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">{calc.title}</h3>
                <p className="text-sm text-muted mt-1">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-surface">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-surface-elevated border border-border p-5 hover:border-gold hover:shadow-md transition-all"
                >
                  <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                  <span className="font-medium text-foreground">{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl bg-surface-elevated border border-border p-5 hover:border-gold hover:shadow-md transition-all"
                >
                  <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                  <span className="font-medium text-foreground">{link.label}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-surface-elevated">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send Us an Email</h2>
              <ContactForm />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Main Office</h2>
              <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                <OfficeMap embedded />
                <div className="p-6 bg-surface">
                  <p className="font-semibold text-foreground">{contact.addressLine1}</p>
                  <p className="text-muted">{contact.addressLine2}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-foreground">Phone:</span>{" "}
                      <a href={contact.phoneHref} className="text-gold hover:underline">
                        {contact.phone}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Email:</span>{" "}
                      <a href={`mailto:${contact.email}`} className="text-gold hover:underline">
                        {contact.email}
                      </a>
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${contact.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-surface">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">Sign Up for Our Tax Newsletter</h2>
          <NewsletterSignup />
        </div>
      </section>

      <CTASection
        title="Life goes by fast. So should filing your taxes."
        subtitle="Complete individual and business tax services. Call for assistance today!"
        primaryLabel="Schedule Appointment"
        secondaryHref="/services"
        secondaryLabel="Explore Services"
      />
    </>
  );
}
