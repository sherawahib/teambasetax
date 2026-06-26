"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { formatCurrency, parseNumber, standardVsItemized, type FilingStatus } from "@/lib/calculators/utils";

export default function StandardVsItemizedCalculator() {
  const [agi, setAgi] = useState("100000");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [over65, setOver65] = useState("0");
  const [blind, setBlind] = useState("0");
  const [medical, setMedical] = useState("3000");
  const [dental, setDental] = useState("1000");
  const [stateTax, setStateTax] = useState("5000");
  const [realEstateTax, setRealEstateTax] = useState("4000");
  const [mortgageInterest, setMortgageInterest] = useState("8000");
  const [charitableCash, setCharitableCash] = useState("2000");

  const results = useMemo(
    () =>
      standardVsItemized({
        agi: parseNumber(agi),
        status,
        blindFilers: parseNumber(blind),
        over65Filers: parseNumber(over65),
        medicalExpenses: parseNumber(medical),
        dentalExpenses: parseNumber(dental),
        stateLocalIncomeTaxes: parseNumber(stateTax),
        realEstateTaxes: parseNumber(realEstateTax),
        personalPropertyTaxes: 0,
        otherTaxes: 0,
        mortgageInterest: parseNumber(mortgageInterest),
        charitableCash: parseNumber(charitableCash),
        charitableInKind: 0,
        charitableCarryover: 0,
      }),
    [agi, status, over65, blind, medical, dental, stateTax, realEstateTax, mortgageInterest, charitableCash],
  );

  return (
    <CalculatorLayout
      title="Standard Deduction vs. Itemized"
      description="Compares standard deduction vs. itemized using medical floor (7.5% AGI), $10,000 SALT cap, and progressive tax brackets."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <CalcField label="Estimated AGI ($)" id="agi" value={agi} onChange={setAgi} />
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
        <CalcField label="Filers Over Age 65" id="over65" value={over65} onChange={setOver65} />
        <CalcField label="Blind Filers" id="blind" value={blind} onChange={setBlind} />
        <CalcField label="Medical Expenses ($)" id="medical" value={medical} onChange={setMedical} />
        <CalcField label="Dental Expenses ($)" id="dental" value={dental} onChange={setDental} />
        <CalcField label="State & Local Income Taxes ($)" id="state" value={stateTax} onChange={setStateTax} />
        <CalcField label="Real Estate Taxes ($)" id="re" value={realEstateTax} onChange={setRealEstateTax} />
        <CalcField label="Home Mortgage Interest ($)" id="mortgage" value={mortgageInterest} onChange={setMortgageInterest} />
        <CalcField label="Cash Charitable Contributions ($)" id="charity" value={charitableCash} onChange={setCharitableCash} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CalcResult label="Standard Deduction" value={formatCurrency(results.standardDeduction)} />
        <CalcResult label="Total Itemized Deductions" value={formatCurrency(results.itemizedTotal)} />
        <CalcResult label="Recommendation" value={results.recommendation} highlight />
        <CalcResult label="Tax Savings from Itemizing" value={formatCurrency(results.taxSavingsFromItemizing)} highlight />
      </div>
    </CalculatorLayout>
  );
}
