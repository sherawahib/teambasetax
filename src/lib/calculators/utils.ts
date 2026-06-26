export {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercent,
  parseNumber,
  CALCULATOR_DISCLAIMER,
  LOCAL_CALCULATOR_NOTE,
} from "./format";

export {
  mortgagePayment,
  mortgageSummary,
  armMortgageSummary,
  fourOhOneKFutureValue,
  socialSecurityBenefit,
  calculateProgressiveTax,
  marginalTaxRate,
  effectiveTaxRate,
  longTermCapitalGainsTax,
  investmentGrowthComparison,
  standardVsItemized,
  annuityTaxComparison,
  taxCreditVsDeduction,
  traditionalIraRmd,
  federalTaxRefundEstimate,
  selfEmploymentTax,
  incomeTaxAnalysis,
  PAY_PERIODS,
  type PayFrequency,
  type ArmRateTrend,
} from "./formulas";

export {
  STANDARD_DEDUCTION,
  ORDINARY_BRACKETS,
  type FilingStatus,
} from "./tax-brackets";

import { ORDINARY_BRACKETS, STANDARD_DEDUCTION } from "./tax-brackets";
import {
  calculateProgressiveTax,
  marginalTaxRate,
  mortgagePayment,
  selfEmploymentTax,
  traditionalIraRmd,
} from "./formulas";

/** @deprecated Use ORDINARY_BRACKETS.single */
export const TAX_BRACKETS_SINGLE = ORDINARY_BRACKETS.single;
/** @deprecated Use STANDARD_DEDUCTION.single */
export const STANDARD_DEDUCTION_SINGLE = STANDARD_DEDUCTION.single;
/** @deprecated Use STANDARD_DEDUCTION.married_joint */
export const STANDARD_DEDUCTION_MARRIED = STANDARD_DEDUCTION.married_joint;

export function calculateFederalTax(taxableIncome: number): number {
  return calculateProgressiveTax(taxableIncome, "single");
}

export function calculateMarginalRate(taxableIncome: number): number {
  return marginalTaxRate(taxableIncome, "single");
}

export function calculateMortgagePayment(principal: number, annualRate: number, years: number): number {
  return mortgagePayment(principal, annualRate, years * 12);
}

export function calculateFutureValue(
  initial: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return initial + monthlyContribution * n;
  return initial * Math.pow(1 + r, n) + monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
}

export function calculateRMD(accountBalance: number, age: number): number {
  return traditionalIraRmd(accountBalance, age).rmd;
}

export function calculateSelfEmploymentTax(netIncome: number): number {
  return selfEmploymentTax({ selfEmploymentIncome: netIncome, employerIncome: 0, status: "single" }).totalSeTax;
}
