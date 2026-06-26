"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { formatCurrency, fourOhOneKFutureValue, parseNumber, type PayFrequency } from "@/lib/calculators/utils";

export default function FourOhOneKCalculator() {
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState("20");
  const [currentIncome, setCurrentIncome] = useState("75000");
  const [salaryIncrease, setSalaryIncrease] = useState("3");
  const [currentBalance, setCurrentBalance] = useState("50000");
  const [contributionPercent, setContributionPercent] = useState("6");
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("biweekly");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [employerMatch, setEmployerMatch] = useState("50");
  const [maxEmployerMatch, setMaxEmployerMatch] = useState("6");

  const results = useMemo(
    () =>
      fourOhOneKFutureValue({
        yearsUntilRetirement: parseNumber(yearsUntilRetirement, 20),
        currentIncome: parseNumber(currentIncome),
        salaryIncreasePercent: parseNumber(salaryIncrease),
        currentBalance: parseNumber(currentBalance),
        contributionPercent: parseNumber(contributionPercent),
        payFrequency,
        annualReturnPercent: parseNumber(annualReturn),
        employerMatchPercent: parseNumber(employerMatch),
        maxEmployerMatchPercent: parseNumber(maxEmployerMatch),
      }),
    [
      yearsUntilRetirement,
      currentIncome,
      salaryIncrease,
      currentBalance,
      contributionPercent,
      payFrequency,
      annualReturn,
      employerMatch,
      maxEmployerMatch,
    ],
  );

  return (
    <CalculatorLayout
      title="401(k) Future Value Calculator"
      description="Projects account growth with salary increases, employee contributions, and employer matching."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Years Until Retirement" id="years" value={yearsUntilRetirement} onChange={setYearsUntilRetirement} />
        <CalcField label="Current Annual Income ($)" id="income" value={currentIncome} onChange={setCurrentIncome} />
        <CalcField label="Annual Salary Increases (%)" id="increase" value={salaryIncrease} onChange={setSalaryIncrease} step="0.1" />
        <CalcField label="Current 401(k) Balance ($)" id="balance" value={currentBalance} onChange={setCurrentBalance} />
        <CalcField label="Current Contribution (% of salary)" id="contrib" value={contributionPercent} onChange={setContributionPercent} step="0.1" />
        <CalcSelect
          label="Pay Period Frequency"
          id="frequency"
          value={payFrequency}
          onChange={(v) => setPayFrequency(v as PayFrequency)}
          options={[
            { value: "weekly", label: "Weekly" },
            { value: "biweekly", label: "Bi-Weekly" },
            { value: "semimonthly", label: "Semi-Monthly" },
            { value: "monthly", label: "Monthly" },
            { value: "annually", label: "Annually" },
          ]}
        />
        <CalcField label="Annual Before-Tax Return (%)" id="return" value={annualReturn} onChange={setAnnualReturn} step="0.1" />
        <CalcField label="Employer Match (% of contribution)" id="match" value={employerMatch} onChange={setEmployerMatch} />
        <CalcField label="Maximum Employer Match (% of salary)" id="maxmatch" value={maxEmployerMatch} onChange={setMaxEmployerMatch} step="0.1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Estimated Future Value" value={formatCurrency(results.futureValue)} highlight />
        <CalcResult label="Total Contributions" value={formatCurrency(results.totalContributions)} />
        <CalcResult label="Employee Contributions" value={formatCurrency(results.totalEmployeeContributions)} />
        <CalcResult label="Employer Match Contributions" value={formatCurrency(results.totalEmployerContributions)} />
        <CalcResult label="Investment Growth" value={formatCurrency(results.investmentGrowth)} highlight />
      </div>
    </CalculatorLayout>
  );
}
