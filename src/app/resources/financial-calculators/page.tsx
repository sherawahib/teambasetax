import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { calculatorCount, getCalculatorsByCategory } from "@/data/site";

export const metadata: Metadata = {
  title: "Financial Calculators",
  description: "Free financial and tax calculators from TEAMBASED Tax Services.",
};

export default function FinancialCalculatorsPage() {
  const categories = getCalculatorsByCategory();

  return (
    <>
      <PageHeader
        title="Financial Calculators"
        subtitle="Self-help tools for tax planning, retirement, mortgages, investments, and more."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources/financial-calculators" },
          { label: "Financial Calculators" },
        ]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-muted max-w-3xl mb-4">
            Use these interactive calculators to explore tax scenarios, retirement planning, mortgage options, and
            everyday financial decisions. Results are estimates for illustrative purposes—contact us for personalized
            advice.
          </p>
          <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3 max-w-3xl mb-8">
            All {calculatorCount} calculators run entirely on your device using standard financial formulas (matching
            CalcXML industry standards). No iframes, external APIs, or third-party services are used.
          </p>

          <nav className="mb-12 flex flex-wrap gap-2" aria-label="Calculator categories">
            <span className="text-sm font-medium text-muted mr-2 self-center">Jump to:</span>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-sm font-medium text-foreground hover:border-gold hover:text-gold transition-colors"
              >
                {cat.label}
              </a>
            ))}
          </nav>

          <div className="space-y-14">
            {categories.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">{cat.label}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.calculators.map((calc) => (
                    <Link
                      key={calc.slug}
                      href={`/resources/financial-calculators/${calc.slug}`}
                      className="group rounded-xl border border-border bg-surface-elevated p-6 hover:border-gold hover:shadow-lg transition-all"
                    >
                      <Calculator className="h-7 w-7 text-gold mb-4" />
                      <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">{calc.title}</h3>
                      <p className="text-sm text-muted mt-2">{calc.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
