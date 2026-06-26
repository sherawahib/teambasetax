"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult } from "@/components/calculators/CalculatorLayout";
import { formatCurrency, parseNumber, socialSecurityBenefit } from "@/lib/calculators/utils";

export default function SocialSecurityCalculator() {
  const [averageIncome, setAverageIncome] = useState("75000");
  const [currentAge, setCurrentAge] = useState("55");
  const [retirementAge, setRetirementAge] = useState("67");
  const [inflationRate, setInflationRate] = useState("2.6");

  const results = useMemo(
    () =>
      socialSecurityBenefit({
        averageAnnualIncome: parseNumber(averageIncome),
        currentAge: parseNumber(currentAge, 55),
        retirementAge: parseNumber(retirementAge, 67),
        inflationRatePercent: parseNumber(inflationRate, 2.6),
      }),
    [averageIncome, currentAge, retirementAge, inflationRate],
  );

  return (
    <CalculatorLayout
      title="Social Security Income Estimation"
      description="Estimates benefits using AIME/PIA bend-point formula with early/late retirement adjustments."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Average Annual Earned Income ($)" id="income" value={averageIncome} onChange={setAverageIncome} />
        <CalcField label="Current Age" id="currentAge" value={currentAge} onChange={setCurrentAge} />
        <CalcField label="Social Security Retirement Age (62–70)" id="retAge" value={retirementAge} onChange={setRetirementAge} />
        <CalcField label="Social Security Inflation Rate (%)" id="inflation" value={inflationRate} onChange={setInflationRate} step="0.1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Estimated Monthly Benefit at Retirement" value={formatCurrency(results.monthlyBenefitAtRetirement)} highlight />
        <CalcResult label="Estimated Annual Benefit at Retirement" value={formatCurrency(results.annualBenefitAtRetirement)} highlight />
        <CalcResult label="Inflation-Adjusted Monthly Benefit" value={formatCurrency(results.inflatedMonthlyBenefit)} />
        <CalcResult label="Primary Insurance Amount (PIA)" value={formatCurrency(results.primaryInsuranceAmount)} />
      </div>
    </CalculatorLayout>
  );
}
