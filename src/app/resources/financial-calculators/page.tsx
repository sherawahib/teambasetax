import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { calculators } from "@/data/site";

export const metadata: Metadata = {
  title: "Financial Calculators",
  description: "Free financial and tax calculators from TEAMBASED Tax Services.",
};

export default function FinancialCalculatorsPage() {
  return (
    <>
      <PageHeader
        title="Financial Calculators"
        subtitle="Self-help tools for tax planning, retirement analysis, and mortgage calculations."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources/financial-calculators" },
          { label: "Financial Calculators" },
        ]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-muted max-w-3xl mb-4">
            Use these interactive calculators to explore tax scenarios, retirement planning, and mortgage options.
            Results are estimates for illustrative purposes—contact us for personalized advice.
          </p>
          <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3 max-w-3xl mb-10">
            All 13 calculators run entirely on your device using standard financial formulas (matching CalcXML industry
            standards). No iframes, external APIs, or third-party services are used.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {calculators.map((calc) => (
              <Link
                key={calc.slug}
                href={`/resources/financial-calculators/${calc.slug}`}
                className="group rounded-xl border border-border bg-surface-elevated p-6 hover:border-gold hover:shadow-lg transition-all"
              >
                <Calculator className="h-7 w-7 text-gold mb-4" />
                <h2 className="font-semibold text-foreground group-hover:text-gold transition-colors">{calc.title}</h2>
                <p className="text-sm text-muted mt-2">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
