"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { formatCurrencyDetailed, longTermCapitalGainsTax, parseNumber, type FilingStatus } from "@/lib/calculators/utils";

export default function CapitalGainsCalculator() {
  const [status, setStatus] = useState<FilingStatus>("single");
  const [taxableIncome, setTaxableIncome] = useState("80000");
  const [purchase1, setPurchase1] = useState("10000");
  const [sale1, setSale1] = useState("15000");
  const [purchase2, setPurchase2] = useState("0");
  const [sale2, setSale2] = useState("0");

  const results = useMemo(() => {
    const gain1 = parseNumber(sale1) - parseNumber(purchase1);
    const gain2 = parseNumber(sale2) - parseNumber(purchase2);
    const netGain = gain1 + gain2;
    return longTermCapitalGainsTax(parseNumber(taxableIncome), netGain, status);
  }, [status, taxableIncome, purchase1, sale1, purchase2, sale2]);

  const netGain = parseNumber(sale1) - parseNumber(purchase1) + (parseNumber(sale2) - parseNumber(purchase2));

  return (
    <CalculatorLayout
      title="Capital Gains/Loss Tax Estimator"
      description="Estimates long-term capital gains tax using 0%, 15%, and 20% federal brackets by filing status."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcSelect
          label="Tax Filing Status"
          id="status"
          value={status}
          onChange={(v) => setStatus(v as FilingStatus)}
          options={[
            { value: "single", label: "Single" },
            { value: "married_joint", label: "Married Filing Jointly" },
            { value: "married_separate", label: "Married Filing Separately" },
            { value: "head_of_household", label: "Head of Household" },
          ]}
        />
        <CalcField
          label="Taxable Income (excluding capital gains) ($)"
          id="income"
          value={taxableIncome}
          onChange={setTaxableIncome}
        />
        <CalcField label="Asset 1 — Purchase Price ($)" id="p1" value={purchase1} onChange={setPurchase1} />
        <CalcField label="Asset 1 — Sales Price ($)" id="s1" value={sale1} onChange={setSale1} />
        <CalcField label="Asset 2 — Purchase Price ($)" id="p2" value={purchase2} onChange={setPurchase2} />
        <CalcField label="Asset 2 — Sales Price ($)" id="s2" value={sale2} onChange={setSale2} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Net Long-Term Capital Gain/Loss" value={formatCurrencyDetailed(netGain)} highlight />
        <CalcResult label="Estimated Capital Gains Tax" value={formatCurrencyDetailed(results.tax)} />
        <CalcResult label="Net Proceeds After Tax" value={formatCurrencyDetailed(results.netProceeds)} highlight />
        <CalcResult label="Effective Tax Rate on Gain" value={`${results.effectiveRate.toFixed(2)}%`} />
      </div>
    </CalculatorLayout>
  );
}
