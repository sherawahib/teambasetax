import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getCalculatorsByCategory } from "@/data/site";

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

          <nav className="mb-10" aria-label="Calculator categories">
            <span className="mb-2 block text-sm font-medium text-muted">Jump to:</span>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="min-h-11 shrink-0 rounded-full border border-border bg-surface-elevated px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-gold sm:min-h-0 sm:py-1.5"
                >
                  {cat.label}
                </a>
              ))}
            </div>
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
                      className="group rounded-xl border border-border bg-surface-elevated p-4 transition-all hover:border-gold hover:shadow-lg sm:p-6"
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
