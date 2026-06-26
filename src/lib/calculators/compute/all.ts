import type { CalcOutput, CalcValues, ComputeFn } from "../types";
import {
  loanPayment,
  futureValueMonthly,
  futureValueAnnual,
  totalInterestPaid,
  amortizationWithExtra,
  percentChange,
  ruleOf72Years,
  cagr as calcCagr,
  taxableEquivalentYield,
  annuityFutureValue,
  recommendationText,
} from "./helpers";
import {
  mortgagePayment,
  mortgageSummary,
  calculateProgressiveTax,
  PAY_PERIODS,
  type PayFrequency,
} from "../formulas";
import { STANDARD_DEDUCTION } from "../tax-brackets";

function v(values: CalcValues, key: string, fallback = 0): number {
  const n = values[key];
  return Number.isFinite(n) ? n : fallback;
}

function filingStatus(values: CalcValues): "single" | "married_joint" {
  return v(values, "filingStatus") === 1 ? "married_joint" : "single";
}

/** Simplified 2026 EIC approximation for single filers */
function earnedIncomeCreditApprox(earnedIncome: number, qualifyingChildren: number): number {
  const children = Math.min(Math.max(Math.floor(qualifyingChildren), 0), 3);
  const tables: Record<number, { max: number; phaseInEnd: number; phaseOutStart: number; phaseOutEnd: number }> = {
    0: { max: 632, phaseInEnd: 8260, phaseOutStart: 10820, phaseOutEnd: 18591 },
    1: { max: 4213, phaseInEnd: 12310, phaseOutStart: 23350, phaseOutEnd: 49084 },
    2: { max: 6960, phaseInEnd: 17310, phaseOutStart: 23350, phaseOutEnd: 55768 },
    3: { max: 7830, phaseInEnd: 17310, phaseOutStart: 23350, phaseOutEnd: 59899 },
  };
  const t = tables[children] ?? tables[0];
  if (earnedIncome <= 0 || earnedIncome >= t.phaseOutEnd) return 0;

  let credit: number;
  if (earnedIncome < t.phaseInEnd) {
    credit = (earnedIncome / t.phaseInEnd) * t.max;
  } else if (earnedIncome <= t.phaseOutStart) {
    credit = t.max;
  } else {
    credit = t.max * (1 - (earnedIncome - t.phaseOutStart) / (t.phaseOutEnd - t.phaseOutStart));
  }
  return Math.max(0, credit);
}

/** Provisional income formula for Social Security taxation */
function socialSecurityTaxableAmount(
  ssBenefits: number,
  otherIncome: number,
  taxExemptInterest: number,
  married: boolean,
): { taxableAmount: number; taxablePercent: number } {
  const provisional = otherIncome + taxExemptInterest + ssBenefits * 0.5;
  const base = married ? 32000 : 25000;
  const upper = married ? 44000 : 34000;

  let taxable = 0;
  if (provisional <= base) {
    taxable = 0;
  } else if (provisional <= upper) {
    taxable = Math.min((provisional - base) * 0.5, ssBenefits * 0.5);
  } else {
    const tier1 = Math.min((upper - base) * 0.5, ssBenefits * 0.5);
    const tier2 = (provisional - upper) * 0.85;
    taxable = Math.min(tier1 + tier2, ssBenefits * 0.85);
  }

  return {
    taxableAmount: taxable,
    taxablePercent: ssBenefits > 0 ? (taxable / ssBenefits) * 100 : 0,
  };
}

function yearsToGoal(
  current: number,
  monthly: number,
  ratePercent: number,
  goal: number,
  maxYears = 100,
): number {
  for (let y = 1; y <= maxYears; y++) {
    const fv = futureValueMonthly(current, monthly, ratePercent, y * 12);
    if (fv >= goal) return y;
  }
  return maxYears;
}

// ─── Automobile ───────────────────────────────────────────────────────────────

const acceleratedPayoffAuto: ComputeFn = (values) => {
  const balance = v(values, "loanAmount");
  const rate = v(values, "interestRate", 6);
  const payment = v(values, "monthlyPayment") || loanPayment(balance, rate, v(values, "months", 60));
  const extra = v(values, "extraPayment");
  const result = amortizationWithExtra(balance, rate, payment, extra);
  return {
    standardMonths: result.standardMonths,
    acceleratedMonths: result.acceleratedMonths,
    monthsSaved: result.monthsSaved,
    standardInterest: result.standardInterest,
    acceleratedInterest: result.acceleratedInterest,
    interestSaved: result.interestSaved,
    recommendation: recommendationText(
      extra > 0 && result.interestSaved > 0,
      `Extra payments save $${result.interestSaved.toFixed(0)} in interest and ${result.monthsSaved} months.`,
      "Add extra payments to reduce interest and payoff time.",
    ),
  };
};

const carDepreciation: ComputeFn = (values) => {
  const purchasePrice = v(values, "purchasePrice", 35000);
  const yearsOwned = v(values, "yearsOwned", 3);
  const annualRate = v(values, "annualDepreciationPercent", 15);
  const rate = annualRate / 100;
  let value = purchasePrice;
  for (let i = 0; i < yearsOwned; i++) value *= 1 - rate;
  const totalDepreciation = purchasePrice - value;
  return {
    currentValue: value,
    totalDepreciation,
    depreciationPercent: purchasePrice > 0 ? (totalDepreciation / purchasePrice) * 100 : 0,
    recommendation: recommendationText(
      value < purchasePrice * 0.5,
      "Vehicle has lost significant value; consider total cost of ownership before upgrading.",
      "Depreciation is within typical range for passenger vehicles.",
    ),
  };
};

const evSavings: ComputeFn = (values) => {
  const miles = v(values, "annualMiles", 12000);
  const gasPrice = v(values, "gasPrice", 3.5);
  const mpg = v(values, "gasMpg", 25);
  const evKwhPer100 = v(values, "evEfficiency", 30);
  const electricityRate = v(values, "electricityRate", 0.15);
  const gasMaint = v(values, "gasMaintenance", 1200);
  const evMaint = v(values, "evMaintenance", 600);
  const years = v(values, "years", 5);

  const annualGasFuel = (miles / mpg) * gasPrice;
  const annualEvFuel = (miles * evKwhPer100 / 100) * electricityRate;
  const annualGasTotal = annualGasFuel + gasMaint;
  const annualEvTotal = annualEvFuel + evMaint;
  const annualSavings = annualGasTotal - annualEvTotal;
  const totalSavings = annualSavings * years;

  return {
    annualGasCost: annualGasTotal,
    annualEvCost: annualEvTotal,
    annualSavings,
    totalSavings,
    recommendation: recommendationText(
      annualSavings > 0,
      `An EV could save about $${annualSavings.toFixed(0)} per year in fuel and maintenance.`,
      "Gas vehicle costs are lower with these assumptions.",
    ),
  };
};

const carAffordability: ComputeFn = (values) => {
  const monthlyIncome = v(values, "monthlyIncome", 5000);
  const monthlyDebts = v(values, "monthlyDebts", 500);
  const maxPaymentPct = v(values, "maxPaymentPercent", 15);
  const rate = v(values, "interestRate", 6);
  const months = v(values, "months", 60);
  const downPayment = v(values, "downPayment", 3000);

  const maxPayment = monthlyIncome * (maxPaymentPct / 100);
  const affordablePayment = Math.max(maxPayment - monthlyDebts * 0.1, 0);
  const maxLoan = affordablePayment > 0 ? solvePrincipal(affordablePayment, rate, months) : 0;
  const maxCarPrice = maxLoan + downPayment;

  return {
    maxMonthlyPayment: affordablePayment,
    maxLoanAmount: maxLoan,
    maxCarPrice,
    recommendation: recommendationText(
      maxCarPrice > 0,
      `Based on income and debts, a car around $${maxCarPrice.toFixed(0)} may be affordable.`,
      "Reduce existing debt or increase income to afford a vehicle payment.",
    ),
  };
};

function solvePrincipal(payment: number, annualRatePercent: number, months: number): number {
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return payment * months;
  return (payment * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
}

const carPayments: ComputeFn = (values) => {
  const price = v(values, "vehiclePrice", 30000);
  const downPayment = v(values, "downPayment", 3000);
  const rate = v(values, "interestRate", 6);
  const months = v(values, "months", 60);
  const loanAmount = Math.max(price - downPayment, 0);
  const monthlyPayment = loanPayment(loanAmount, rate, months);
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - loanAmount;

  return {
    loanAmount,
    monthlyPayment,
    totalInterest,
    totalPaid: totalPaid + downPayment,
    recommendation: recommendationText(
      monthlyPayment <= v(values, "monthlyBudget", monthlyPayment),
      "Payment fits within your stated budget.",
      "Consider a larger down payment or longer term to lower the monthly payment.",
    ),
  };
};

const leaseOrBuyCar: ComputeFn = (values) => {
  const buyPrice = v(values, "buyPrice", 35000);
  const downPayment = v(values, "downPayment", 3000);
  const loanRate = v(values, "loanRate", 6);
  const loanMonths = v(values, "loanMonths", 60);
  const leaseDown = v(values, "leaseDownPayment", 2000);
  const leaseMonthly = v(values, "leaseMonthly", 399);
  const leaseMonths = v(values, "leaseMonths", 36);
  const residualValue = v(values, "residualValue", 18000);

  const loanAmount = buyPrice - downPayment;
  const buyPayment = loanPayment(loanAmount, loanRate, loanMonths);
  const buyTotal = downPayment + buyPayment * loanMonths;
  const leaseTotal = leaseDown + leaseMonthly * leaseMonths;
  const buyEquity = residualValue;
  const buyNetCost = buyTotal - buyEquity;
  const leaseNetCost = leaseTotal;

  return {
    buyTotalCost: buyTotal,
    leaseTotalCost: leaseTotal,
    buyNetCost,
    leaseNetCost,
    costDifference: leaseNetCost - buyNetCost,
    recommendation: recommendationText(
      buyNetCost < leaseNetCost,
      "Buying is likely cheaper over this period when equity is considered.",
      "Leasing may cost less upfront; compare mileage limits and wear charges.",
    ),
  };
};

const autoLoanLtv: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 25000);
  const vehicleValue = v(values, "vehicleValue", 28000);
  const ltv = vehicleValue > 0 ? (loanAmount / vehicleValue) * 100 : 0;
  const equity = vehicleValue - loanAmount;

  return {
    ltvRatio: ltv,
    equity,
    underwater: equity < 0 ? 1 : 0,
    recommendation: recommendationText(
      ltv <= 100,
      "Loan-to-value is at or below 100%; you have positive or neutral equity.",
      "You owe more than the vehicle is worth; consider extra principal payments.",
    ),
  };
};

const loanVsDealerFinancing: ComputeFn = (values) => {
  const price = v(values, "vehiclePrice", 30000);
  const bankRate = v(values, "bankRate", 5.5);
  const bankMonths = v(values, "bankMonths", 60);
  const dealerRebate = v(values, "dealerRebate", 2000);
  const dealerPrice = price - dealerRebate;

  const bankLoan = price - v(values, "downPayment", 0);
  const bankPayment = loanPayment(bankLoan, bankRate, bankMonths);
  const bankTotalInterest = bankPayment * bankMonths - bankLoan;
  const dealerTotal = dealerPrice;

  return {
    bankMonthlyPayment: bankPayment,
    bankTotalInterest,
    bankTotalCost: bankPayment * bankMonths + v(values, "downPayment", 0),
    dealerTotalCost: dealerTotal + v(values, "downPayment", 0),
    savings: bankPayment * bankMonths + v(values, "downPayment", 0) - (dealerTotal + v(values, "downPayment", 0)),
    recommendation: recommendationText(
      dealerTotal + bankTotalInterest < price,
      "0% dealer financing with rebate may beat bank financing total cost.",
      "Bank financing may be cheaper when dealer rebate is small.",
    ),
  };
};

// ─── Business ─────────────────────────────────────────────────────────────────

const businessValuation: ComputeFn = (values) => {
  const earnings = v(values, "annualEarnings", 250000);
  const multiple = v(values, "earningsMultiple", 4);
  const value = earnings * multiple;
  return {
    businessValue: value,
    earningsMultiple: multiple,
    recommendation: `Estimated value: $${value.toLocaleString()} at ${multiple}x earnings.`,
  };
};

const debtToEquity: ComputeFn = (values) => {
  const debt = v(values, "totalDebt", 500000);
  const equity = v(values, "totalEquity", 750000);
  const ratio = equity > 0 ? debt / equity : 0;
  return {
    debtToEquityRatio: ratio,
    totalDebt: debt,
    totalEquity: equity,
    recommendation: recommendationText(
      ratio < 1,
      "Debt-to-equity below 1.0 indicates moderate leverage.",
      "High leverage; creditors bear more risk relative to equity.",
    ),
  };
};

const cashFlowProjection: ComputeFn = (values) => {
  const startingCash = v(values, "startingCash", 50000);
  const revenue = v(values, "annualRevenue", 500000);
  const expenses = v(values, "annualExpenses", 400000);
  const growth = v(values, "growthRate", 5);
  const years = v(values, "years", 5);

  let cash = startingCash;
  let rev = revenue;
  let exp = expenses;
  const projections: number[] = [];
  for (let y = 1; y <= years; y++) {
    const netCashFlow = rev - exp;
    cash += netCashFlow;
    projections.push(cash);
    rev *= 1 + growth / 100;
    exp *= 1 + growth / 100 * 0.8;
  }

  return {
    year1Cash: projections[0] ?? startingCash,
    finalCash: projections[projections.length - 1] ?? startingCash,
    totalNetCashFlow: projections[projections.length - 1] - startingCash,
    recommendation: recommendationText(
      (projections[projections.length - 1] ?? 0) > startingCash,
      "Projected cash position improves over the period.",
      "Review expenses or revenue growth assumptions to improve cash flow.",
    ),
  };
};

const cagrCalc: ComputeFn = (values) => {
  const beginning = v(values, "beginningValue", 10000);
  const ending = v(values, "endingValue", 25000);
  const years = v(values, "years", 5);
  const rate = calcCagr(beginning, ending, years);
  return {
    cagr: rate,
    totalGrowth: beginning > 0 ? ((ending - beginning) / beginning) * 100 : 0,
    recommendation: `Compound annual growth rate: ${rate.toFixed(2)}% over ${years} years.`,
  };
};

const freelancerRate: ComputeFn = (values) => {
  const desiredIncome = v(values, "desiredAnnualIncome", 75000);
  const expenses = v(values, "annualExpenses", 15000);
  const billableHours = v(values, "billableHours", 1200);
  const utilization = v(values, "utilizationPercent", 75);
  const effectiveHours = billableHours * (utilization / 100);
  const requiredRevenue = desiredIncome + expenses;
  const hourlyRate = effectiveHours > 0 ? requiredRevenue / effectiveHours : 0;

  return {
    requiredHourlyRate: hourlyRate,
    requiredAnnualRevenue: requiredRevenue,
    effectiveBillableHours: effectiveHours,
    recommendation: `Charge at least $${hourlyRate.toFixed(2)}/hr to meet income and expense goals.`,
  };
};

const netProfitMargin: ComputeFn = (values) => {
  const revenue = v(values, "revenue", 500000);
  const expenses = v(values, "expenses", 400000);
  const netProfit = revenue - expenses;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  return {
    netProfit,
    netProfitMargin: margin,
    recommendation: recommendationText(
      margin >= 10,
      "Healthy net profit margin for most industries.",
      "Margin is thin; review pricing and cost structure.",
    ),
  };
};

const roi: ComputeFn = (values) => {
  const gain = v(values, "gain", 15000);
  const cost = v(values, "cost", 10000);
  const roiPercent = cost > 0 ? (gain / cost) * 100 : 0;
  return {
    roi: roiPercent,
    netGain: gain - cost,
    recommendation: recommendationText(
      roiPercent > 0,
      `Positive ROI of ${roiPercent.toFixed(1)}% on this investment.`,
      "Investment did not generate a positive return.",
    ),
  };
};

// ─── Credit Cards ─────────────────────────────────────────────────────────────

const buyNowVsWait: ComputeFn = (values) => {
  const price = v(values, "purchasePrice", 2000);
  const savingsRate = v(values, "savingsRate", 4);
  const monthsToSave = v(values, "monthsToSave", 12);
  const creditRate = v(values, "creditRate", 18);
  const monthlySave = price / monthsToSave;
  const savedAmount = futureValueMonthly(0, monthlySave, savingsRate, monthsToSave);
  const buyNowInterest = totalInterestPaid(price, creditRate, loanPayment(price, creditRate, monthsToSave));
  const waitCost = price;
  const buyNowCost = price + buyNowInterest.totalInterest;

  return {
    savedAmount,
    buyNowTotalCost: buyNowCost,
    waitTotalCost: waitCost,
    savingsByWaiting: buyNowCost - waitCost,
    recommendation: recommendationText(
      waitCost < buyNowCost,
      "Saving and paying cash avoids credit card interest.",
      "If you need the item now, minimize financing cost with a payoff plan.",
    ),
  };
};

const creditCardBalanceTransfer: ComputeFn = (values) => {
  const balance = v(values, "balance", 5000);
  const currentRate = v(values, "currentRate", 22);
  const newRate = v(values, "newRate", 0);
  const transferFeePct = v(values, "transferFeePercent", 3);
  const months = v(values, "monthsToPayoff", 18);
  const payment = v(values, "monthlyPayment") || loanPayment(balance, currentRate, months);

  const currentResult = totalInterestPaid(balance, currentRate, payment);
  const newBalance = balance * (1 + transferFeePct / 100);
  const newResult = totalInterestPaid(newBalance, newRate, payment);
  const savings = currentResult.totalInterest - newResult.totalInterest - balance * (transferFeePct / 100);

  return {
    currentTotalInterest: currentResult.totalInterest,
    newTotalInterest: newResult.totalInterest,
    transferFee: balance * (transferFeePct / 100),
    netSavings: savings,
    recommendation: recommendationText(
      savings > 0,
      "Balance transfer likely saves money if paid off during promotional period.",
      "Transfer fee and rate may not justify moving the balance.",
    ),
  };
};

const creditCardCashAdvance: ComputeFn = (values) => {
  const amount = v(values, "advanceAmount", 1000);
  const feePct = v(values, "feePercent", 5);
  const rate = v(values, "interestRate", 25);
  const months = v(values, "months", 6);
  const fee = amount * (feePct / 100);
  const balance = amount + fee;
  const payment = loanPayment(balance, rate, months);
  const result = totalInterestPaid(balance, rate, payment);

  return {
    cashAdvanceFee: fee,
    totalInterest: result.totalInterest,
    totalCost: balance + result.totalInterest,
    monthsToPayoff: result.months,
    recommendation: "Cash advances carry high fees and interest; use only for emergencies.",
  };
};

const creditCardMinimumPayment: ComputeFn = (values) => {
  const balance = v(values, "balance", 5000);
  const rate = v(values, "interestRate", 22);
  const minPct = v(values, "minimumPercent", 2);
  const minDollar = v(values, "minimumDollar", 25);

  let remaining = balance;
  const r = rate / 100 / 12;
  let months = 0;
  let totalInterest = 0;
  while (remaining > 0.01 && months < 600) {
    const interest = remaining * r;
    const minPay = Math.max(remaining * (minPct / 100), minDollar);
    const payment = Math.min(minPay, remaining + interest);
    const principal = payment - interest;
    if (principal <= 0) break;
    totalInterest += interest;
    remaining -= principal;
    months++;
  }

  return {
    monthsToPayoff: months,
    totalInterest,
    totalPaid: balance + totalInterest,
    recommendation: recommendationText(
      months < 120,
      "Minimum payments extend payoff; increase payment to save interest.",
      "Paying only minimums could take decades; pay more than the minimum.",
    ),
  };
};

const creditCardPayoff: ComputeFn = (values) => {
  const balance = v(values, "balance", 5000);
  const rate = v(values, "interestRate", 22);
  const payment = v(values, "monthlyPayment", 200);
  const result = totalInterestPaid(balance, rate, payment);
  return {
    monthsToPayoff: result.months,
    totalInterest: result.totalInterest,
    totalPaid: result.totalPaid,
    recommendation: recommendationText(
      result.months < 36,
      `Paying $${payment}/month clears the balance in ${result.months} months.`,
      "Increase monthly payment to reduce interest and payoff time.",
    ),
  };
};

const creditCardRewards: ComputeFn = (values) => {
  const spending = v(values, "annualSpending", 24000);
  const rewardRate = v(values, "rewardRate", 2);
  const annualFee = v(values, "annualFee", 95);
  const grossRewards = spending * (rewardRate / 100);
  const netRewards = grossRewards - annualFee;

  return {
    grossRewards,
    netRewards,
    effectiveRewardRate: spending > 0 ? (netRewards / spending) * 100 : 0,
    recommendation: recommendationText(
      netRewards > 0,
      `Net annual rewards value: $${netRewards.toFixed(0)} after fees.`,
      "Annual fee exceeds rewards; consider a no-fee card.",
    ),
  };
};

const extraDebtPayments: ComputeFn = (values) => {
  const balance = v(values, "balance", 10000);
  const rate = v(values, "interestRate", 15);
  const payment = v(values, "monthlyPayment", 250);
  const extra = v(values, "extraPayment", 100);
  const result = amortizationWithExtra(balance, rate, payment, extra);
  return {
    monthsSaved: result.monthsSaved,
    interestSaved: result.interestSaved,
    standardMonths: result.standardMonths,
    acceleratedMonths: result.acceleratedMonths,
    recommendation: recommendationText(
      extra > 0,
      `Extra $${extra}/month saves $${result.interestSaved.toFixed(0)} and ${result.monthsSaved} months.`,
      "Add extra payments to accelerate debt payoff.",
    ),
  };
};

// ─── Mortgage ─────────────────────────────────────────────────────────────────

const closingCostsImpact: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 300000);
  const rateWithPoints = v(values, "rateWithPoints", 6);
  const rateWithout = v(values, "rateWithoutPoints", 6.5);
  const pointsCost = v(values, "pointsCost", 3000);
  const months = v(values, "months", 360);

  const payWithPoints = mortgagePayment(loanAmount, rateWithPoints, months);
  const payWithout = mortgagePayment(loanAmount, rateWithout, months);
  const monthlySavings = payWithout - payWithPoints;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : Infinity;

  return {
    paymentWithPoints: payWithPoints,
    paymentWithoutPoints: payWithout,
    monthlySavings,
    breakEvenMonths: Number.isFinite(breakEvenMonths) ? breakEvenMonths : 0,
    recommendation: recommendationText(
      breakEvenMonths < months,
      `Points break even in about ${breakEvenMonths} months if you keep the loan.`,
      "Higher rate without points may cost less if you sell or refinance early.",
    ),
  };
};

const homeAffordability: ComputeFn = (values) => {
  const annualIncome = v(values, "annualIncome", 100000);
  const monthlyDebts = v(values, "monthlyDebts", 500);
  const downPayment = v(values, "downPayment", 50000);
  const rate = v(values, "interestRate", 6.5);
  const months = v(values, "loanTermMonths", 360);
  const maxRatio = v(values, "maxHousingRatio", 28);
  const propertyTax = v(values, "annualPropertyTax", 4000);
  const insurance = v(values, "annualInsurance", 1500);

  const maxHousing = (annualIncome / 12) * (maxRatio / 100);
  const monthlyTaxIns = (propertyTax + insurance) / 12;
  const maxPI = Math.max(maxHousing - monthlyDebts * 0.36 - monthlyTaxIns, 0);
  const maxLoan = solvePrincipal(maxPI, rate, months);
  const affordableHome = maxLoan + downPayment;

  return {
    maxMonthlyHousing: maxHousing,
    maxLoanAmount: maxLoan,
    affordableHomePrice: affordableHome,
    recommendation: recommendationText(
      affordableHome > 0,
      `You may afford a home around $${affordableHome.toFixed(0)} with these assumptions.`,
      "Reduce debts or increase down payment to improve affordability.",
    ),
  };
};

const interestOnlyVsTraditional: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 300000);
  const rate = v(values, "interestRate", 6.5);
  const months = v(values, "months", 360);

  const ioPayment = loanAmount * (rate / 100 / 12);
  const traditionalPayment = mortgagePayment(loanAmount, rate, months);
  const ioTotalInterest = ioPayment * months;
  const tradSummary = mortgageSummary(loanAmount, rate, months);

  return {
    interestOnlyPayment: ioPayment,
    traditionalPayment,
    paymentDifference: traditionalPayment - ioPayment,
    interestOnlyTotalInterest: ioTotalInterest,
    traditionalTotalInterest: tradSummary.totalInterest,
    recommendation: recommendationText(
      traditionalPayment - ioPayment < loanAmount * 0.01,
      "Traditional amortizing loan builds equity despite higher payment.",
      "Interest-only lowers payment early but does not reduce principal.",
    ),
  };
};

const mortgageRefinance: ComputeFn = (values) => {
  const balance = v(values, "currentBalance", 280000);
  const currentRate = v(values, "currentRate", 7);
  const monthsRemaining = v(values, "monthsRemaining", 300);
  const newRate = v(values, "newRate", 6);
  const newMonths = v(values, "newMonths", 360);
  const closingCosts = v(values, "closingCosts", 5000);

  const currentPayment = mortgagePayment(balance, currentRate, monthsRemaining);
  const newPayment = mortgagePayment(balance, newRate, newMonths);
  const monthlySavings = currentPayment - newPayment;
  const breakEven = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 0;
  const currentTotal = currentPayment * monthsRemaining;
  const newTotal = newPayment * newMonths + closingCosts;

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths: breakEven,
    lifetimeSavings: currentTotal - newTotal,
    recommendation: recommendationText(
      breakEven > 0 && breakEven < monthsRemaining,
      `Refinance breaks even in ~${breakEven} months with monthly savings of $${monthlySavings.toFixed(0)}.`,
      "Closing costs may outweigh savings; stay with current loan.",
    ),
  };
};

const buyOrRent: ComputeFn = (values) => {
  const homePrice = v(values, "homePrice", 400000);
  const downPayment = v(values, "downPayment", 80000);
  const mortgageRate = v(values, "mortgageRate", 6.5);
  const mortgageYears = v(values, "mortgageYears", 30);
  const monthlyRent = v(values, "monthlyRent", 2000);
  const rentIncrease = v(values, "rentIncreasePercent", 3);
  const appreciation = v(values, "appreciationPercent", 3);
  const years = v(values, "years", 7);

  const loanAmount = homePrice - downPayment;
  const months = mortgageYears * 12;
  const payment = mortgagePayment(loanAmount, mortgageRate, months);
  let buyCost = downPayment;
  let rentCost = 0;
  let rent = monthlyRent;
  let homeValue = homePrice;
  let balance = loanAmount;
  const r = mortgageRate / 100 / 12;

  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      const principal = payment - interest;
      balance = Math.max(balance - principal, 0);
      buyCost += payment + v(values, "annualMaintenance", 3000) / 12 + v(values, "annualPropertyTax", 5000) / 12;
    }
    homeValue *= 1 + appreciation / 100;
    rentCost += rent * 12;
    rent *= 1 + rentIncrease / 100;
  }

  const buyEquity = homeValue - balance;
  const buyNetCost = buyCost - buyEquity;

  return {
    buyNetCost,
    rentTotalCost: rentCost,
    costDifference: buyNetCost - rentCost,
    endingHomeEquity: buyEquity,
    recommendation: recommendationText(
      buyNetCost < rentCost,
      "Buying may cost less than renting over this period when equity is included.",
      "Renting may be cheaper short-term; consider how long you will stay.",
    ),
  };
};

const mortgagePoints: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 300000);
  const pointsPercent = v(values, "pointsPercent", 1);
  const rateReduction = v(values, "rateReduction", 0.25);
  const baseRate = v(values, "baseRate", 6.75);
  const months = v(values, "months", 360);

  const pointsCost = loanAmount * (pointsPercent / 100);
  const rateWithPoints = baseRate - rateReduction;
  const payBase = mortgagePayment(loanAmount, baseRate, months);
  const payPoints = mortgagePayment(loanAmount, rateWithPoints, months);
  const monthlySavings = payBase - payPoints;
  const breakEven = monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : 0;

  return {
    pointsCost,
    rateWithPoints,
    monthlySavings,
    breakEvenMonths: breakEven,
    recommendation: recommendationText(
      breakEven > 0 && breakEven < months,
      `Paying points breaks even in ${breakEven} months.`,
      "Points may not pay off if you refinance or sell before break-even.",
    ),
  };
};

// ─── Retirement ───────────────────────────────────────────────────────────────

const retirementSavingsSufficient: ComputeFn = (values) => {
  const currentSavings = v(values, "currentSavings", 150000);
  const monthlyContribution = v(values, "monthlyContribution", 500);
  const returnRate = v(values, "returnRate", 7);
  const years = v(values, "yearsToRetirement", 20);
  const desiredIncome = v(values, "desiredAnnualIncome", 60000);
  const withdrawalRate = v(values, "withdrawalRate", 4);

  const projected = futureValueMonthly(currentSavings, monthlyContribution, returnRate, years * 12);
  const neededNestEgg = desiredIncome / (withdrawalRate / 100);
  const shortfall = neededNestEgg - projected;

  return {
    projectedSavings: projected,
    neededNestEgg,
    shortfall: Math.max(shortfall, 0),
    surplus: Math.max(projected - neededNestEgg, 0),
    recommendation: recommendationText(
      projected >= neededNestEgg,
      "Projected savings meet your retirement income target.",
      `Increase savings by ~$${Math.max(shortfall / (years * 12), 0).toFixed(0)}/month to close the gap.`,
    ),
  };
};

const inflationRetirementIncome: ComputeFn = (values) => {
  const currentNeed = v(values, "currentIncomeNeed", 5000);
  const inflation = v(values, "inflationRate", 3);
  const years = v(values, "yearsToRetirement", 25);

  const futureMonthly = currentNeed * Math.pow(1 + inflation / 100, years);
  const futureAnnual = futureMonthly * 12;
  const increase = futureMonthly - currentNeed;

  return {
    futureMonthlyNeed: futureMonthly,
    futureAnnualNeed: futureAnnual,
    purchasingPowerLoss: currentNeed - currentNeed / Math.pow(1 + inflation / 100, years),
    increaseAmount: increase,
    recommendation: `Inflation could raise monthly needs to $${futureMonthly.toFixed(0)} in ${years} years.`,
  };
};

const whenStartSavingRetirement: ComputeFn = (values) => {
  const monthly = v(values, "monthlyContribution", 400);
  const returnRate = v(values, "returnRate", 7);
  const years = v(values, "yearsToRetirement", 30);
  const target = v(values, "targetAmount", 1000000);
  const delayYears = v(values, "delayYears", 5);

  const startNow = futureValueMonthly(0, monthly, returnRate, years * 12);
  const startLater = futureValueMonthly(0, monthly, returnRate, (years - delayYears) * 12);
  const costOfDelay = startNow - startLater;

  return {
    valueIfStartNow: startNow,
    valueIfStartLater: startLater,
    costOfDelay,
    recommendation: recommendationText(
      delayYears > 0,
      `Waiting ${delayYears} years could cost $${costOfDelay.toFixed(0)} in retirement savings.`,
      "Starting now maximizes compound growth over time.",
    ),
  };
};

// ─── Insurance ────────────────────────────────────────────────────────────────

const burialFinalExpenses: ComputeFn = (values) => {
  const funeral = v(values, "funeralCost", 10000);
  const medical = v(values, "medicalBills", 5000);
  const legal = v(values, "legalFees", 3000);
  const monthsToSave = v(values, "monthsToSave", 60);
  const total = funeral + medical + legal;
  const monthlySavings = monthsToSave > 0 ? total / monthsToSave : total;

  return {
    totalFinalExpenses: total,
    monthlySavingsNeeded: monthlySavings,
    recommendation: `Plan for $${total.toLocaleString()} in final expenses; save $${monthlySavings.toFixed(0)}/month.`,
  };
};

const disabilityInsuranceNeeded: ComputeFn = (values) => {
  const annualIncome = v(values, "annualIncome", 80000);
  const currentCoverage = v(values, "currentCoverage", 0);
  const monthlyExpenses = v(values, "monthlyExpenses", 4000);
  const benefitPct = v(values, "benefitPercent", 60);

  const monthlyIncome = annualIncome / 12;
  const targetBenefit = monthlyIncome * (benefitPct / 100);
  const coverageGap = Math.max(targetBenefit - currentCoverage, 0);
  const expenseCoverage = monthlyExpenses * 0.8;

  return {
    recommendedMonthlyBenefit: Math.max(targetBenefit, expenseCoverage),
    coverageGap,
    currentCoverage,
    recommendation: recommendationText(
      coverageGap > 0,
      `Consider additional disability coverage of ~$${coverageGap.toFixed(0)}/month.`,
      "Current coverage appears adequate for income replacement.",
    ),
  };
};

const futureValueAnnuityCalc: ComputeFn = (values) => {
  const payment = v(values, "monthlyPayment", 500);
  const rate = v(values, "interestRate", 5);
  const years = v(values, "years", 20);
  const fv = annuityFutureValue(payment, rate, years);
  const contributed = payment * years * 12;

  return {
    futureValue: fv,
    totalContributions: contributed,
    investmentGrowth: fv - contributed,
    recommendation: `Regular contributions could grow to $${fv.toFixed(0)} over ${years} years.`,
  };
};

const hsaVsComprehensive: ComputeFn = (values) => {
  const hdhpPremium = v(values, "hdhpPremium", 400);
  const hdhpDeductible = v(values, "hdhpDeductible", 3000);
  const hsaContribution = v(values, "employerHsaContribution", 1000);
  const compPremium = v(values, "comprehensivePremium", 550);
  const compDeductible = v(values, "comprehensiveDeductible", 500);
  const medical = v(values, "expectedMedical", 2000);

  const hdhpOutOfPocket = Math.max(medical - hsaContribution, 0) + Math.min(medical, hdhpDeductible);
  const hdhpTotal = hdhpPremium * 12 + hdhpOutOfPocket;
  const compTotal = compPremium * 12 + Math.min(medical, compDeductible) + Math.max(medical - compDeductible, 0) * 0.2;

  return {
    hdhpAnnualCost: hdhpTotal,
    comprehensiveAnnualCost: compTotal,
    savings: compTotal - hdhpTotal,
    recommendation: recommendationText(
      hdhpTotal < compTotal,
      "HDHP with HSA may cost less given expected medical expenses.",
      "Comprehensive plan may be better for higher expected medical costs.",
    ),
  };
};

const lifeInsuranceProceedsDuration: ComputeFn = (values) => {
  const deathBenefit = v(values, "deathBenefit", 500000);
  const monthlyExpenses = v(values, "monthlyExpenses", 4000);
  const returnRate = v(values, "investmentReturn", 4);
  const r = returnRate / 100 / 12;
  let balance = deathBenefit;
  let months = 0;
  while (balance > 0 && months < 600) {
    balance = balance * (1 + r) - monthlyExpenses;
    months++;
  }

  return {
    monthsProceedsLast: months,
    yearsProceedsLast: months / 12,
    recommendation: recommendationText(
      months >= 120,
      "Proceeds may support beneficiaries for 10+ years at current expenses.",
      "Consider additional coverage or expense reduction planning.",
    ),
  };
};

const lifeInsuranceNeeded: ComputeFn = (values) => {
  const annualIncome = v(values, "annualIncome", 75000);
  const yearsToReplace = v(values, "yearsToReplace", 10);
  const existing = v(values, "existingCoverage", 100000);
  const debts = v(values, "outstandingDebts", 150000);
  const finalExpenses = v(values, "finalExpenses", 15000);

  const incomeReplacement = annualIncome * yearsToReplace;
  const totalNeed = incomeReplacement + debts + finalExpenses;
  const additionalNeeded = Math.max(totalNeed - existing, 0);

  return {
    totalCoverageNeeded: totalNeed,
    additionalCoverageNeeded: additionalNeeded,
    existingCoverage: existing,
    recommendation: recommendationText(
      additionalNeeded > 0,
      `Consider $${additionalNeeded.toLocaleString()} in additional life insurance coverage.`,
      "Existing coverage meets estimated needs.",
    ),
  };
};

const retiredSavingsDuration: ComputeFn = (values) => {
  const savings = v(values, "retirementSavings", 500000);
  const withdrawal = v(values, "monthlyWithdrawal", 3000);
  const returnRate = v(values, "returnRate", 5);
  const r = returnRate / 100 / 12;
  let balance = savings;
  let months = 0;
  while (balance > 0 && months < 600) {
    balance = balance * (1 + r) - withdrawal;
    months++;
  }

  return {
    monthsSavingsLast: months,
    yearsSavingsLast: months / 12,
    recommendation: recommendationText(
      months >= 240,
      "Savings may last 20+ years at this withdrawal rate.",
      "Reduce withdrawals or delay retirement to extend savings duration.",
    ),
  };
};

const lifetimeEarnings: ComputeFn = (values) => {
  const salary = v(values, "currentSalary", 60000);
  const raise = v(values, "annualRaisePercent", 3);
  const years = v(values, "yearsWorking", 35);
  let total = 0;
  let current = salary;
  for (let y = 0; y < years; y++) {
    total += current;
    current *= 1 + raise / 100;
  }

  return {
    lifetimeEarnings: total,
    finalYearSalary: current / (1 + raise / 100),
    recommendation: `Career earnings could total $${total.toLocaleString()} over ${years} years.`,
  };
};

const longTermCareInsurance: ComputeFn = (values) => {
  const dailyCost = v(values, "dailyCost", 250);
  const yearsOfCare = v(values, "yearsOfCare", 3);
  const inflation = v(values, "inflationRate", 4);
  const yearsUntil = v(values, "yearsUntilNeed", 20);
  const existing = v(values, "existingCoverage", 100000);

  const futureDaily = dailyCost * Math.pow(1 + inflation / 100, yearsUntil);
  const totalCost = futureDaily * 365 * yearsOfCare;
  const coverageGap = Math.max(totalCost - existing, 0);

  return {
    projectedTotalCost: totalCost,
    coverageGap,
    futureDailyCost: futureDaily,
    recommendation: recommendationText(
      coverageGap > 0,
      `Potential LTC cost gap of $${coverageGap.toLocaleString()}; consider LTC insurance.`,
      "Existing coverage may offset projected long-term care costs.",
    ),
  };
};

// ─── Kids ─────────────────────────────────────────────────────────────────────

const allowanceInvestmentReturn: ComputeFn = (values) => {
  const weekly = v(values, "weeklyAllowance", 10);
  const rate = v(values, "returnRate", 7);
  const years = v(values, "years", 10);
  const monthly = weekly * 52 / 12;
  const fv = futureValueMonthly(0, monthly, rate, years * 12);

  return {
    futureValue: fv,
    totalContributions: weekly * 52 * years,
    investmentGrowth: fv - weekly * 52 * years,
    recommendation: `Investing allowance could grow to $${fv.toFixed(0)} in ${years} years.`,
  };
};

const choreValueKids: ComputeFn = (values) => {
  const hours = v(values, "hoursPerWeek", 5);
  const rate = v(values, "hourlyRate", 5);
  const weeks = v(values, "weeksPerYear", 52);
  const weekly = hours * rate;
  const annual = weekly * weeks;

  return {
    weeklyEarnings: weekly,
    annualEarnings: annual,
    recommendation: `Chores could earn $${weekly.toFixed(0)}/week or $${annual.toFixed(0)}/year.`,
  };
};

const compoundInterestKids: ComputeFn = (values) => {
  const initial = v(values, "initialDeposit", 100);
  const monthly = v(values, "monthlyContribution", 25);
  const rate = v(values, "returnRate", 7);
  const years = v(values, "years", 18);
  const fv = futureValueMonthly(initial, monthly, rate, years * 12);
  const contributed = initial + monthly * years * 12;

  return {
    futureValue: fv,
    totalContributions: contributed,
    compoundGrowth: fv - contributed,
    recommendation: "Starting early lets compound interest do most of the work.",
  };
};

const lemonadeStand: ComputeFn = (values) => {
  const cups = v(values, "cupsSold", 50);
  const price = v(values, "pricePerCup", 1);
  const cost = v(values, "costPerCup", 0.25);
  const fixed = v(values, "fixedCosts", 10);
  const revenue = cups * price;
  const variableCost = cups * cost;
  const profit = revenue - variableCost - fixed;

  return {
    revenue,
    totalCosts: variableCost + fixed,
    profit,
    profitPerCup: cups > 0 ? profit / cups : 0,
    recommendation: recommendationText(
      profit > 0,
      `Great job! Profit of $${profit.toFixed(2)} on ${cups} cups sold.`,
      "Try raising price or reducing costs to earn a profit.",
    ),
  };
};

const pennyDoubles: ComputeFn = (values) => {
  const days = v(values, "days", 30);
  const alternative = v(values, "alternativeAmount", 1000000);
  const pennyValue = 0.01 * Math.pow(2, days);
  const difference = pennyValue - alternative;

  return {
    pennyDoublesValue: pennyValue,
    alternativeAmount: alternative,
    difference,
    recommendation: recommendationText(
      pennyValue > alternative,
      `The doubling penny wins at $${pennyValue.toLocaleString()} after ${days} days!`,
      `$${alternative.toLocaleString()} is more than the doubling penny over ${days} days.`,
    ),
  };
};

// ─── Investment ───────────────────────────────────────────────────────────────

const assetAllocation: ComputeFn = (values) => {
  const total = v(values, "totalPortfolio", 100000);
  const stocksPct = v(values, "stocksPercent", 60);
  const bondsPct = v(values, "bondsPercent", 30);
  const cashPct = v(values, "cashPercent", 10);
  return {
    stocksValue: total * (stocksPct / 100),
    bondsValue: total * (bondsPct / 100),
    cashValue: total * (cashPct / 100),
    recommendation: `Portfolio: ${stocksPct}% stocks, ${bondsPct}% bonds, ${cashPct}% cash.`,
  };
};

const dividendReinvestment: ComputeFn = (values) => {
  const initial = v(values, "initialInvestment", 10000);
  const yieldPct = v(values, "dividendYield", 3);
  const returnRate = v(values, "returnRate", 7);
  const years = v(values, "years", 20);
  let balance = initial;
  for (let y = 0; y < years; y++) {
    const dividends = balance * (yieldPct / 100);
    balance = (balance + dividends) * (1 + (returnRate - yieldPct) / 100);
  }
  const noReinvest = futureValueAnnual(initial, 0, returnRate, years);
  return {
    valueWithReinvestment: balance,
    valueWithoutReinvestment: noReinvest,
    reinvestmentBenefit: balance - noReinvest,
    recommendation: "Reinvesting dividends accelerates long-term compound growth.",
  };
};

const employeeStockOptions: ComputeFn = (values) => {
  const options = v(values, "numOptions", 1000);
  const strike = v(values, "strikePrice", 10);
  const current = v(values, "currentPrice", 25);
  const intrinsic = Math.max(current - strike, 0) * options;
  return {
    intrinsicValue: intrinsic,
    valuePerOption: Math.max(current - strike, 0),
    recommendation: recommendationText(
      current > strike,
      `Options are in-the-money with intrinsic value of $${intrinsic.toLocaleString()}.`,
      "Options are out-of-the-money at current price.",
    ),
  };
};

const investOrPayDebt: ComputeFn = (values) => {
  const debtBalance = v(values, "debtBalance", 10000);
  const debtRate = v(values, "debtRate", 18);
  const investReturn = v(values, "investmentReturn", 8);
  const extraPayment = v(values, "extraPayment", 200);
  const months = v(values, "months", 60);

  const debtResult = amortizationWithExtra(debtBalance, debtRate, loanPayment(debtBalance, debtRate, months), extraPayment);
  const investFv = futureValueMonthly(0, extraPayment, investReturn, months);
  const debtInterestSaved = debtResult.interestSaved;
  const netBenefitDebt = debtInterestSaved;
  const netBenefitInvest = investFv - extraPayment * months;

  return {
    debtInterestSaved,
    investmentFutureValue: investFv,
    netBenefitPayDebt: netBenefitDebt,
    netBenefitInvest: netBenefitInvest,
    recommendation: recommendationText(
      debtRate > investReturn,
      "Paying high-interest debt likely beats investing after-tax returns.",
      "Investing may outperform this debt rate; consider a balanced approach.",
    ),
  };
};

const lumpSumVsDca: ComputeFn = (values) => {
  const lumpSum = v(values, "lumpSum", 50000);
  const monthlyDca = v(values, "monthlyDCA", 5000);
  const months = v(values, "months", 10);
  const returnRate = v(values, "returnRate", 8);

  const lumpFv = lumpSum * Math.pow(1 + returnRate / 100, months / 12);
  const dcaFv = futureValueMonthly(0, monthlyDca, returnRate, months);
  return {
    lumpSumFutureValue: lumpFv,
    dcaFutureValue: dcaFv,
    difference: lumpFv - dcaFv,
    recommendation: recommendationText(
      lumpFv > dcaFv,
      "Lump-sum investing typically outperforms DCA in rising markets.",
      "DCA may reduce timing risk when markets are volatile.",
    ),
  };
};

const percentageChange: ComputeFn = (values) => {
  const oldVal = v(values, "oldValue", 100);
  const newVal = v(values, "newValue", 125);
  const change = percentChange(oldVal, newVal);
  return {
    percentChange: change,
    absoluteChange: newVal - oldVal,
    recommendation: `${change >= 0 ? "Increase" : "Decrease"} of ${Math.abs(change).toFixed(2)}% from prior value.`,
  };
};

const portfolioRebalancing: ComputeFn = (values) => {
  const total = v(values, "totalValue", 200000);
  const curStocks = v(values, "currentStocksPercent", 70);
  const tgtStocks = v(values, "targetStocksPercent", 60);
  const curBonds = v(values, "currentBondsPercent", 20);
  const tgtBonds = v(values, "targetBondsPercent", 30);

  const stocksValue = total * (curStocks / 100);
  const bondsValue = total * (curBonds / 100);
  const targetStocks = total * (tgtStocks / 100);
  const targetBonds = total * (tgtBonds / 100);
  const sellStocks = Math.max(stocksValue - targetStocks, 0);
  const buyBonds = Math.max(targetBonds - bondsValue, 0);

  return {
    stocksAdjustment: targetStocks - stocksValue,
    bondsAdjustment: targetBonds - bondsValue,
    sellStocksAmount: sellStocks,
    buyBondsAmount: buyBonds,
    recommendation: recommendationText(
      Math.abs(curStocks - tgtStocks) > 5,
      "Rebalance by shifting allocation back to target weights.",
      "Portfolio is close to target allocation.",
    ),
  };
};

const rothVsTraditionalIra: ComputeFn = (values) => {
  const contribution = v(values, "annualContribution", 7000);
  const years = v(values, "years", 25);
  const returnRate = v(values, "returnRate", 7);
  const taxNow = v(values, "marginalTaxNow", 22);
  const taxRetire = v(values, "marginalTaxRetirement", 15);

  const traditionalFv = futureValueAnnual(0, contribution, returnRate, years);
  const traditionalAfterTax = traditionalFv * (1 - taxRetire / 100);
  const rothContribution = contribution * (1 - taxNow / 100);
  const rothFv = futureValueAnnual(0, rothContribution, returnRate, years);

  return {
    traditionalAfterTax,
    rothAfterTax: rothFv,
    advantage: rothFv - traditionalAfterTax,
    recommendation: recommendationText(
      rothFv > traditionalAfterTax,
      "Roth IRA may provide higher after-tax value at retirement.",
      "Traditional IRA may be better if you expect a lower tax bracket in retirement.",
    ),
  };
};

const exerciseStockOptions: ComputeFn = (values) => {
  const options = v(values, "numOptions", 500);
  const strike = v(values, "strikePrice", 15);
  const current = v(values, "currentPrice", 30);
  const growth = v(values, "expectedGrowth", 8);
  const years = v(values, "yearsToHold", 3);

  const exerciseNow = Math.max(current - strike, 0) * options;
  const futurePrice = current * Math.pow(1 + growth / 100, years);
  const holdValue = Math.max(futurePrice - strike, 0) * options;
  const exerciseCost = (current - strike) * options;

  return {
    valueIfExerciseNow: exerciseNow,
    projectedValueIfHold: holdValue,
    exerciseCost,
    recommendation: recommendationText(
      holdValue > exerciseNow,
      "Holding options may yield higher value if growth expectations are met.",
      "Exercising now locks in gains and reduces option risk.",
    ),
  };
};

// ─── Loans ────────────────────────────────────────────────────────────────────

const aprVsInterestRate: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 20000);
  const interestRate = v(values, "interestRate", 6);
  const fees = v(values, "fees", 500);
  const months = v(values, "months", 60);
  const payment = loanPayment(loanAmount, interestRate, months);
  const totalCost = payment * months + fees;
  const effectiveApr = solveApr(loanAmount - fees, payment, months);

  return {
    monthlyPayment: payment,
    statedRate: interestRate,
    effectiveApr,
    totalCost,
    recommendation: `APR of ${effectiveApr.toFixed(2)}% includes fees vs. stated rate of ${interestRate}%.`,
  };
};

function solveApr(principal: number, payment: number, months: number): number {
  if (principal <= 0 || payment <= 0) return 0;
  let low = 0;
  let high = 100;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const testPayment = loanPayment(principal, mid, months);
    if (testPayment > payment) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

const balloonPayment: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 30000);
  const rate = v(values, "interestRate", 6);
  const months = v(values, "months", 60);
  const balloonPct = v(values, "balloonPercent", 30);
  const balloon = loanAmount * (balloonPct / 100);
  const amortAmount = loanAmount - balloon;
  const monthlyPayment = loanPayment(amortAmount, rate, months);

  return {
    monthlyPayment,
    balloonPayment: balloon,
    totalPaid: monthlyPayment * months + balloon,
    recommendation: "Ensure you can refinance or pay the balloon at term end.",
  };
};

const loanSimulator: ComputeFn = (values) => {
  const balance = v(values, "loanAmount", 25000);
  const rate = v(values, "interestRate", 7);
  const months = v(values, "months", 60);
  const payment = v(values, "monthlyPayment") || loanPayment(balance, rate, months);
  const extra = v(values, "extraPayment", 0);
  const result = totalInterestPaid(balance, rate, payment, extra);

  return {
    monthlyPayment: payment + extra,
    monthsToPayoff: result.months,
    totalInterest: result.totalInterest,
    totalPaid: result.totalPaid,
    recommendation: recommendationText(
      extra > 0,
      `Extra payments reduce total interest to $${result.totalInterest.toFixed(0)}.`,
      "Add extra principal payments to shorten the loan term.",
    ),
  };
};

const debtConsolidation: ComputeFn = (values) => {
  const bal1 = v(values, "debt1Balance", 8000);
  const rate1 = v(values, "debt1Rate", 22);
  const bal2 = v(values, "debt2Balance", 5000);
  const rate2 = v(values, "debt2Rate", 18);
  const consRate = v(values, "consolidatedRate", 12);
  const months = v(values, "consolidatedMonths", 48);

  const totalBalance = bal1 + bal2;
  const currentPay1 = loanPayment(bal1, rate1, months);
  const currentPay2 = loanPayment(bal2, rate2, months);
  const currentInterest = totalInterestPaid(bal1, rate1, currentPay1).totalInterest +
    totalInterestPaid(bal2, rate2, currentPay2).totalInterest;
  const consPayment = loanPayment(totalBalance, consRate, months);
  const consInterest = totalInterestPaid(totalBalance, consRate, consPayment).totalInterest;

  return {
    currentTotalPayment: currentPay1 + currentPay2,
    consolidatedPayment: consPayment,
    currentTotalInterest: currentInterest,
    consolidatedTotalInterest: consInterest,
    interestSavings: currentInterest - consInterest,
    recommendation: recommendationText(
      consInterest < currentInterest,
      "Consolidation may lower total interest and simplify payments.",
      "Current debts may cost less than a consolidated loan.",
    ),
  };
};

const studentLoanRepayment: ComputeFn = (values) => {
  const loanAmount = v(values, "loanAmount", 35000);
  const rate = v(values, "interestRate", 5.5);
  const years = v(values, "repaymentYears", 10);
  const months = years * 12;
  const payment = loanPayment(loanAmount, rate, months);
  const result = totalInterestPaid(loanAmount, rate, payment);

  return {
    monthlyPayment: payment,
    totalInterest: result.totalInterest,
    totalPaid: result.totalPaid,
    recommendation: `Standard ${years}-year repayment: $${payment.toFixed(0)}/month.`,
  };
};

// ─── Paycheck ───────────────────────────────────────────────────────────────────

const fourOhOneKContributionImpact: ComputeFn = (values) => {
  const grossPay = v(values, "grossPay", 5000);
  const contributionPct = v(values, "contributionPercent", 6);
  const marginalTax = v(values, "marginalTaxRate", 22);
  const contribution = grossPay * (contributionPct / 100);
  const taxSavings = contribution * (marginalTax / 100);
  const netPayReduction = contribution - taxSavings;

  return {
    contributionAmount: contribution,
    taxSavings,
    netPayReduction,
    recommendation: `401(k) contribution reduces take-home by ~$${netPayReduction.toFixed(0)} after tax savings.`,
  };
};

const garnishment: ComputeFn = (values) => {
  const grossPay = v(values, "grossPay", 4000);
  const garnishmentAmt = v(values, "garnishmentAmount", 500);
  const maxPct = v(values, "maxGarnishmentPercent", 25);
  const maxAllowed = grossPay * (maxPct / 100);
  const actualGarnishment = Math.min(garnishmentAmt, maxAllowed);
  const netAfterGarnishment = grossPay - actualGarnishment;

  return {
    maxAllowedGarnishment: maxAllowed,
    actualGarnishment,
    netAfterGarnishment,
    recommendation: recommendationText(
      garnishmentAmt <= maxAllowed,
      "Garnishment is within federal disposable income limits.",
      `Garnishment capped at $${maxAllowed.toFixed(0)} (${maxPct}% of gross).`,
    ),
  };
};

const hourlyToSalary: ComputeFn = (values) => {
  const hourly = v(values, "hourlyWage", 25);
  const hours = v(values, "hoursPerWeek", 40);
  const weeks = v(values, "weeksPerYear", 52);
  const annual = hourly * hours * weeks;
  const monthly = annual / 12;

  return {
    annualSalary: annual,
    monthlySalary: monthly,
    weeklyPay: hourly * hours,
    recommendation: `$${hourly.toFixed(2)}/hr equals $${annual.toLocaleString()} per year.`,
  };
};

const overtimePay: ComputeFn = (values) => {
  const hourly = v(values, "hourlyRate", 20);
  const otHours = v(values, "overtimeHours", 10);
  const multiplier = v(values, "overtimeMultiplier", 1.5);
  const regularHours = v(values, "regularHours", 40);
  const regularPay = hourly * regularHours;
  const otPay = hourly * multiplier * otHours;
  const totalPay = regularPay + otPay;

  return {
    regularPay,
    overtimePay: otPay,
    totalPay,
    recommendation: `${otHours} overtime hours add $${otPay.toFixed(0)} to this period's pay.`,
  };
};

const paycheckComparison: ComputeFn = (values) => {
  const salary1 = v(values, "salary1", 75000);
  const salary2 = v(values, "salary2", 82000);
  const taxRate1 = v(values, "taxRate1", 22);
  const taxRate2 = v(values, "taxRate2", 24);
  const net1 = salary1 * (1 - taxRate1 / 100);
  const net2 = salary2 * (1 - taxRate2 / 100);

  return {
    netPay1: net1,
    netPay2: net2,
    difference: net2 - net1,
    recommendation: recommendationText(
      net2 > net1,
      `Job 2 nets $${(net2 - net1).toFixed(0)} more annually after estimated taxes.`,
      "Job 1 may net more after taxes despite lower gross salary.",
    ),
  };
};

const payFrequencyImpact: ComputeFn = (values) => {
  const annualSalary = v(values, "annualSalary", 60000);
  const taxRate = v(values, "taxRate", 22);
  const frequencies: PayFrequency[] = ["weekly", "biweekly", "semimonthly", "monthly"];
  const perPeriod = Object.fromEntries(
    frequencies.map((f) => [f, (annualSalary / PAY_PERIODS[f]) * (1 - taxRate / 100)]),
  );

  return {
    weeklyNet: perPeriod.weekly,
    biweeklyNet: perPeriod.biweekly,
    semimonthlyNet: perPeriod.semimonthly,
    monthlyNet: perPeriod.monthly,
    recommendation: "Annual salary is the same; pay frequency affects cash flow timing only.",
  };
};

// ─── Real Estate ────────────────────────────────────────────────────────────────

const fixAndFlip: ComputeFn = (values) => {
  const purchase = v(values, "purchasePrice", 200000);
  const rehab = v(values, "rehabCost", 40000);
  const holding = v(values, "holdingCosts", 8000);
  const sale = v(values, "salePrice", 320000);
  const selling = v(values, "sellingCosts", 19200);
  const totalCost = purchase + rehab + holding + selling;
  const profit = sale - totalCost;
  const roiPct = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  return {
    totalInvestment: totalCost,
    netProfit: profit,
    roi: roiPct,
    recommendation: recommendationText(
      profit > 0,
      `Projected profit of $${profit.toLocaleString()} (${roiPct.toFixed(1)}% ROI).`,
      "Review purchase price, rehab budget, or ARV assumptions.",
    ),
  };
};

const grossRentMultiplier: ComputeFn = (values) => {
  const price = v(values, "propertyPrice", 300000);
  const rent = v(values, "monthlyRent", 2000);
  const annualRent = rent * 12;
  const grm = annualRent > 0 ? price / annualRent : 0;

  return {
    grossRentMultiplier: grm,
    annualGrossRent: annualRent,
    recommendation: recommendationText(
      grm < 10,
      "GRM below 10 may indicate strong rental income relative to price.",
      "Higher GRM suggests lower rental yield; verify operating expenses.",
    ),
  };
};

const landValue: ComputeFn = (values) => {
  const total = v(values, "totalPropertyValue", 400000);
  const landPct = v(values, "landPercent", 25);
  const landValue = total * (landPct / 100);
  const improvementValue = total - landValue;

  return {
    landValue,
    improvementValue,
    landPercent: landPct,
    recommendation: "Land is typically not depreciable; improvements may be depreciated for rentals.",
  };
};

const realEstateCapRate: ComputeFn = (values) => {
  const noi = v(values, "netOperatingIncome", 24000);
  const value = v(values, "propertyValue", 350000);
  const capRate = value > 0 ? (noi / value) * 100 : 0;

  return {
    capRate,
    netOperatingIncome: noi,
    recommendation: recommendationText(
      capRate >= 6,
      "Cap rate meets or exceeds typical investment property benchmarks.",
      "Cap rate is low; verify NOI and compare to market rates.",
    ),
  };
};

const realEstateCommission: ComputeFn = (values) => {
  const salePrice = v(values, "salePrice", 450000);
  const commissionPct = v(values, "commissionPercent", 6);
  const commission = salePrice * (commissionPct / 100);
  const netProceeds = salePrice - commission;

  return {
    totalCommission: commission,
    sellerAgentShare: commission / 2,
    netProceeds,
    recommendation: `Estimated commission: $${commission.toLocaleString()} (${commissionPct}% of sale price).`,
  };
};

const rentalProperty: ComputeFn = (values) => {
  const price = v(values, "purchasePrice", 300000);
  const down = v(values, "downPayment", 60000);
  const rate = v(values, "loanRate", 7);
  const years = v(values, "loanYears", 30);
  const rent = v(values, "monthlyRent", 2200);
  const expenses = v(values, "monthlyExpenses", 400);
  const vacancy = v(values, "vacancyRate", 5);

  const loanAmount = price - down;
  const payment = mortgagePayment(loanAmount, rate, years * 12);
  const effectiveRent = rent * (1 - vacancy / 100);
  const monthlyCashFlow = effectiveRent - expenses - payment;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashInvested = down + v(values, "closingCosts", 6000);
  const cashOnCash = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;

  return {
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn: cashOnCash,
    recommendation: recommendationText(
      monthlyCashFlow > 0,
      "Positive cash flow after debt service and expenses.",
      "Negative cash flow; review rent, expenses, or financing terms.",
    ),
  };
};

// ─── Savings ────────────────────────────────────────────────────────────────────

const becomingMillionaire: ComputeFn = (values) => {
  const current = v(values, "currentSavings", 50000);
  const monthly = v(values, "monthlyContribution", 1000);
  const rate = v(values, "returnRate", 8);
  const goal = v(values, "goalAmount", 1000000);
  const years = yearsToGoal(current, monthly, rate, goal);

  return {
    yearsToGoal: years,
    goalAmount: goal,
    recommendation: recommendationText(
      years < 40,
      `Reach $1M in ~${years} years with current savings and contributions.`,
      "Increase contributions or expected return to reach goal sooner.",
    ),
  };
};

const cdCalculator: ComputeFn = (values) => {
  const deposit = v(values, "deposit", 10000);
  const rate = v(values, "interestRate", 4.5);
  const months = v(values, "months", 12);
  const r = rate / 100 / 12;
  const maturity = r === 0 ? deposit : deposit * Math.pow(1 + r, months);
  const interest = maturity - deposit;

  return {
    maturityValue: maturity,
    interestEarned: interest,
    recommendation: `CD matures at $${maturity.toFixed(2)} after ${months} months.`,
  };
};

const collegeSavings: ComputeFn = (values) => {
  const current = v(values, "currentSavings", 5000);
  const monthly = v(values, "monthlyContribution", 200);
  const rate = v(values, "returnRate", 6);
  const years = v(values, "years", 15);
  const target = v(values, "targetAmount", 100000);
  const projected = futureValueMonthly(current, monthly, rate, years * 12);
  const shortfall = Math.max(target - projected, 0);

  return {
    projectedSavings: projected,
    targetAmount: target,
    shortfall,
    recommendation: recommendationText(
      projected >= target,
      "On track to meet college savings goal.",
      `Increase savings by ~$${(shortfall / (years * 12)).toFixed(0)}/month to reach target.`,
    ),
  };
};

const compareSavingsRates: ComputeFn = (values) => {
  const initial = v(values, "initialDeposit", 25000);
  const rate1 = v(values, "rate1", 3);
  const rate2 = v(values, "rate2", 4.5);
  const years = v(values, "years", 5);
  const balance1 = futureValueAnnual(initial, 0, rate1, years);
  const balance2 = futureValueAnnual(initial, 0, rate2, years);

  return {
    balanceAtRate1: balance1,
    balanceAtRate2: balance2,
    difference: balance2 - balance1,
    recommendation: `Higher rate earns $${(balance2 - balance1).toFixed(0)} more over ${years} years.`,
  };
};

const householdBudget: ComputeFn = (values) => {
  const income = v(values, "monthlyIncome", 6000);
  const housing = v(values, "housing", 1800);
  const transport = v(values, "transportation", 600);
  const food = v(values, "food", 500);
  const utilities = v(values, "utilities", 250);
  const other = v(values, "otherExpenses", 400);
  const expenses = housing + transport + food + utilities + other;
  const surplus = income - expenses;

  return {
    totalExpenses: expenses,
    monthlySurplus: surplus,
    savingsRate: income > 0 ? (surplus / income) * 100 : 0,
    recommendation: recommendationText(
      surplus >= 0,
      `Monthly surplus of $${surplus.toFixed(0)} available for savings or debt payoff.`,
      "Expenses exceed income; review budget categories.",
    ),
  };
};

const impactDelayingSavings: ComputeFn = (values) => {
  const monthly = v(values, "monthlyContribution", 500);
  const rate = v(values, "returnRate", 7);
  const years = v(values, "years", 30);
  const delay = v(values, "delayYears", 5);
  const startNow = futureValueMonthly(0, monthly, rate, years * 12);
  const startLater = futureValueMonthly(0, monthly, rate, (years - delay) * 12);

  return {
    valueIfStartNow: startNow,
    valueIfDelayed: startLater,
    costOfDelay: startNow - startLater,
    recommendation: `Delaying ${delay} years could cost $${(startNow - startLater).toFixed(0)} in future savings.`,
  };
};

const fixedDepositReturns: ComputeFn = (values) => {
  const principal = v(values, "principal", 50000);
  const rate = v(values, "interestRate", 5);
  const years = v(values, "years", 3);
  const maturity = principal * Math.pow(1 + rate / 100, years);
  const interest = maturity - principal;

  return {
    maturityAmount: maturity,
    interestEarned: interest,
    recommendation: `Fixed deposit grows to $${maturity.toFixed(0)} over ${years} years.`,
  };
};

const ruleOf72: ComputeFn = (values) => {
  const rate = v(values, "interestRate", 7);
  const years = ruleOf72Years(rate);
  return {
    yearsToDouble: years,
    interestRate: rate,
    recommendation: `At ${rate}%, your money doubles in about ${years.toFixed(1)} years.`,
  };
};

const simpleSavings: ComputeFn = (values) => {
  const initial = v(values, "initialDeposit", 1000);
  const monthly = v(values, "monthlyContribution", 200);
  const rate = v(values, "interestRate", 4);
  const years = v(values, "years", 10);
  const fv = futureValueMonthly(initial, monthly, rate, years * 12);
  const contributed = initial + monthly * years * 12;

  return {
    futureValue: fv,
    totalContributions: contributed,
    interestEarned: fv - contributed,
    recommendation: `Balance grows to $${fv.toFixed(0)} over ${years} years.`,
  };
};

const inflationCalculator: ComputeFn = (values) => {
  const amount = v(values, "currentAmount", 100000);
  const inflation = v(values, "inflationRate", 3);
  const years = v(values, "years", 10);
  const futureValue = amount / Math.pow(1 + inflation / 100, years);
  const purchasingPowerLost = amount - futureValue;

  return {
    futurePurchasingPower: futureValue,
    purchasingPowerLost,
    equivalentToday: futureValue,
    recommendation: `$${amount.toLocaleString()} today equals ~$${futureValue.toFixed(0)} in purchasing power after ${years} years.`,
  };
};

const savingsGrowth: ComputeFn = (values) => {
  const current = v(values, "currentSavings", 25000);
  const monthly = v(values, "monthlyContribution", 300);
  const rate = v(values, "returnRate", 6);
  const years = v(values, "years", 15);
  const fv = futureValueMonthly(current, monthly, rate, years * 12);

  return {
    futureValue: fv,
    totalContributions: current + monthly * years * 12,
    investmentGrowth: fv - current - monthly * years * 12,
    recommendation: `Savings could grow to $${fv.toFixed(0)} in ${years} years.`,
  };
};

// ─── Tax ────────────────────────────────────────────────────────────────────────

const socialSecurityTaxable: ComputeFn = (values) => {
  const ssBenefits = v(values, "ssBenefits", 24000);
  const otherIncome = v(values, "otherIncome", 30000);
  const taxExempt = v(values, "taxExemptInterest", 0);
  const married = filingStatus(values) === "married_joint";
  const result = socialSecurityTaxableAmount(ssBenefits, otherIncome, taxExempt, married);

  return {
    provisionalIncome: otherIncome + taxExempt + ssBenefits * 0.5,
    taxableBenefits: result.taxableAmount,
    taxablePercent: result.taxablePercent,
    recommendation: recommendationText(
      result.taxableAmount > 0,
      `${result.taxablePercent.toFixed(0)}% of Social Security benefits may be taxable.`,
      "Social Security benefits may not be taxable at this income level.",
    ),
  };
};

const earnedIncomeCredit: ComputeFn = (values) => {
  const earnedIncome = v(values, "earnedIncome", 25000);
  const children = v(values, "qualifyingChildren", 1);
  const credit = earnedIncomeCreditApprox(earnedIncome, children);

  return {
    estimatedEic: credit,
    earnedIncome,
    qualifyingChildren: children,
    recommendation: recommendationText(
      credit > 0,
      `Estimated EIC: $${credit.toFixed(0)} for ${children} qualifying child(ren).`,
      "Earned income may be outside EIC eligibility range.",
    ),
  };
};

const taxSavingsInterest: ComputeFn = (values) => {
  const interestPaid = v(values, "interestPaid", 12000);
  const marginalTax = v(values, "marginalTaxRate", 24);
  const taxSavings = interestPaid * (marginalTax / 100);

  return {
    taxSavings,
    afterTaxInterestCost: interestPaid - taxSavings,
    recommendation: `Deductible interest saves ~$${taxSavings.toFixed(0)} at ${marginalTax}% marginal rate.`,
  };
};

const taxableEquivalentYieldCalc: ComputeFn = (values) => {
  const taxFree = v(values, "taxFreeYield", 3);
  const marginalTax = v(values, "marginalTaxRate", 24);
  const equivalent = taxableEquivalentYield(taxFree, marginalTax);

  return {
    taxableEquivalentYield: equivalent,
    taxFreeYield: taxFree,
    recommendation: `A ${taxFree}% tax-free yield equals ${equivalent.toFixed(2)}% taxable at ${marginalTax}% bracket.`,
  };
};

// ─── Young Adults ───────────────────────────────────────────────────────────────

const careerPathAffordability: ComputeFn = (values) => {
  const educationCost = v(values, "educationCost", 80000);
  const startingSalary = v(values, "startingSalary", 55000);
  const livingExpenses = v(values, "annualLivingExpenses", 35000);
  const surplus = startingSalary - livingExpenses;
  const yearsToBreakEven = surplus > 0 ? educationCost / surplus : Infinity;

  return {
    firstYearSurplus: surplus,
    yearsToBreakEven: Number.isFinite(yearsToBreakEven) ? yearsToBreakEven : 0,
    recommendation: recommendationText(
      surplus > 0 && yearsToBreakEven < 10,
      "Career path may recoup education costs within a reasonable timeframe.",
      "Starting salary may not cover living expenses and education debt comfortably.",
    ),
  };
};

const collegeBudget: ComputeFn = (values) => {
  const income = v(values, "monthlyIncome", 800);
  const tuition = v(values, "tuitionShare", 0);
  const housing = v(values, "housing", 600);
  const food = v(values, "food", 250);
  const books = v(values, "books", 50);
  const other = v(values, "otherExpenses", 100);
  const expenses = tuition + housing + food + books + other;
  const surplus = income - expenses;

  return {
    totalExpenses: expenses,
    monthlySurplus: surplus,
    recommendation: recommendationText(
      surplus >= 0,
      "Budget balances with room for savings or discretionary spending.",
      "Reduce expenses or increase income to balance your college budget.",
    ),
  };
};

const campusVsHome: ComputeFn = (values) => {
  const campusHousing = v(values, "campusHousing", 8000);
  const mealPlan = v(values, "mealPlan", 5000);
  const commuting = v(values, "commutingCost", 2000);
  const homeFood = v(values, "homeFoodCost", 3000);
  const years = v(values, "years", 4);
  const campusTotal = (campusHousing + mealPlan) * years;
  const homeTotal = (commuting + homeFood) * years;

  return {
    campusTotalCost: campusTotal,
    homeTotalCost: homeTotal,
    savings: campusTotal - homeTotal,
    recommendation: recommendationText(
      homeTotal < campusTotal,
      `Living at home may save $${(campusTotal - homeTotal).toLocaleString()} over ${years} years.`,
      "Campus living may be comparable or cheaper when factoring in commute and meals.",
    ),
  };
};

const studentLoanExtraPayment: ComputeFn = (values) => {
  const balance = v(values, "loanBalance", 28000);
  const rate = v(values, "interestRate", 5.5);
  const payment = v(values, "monthlyPayment", 300);
  const extra = v(values, "extraPayment", 100);
  const result = amortizationWithExtra(balance, rate, payment, extra);

  return {
    monthsSaved: result.monthsSaved,
    interestSaved: result.interestSaved,
    recommendation: `Extra $${extra}/month saves $${result.interestSaved.toFixed(0)} and ${result.monthsSaved} months.`,
  };
};

const summerJobTax: ComputeFn = (values) => {
  const gross = v(values, "grossEarnings", 4000);
  const withholding = v(values, "withholdingPercent", 10);
  const withheld = gross * (withholding / 100);
  const taxable = Math.max(gross - STANDARD_DEDUCTION.single, 0);
  const tax = calculateProgressiveTax(taxable, "single");
  const refund = withheld - tax;

  return {
    federalTax: tax,
    amountWithheld: withheld,
    estimatedRefund: Math.max(refund, 0),
    estimatedOwed: Math.max(-refund, 0),
    recommendation: recommendationText(
      refund >= 0,
      "Withholding may cover estimated federal tax on summer earnings.",
      "You may owe additional tax beyond withholding.",
    ),
  };
};

const collegeEducationValue: ComputeFn = (values) => {
  const degreeEarnings = v(values, "degreeAnnualEarnings", 65000);
  const noDegreeEarnings = v(values, "noDegreeAnnualEarnings", 38000);
  const years = v(values, "yearsWorking", 40);
  const educationCost = v(values, "educationCost", 100000);
  const lifetimeWithDegree = degreeEarnings * years;
  const lifetimeWithout = noDegreeEarnings * years;
  const earningsPremium = lifetimeWithDegree - lifetimeWithout - educationCost;

  return {
    lifetimeEarningsWithDegree: lifetimeWithDegree,
    lifetimeEarningsWithoutDegree: lifetimeWithout,
    netEarningsPremium: earningsPremium,
    recommendation: recommendationText(
      earningsPremium > 0,
      `College degree may add $${earningsPremium.toLocaleString()} in lifetime earnings net of cost.`,
      "Lifetime earnings premium may not exceed education cost with these assumptions.",
    ),
  };
};

// ─── Export ─────────────────────────────────────────────────────────────────────

export const computeFunctions: Record<string, ComputeFn> = {
  "accelerated-payoff-auto": acceleratedPayoffAuto,
  "car-depreciation": carDepreciation,
  "ev-savings": evSavings,
  "car-affordability": carAffordability,
  "car-payments": carPayments,
  "lease-or-buy-car": leaseOrBuyCar,
  "auto-loan-ltv": autoLoanLtv,
  "loan-vs-dealer-financing": loanVsDealerFinancing,
  "business-valuation": businessValuation,
  "debt-to-equity": debtToEquity,
  "cash-flow-projection": cashFlowProjection,
  cagr: cagrCalc,
  "freelancer-rate": freelancerRate,
  "net-profit-margin": netProfitMargin,
  roi,
  "buy-now-vs-wait": buyNowVsWait,
  "credit-card-balance-transfer": creditCardBalanceTransfer,
  "credit-card-cash-advance": creditCardCashAdvance,
  "credit-card-minimum-payment": creditCardMinimumPayment,
  "credit-card-payoff": creditCardPayoff,
  "credit-card-rewards": creditCardRewards,
  "extra-debt-payments": extraDebtPayments,
  "closing-costs-impact": closingCostsImpact,
  "home-affordability": homeAffordability,
  "interest-only-vs-traditional": interestOnlyVsTraditional,
  "mortgage-refinance": mortgageRefinance,
  "buy-or-rent": buyOrRent,
  "mortgage-points": mortgagePoints,
  "retirement-savings-sufficient": retirementSavingsSufficient,
  "inflation-retirement-income": inflationRetirementIncome,
  "when-start-saving-retirement": whenStartSavingRetirement,
  "burial-final-expenses": burialFinalExpenses,
  "disability-insurance-needed": disabilityInsuranceNeeded,
  "future-value-annuity": futureValueAnnuityCalc,
  "hsa-vs-comprehensive": hsaVsComprehensive,
  "life-insurance-proceeds-duration": lifeInsuranceProceedsDuration,
  "life-insurance-needed": lifeInsuranceNeeded,
  "retired-savings-duration": retiredSavingsDuration,
  "lifetime-earnings": lifetimeEarnings,
  "long-term-care-insurance": longTermCareInsurance,
  "allowance-investment-return": allowanceInvestmentReturn,
  "chore-value-kids": choreValueKids,
  "compound-interest-kids": compoundInterestKids,
  "lemonade-stand": lemonadeStand,
  "penny-doubles": pennyDoubles,
  "asset-allocation": assetAllocation,
  "dividend-reinvestment": dividendReinvestment,
  "employee-stock-options": employeeStockOptions,
  "invest-or-pay-debt": investOrPayDebt,
  "lump-sum-vs-dca": lumpSumVsDca,
  "percentage-change": percentageChange,
  "portfolio-rebalancing": portfolioRebalancing,
  "roth-vs-traditional-ira": rothVsTraditionalIra,
  "exercise-stock-options": exerciseStockOptions,
  "apr-vs-interest-rate": aprVsInterestRate,
  "balloon-payment": balloonPayment,
  "loan-simulator": loanSimulator,
  "debt-consolidation": debtConsolidation,
  "student-loan-repayment": studentLoanRepayment,
  "401k-contribution-impact": fourOhOneKContributionImpact,
  garnishment,
  "hourly-to-salary": hourlyToSalary,
  "overtime-pay": overtimePay,
  "paycheck-comparison": paycheckComparison,
  "pay-frequency-impact": payFrequencyImpact,
  "fix-and-flip": fixAndFlip,
  "gross-rent-multiplier": grossRentMultiplier,
  "land-value": landValue,
  "real-estate-cap-rate": realEstateCapRate,
  "real-estate-commission": realEstateCommission,
  "rental-property": rentalProperty,
  "becoming-millionaire": becomingMillionaire,
  "cd-calculator": cdCalculator,
  "college-savings": collegeSavings,
  "compare-savings-rates": compareSavingsRates,
  "household-budget": householdBudget,
  "impact-delaying-savings": impactDelayingSavings,
  "fixed-deposit-returns": fixedDepositReturns,
  "rule-of-72": ruleOf72,
  "simple-savings": simpleSavings,
  "inflation-calculator": inflationCalculator,
  "savings-growth": savingsGrowth,
  "social-security-taxable": socialSecurityTaxable,
  "earned-income-credit": earnedIncomeCredit,
  "tax-savings-interest": taxSavingsInterest,
  "taxable-equivalent-yield": taxableEquivalentYieldCalc,
  "career-path-affordability": careerPathAffordability,
  "college-budget": collegeBudget,
  "campus-vs-home": campusVsHome,
  "student-loan-extra-payment": studentLoanExtraPayment,
  "summer-job-tax": summerJobTax,
  "college-education-value": collegeEducationValue,
};
