import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { resourcePages } from "@/data/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(resourcePages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = resourcePages[slug];
  if (!page) return { title: "Resource Not Found" };
  return { title: page.title, description: page.subtitle };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const page = resourcePages[slug];
  if (!page) notFound();

  const showNewsletter = slug.includes("subscribe") || slug === "insights-by-email";

  return (
    <>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources/financial-calculators" },
          { label: page.title },
        ]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4 prose-content">
          {page.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {page.list && (
            <ul>
              {page.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {showNewsletter && (
            <div className="mt-8 not-prose">
              <NewsletterSignup />
            </div>
          )}
        </div>
      </section>
      <CTASection title="Need personalized tax advice?" subtitle="Contact TEAMBASED Tax Services for expert guidance tailored to your situation." />
    </>
  );
}
