"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult } from "@/components/calculators/CalculatorLayout";
import { annuityTaxComparison, formatCurrency, parseNumber } from "@/lib/calculators/utils";

export default function AnnuityTaxCalculator() {
  const [initial, setInitial] = useState("50000");
  const [annualContribution, setAnnualContribution] = useState("5000");
  const [contributionIncrease, setContributionIncrease] = useState("0");
  const [years, setYears] = useState("15");
  const [beforeTaxReturn, setBeforeTaxReturn] = useState("5");
  const [taxDuringDeposit, setTaxDuringDeposit] = useState("22");
  const [taxAtWithdrawal, setTaxAtWithdrawal] = useState("22");

  const results = useMemo(
    () =>
      annuityTaxComparison({
        initialBalance: parseNumber(initial),
        annualContribution: parseNumber(annualContribution),
        contributionIncreasePercent: parseNumber(contributionIncrease),
        years: parseNumber(years, 15),
        beforeTaxReturnPercent: parseNumber(beforeTaxReturn),
        taxDuringDepositPercent: parseNumber(taxDuringDeposit),
        taxAtWithdrawalPercent: parseNumber(taxAtWithdrawal),
      }),
    [initial, annualContribution, contributionIncrease, years, beforeTaxReturn, taxDuringDeposit, taxAtWithdrawal],
  );

  return (
    <CalculatorLayout
      title="Tax Advantages of an Annuity"
      description="Compares tax-deferred annuity growth vs. a taxable CD where interest is taxed annually."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Initial Balance or Deposit ($)" id="initial" value={initial} onChange={setInitial} />
        <CalcField label="Annual Contribution ($)" id="contrib" value={annualContribution} onChange={setAnnualContribution} />
        <CalcField label="Annual Increase in Contributions (%)" id="increase" value={contributionIncrease} onChange={setContributionIncrease} step="0.1" />
        <CalcField label="Number of Years" id="years" value={years} onChange={setYears} />
        <CalcField label="Before-Tax Return (%)" id="return" value={beforeTaxReturn} onChange={setBeforeTaxReturn} step="0.1" />
        <CalcField label="Marginal Tax Rate During Deposits (%)" id="taxdep" value={taxDuringDeposit} onChange={setTaxDuringDeposit} step="0.1" />
        <CalcField label="Marginal Tax Rate at Withdrawal (%)" id="taxwith" value={taxAtWithdrawal} onChange={setTaxAtWithdrawal} step="0.1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Taxable Account (CD) Value" value={formatCurrency(results.taxableBalance)} />
        <CalcResult label="Tax-Deferred Annuity Value" value={formatCurrency(results.annuityBalance)} highlight />
        <CalcResult label="Annuity After Withdrawal Tax" value={formatCurrency(results.annuityAfterTax)} highlight />
        <CalcResult label="Tax Advantage of Annuity" value={formatCurrency(results.taxAdvantage)} highlight />
      </div>
    </CalculatorLayout>
  );
}
