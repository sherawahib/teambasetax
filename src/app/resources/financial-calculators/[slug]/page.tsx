import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { calculators } from "@/data/site";
import { getCalculatorComponent } from "@/lib/calculators/registry";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) return { title: "Calculator Not Found" };
  return { title: calc.title, description: calc.description };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calc = calculators.find((c) => c.slug === slug);
  const Component = getCalculatorComponent(slug);

  if (!calc || !Component) notFound();

  return (
    <>
      <PageHeader
        title={calc.title}
        subtitle={calc.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Financial Calculators", href: "/resources/financial-calculators" },
          { label: calc.title },
        ]}
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Link
            href="/resources/financial-calculators"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Calculators
          </Link>
          <Component />
        </div>
      </section>
    </>
  );
}
