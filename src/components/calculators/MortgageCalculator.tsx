"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult } from "@/components/calculators/CalculatorLayout";
import { formatCurrencyDetailed, mortgageSummary, parseNumber } from "@/lib/calculators/utils";

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [months, setMonths] = useState("360");
  const [propertyTax, setPropertyTax] = useState("3600");
  const [insurance, setInsurance] = useState("1200");
  const [pmi, setPmi] = useState("0");

  const results = useMemo(
    () =>
      mortgageSummary(
        parseNumber(loanAmount),
        parseNumber(interestRate),
        parseNumber(months, 360),
        parseNumber(propertyTax),
        parseNumber(insurance),
        parseNumber(pmi),
      ),
    [loanAmount, interestRate, months, propertyTax, insurance, pmi],
  );

  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      description="Estimate monthly payment using standard amortization: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], plus taxes and insurance."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Proposed Loan Amount ($)" id="loan" value={loanAmount} onChange={setLoanAmount} />
        <CalcField label="Annual Interest Rate (%)" id="rate" value={interestRate} onChange={setInterestRate} step="0.01" />
        <CalcField label="Number of Months (30 yrs = 360)" id="months" value={months} onChange={setMonths} />
        <CalcField label="Annual Property Taxes ($)" id="tax" value={propertyTax} onChange={setPropertyTax} />
        <CalcField label="Annual Hazard Insurance ($)" id="insurance" value={insurance} onChange={setInsurance} />
        <CalcField label="Monthly PMI ($)" id="pmi" value={pmi} onChange={setPmi} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Principal & Interest" value={formatCurrencyDetailed(results.principalAndInterest)} highlight />
        <CalcResult label="Total Monthly Payment" value={formatCurrencyDetailed(results.totalMonthly)} highlight />
        <CalcResult label="Total Interest Paid" value={formatCurrencyDetailed(results.totalInterest)} />
        <CalcResult label="Total of All Payments" value={formatCurrencyDetailed(results.totalPaid)} />
      </div>
    </CalculatorLayout>
  );
}
