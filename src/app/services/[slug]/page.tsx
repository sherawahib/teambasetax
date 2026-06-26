import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";
import { servicePages } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages[slug];
  if (!page) return { title: "Service Not Found" };
  return { title: page.title, description: page.subtitle };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = servicePages[slug];
  if (!page) notFound();

  return (
    <>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: page.title },
        ]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4 prose-content">
          {page.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>
      <CTASection title="Schedule your consultation today" subtitle="Contact us to discuss how we can help with your tax and financial needs." />
    </>
  );
}
