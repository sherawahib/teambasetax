import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import NewsletterSignup from "@/components/NewsletterSignup";
import { newsletterPages } from "@/data/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(newsletterPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = newsletterPages[slug];
  if (!page) return { title: "Not Found" };
  return { title: page.title, description: page.subtitle };
}

export default async function NewsletterPage({ params }: Props) {
  const { slug } = await params;
  const page = newsletterPages[slug];
  if (!page) notFound();

  return (
    <>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Newsletter", href: "/newsletter/subscribe" },
          { label: page.title },
        ]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4 prose-content">
          {page.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {(slug === "subscribe" || slug === "latest-edition") && (
            <div className="mt-8 not-prose max-w-md">
              <NewsletterSignup />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
