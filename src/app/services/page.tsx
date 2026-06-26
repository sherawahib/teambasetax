import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, FileText, Scale, User } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import { servicePages } from "@/data/site";

export const metadata: Metadata = {
  title: "Services Overview",
  description: "Complete individual and business tax services from TEAMBASED Tax Services in Germantown, MD.",
};

const serviceCategories = [
  {
    icon: User,
    title: "Tax Planning & Preparation",
    links: [
      { slug: "personal-tax-services", label: "Personal Tax Services" },
      { slug: "retirement-planning-services", label: "Retirement Planning Services" },
      { slug: "estate-tax-planning", label: "Estate Tax Planning" },
    ],
  },
  {
    icon: Scale,
    title: "IRS Representation",
    links: [{ slug: "irs-representation", label: "IRS Representation" }],
  },
  {
    icon: Building2,
    title: "Business Tax Consulting",
    links: [
      { slug: "business-tax-services", label: "Business Tax Services" },
      { slug: "business-entity-selection", label: "Business Entity Selection" },
      { slug: "financial-statement-preparation", label: "Financial Statement Preparation" },
      { slug: "management-advisory", label: "Management Advisory" },
      { slug: "bookkeeping-services", label: "Bookkeeping Services" },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Complete individual and business tax services tailored to your needs."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mb-12 prose-content">
            <p>
              We provide a full range of tax services, from proactive tax planning to meticulous preparation and filing.
              Whether you need help identifying tax-saving opportunities throughout the year or ensuring accuracy in your
              filings, our services are designed to meet your unique demands.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceCategories.map((category) => (
              <div key={category.title} className="rounded-2xl border border-border bg-surface-elevated p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold mb-4">
                  <category.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-4">{category.title}</h2>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={`/services/${link.slug}`}
                        className="flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors"
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(servicePages).map(([slug, page]) => (
              <Link
                key={slug}
                href={`/services/${slug}`}
                className="group rounded-xl border border-border p-5 hover:border-gold hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">{page.title}</h3>
                <p className="text-sm text-muted mt-2 line-clamp-2">{page.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold mt-3">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title="Getting started is easy!"
        subtitle="Contact us to schedule a consultation. Our team will evaluate your current tax situation and discuss how we can help."
      />
    </>
  );
}
