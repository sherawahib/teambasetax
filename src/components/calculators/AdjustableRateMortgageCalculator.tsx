"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { armMortgageSummary, formatCurrencyDetailed, parseNumber, type ArmRateTrend } from "@/lib/calculators/utils";

export default function AdjustableRateMortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [initialRate, setInitialRate] = useState("5.5");
  const [months, setMonths] = useState("360");
  const [minRate, setMinRate] = useState("2.5");
  const [maxRate, setMaxRate] = useState("12");
  const [monthsBeforeAdjust, setMonthsBeforeAdjust] = useState("60");
  const [monthsBetweenAdjust, setMonthsBetweenAdjust] = useState("12");
  const [rateTrend, setRateTrend] = useState<ArmRateTrend>("increasing");
  const [rateAdjustment, setRateAdjustment] = useState("0.25");
  const [fixedCompareRate, setFixedCompareRate] = useState("6.75");

  const results = useMemo(
    () =>
      armMortgageSummary({
        loanAmount: parseNumber(loanAmount),
        initialRatePercent: parseNumber(initialRate),
        months: parseNumber(months, 360),
        minRatePercent: parseNumber(minRate),
        maxRatePercent: parseNumber(maxRate),
        monthsBeforeFirstAdjustment: parseNumber(monthsBeforeAdjust, 60),
        monthsBetweenAdjustments: parseNumber(monthsBetweenAdjust, 12),
        rateTrend,
        rateAdjustmentPercent: parseNumber(rateAdjustment),
        compareFixedRatePercent: parseNumber(fixedCompareRate),
      }),
    [
      loanAmount,
      initialRate,
      months,
      minRate,
      maxRate,
      monthsBeforeAdjust,
      monthsBetweenAdjust,
      rateTrend,
      rateAdjustment,
      fixedCompareRate,
    ],
  );

  return (
    <CalculatorLayout
      title="Adjustable Rate Mortgage Calculator"
      description="Simulates ARM rate adjustments over the loan term and compares against a fixed-rate mortgage."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Loan Amount ($)" id="loan" value={loanAmount} onChange={setLoanAmount} />
        <CalcField label="Initial Interest Rate (%)" id="initial" value={initialRate} onChange={setInitialRate} step="0.01" />
        <CalcField label="Number of Months" id="months" value={months} onChange={setMonths} />
        <CalcField label="Fixed Rate for Comparison (%)" id="fixed" value={fixedCompareRate} onChange={setFixedCompareRate} step="0.01" />
        <CalcField label="Absolute Minimum Rate (%)" id="min" value={minRate} onChange={setMinRate} step="0.01" />
        <CalcField label="Absolute Maximum Rate (%)" id="max" value={maxRate} onChange={setMaxRate} step="0.01" />
        <CalcField label="Months Before First Adjustment" id="before" value={monthsBeforeAdjust} onChange={setMonthsBeforeAdjust} />
        <CalcField label="Months Between Adjustments" id="between" value={monthsBetweenAdjust} onChange={setMonthsBetweenAdjust} />
        <CalcSelect
          label="Rate Trend Over Loan Life"
          id="trend"
          value={rateTrend}
          onChange={(v) => setRateTrend(v as ArmRateTrend)}
          options={[
            { value: "same", label: "Stay the same" },
            { value: "increasing", label: "Increasing" },
            { value: "decreasing", label: "Decreasing" },
          ]}
        />
        <CalcField label="Assumed Rate Adjustment (%)" id="adjust" value={rateAdjustment} onChange={setRateAdjustment} step="0.01" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Fixed-Rate Monthly Payment" value={formatCurrencyDetailed(results.fixedPayment)} highlight />
        <CalcResult label="ARM Initial Monthly Payment" value={formatCurrencyDetailed(results.initialArmPayment)} highlight />
        <CalcResult label="ARM Payment After Adjustment" value={formatCurrencyDetailed(results.adjustedPayment)} />
        <CalcResult label="Final ARM Rate" value={`${results.finalRate.toFixed(2)}%`} />
        <CalcResult label="Total ARM Interest Paid" value={formatCurrencyDetailed(results.totalInterest)} />
        <CalcResult label="Total ARM Payments" value={formatCurrencyDetailed(results.totalPaid)} />
      </div>
    </CalculatorLayout>
  );
}
