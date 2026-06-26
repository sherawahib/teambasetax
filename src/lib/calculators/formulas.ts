import {
  CHILD_TAX_CREDIT,
  LTCG_BRACKETS,
  MEDICAL_AGI_FLOOR,
  MEDICARE_SURCHARGE,
  ORDINARY_BRACKETS,
  RMD_DIVISORS,
  SALT_CAP,
  SS_BEND_POINTS,
  SS_WAGE_BASE,
  STANDARD_DEDUCTION,
  type FilingStatus,
} from "./tax-brackets";

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly" | "annually";

export const PAY_PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annually: 1,
};

/** Standard monthly mortgage payment (CalcXML hom03) */
export function mortgagePayment(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function mortgageSummary(
  loanAmount: number,
  annualRatePercent: number,
  months: number,
  annualPropertyTax = 0,
  annualInsurance = 0,
  monthlyPmi = 0,
) {
  const principalAndInterest = mortgagePayment(loanAmount, annualRatePercent, months);
  const monthlyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthly = principalAndInterest + monthlyTax + monthlyInsurance + monthlyPmi;
  const totalPaid = principalAndInterest * months;
  const totalInterest = Math.max(totalPaid - loanAmount, 0);

  return {
    principalAndInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyPmi,
    totalMonthly,
    totalInterest,
    totalPaid,
  };
}

export type ArmRateTrend = "same" | "increasing" | "decreasing";

/** Adjustable-rate mortgage simulation (CalcXML hom11) */
export function armMortgageSummary(params: {
  loanAmount: number;
  initialRatePercent: number;
  months: number;
  minRatePercent: number;
  maxRatePercent: number;
  monthsBeforeFirstAdjustment: number;
  monthsBetweenAdjustments: number;
  rateTrend: ArmRateTrend;
  rateAdjustmentPercent: number;
  compareFixedRatePercent: number;
}) {
  const {
    loanAmount,
    initialRatePercent,
    months,
    minRatePercent,
    maxRatePercent,
    monthsBeforeFirstAdjustment,
    monthsBetweenAdjustments,
    rateTrend,
    rateAdjustmentPercent,
    compareFixedRatePercent,
  } = params;

  const fixedPayment = mortgagePayment(loanAmount, compareFixedRatePercent, months);

  let balance = loanAmount;
  let currentRate = initialRatePercent;
  let payment = mortgagePayment(balance, currentRate, months);
  const payments: number[] = [];
  let totalInterest = 0;
  let adjustmentPayment = payment;

  for (let m = 1; m <= months; m++) {
    if (m > monthsBeforeFirstAdjustment && (m - monthsBeforeFirstAdjustment - 1) % monthsBetweenAdjustments === 0) {
      if (rateTrend === "increasing") currentRate += rateAdjustmentPercent;
      else if (rateTrend === "decreasing") currentRate -= rateAdjustmentPercent;
      currentRate = Math.min(Math.max(currentRate, minRatePercent), maxRatePercent);
      const remainingMonths = months - m + 1;
      payment = mortgagePayment(balance, currentRate, remainingMonths);
      adjustmentPayment = payment;
    }

    const monthlyRate = currentRate / 100 / 12;
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    balance = Math.max(balance - principalPaid, 0);
    totalInterest += interest;
    payments.push(payment);
  }

  const initialArmPayment = mortgagePayment(loanAmount, initialRatePercent, months);

  return {
    fixedPayment,
    initialArmPayment,
    adjustedPayment: adjustmentPayment,
    finalRate: currentRate,
    totalInterest,
    totalPaid: payments.reduce((a, b) => a + b, 0),
  };
}

/** 401(k) future value (CalcXML pay07) */
export function fourOhOneKFutureValue(params: {
  yearsUntilRetirement: number;
  currentIncome: number;
  salaryIncreasePercent: number;
  currentBalance: number;
  contributionPercent: number;
  payFrequency: PayFrequency;
  annualReturnPercent: number;
  employerMatchPercent: number;
  maxEmployerMatchPercent: number;
}) {
  const periodsPerYear = PAY_PERIODS[params.payFrequency];
  const months = params.yearsUntilRetirement * 12;
  const monthlyReturn = params.annualReturnPercent / 100 / 12;

  let balance = params.currentBalance;
  let income = params.currentIncome;
  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;

  for (let year = 0; year < params.yearsUntilRetirement; year++) {
    const employeeAnnual = income * (params.contributionPercent / 100);
    const employerAnnual = Math.min(
      income * (params.employerMatchPercent / 100),
      income * (params.maxEmployerMatchPercent / 100),
    );
    const totalAnnual = employeeAnnual + employerAnnual;
    const contributionPerPeriod = totalAnnual / periodsPerYear;

    for (let p = 0; p < periodsPerYear; p++) {
      balance = balance * (1 + monthlyReturn * (12 / periodsPerYear)) + contributionPerPeriod;
    }

    totalEmployeeContributions += employeeAnnual;
    totalEmployerContributions += employerAnnual;
    income *= 1 + params.salaryIncreasePercent / 100;
  }

  return {
    futureValue: balance,
    totalContributions: params.currentBalance + totalEmployeeContributions + totalEmployerContributions,
    investmentGrowth: balance - (params.currentBalance + totalEmployeeContributions + totalEmployerContributions),
    totalEmployeeContributions,
    totalEmployerContributions,
  };
}

/** Social Security benefit estimate (CalcXML ret04 simplified AIME/PIA) */
export function socialSecurityBenefit(params: {
  averageAnnualIncome: number;
  currentAge: number;
  retirementAge: number;
  inflationRatePercent?: number;
}) {
  const { averageAnnualIncome, currentAge, retirementAge, inflationRatePercent = 2.6 } = params;

  const indexedEarnings = Math.min(averageAnnualIncome, SS_WAGE_BASE);
  const aime = indexedEarnings / 12;

  const pia =
    0.9 * Math.min(aime, SS_BEND_POINTS.first) +
    0.32 * Math.min(Math.max(aime - SS_BEND_POINTS.first, 0), SS_BEND_POINTS.second - SS_BEND_POINTS.first) +
    0.15 * Math.max(aime - SS_BEND_POINTS.second, 0);

  let adjustmentFactor = 1;
  if (retirementAge < 67) {
    const monthsEarly = (67 - retirementAge) * 12;
    adjustmentFactor = 1 - monthsEarly * 0.00556;
    adjustmentFactor = Math.max(adjustmentFactor, 0.7);
  } else if (retirementAge > 67) {
    const monthsLate = (retirementAge - 67) * 12;
    adjustmentFactor = 1 + monthsLate * 0.00667;
  }

  const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
  const inflationFactor = Math.pow(1 + inflationRatePercent / 100, yearsToRetirement);
  const monthlyBenefit = pia * adjustmentFactor;
  const inflatedMonthly = monthlyBenefit * inflationFactor;

  return {
    monthlyBenefitAtRetirement: monthlyBenefit,
    annualBenefitAtRetirement: monthlyBenefit * 12,
    inflatedMonthlyBenefit: inflatedMonthly,
    inflatedAnnualBenefit: inflatedMonthly * 12,
    primaryInsuranceAmount: pia,
  };
}

export function calculateProgressiveTax(taxableIncome: number, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  let previousMax = 0;
  for (const bracket of ORDINARY_BRACKETS[status]) {
    const inBracket = Math.min(taxableIncome, bracket.max) - previousMax;
    if (inBracket <= 0) break;
    tax += inBracket * bracket.rate;
    previousMax = bracket.max;
  }
  return tax;
}

export function marginalTaxRate(taxableIncome: number, status: FilingStatus): number {
  for (const bracket of ORDINARY_BRACKETS[status]) {
    if (taxableIncome <= bracket.max) return bracket.rate * 100;
  }
  return 37;
}

export function effectiveTaxRate(tax: number, grossIncome: number): number {
  if (grossIncome <= 0) return 0;
  return (tax / grossIncome) * 100;
}

/** Long-term capital gains tax (CalcXML inc06) */
export function longTermCapitalGainsTax(
  taxableIncomeExcludingGains: number,
  netLongTermGain: number,
  status: FilingStatus,
) {
  if (netLongTermGain <= 0) {
    return { tax: 0, netProceeds: netLongTermGain, effectiveRate: 0 };
  }

  let remainingGain = netLongTermGain;
  let tax = 0;
  let incomeLevel = taxableIncomeExcludingGains;
  const brackets = LTCG_BRACKETS[status];
  let previousMax = 0;

  for (const bracket of brackets) {
    if (remainingGain <= 0) break;

    if (incomeLevel >= bracket.max) {
      previousMax = bracket.max;
      continue;
    }

    const bracketStart = Math.max(incomeLevel, previousMax);
    const roomInBracket = Math.max(bracket.max - bracketStart, 0);
    const gainInBracket = Math.min(remainingGain, roomInBracket);
    tax += gainInBracket * bracket.rate;
    remainingGain -= gainInBracket;
    incomeLevel += gainInBracket;
    previousMax = bracket.max;
  }

  if (remainingGain > 0) {
    tax += remainingGain * (brackets[brackets.length - 1]?.rate ?? 0.2);
  }

  return {
    tax,
    netProceeds: netLongTermGain - tax,
    effectiveRate: netLongTermGain > 0 ? (tax / netLongTermGain) * 100 : 0,
  };
}

/** Investment growth comparison (CalcXML inc07) */
export function investmentGrowthComparison(params: {
  currentBalance: number;
  annualContributions: number;
  years: number;
  taxableReturnPercent: number;
  taxDeferredReturnPercent: number;
  taxFreeReturnPercent: number;
  marginalTaxPercent: number;
}) {
  const taxRate = params.marginalTaxPercent / 100;
  const taxableAfterTaxReturn = params.taxableReturnPercent * (1 - taxRate);

  const taxable = futureValueAnnual(params.currentBalance, params.annualContributions, taxableAfterTaxReturn, params.years);
  const taxDeferred = futureValueAnnual(
    params.currentBalance,
    params.annualContributions,
    params.taxDeferredReturnPercent,
    params.years,
  );
  const taxFree = futureValueAnnual(
    params.currentBalance,
    params.annualContributions,
    params.taxFreeReturnPercent,
    params.years,
  );

  const deferredTaxOwed = Math.max(taxDeferred - (params.currentBalance + params.annualContributions * params.years), 0) * taxRate;
  const taxDeferredAfterTax = taxDeferred - deferredTaxOwed;

  return { taxable, taxDeferred, taxDeferredAfterTax, taxFree, deferredTaxOwed };
}

function futureValueAnnual(initial: number, annualContribution: number, annualReturnPercent: number, years: number) {
  const r = annualReturnPercent / 100;
  if (r === 0) return initial + annualContribution * years;
  const fvInitial = initial * Math.pow(1 + r, years);
  const fvContributions = annualContribution * ((Math.pow(1 + r, years) - 1) / r);
  return fvInitial + fvContributions;
}

/** Standard vs itemized (CalcXML inc10) */
export function standardVsItemized(params: {
  agi: number;
  status: FilingStatus;
  blindFilers: number;
  over65Filers: number;
  medicalExpenses: number;
  dentalExpenses: number;
  stateLocalIncomeTaxes: number;
  realEstateTaxes: number;
  personalPropertyTaxes: number;
  otherTaxes: number;
  mortgageInterest: number;
  charitableCash: number;
  charitableInKind: number;
  charitableCarryover: number;
}) {
  const extraStandard =
    params.over65Filers * (params.status === "married_joint" ? 1600 : 2000) +
    params.blindFilers * (params.status === "married_joint" ? 1600 : 2000);

  const standardDeduction = STANDARD_DEDUCTION[params.status] + extraStandard;

  const medicalTotal = params.medicalExpenses + params.dentalExpenses;
  const medicalDeduction = Math.max(medicalTotal - params.agi * MEDICAL_AGI_FLOOR, 0);

  const salt = Math.min(
    params.stateLocalIncomeTaxes + params.realEstateTaxes + params.personalPropertyTaxes + params.otherTaxes,
    SALT_CAP,
  );

  const itemized =
    medicalDeduction +
    salt +
    params.mortgageInterest +
    params.charitableCash +
    params.charitableInKind +
    params.charitableCarryover;

  const useItemized = itemized > standardDeduction;
  const deductionUsed = Math.max(standardDeduction, itemized);
  const taxStandard = calculateProgressiveTax(Math.max(params.agi - standardDeduction, 0), params.status);
  const taxItemized = calculateProgressiveTax(Math.max(params.agi - itemized, 0), params.status);

  return {
    standardDeduction,
    itemizedTotal: itemized,
    deductionUsed,
    recommendation: useItemized ? "Itemize deductions" : "Take the standard deduction",
    taxSavingsFromItemizing: taxStandard - taxItemized,
    taxWithStandard: taxStandard,
    taxWithItemized: taxItemized,
  };
}

/** Annuity tax advantages (CalcXML ins08) */
export function annuityTaxComparison(params: {
  initialBalance: number;
  annualContribution: number;
  contributionIncreasePercent: number;
  years: number;
  beforeTaxReturnPercent: number;
  taxDuringDepositPercent: number;
  taxAtWithdrawalPercent: number;
}) {
  let taxableBalance = params.initialBalance;
  let annuityBalance = params.initialBalance;
  let totalContributions = params.initialBalance;

  for (let y = 0; y < params.years; y++) {
    const contribution = params.annualContribution * Math.pow(1 + params.contributionIncreasePercent / 100, y);
    totalContributions += contribution;
    taxableBalance += contribution;
    annuityBalance += contribution;

    const taxableInterest = taxableBalance * (params.beforeTaxReturnPercent / 100);
    const taxOnInterest = taxableInterest * (params.taxDuringDepositPercent / 100);
    taxableBalance += taxableInterest - taxOnInterest;

    annuityBalance *= 1 + params.beforeTaxReturnPercent / 100;
  }

  const annuityGain = Math.max(annuityBalance - totalContributions, 0);
  const annuityAfterTax = annuityBalance - annuityGain * (params.taxAtWithdrawalPercent / 100);
  const taxableGain = Math.max(taxableBalance - totalContributions, 0);

  return {
    taxableBalance,
    annuityBalance,
    annuityAfterTax,
    taxAdvantage: annuityAfterTax - taxableBalance,
    taxableGain,
    annuityGain,
  };
}

export function taxCreditVsDeduction(taxLiability: number, deductionAmount: number, creditAmount: number, marginalRatePercent: number) {
  const deductionSavings = deductionAmount * (marginalRatePercent / 100);
  const creditSavings = creditAmount;
  return {
    deductionSavings,
    creditSavings,
    taxAfterDeduction: Math.max(taxLiability - deductionSavings, 0),
    taxAfterCredit: Math.max(taxLiability - creditSavings, 0),
    netBenefitDifference: creditSavings - deductionSavings,
  };
}

export function traditionalIraRmd(priorYearEndBalance: number, age: number) {
  const clampedAge = Math.min(Math.max(Math.floor(age), 72), 115);
  const divisor = RMD_DIVISORS[clampedAge] ?? RMD_DIVISORS[115];
  const rmd = priorYearEndBalance / divisor;
  return { rmd, divisor, monthlyEquivalent: rmd / 12 };
}

/** Federal tax refund estimator (CalcXML inc12) */
export function federalTaxRefundEstimate(params: {
  status: FilingStatus;
  grossIncome: number;
  traditionalIraContribution: number;
  itemizedDeductionsOtherThanSalt: number;
  childDependents: number;
  otherDependents: number;
  saltPaid: number;
  useStandardDeduction: boolean;
  taxWithheld: number;
  over65Count: number;
  blindCount: number;
}) {
  const extraStandard =
    params.over65Count * (params.status === "married_joint" ? 1600 : 2000) +
    params.blindCount * (params.status === "married_joint" ? 1600 : 2000);

  const standardDeduction = STANDARD_DEDUCTION[params.status] + extraStandard;
  const saltAllowed = Math.min(params.saltPaid, SALT_CAP);
  const itemized = params.itemizedDeductionsOtherThanSalt + saltAllowed;
  const deduction = params.useStandardDeduction || itemized <= standardDeduction ? standardDeduction : itemized;

  const agi = Math.max(params.grossIncome - params.traditionalIraContribution, 0);
  const taxableIncome = Math.max(agi - deduction, 0);
  const incomeTax = calculateProgressiveTax(taxableIncome, params.status);
  const childCredit = params.childDependents * CHILD_TAX_CREDIT;
  const taxAfterCredits = Math.max(incomeTax - childCredit, 0);
  const refundOrOwed = params.taxWithheld - taxAfterCredits;

  return {
    agi,
    taxableIncome,
    deductionUsed: deduction,
    estimatedTax: taxAfterCredits,
    refundOrOwed,
    isRefund: refundOrOwed >= 0,
    marginalRate: marginalTaxRate(taxableIncome, params.status),
    effectiveRate: effectiveTaxRate(taxAfterCredits, params.grossIncome),
  };
}

/** Self-employment tax (CalcXML inc05) */
export function selfEmploymentTax(params: {
  selfEmploymentIncome: number;
  employerIncome: number;
  status: FilingStatus;
}) {
  const netEarnings = params.selfEmploymentIncome * 0.9235;
  const combinedWages = params.employerIncome + netEarnings;

  const ssWageBaseRemaining = Math.max(SS_WAGE_BASE - params.employerIncome, 0);
  const socialSecurityTax = Math.min(netEarnings, ssWageBaseRemaining) * 0.124;
  const medicareTax = netEarnings * 0.029;

  const additionalMedicareThreshold = MEDICARE_SURCHARGE[params.status];
  const additionalMedicareBase = Math.max(combinedWages - additionalMedicareThreshold, 0);
  const additionalMedicare = additionalMedicareBase * 0.009;

  const totalSeTax = socialSecurityTax + medicareTax + additionalMedicare;
  const deductiblePortion = (socialSecurityTax + medicareTax) * 0.5;

  return {
    netEarnings,
    socialSecurityTax,
    medicareTax,
    additionalMedicare,
    totalSeTax,
    deductiblePortion,
  };
}

/** Marginal vs effective from inc02 */
export function incomeTaxAnalysis(params: {
  status: FilingStatus;
  grossIncome: number;
  traditionalIraContribution: number;
  itemizedOtherThanSalt: number;
  saltPaid: number;
  useStandard: boolean;
  over65Count: number;
  blindCount: number;
}) {
  const result = federalTaxRefundEstimate({
    ...params,
    childDependents: 0,
    otherDependents: 0,
    taxWithheld: 0,
    useStandardDeduction: params.useStandard,
    itemizedDeductionsOtherThanSalt: params.itemizedOtherThanSalt,
  });

  return {
    taxableIncome: result.taxableIncome,
    federalTax: result.estimatedTax,
    marginalRate: result.marginalRate,
    effectiveRate: result.effectiveRate,
    deductionUsed: result.deductionUsed,
  };
}
