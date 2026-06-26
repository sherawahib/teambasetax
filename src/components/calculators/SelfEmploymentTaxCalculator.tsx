"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { formatCurrencyDetailed, parseNumber, selfEmploymentTax, type FilingStatus } from "@/lib/calculators/utils";

export default function SelfEmploymentTaxCalculator() {
  const [selfEmploymentIncome, setSelfEmploymentIncome] = useState("80000");
  const [employerIncome, setEmployerIncome] = useState("0");
  const [status, setStatus] = useState<FilingStatus>("single");

  const results = useMemo(
    () =>
      selfEmploymentTax({
        selfEmploymentIncome: parseNumber(selfEmploymentIncome),
        employerIncome: parseNumber(employerIncome),
        status,
      }),
    [selfEmploymentIncome, employerIncome, status],
  );

  return (
    <CalculatorLayout
      title="Self-Employment Tax Owed"
      description="SE tax = 92.35% of net earnings × 12.4% (Social Security up to wage base) + 2.9% Medicare + 0.9% additional Medicare if applicable."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Annual Self-Employment Income ($)" id="se" value={selfEmploymentIncome} onChange={setSelfEmploymentIncome} />
        <CalcField label="Annual Employer W-2 Income ($)" id="w2" value={employerIncome} onChange={setEmployerIncome} />
        <CalcSelect
          label="Tax Filing Status"
          id="status"
          value={status}
          onChange={(v) => setStatus(v as FilingStatus)}
          options={[
            { value: "single", label: "Single" },
            { value: "head_of_household", label: "Head of Household" },
            { value: "married_joint", label: "Married Filing Jointly" },
            { value: "married_separate", label: "Married Filing Separately" },
          ]}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Net Earnings (92.35% of SE income)" value={formatCurrencyDetailed(results.netEarnings)} />
        <CalcResult label="Social Security Tax (12.4%)" value={formatCurrencyDetailed(results.socialSecurityTax)} />
        <CalcResult label="Medicare Tax (2.9%)" value={formatCurrencyDetailed(results.medicareTax)} />
        <CalcResult label="Additional Medicare Tax (0.9%)" value={formatCurrencyDetailed(results.additionalMedicare)} />
        <CalcResult label="Total Self-Employment Tax" value={formatCurrencyDetailed(results.totalSeTax)} highlight />
        <CalcResult label="Deductible Portion (50%)" value={formatCurrencyDetailed(results.deductiblePortion)} />
      </div>
    </CalculatorLayout>
  );
}
