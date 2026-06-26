"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult } from "@/components/calculators/CalculatorLayout";
import { formatCurrency, parseNumber, taxCreditVsDeduction } from "@/lib/calculators/utils";

export default function TaxCreditVsDeductionCalculator() {
  const [taxLiability, setTaxLiability] = useState("8000");
  const [deductionAmount, setDeductionAmount] = useState("2000");
  const [creditAmount, setCreditAmount] = useState("2000");
  const [marginalRate, setMarginalRate] = useState("22");

  const results = useMemo(
    () =>
      taxCreditVsDeduction(
        parseNumber(taxLiability),
        parseNumber(deductionAmount),
        parseNumber(creditAmount),
        parseNumber(marginalRate),
      ),
    [taxLiability, deductionAmount, creditAmount, marginalRate],
  );

  return (
    <CalculatorLayout
      title="Tax Credit vs. Tax Deduction"
      description="Deduction savings = amount × marginal rate. Credit savings = dollar-for-dollar reduction in tax owed."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Tax Liability Before Benefits ($)" id="liability" value={taxLiability} onChange={setTaxLiability} />
        <CalcField label="Marginal Tax Rate (%)" id="rate" value={marginalRate} onChange={setMarginalRate} step="0.1" />
        <CalcField label="Deduction Amount ($)" id="deduction" value={deductionAmount} onChange={setDeductionAmount} />
        <CalcField label="Credit Amount ($)" id="credit" value={creditAmount} onChange={setCreditAmount} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Value of Deduction (saves)" value={formatCurrency(results.deductionSavings)} />
        <CalcResult label="Value of Credit (saves)" value={formatCurrency(results.creditSavings)} highlight />
        <CalcResult label="Tax After Deduction" value={formatCurrency(results.taxAfterDeduction)} />
        <CalcResult label="Tax After Credit" value={formatCurrency(results.taxAfterCredit)} highlight />
      </div>
    </CalculatorLayout>
  );
}
