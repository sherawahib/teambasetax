/** Shared financial helpers aligned with CalcXML standard formulas */

export function loanPayment(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function futureValueMonthly(
  initial: number,
  monthlyContribution: number,
  annualRatePercent: number,
  months: number,
): number {
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return initial + monthlyContribution * months;
  return initial * Math.pow(1 + r, months) + monthlyContribution * ((Math.pow(1 + r, months) - 1) / r);
}

export function futureValueAnnual(
  initial: number,
  annualContribution: number,
  annualRatePercent: number,
  years: number,
): number {
  const r = annualRatePercent / 100;
  if (r === 0) return initial + annualContribution * years;
  return initial * Math.pow(1 + r, years) + annualContribution * ((Math.pow(1 + r, years) - 1) / r);
}

export function monthsToPayoff(
  balance: number,
  annualRatePercent: number,
  monthlyPayment: number,
  extraPayment = 0,
): number {
  if (balance <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  const payment = monthlyPayment + extraPayment;
  if (payment <= balance * r && r > 0) return Infinity;
  if (r === 0) return Math.ceil(balance / payment);

  let remaining = balance;
  let months = 0;
  while (remaining > 0.01 && months < 600) {
    remaining = remaining * (1 + r) - payment;
    months++;
  }
  return months;
}

export function totalInterestPaid(
  balance: number,
  annualRatePercent: number,
  monthlyPayment: number,
  extraPayment = 0,
): { months: number; totalInterest: number; totalPaid: number } {
  const r = annualRatePercent / 100 / 12;
  const payment = monthlyPayment + extraPayment;
  let remaining = balance;
  let months = 0;
  let totalInterest = 0;

  while (remaining > 0.01 && months < 600) {
    const interest = remaining * r;
    const principal = Math.min(payment - interest, remaining);
    if (principal <= 0) break;
    totalInterest += interest;
    remaining -= principal;
    months++;
  }

  return { months, totalInterest, totalPaid: balance + totalInterest };
}

export function amortizationWithExtra(
  balance: number,
  annualRatePercent: number,
  monthlyPayment: number,
  extraPayment: number,
) {
  const standard = totalInterestPaid(balance, annualRatePercent, monthlyPayment, 0);
  const accelerated = totalInterestPaid(balance, annualRatePercent, monthlyPayment, extraPayment);
  return {
    standardMonths: standard.months,
    acceleratedMonths: accelerated.months,
    monthsSaved: standard.months - accelerated.months,
    standardInterest: standard.totalInterest,
    acceleratedInterest: accelerated.totalInterest,
    interestSaved: standard.totalInterest - accelerated.totalInterest,
  };
}

export function percentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export function ruleOf72Years(ratePercent: number): number {
  if (ratePercent <= 0) return 0;
  return 72 / ratePercent;
}

export function cagr(beginningValue: number, endingValue: number, years: number): number {
  if (beginningValue <= 0 || years <= 0) return 0;
  return (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
}

export function taxableEquivalentYield(taxFreeYieldPercent: number, marginalTaxPercent: number): number {
  const taxRate = marginalTaxPercent / 100;
  if (taxRate >= 1) return 0;
  return taxFreeYieldPercent / (1 - taxRate);
}

export function annuityFutureValue(
  payment: number,
  annualRatePercent: number,
  years: number,
  paymentsPerYear = 12,
): number {
  const n = years * paymentsPerYear;
  const r = annualRatePercent / 100 / paymentsPerYear;
  if (r === 0) return payment * n;
  return payment * ((Math.pow(1 + r, n) - 1) / r);
}

export function presentValueAnnuity(payment: number, annualRatePercent: number, years: number): number {
  const n = years * 12;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return payment * n;
  return payment * ((1 - Math.pow(1 + r, -n)) / r);
}

export function recommendationText(condition: boolean, yes: string, no: string): string {
  return condition ? yes : no;
}
