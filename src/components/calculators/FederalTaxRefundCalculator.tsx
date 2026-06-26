"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { federalTaxRefundEstimate, formatCurrencyDetailed, formatPercent, parseNumber, type FilingStatus } from "@/lib/calculators/utils";

export default function FederalTaxRefundCalculator() {
  const [status, setStatus] = useState<FilingStatus>("single");
  const [grossIncome, setGrossIncome] = useState("75000");
  const [iraContribution, setIraContribution] = useState("0");
  const [itemizedOther, setItemizedOther] = useState("0");
  const [childDependents, setChildDependents] = useState("0");
  const [saltPaid, setSaltPaid] = useState("5000");
  const [withheld, setWithheld] = useState("9000");

  const results = useMemo(
    () =>
      federalTaxRefundEstimate({
        status,
        grossIncome: parseNumber(grossIncome),
        traditionalIraContribution: parseNumber(iraContribution),
        itemizedDeductionsOtherThanSalt: parseNumber(itemizedOther),
        childDependents: parseNumber(childDependents),
        otherDependents: 0,
        saltPaid: parseNumber(saltPaid),
        useStandardDeduction: parseNumber(itemizedOther) === 0,
        taxWithheld: parseNumber(withheld),
        over65Count: 0,
        blindCount: 0,
      }),
    [status, grossIncome, iraContribution, itemizedOther, childDependents, saltPaid, withheld],
  );

  return (
    <CalculatorLayout
      title="Individual Federal Tax Refund/Owed Estimator"
      description="Estimates federal tax liability and compares to withholding to determine refund or amount owed."
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
        <CalcField label="Itemized Deductions (other than SALT) — $0 for standard" id="itemized" value={itemizedOther} onChange={setItemizedOther} />
        <CalcField label="Dependent Children Under 17" id="children" value={childDependents} onChange={setChildDependents} />
        <CalcField label="State and Local Taxes Paid ($)" id="salt" value={saltPaid} onChange={setSaltPaid} />
        <CalcField label="Federal Tax Withheld to Date ($)" id="withheld" value={withheld} onChange={setWithheld} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Taxable Income" value={formatCurrencyDetailed(results.taxableIncome)} />
        <CalcResult label="Estimated Federal Tax" value={formatCurrencyDetailed(results.estimatedTax)} />
        <CalcResult label="Marginal Tax Rate" value={formatPercent(results.marginalRate)} />
        <CalcResult
          label={results.isRefund ? "Estimated Refund" : "Estimated Amount Owed"}
          value={formatCurrencyDetailed(Math.abs(results.refundOrOwed))}
          highlight
        />
      </div>
    </CalculatorLayout>
  );
}
