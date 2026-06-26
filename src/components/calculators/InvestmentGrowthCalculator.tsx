"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult } from "@/components/calculators/CalculatorLayout";
import { formatCurrency, investmentGrowthComparison, parseNumber } from "@/lib/calculators/utils";

export default function InvestmentGrowthCalculator() {
  const [currentBalance, setCurrentBalance] = useState("10000");
  const [annualContributions, setAnnualContributions] = useState("6000");
  const [years, setYears] = useState("20");
  const [taxableReturn, setTaxableReturn] = useState("7");
  const [deferredReturn, setDeferredReturn] = useState("7");
  const [taxFreeReturn, setTaxFreeReturn] = useState("7");
  const [marginalTax, setMarginalTax] = useState("22");

  const results = useMemo(
    () =>
      investmentGrowthComparison({
        currentBalance: parseNumber(currentBalance),
        annualContributions: parseNumber(annualContributions),
        years: parseNumber(years, 20),
        taxableReturnPercent: parseNumber(taxableReturn),
        taxDeferredReturnPercent: parseNumber(deferredReturn),
        taxFreeReturnPercent: parseNumber(taxFreeReturn),
        marginalTaxPercent: parseNumber(marginalTax),
      }),
    [currentBalance, annualContributions, years, taxableReturn, deferredReturn, taxFreeReturn, marginalTax],
  );

  return (
    <CalculatorLayout
      title="Growth of Taxable, Tax-Deferred, and Tax-Free Investments"
      description="Compares fully taxable, tax-deferred, and tax-free account growth using after-tax return formulas."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Current Investment Balance ($)" id="balance" value={currentBalance} onChange={setCurrentBalance} />
        <CalcField label="Annual Contributions ($)" id="contrib" value={annualContributions} onChange={setAnnualContributions} />
        <CalcField label="Number of Years to Invest" id="years" value={years} onChange={setYears} />
        <CalcField label="Marginal Tax Bracket (%)" id="tax" value={marginalTax} onChange={setMarginalTax} step="0.1" />
        <CalcField label="Before-Tax Return — Taxable (%)" id="taxable" value={taxableReturn} onChange={setTaxableReturn} step="0.1" />
        <CalcField label="Before-Tax Return — Tax-Deferred (%)" id="deferred" value={deferredReturn} onChange={setDeferredReturn} step="0.1" />
        <CalcField label="Return — Tax-Free (%)" id="free" value={taxFreeReturn} onChange={setTaxFreeReturn} step="0.1" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <CalcResult label="Taxable Account Value" value={formatCurrency(results.taxable)} />
        <CalcResult label="Tax-Deferred (before withdrawal tax)" value={formatCurrency(results.taxDeferred)} />
        <CalcResult label="Tax-Deferred (after tax)" value={formatCurrency(results.taxDeferredAfterTax)} highlight />
        <CalcResult label="Tax-Free Account Value" value={formatCurrency(results.taxFree)} highlight />
      </div>
    </CalculatorLayout>
  );
}
