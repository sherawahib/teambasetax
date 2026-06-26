"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult } from "@/components/calculators/CalculatorLayout";
import { formatCurrencyDetailed, parseNumber, traditionalIraRmd } from "@/lib/calculators/utils";

export default function IRARMDCalculator() {
  const [priorYearBalance, setPriorYearBalance] = useState("500000");
  const [age, setAge] = useState("73");

  const results = useMemo(
    () => traditionalIraRmd(parseNumber(priorYearBalance), parseNumber(age, 73)),
    [priorYearBalance, age],
  );

  return (
    <CalculatorLayout
      title="Traditional IRA RMD Calculator"
      description="RMD = prior year-end balance ÷ IRS Uniform Lifetime Table divisor for your age."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Prior Year-End IRA Balance ($)" id="balance" value={priorYearBalance} onChange={setPriorYearBalance} />
        <CalcField label="Account Owner Age This Year" id="age" value={age} onChange={setAge} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Required Minimum Distribution" value={formatCurrencyDetailed(results.rmd)} highlight />
        <CalcResult label="IRS Life Expectancy Divisor" value={results.divisor.toFixed(1)} />
        <CalcResult label="Estimated Monthly Equivalent" value={formatCurrencyDetailed(results.monthlyEquivalent)} />
      </div>
    </CalculatorLayout>
  );
}
