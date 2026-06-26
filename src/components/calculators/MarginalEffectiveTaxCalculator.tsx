"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { formatCurrency, formatPercent, incomeTaxAnalysis, parseNumber, type FilingStatus } from "@/lib/calculators/utils";

export default function MarginalEffectiveTaxCalculator() {
  const [status, setStatus] = useState<FilingStatus>("single");
  const [grossIncome, setGrossIncome] = useState("85000");
  const [iraContribution, setIraContribution] = useState("0");
  const [itemizedOther, setItemizedOther] = useState("0");
  const [saltPaid, setSaltPaid] = useState("5000");
  const [useStandard, setUseStandard] = useState("yes");

  const results = useMemo(
    () =>
      incomeTaxAnalysis({
        status,
        grossIncome: parseNumber(grossIncome),
        traditionalIraContribution: parseNumber(iraContribution),
        itemizedOtherThanSalt: parseNumber(itemizedOther),
        saltPaid: parseNumber(saltPaid),
        useStandard: useStandard === "yes",
        over65Count: 0,
        blindCount: 0,
      }),
    [status, grossIncome, iraContribution, itemizedOther, saltPaid, useStandard],
  );

  return (
    <CalculatorLayout
      title="Marginal vs. Effective Tax Rate"
      description="Calculates federal tax liability, marginal rate (top bracket), and effective rate (total tax ÷ gross income)."
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
        <CalcField label="Taxable Gross Annual Income ($)" id="income" value={grossIncome} onChange={setGrossIncome} />
        <CalcField label="Traditional IRA Contribution ($)" id="ira" value={iraContribution} onChange={setIraContribution} />
        <CalcField label="Itemized Deductions (other than SALT) ($)" id="itemized" value={itemizedOther} onChange={setItemizedOther} />
        <CalcField label="State and Local Taxes Paid ($)" id="salt" value={saltPaid} onChange={setSaltPaid} />
        <CalcSelect
          label="Use Standard Deduction?"
          id="standard"
          value={useStandard}
          onChange={setUseStandard}
          options={[
            { value: "yes", label: "Yes — use standard if greater" },
            { value: "no", label: "No — force itemized if entered" },
          ]}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Taxable Income" value={formatCurrency(results.taxableIncome)} />
        <CalcResult label="Estimated Federal Tax" value={formatCurrency(results.federalTax)} highlight />
        <CalcResult label="Marginal Tax Rate" value={formatPercent(results.marginalRate)} highlight />
        <CalcResult label="Effective Tax Rate" value={formatPercent(results.effectiveRate)} highlight />
      </div>
    </CalculatorLayout>
  );
}
