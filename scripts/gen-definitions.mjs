import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const allTs = fs.readFileSync(path.join(root, "src/lib/calculators/compute/all.ts"), "utf8");
const catalogTs = fs.readFileSync(path.join(root, "src/data/calculators/catalog.ts"), "utf8");

const exportMatch = allTs.match(/export const computeFunctions[^=]*=\s*\{([\s\S]*?)\n\};/);
const slugs = [...exportMatch[1].matchAll(/"([^"]+)"\s*:/g)].map((m) => m[1]);

const catalogEntries = [
  ...catalogTs.matchAll(
    /\{\s*slug:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g,
  ),
];
const catalog = Object.fromEntries(
  catalogEntries.map((m) => [m[1], { category: m[2], title: m[3], description: m[4] }]),
);

const funcBlocks = {};
const funcRegex = /const (\w+):\s*ComputeFn\s*=\s*\(values\)\s*=>\s*\{([\s\S]*?)\n\};/g;
let m;
while ((m = funcRegex.exec(allTs)) !== null) {
  funcBlocks[m[1]] = m[2];
}

const slugToFunc = {};
for (const line of exportMatch[1].split("\n")) {
  const sm = line.match(/"([^"]+)":\s*(\w+)/);
  if (sm) slugToFunc[sm[1]] = sm[2];
}

function camelToLabel(id) {
  const overrides = {
    loanAmount: "Loan Amount",
    interestRate: "Interest Rate",
    monthlyPayment: "Monthly Payment",
    months: "Loan Term",
    extraPayment: "Extra Payment",
    purchasePrice: "Purchase Price",
    yearsOwned: "Years Owned",
    annualDepreciationPercent: "Annual Depreciation",
    annualMiles: "Annual Miles",
    gasPrice: "Gas Price",
    gasMpg: "Gas MPG",
    evEfficiency: "EV Efficiency (kWh/100 mi)",
    electricityRate: "Electricity Rate",
    gasMaintenance: "Gas Maintenance (Annual)",
    evMaintenance: "EV Maintenance (Annual)",
    years: "Years",
    monthlyIncome: "Monthly Income",
    monthlyDebts: "Monthly Debts",
    maxPaymentPercent: "Max Payment (% of Income)",
    downPayment: "Down Payment",
    vehiclePrice: "Vehicle Price",
    monthlyBudget: "Monthly Budget",
    buyPrice: "Purchase Price",
    loanRate: "Loan Rate",
    loanMonths: "Loan Term (Months)",
    leaseDownPayment: "Lease Down Payment",
    leaseMonthly: "Lease Monthly Payment",
    leaseMonths: "Lease Term (Months)",
    residualValue: "Residual Value",
    vehicleValue: "Vehicle Value",
    bankRate: "Bank Rate",
    bankMonths: "Bank Term (Months)",
    dealerRebate: "Dealer Rebate",
    annualEarnings: "Annual Earnings",
    earningsMultiple: "Earnings Multiple",
    totalDebt: "Total Debt",
    totalEquity: "Total Equity",
    startingCash: "Starting Cash",
    annualRevenue: "Annual Revenue",
    annualExpenses: "Annual Expenses",
    growthRate: "Growth Rate",
    beginningValue: "Beginning Value",
    endingValue: "Ending Value",
    desiredAnnualIncome: "Desired Annual Income",
    billableHours: "Billable Hours",
    utilizationPercent: "Utilization",
    revenue: "Revenue",
    expenses: "Expenses",
    gain: "Gain",
    cost: "Cost",
    savingsRate: "Savings Rate",
    monthsToSave: "Months to Save",
    creditRate: "Credit Rate",
    balance: "Balance",
    currentRate: "Current Rate",
    newRate: "New Rate",
    transferFeePercent: "Transfer Fee",
    monthsToPayoff: "Months to Payoff",
    advanceAmount: "Advance Amount",
    feePercent: "Fee Percent",
    minimumPercent: "Minimum Payment (%)",
    minimumDollar: "Minimum Payment ($)",
    annualSpending: "Annual Spending",
    rewardRate: "Reward Rate",
    annualFee: "Annual Fee",
    rateWithPoints: "Rate With Points",
    rateWithoutPoints: "Rate Without Points",
    pointsCost: "Points Cost",
    annualIncome: "Annual Income",
    loanTermMonths: "Loan Term (Months)",
    maxHousingRatio: "Max Housing Ratio",
    annualPropertyTax: "Annual Property Tax",
    annualInsurance: "Annual Insurance",
    currentBalance: "Current Balance",
    monthsRemaining: "Months Remaining",
    newMonths: "New Loan Term (Months)",
    closingCosts: "Closing Costs",
    homePrice: "Home Price",
    mortgageRate: "Mortgage Rate",
    mortgageYears: "Mortgage Years",
    monthlyRent: "Monthly Rent",
    rentIncreasePercent: "Rent Increase",
    appreciationPercent: "Appreciation",
    annualMaintenance: "Annual Maintenance",
    pointsPercent: "Points Percent",
    rateReduction: "Rate Reduction",
    baseRate: "Base Rate",
    currentSavings: "Current Savings",
    monthlyContribution: "Monthly Contribution",
    returnRate: "Return Rate",
    yearsToRetirement: "Years to Retirement",
    desiredAnnualIncome: "Desired Annual Income",
    withdrawalRate: "Withdrawal Rate",
    currentIncomeNeed: "Current Monthly Income Need",
    inflationRate: "Inflation Rate",
    targetAmount: "Target Amount",
    delayYears: "Delay (Years)",
    funeralCost: "Funeral Cost",
    medicalBills: "Medical Bills",
    legalFees: "Legal Fees",
    currentCoverage: "Current Coverage",
    monthlyExpenses: "Monthly Expenses",
    benefitPercent: "Benefit Percent",
    employerHsaContribution: "Employer HSA Contribution",
    hdhpPremium: "HDHP Premium (Monthly)",
    hdhpDeductible: "HDHP Deductible",
    comprehensivePremium: "Comprehensive Premium (Monthly)",
    comprehensiveDeductible: "Comprehensive Deductible",
    expectedMedical: "Expected Medical Expenses",
    deathBenefit: "Death Benefit",
    investmentReturn: "Investment Return",
    yearsToReplace: "Years to Replace",
    existingCoverage: "Existing Coverage",
    outstandingDebts: "Outstanding Debts",
    finalExpenses: "Final Expenses",
    retirementSavings: "Retirement Savings",
    monthlyWithdrawal: "Monthly Withdrawal",
    currentSalary: "Current Salary",
    annualRaisePercent: "Annual Raise",
    yearsWorking: "Years Working",
    dailyCost: "Daily Cost",
    yearsOfCare: "Years of Care",
    yearsUntilNeed: "Years Until Need",
    weeklyAllowance: "Weekly Allowance",
    hoursPerWeek: "Hours Per Week",
    hourlyRate: "Hourly Rate",
    weeksPerYear: "Weeks Per Year",
    initialDeposit: "Initial Deposit",
    cupsSold: "Cups Sold",
    pricePerCup: "Price Per Cup",
    costPerCup: "Cost Per Cup",
    fixedCosts: "Fixed Costs",
    days: "Days",
    alternativeAmount: "Alternative Amount",
    totalPortfolio: "Total Portfolio",
    stocksPercent: "Stocks (%)",
    bondsPercent: "Bonds (%)",
    cashPercent: "Cash (%)",
    initialInvestment: "Initial Investment",
    dividendYield: "Dividend Yield",
    numOptions: "Number of Options",
    strikePrice: "Strike Price",
    currentPrice: "Current Price",
    debtBalance: "Debt Balance",
    debtRate: "Debt Rate",
    lumpSum: "Lump Sum",
    monthlyDCA: "Monthly DCA",
    oldValue: "Old Value",
    newValue: "New Value",
    totalValue: "Total Value",
    currentStocksPercent: "Current Stocks (%)",
    targetStocksPercent: "Target Stocks (%)",
    currentBondsPercent: "Current Bonds (%)",
    targetBondsPercent: "Target Bonds (%)",
    annualContribution: "Annual Contribution",
    marginalTaxNow: "Marginal Tax Rate (Now)",
    marginalTaxRetirement: "Marginal Tax Rate (Retirement)",
    expectedGrowth: "Expected Growth",
    yearsToHold: "Years to Hold",
    fees: "Fees",
    balloonPercent: "Balloon Percent",
    debt1Balance: "Debt 1 Balance",
    debt1Rate: "Debt 1 Rate",
    debt2Balance: "Debt 2 Balance",
    debt2Rate: "Debt 2 Rate",
    consolidatedRate: "Consolidated Rate",
    consolidatedMonths: "Consolidated Term (Months)",
    repaymentYears: "Repayment Years",
    grossPay: "Gross Pay",
    contributionPercent: "Contribution Percent",
    marginalTaxRate: "Marginal Tax Rate",
    garnishmentAmount: "Garnishment Amount",
    maxGarnishmentPercent: "Max Garnishment (%)",
    hourlyWage: "Hourly Wage",
    overtimeHours: "Overtime Hours",
    overtimeMultiplier: "Overtime Multiplier",
    regularHours: "Regular Hours",
    salary1: "Salary (Job 1)",
    salary2: "Salary (Job 2)",
    taxRate1: "Tax Rate (Job 1)",
    taxRate2: "Tax Rate (Job 2)",
    annualSalary: "Annual Salary",
    taxRate: "Tax Rate",
    rehabCost: "Rehab Cost",
    holdingCosts: "Holding Costs",
    salePrice: "Sale Price",
    sellingCosts: "Selling Costs",
    propertyPrice: "Property Price",
    totalPropertyValue: "Total Property Value",
    landPercent: "Land (%)",
    netOperatingIncome: "Net Operating Income",
    propertyValue: "Property Value",
    commissionPercent: "Commission Percent",
    loanYears: "Loan Years",
    vacancyRate: "Vacancy Rate",
    goalAmount: "Goal Amount",
    deposit: "Deposit",
    rate1: "Rate 1",
    rate2: "Rate 2",
    housing: "Housing",
    transportation: "Transportation",
    food: "Food",
    utilities: "Utilities",
    otherExpenses: "Other Expenses",
    principal: "Principal",
    currentAmount: "Current Amount",
    ssBenefits: "Social Security Benefits",
    otherIncome: "Other Income",
    taxExemptInterest: "Tax-Exempt Interest",
    earnedIncome: "Earned Income",
    qualifyingChildren: "Qualifying Children",
    interestPaid: "Interest Paid",
    taxFreeYield: "Tax-Free Yield",
    educationCost: "Education Cost",
    startingSalary: "Starting Salary",
    annualLivingExpenses: "Annual Living Expenses",
    tuitionShare: "Tuition Share",
    books: "Books",
    campusHousing: "Campus Housing (Annual)",
    mealPlan: "Meal Plan (Annual)",
    commutingCost: "Commuting Cost (Annual)",
    homeFoodCost: "Home Food Cost (Annual)",
    loanBalance: "Loan Balance",
    grossEarnings: "Gross Earnings",
    withholdingPercent: "Withholding Percent",
    degreeAnnualEarnings: "Degree Annual Earnings",
    noDegreeAnnualEarnings: "No-Degree Annual Earnings",
    filingStatus: "Filing Status",
  };
  if (overrides[id]) return overrides[id];
  return id
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/Pct$/, "")
    .replace(/Percent$/, " Percent")
    .trim();
}

function fieldSuffix(id, defaultVal) {
  const pct = [
    "interestRate", "annualDepreciationPercent", "maxPaymentPercent", "utilizationPercent",
    "savingsRate", "creditRate", "currentRate", "newRate", "transferFeePercent", "feePercent",
    "minimumPercent", "rewardRate", "rateWithPoints", "rateWithoutPoints", "maxHousingRatio",
    "rentIncreasePercent", "appreciationPercent", "pointsPercent", "rateReduction", "baseRate",
    "returnRate", "withdrawalRate", "inflationRate", "benefitPercent", "investmentReturn",
    "annualRaisePercent", "growthRate", "dividendYield", "debtRate", "expectedGrowth",
    "balloonPercent", "debt1Rate", "debt2Rate", "consolidatedRate", "contributionPercent",
    "marginalTaxRate", "marginalTaxNow", "marginalTaxRetirement", "maxGarnishmentPercent",
    "taxRate1", "taxRate2", "taxRate", "commissionPercent", "vacancyRate", "withholdingPercent",
    "stocksPercent", "bondsPercent", "cashPercent", "currentStocksPercent", "targetStocksPercent",
    "currentBondsPercent", "targetBondsPercent", "loanRate", "mortgageRate", "bankRate",
  ];
  const dollar = [
    "loanAmount", "monthlyPayment", "extraPayment", "purchasePrice", "gasPrice", "electricityRate",
    "gasMaintenance", "evMaintenance", "monthlyIncome", "monthlyDebts", "downPayment", "vehiclePrice",
    "monthlyBudget", "buyPrice", "leaseDownPayment", "leaseMonthly", "residualValue", "vehicleValue",
    "dealerRebate", "annualEarnings", "totalDebt", "totalEquity", "startingCash", "annualRevenue",
    "annualExpenses", "beginningValue", "endingValue", "desiredAnnualIncome", "revenue", "expenses",
    "gain", "cost", "balance", "advanceAmount", "minimumDollar", "annualSpending", "annualFee",
    "pointsCost", "annualIncome", "annualPropertyTax", "annualInsurance", "currentBalance",
    "closingCosts", "homePrice", "monthlyRent", "annualMaintenance", "currentSavings",
    "monthlyContribution", "currentIncomeNeed", "targetAmount", "funeralCost", "medicalBills",
    "legalFees", "currentCoverage", "monthlyExpenses", "employerHsaContribution", "hdhpPremium",
    "hdhpDeductible", "comprehensivePremium", "comprehensiveDeductible", "expectedMedical",
    "deathBenefit", "existingCoverage", "outstandingDebts", "finalExpenses", "retirementSavings",
    "monthlyWithdrawal", "currentSalary", "dailyCost", "weeklyAllowance", "hourlyRate",
    "initialDeposit", "pricePerCup", "costPerCup", "fixedCosts", "alternativeAmount",
    "totalPortfolio", "initialInvestment", "strikePrice", "currentPrice", "debtBalance",
    "lumpSum", "monthlyDCA", "oldValue", "newValue", "totalValue", "annualContribution",
    "fees", "debt1Balance", "debt2Balance", "grossPay", "garnishmentAmount", "hourlyWage",
    "salary1", "salary2", "annualSalary", "rehabCost", "holdingCosts", "salePrice",
    "sellingCosts", "propertyPrice", "totalPropertyValue", "netOperatingIncome", "propertyValue",
    "goalAmount", "deposit", "housing", "transportation", "food", "utilities", "otherExpenses",
    "principal", "currentAmount", "ssBenefits", "otherIncome", "taxExemptInterest", "earnedIncome",
    "interestPaid", "educationCost", "startingSalary", "annualLivingExpenses", "tuitionShare",
    "books", "campusHousing", "mealPlan", "commutingCost", "homeFoodCost", "loanBalance",
    "grossEarnings", "degreeAnnualEarnings", "noDegreeAnnualEarnings", "monthlyDCA",
  ];
  const months = ["months", "loanMonths", "leaseMonths", "loanTermMonths", "newMonths", "monthsToSave", "monthsToPayoff", "consolidatedMonths", "monthsRemaining"];
  const years = ["years", "yearsOwned", "mortgageYears", "yearsToRetirement", "yearsToReplace", "yearsWorking", "yearsOfCare", "yearsUntilNeed", "repaymentYears", "loanYears", "yearsToHold", "delayYears"];
  if (pct.includes(id)) return "%";
  if (dollar.includes(id)) return "$";
  if (months.includes(id)) return "months";
  if (years.includes(id)) return "years";
  if (id === "cupsSold" || id === "numOptions" || id === "qualifyingChildren" || id === "days" || id === "billableHours" || id === "hoursPerWeek" || id === "weeksPerYear" || id === "overtimeHours" || id === "regularHours") return "";
  return "";
}

function resultFormat(id, slug) {
  if (id === "recommendation") return "text";
  const currency = [
    "standardInterest", "acceleratedInterest", "interestSaved", "currentValue", "totalDepreciation",
    "annualGasCost", "annualEvCost", "annualSavings", "totalSavings", "maxMonthlyPayment", "maxLoanAmount",
    "maxCarPrice", "loanAmount", "monthlyPayment", "totalInterest", "totalPaid", "buyTotalCost",
    "leaseTotalCost", "buyNetCost", "leaseNetCost", "costDifference", "equity", "bankMonthlyPayment",
    "bankTotalInterest", "bankTotalCost", "dealerTotalCost", "savings", "businessValue", "totalDebt",
    "totalEquity", "year1Cash", "finalCash", "totalNetCashFlow", "requiredHourlyRate", "requiredAnnualRevenue",
    "netProfit", "netGain", "savedAmount", "buyNowTotalCost", "waitTotalCost", "savingsByWaiting",
    "currentTotalInterest", "newTotalInterest", "transferFee", "netSavings", "cashAdvanceFee", "totalCost",
    "grossRewards", "netRewards", "paymentWithPoints", "paymentWithoutPoints", "monthlySavings",
    "maxMonthlyHousing", "affordableHomePrice", "interestOnlyPayment", "traditionalPayment",
    "paymentDifference", "interestOnlyTotalInterest", "traditionalTotalInterest", "currentPayment",
    "newPayment", "lifetimeSavings", "buyNetCost", "rentTotalCost", "endingHomeEquity", "pointsCost",
    "projectedSavings", "neededNestEgg", "shortfall", "surplus", "futureMonthlyNeed", "futureAnnualNeed",
    "purchasingPowerLoss", "increaseAmount", "valueIfStartNow", "valueIfStartLater", "costOfDelay",
    "totalFinalExpenses", "monthlySavingsNeeded", "recommendedMonthlyBenefit", "coverageGap",
    "futureValue", "totalContributions", "investmentGrowth", "hdhpAnnualCost", "comprehensiveAnnualCost",
    "lifetimeEarnings", "finalYearSalary", "projectedTotalCost", "futureDailyCost", "weeklyEarnings",
    "annualEarnings", "compoundGrowth", "revenue", "totalCosts", "profit", "profitPerCup",
    "pennyDoublesValue", "alternativeAmount", "difference", "stocksValue", "bondsValue", "cashValue",
    "valueWithReinvestment", "valueWithoutReinvestment", "reinvestmentBenefit", "intrinsicValue",
    "valuePerOption", "debtInterestSaved", "investmentFutureValue", "netBenefitPayDebt", "netBenefitInvest",
    "lumpSumFutureValue", "dcaFutureValue", "absoluteChange", "stocksAdjustment", "bondsAdjustment",
    "sellStocksAmount", "buyBondsAmount", "traditionalAfterTax", "rothAfterTax", "advantage",
    "valueIfExerciseNow", "projectedValueIfHold", "exerciseCost", "effectiveApr", "balloonPayment",
    "currentTotalPayment", "consolidatedPayment", "currentTotalInterest", "consolidatedTotalInterest",
    "interestSavings", "contributionAmount", "taxSavings", "netPayReduction", "maxAllowedGarnishment",
    "actualGarnishment", "netAfterGarnishment", "annualSalary", "monthlySalary", "weeklyPay",
    "regularPay", "overtimePay", "totalPay", "netPay1", "netPay2", "weeklyNet", "biweeklyNet",
    "semimonthlyNet", "monthlyNet", "totalInvestment", "netProfit", "annualGrossRent",
    "landValue", "improvementValue", "netOperatingIncome", "totalCommission", "sellerAgentShare",
    "netProceeds", "monthlyCashFlow", "annualCashFlow", "maturityValue", "interestEarned",
    "projectedSavings", "targetAmount", "balanceAtRate1", "balanceAtRate2", "totalExpenses",
    "monthlySurplus", "valueIfDelayed", "maturityAmount", "futurePurchasingPower", "purchasingPowerLost",
    "equivalentToday", "taxableBenefits", "estimatedEic", "earnedIncome", "afterTaxInterestCost",
    "firstYearSurplus", "campusTotalCost", "homeTotalCost", "federalTax", "amountWithheld",
    "estimatedRefund", "estimatedOwed", "lifetimeEarningsWithDegree", "lifetimeEarningsWithoutDegree",
    "netEarningsPremium", "provisionalIncome",
  ];
  const percent = [
    "depreciationPercent", "effectiveRewardRate", "cagr", "totalGrowth", "netProfitMargin", "roi",
    "percentChange", "ltvRatio", "taxablePercent", "cashOnCashReturn", "savingsRate", "capRate",
    "landPercent", "grossRentMultiplier", "taxableEquivalentYield", "taxFreeYield", "interestRate",
    "statedRate", "effectiveApr",
  ];
  const monthsFmt = [
    "standardMonths", "acceleratedMonths", "monthsSaved", "monthsToPayoff", "breakEvenMonths",
    "monthsProceedsLast", "monthsSavingsLast",
  ];
  const yearsFmt = ["yearsToGoal", "yearsProceedsLast", "yearsSavingsLast", "yearsToBreakEven"];
  const number = [
    "underwater", "earningsMultiple", "effectiveBillableHours", "qualifyingChildren",
  ];
  if (currency.includes(id)) return "currency";
  if (percent.includes(id)) return "percent";
  if (monthsFmt.includes(id)) return "months";
  if (yearsFmt.includes(id)) return "years";
  if (number.includes(id)) return "number";
  if (id.endsWith("Months") || id.endsWith("months")) return "months";
  if (id.endsWith("Years") || id.endsWith("years")) return "years";
  if (id.includes("Percent") || id.includes("Rate") || id.includes("roi") || id === "cagr") return "percent";
  if (id.includes("Payment") || id.includes("Cost") || id.includes("Amount") || id.includes("Value") || id.includes("Savings") || id.includes("Income") || id.includes("Profit") || id.includes("Equity") || id.includes("Benefit") || id.includes("Tax") || id.includes("Premium") || id.includes("Earnings") || id.includes("Proceeds") || id.includes("Commission") || id.includes("Flow") || id.includes("Gap") || id.includes("Need") || id.includes("Shortfall") || id.includes("Surplus") || id.includes("Refund") || id.includes("Owed") || id.includes("Withheld")) return "currency";
  return "number";
}

function resultLabel(id) {
  const overrides = {
    standardMonths: "Standard Payoff",
    acceleratedMonths: "Accelerated Payoff",
    monthsSaved: "Months Saved",
    standardInterest: "Standard Interest",
    acceleratedInterest: "Accelerated Interest",
    interestSaved: "Interest Saved",
    recommendation: "Recommendation",
    currentValue: "Current Value",
    totalDepreciation: "Total Depreciation",
    depreciationPercent: "Depreciation",
    annualGasCost: "Annual Gas Cost",
    annualEvCost: "Annual EV Cost",
    annualSavings: "Annual Savings",
    totalSavings: "Total Savings",
    maxMonthlyPayment: "Max Monthly Payment",
    maxLoanAmount: "Max Loan Amount",
    maxCarPrice: "Max Car Price",
    loanAmount: "Loan Amount",
    monthlyPayment: "Monthly Payment",
    totalInterest: "Total Interest",
    totalPaid: "Total Paid",
    buyTotalCost: "Buy Total Cost",
    leaseTotalCost: "Lease Total Cost",
    buyNetCost: "Buy Net Cost",
    leaseNetCost: "Lease Net Cost",
    costDifference: "Cost Difference",
    ltvRatio: "LTV Ratio",
    equity: "Equity",
    underwater: "Underwater",
    bankMonthlyPayment: "Bank Monthly Payment",
    bankTotalInterest: "Bank Total Interest",
    bankTotalCost: "Bank Total Cost",
    dealerTotalCost: "Dealer Total Cost",
    savings: "Savings",
    businessValue: "Business Value",
    earningsMultiple: "Earnings Multiple",
    debtToEquityRatio: "Debt-to-Equity Ratio",
    year1Cash: "Year 1 Cash",
    finalCash: "Final Cash",
    totalNetCashFlow: "Total Net Cash Flow",
    cagr: "CAGR",
    totalGrowth: "Total Growth",
    requiredHourlyRate: "Required Hourly Rate",
    requiredAnnualRevenue: "Required Annual Revenue",
    effectiveBillableHours: "Effective Billable Hours",
    netProfit: "Net Profit",
    netProfitMargin: "Net Profit Margin",
    roi: "ROI",
    netGain: "Net Gain",
    savedAmount: "Saved Amount",
    buyNowTotalCost: "Buy Now Total Cost",
    waitTotalCost: "Wait Total Cost",
    savingsByWaiting: "Savings by Waiting",
    currentTotalInterest: "Current Total Interest",
    newTotalInterest: "New Total Interest",
    transferFee: "Transfer Fee",
    netSavings: "Net Savings",
    cashAdvanceFee: "Cash Advance Fee",
    monthsToPayoff: "Months to Payoff",
    grossRewards: "Gross Rewards",
    netRewards: "Net Rewards",
    effectiveRewardRate: "Effective Reward Rate",
    paymentWithPoints: "Payment With Points",
    paymentWithoutPoints: "Payment Without Points",
    monthlySavings: "Monthly Savings",
    breakEvenMonths: "Break-Even Months",
    maxMonthlyHousing: "Max Monthly Housing",
    affordableHomePrice: "Affordable Home Price",
    interestOnlyPayment: "Interest-Only Payment",
    traditionalPayment: "Traditional Payment",
    paymentDifference: "Payment Difference",
    interestOnlyTotalInterest: "Interest-Only Total Interest",
    traditionalTotalInterest: "Traditional Total Interest",
    currentPayment: "Current Payment",
    newPayment: "New Payment",
    lifetimeSavings: "Lifetime Savings",
    rentTotalCost: "Rent Total Cost",
    endingHomeEquity: "Ending Home Equity",
    pointsCost: "Points Cost",
    rateWithPoints: "Rate With Points",
    projectedSavings: "Projected Savings",
    neededNestEgg: "Needed Nest Egg",
    shortfall: "Shortfall",
    surplus: "Surplus",
    futureMonthlyNeed: "Future Monthly Need",
    futureAnnualNeed: "Future Annual Need",
    purchasingPowerLoss: "Purchasing Power Loss",
    increaseAmount: "Increase Amount",
    valueIfStartNow: "Value If Start Now",
    valueIfStartLater: "Value If Start Later",
    costOfDelay: "Cost of Delay",
    totalFinalExpenses: "Total Final Expenses",
    monthlySavingsNeeded: "Monthly Savings Needed",
    recommendedMonthlyBenefit: "Recommended Monthly Benefit",
    coverageGap: "Coverage Gap",
    currentCoverage: "Current Coverage",
    futureValue: "Future Value",
    totalContributions: "Total Contributions",
    investmentGrowth: "Investment Growth",
    hdhpAnnualCost: "HDHP Annual Cost",
    comprehensiveAnnualCost: "Comprehensive Annual Cost",
    monthsProceedsLast: "Months Proceeds Last",
    yearsProceedsLast: "Years Proceeds Last",
    totalCoverageNeeded: "Total Coverage Needed",
    additionalCoverageNeeded: "Additional Coverage Needed",
    existingCoverage: "Existing Coverage",
    monthsSavingsLast: "Months Savings Last",
    yearsSavingsLast: "Years Savings Last",
    lifetimeEarnings: "Lifetime Earnings",
    finalYearSalary: "Final Year Salary",
    projectedTotalCost: "Projected Total Cost",
    futureDailyCost: "Future Daily Cost",
    weeklyEarnings: "Weekly Earnings",
    annualEarnings: "Annual Earnings",
    compoundGrowth: "Compound Growth",
    profitPerCup: "Profit Per Cup",
    pennyDoublesValue: "Penny Doubles Value",
    alternativeAmount: "Alternative Amount",
    difference: "Difference",
    stocksValue: "Stocks Value",
    bondsValue: "Bonds Value",
    cashValue: "Cash Value",
    valueWithReinvestment: "Value With Reinvestment",
    valueWithoutReinvestment: "Value Without Reinvestment",
    reinvestmentBenefit: "Reinvestment Benefit",
    intrinsicValue: "Intrinsic Value",
    valuePerOption: "Value Per Option",
    debtInterestSaved: "Debt Interest Saved",
    investmentFutureValue: "Investment Future Value",
    netBenefitPayDebt: "Net Benefit (Pay Debt)",
    netBenefitInvest: "Net Benefit (Invest)",
    lumpSumFutureValue: "Lump Sum Future Value",
    dcaFutureValue: "DCA Future Value",
    percentChange: "Percent Change",
    absoluteChange: "Absolute Change",
    stocksAdjustment: "Stocks Adjustment",
    bondsAdjustment: "Bonds Adjustment",
    sellStocksAmount: "Sell Stocks Amount",
    buyBondsAmount: "Buy Bonds Amount",
    traditionalAfterTax: "Traditional (After Tax)",
    rothAfterTax: "Roth (After Tax)",
    advantage: "Advantage",
    valueIfExerciseNow: "Value If Exercise Now",
    projectedValueIfHold: "Projected Value If Hold",
    exerciseCost: "Exercise Cost",
    statedRate: "Stated Rate",
    effectiveApr: "Effective APR",
    balloonPayment: "Balloon Payment",
    currentTotalPayment: "Current Total Payment",
    consolidatedPayment: "Consolidated Payment",
    consolidatedTotalInterest: "Consolidated Total Interest",
    interestSavings: "Interest Savings",
    contributionAmount: "Contribution Amount",
    taxSavings: "Tax Savings",
    netPayReduction: "Net Pay Reduction",
    maxAllowedGarnishment: "Max Allowed Garnishment",
    actualGarnishment: "Actual Garnishment",
    netAfterGarnishment: "Net After Garnishment",
    monthlySalary: "Monthly Salary",
    weeklyPay: "Weekly Pay",
    regularPay: "Regular Pay",
    overtimePay: "Overtime Pay",
    totalPay: "Total Pay",
    netPay1: "Net Pay (Job 1)",
    netPay2: "Net Pay (Job 2)",
    weeklyNet: "Weekly Net",
    biweeklyNet: "Biweekly Net",
    semimonthlyNet: "Semi-Monthly Net",
    monthlyNet: "Monthly Net",
    totalInvestment: "Total Investment",
    grossRentMultiplier: "Gross Rent Multiplier",
    annualGrossRent: "Annual Gross Rent",
    landValue: "Land Value",
    improvementValue: "Improvement Value",
    landPercent: "Land Percent",
    capRate: "Cap Rate",
    totalCommission: "Total Commission",
    sellerAgentShare: "Seller Agent Share",
    netProceeds: "Net Proceeds",
    monthlyCashFlow: "Monthly Cash Flow",
    annualCashFlow: "Annual Cash Flow",
    cashOnCashReturn: "Cash-on-Cash Return",
    yearsToGoal: "Years to Goal",
    goalAmount: "Goal Amount",
    maturityValue: "Maturity Value",
    interestEarned: "Interest Earned",
    targetAmount: "Target Amount",
    balanceAtRate1: "Balance at Rate 1",
    balanceAtRate2: "Balance at Rate 2",
    totalExpenses: "Total Expenses",
    monthlySurplus: "Monthly Surplus",
    savingsRate: "Savings Rate",
    valueIfDelayed: "Value If Delayed",
    maturityAmount: "Maturity Amount",
    yearsToDouble: "Years to Double",
    interestRate: "Interest Rate",
    futurePurchasingPower: "Future Purchasing Power",
    purchasingPowerLost: "Purchasing Power Lost",
    equivalentToday: "Equivalent Today",
    provisionalIncome: "Provisional Income",
    taxableBenefits: "Taxable Benefits",
    taxablePercent: "Taxable Percent",
    estimatedEic: "Estimated EIC",
    earnedIncome: "Earned Income",
    qualifyingChildren: "Qualifying Children",
    afterTaxInterestCost: "After-Tax Interest Cost",
    taxableEquivalentYield: "Taxable Equivalent Yield",
    taxFreeYield: "Tax-Free Yield",
    firstYearSurplus: "First Year Surplus",
    yearsToBreakEven: "Years to Break Even",
    campusTotalCost: "Campus Total Cost",
    homeTotalCost: "Home Total Cost",
    federalTax: "Federal Tax",
    amountWithheld: "Amount Withheld",
    estimatedRefund: "Estimated Refund",
    estimatedOwed: "Estimated Owed",
    lifetimeEarningsWithDegree: "Lifetime Earnings (With Degree)",
    lifetimeEarningsWithoutDegree: "Lifetime Earnings (Without Degree)",
    netEarningsPremium: "Net Earnings Premium",
  };
  if (overrides[id]) return overrides[id];
  return camelToLabel(id);
}

function isPrimaryResult(id, keys) {
  if (id === "recommendation") return false;
  const primaryPatterns = [
    "Saved", "Savings", "affordable", "Affordable", "maxCar", "maxLoan", "maxMonthly", "netProfit",
    "roi", "cagr", "futureValue", "projectedSavings", "neededNestEgg", "shortfall", "surplus",
    "costDifference", "difference", "advantage", "netSavings", "interestSaved", "monthsSaved",
    "breakEven", "lifetimeSavings", "buyNetCost", "leaseNetCost", "annualSavings", "totalSavings",
    "currentValue", "businessValue", "requiredHourlyRate", "netRewards", "monthsToPayoff",
    "affordableHome", "monthlyPayment", "totalPaid", "estimatedEic", "taxSavings", "taxableEquivalent",
    "yearsToGoal", "maturityValue", "monthlySurplus", "costOfDelay", "yearsToDouble",
    "futurePurchasingPower", "taxableBenefits", "netEarningsPremium", "yearsToBreakEven",
    "cashOnCash", "monthlyCashFlow", "capRate", "grossRentMultiplier", "netProceeds",
    "totalCommission", "netPay", "totalPay", "annualSalary", "consolidatedPayment", "effectiveApr",
    "balloonPayment", "intrinsicValue", "lumpSumFutureValue", "dcaFutureValue", "traditionalAfterTax",
    "rothAfterTax", "valueIfExerciseNow", "projectedValueIfHold", "debtToEquity", "percentChange",
    "ltvRatio", "underwater", "yearsProceedsLast", "yearsSavingsLast", "additionalCoverage",
    "recommendedMonthly", "coverageGap", "projectedTotalCost", "profit", "pennyDoublesValue",
    "valueWithReinvestment", "netBenefit", "weeklyEarnings", "annualEarnings", "lifetimeEarnings",
    "estimatedRefund", "estimatedOwed", "campusTotalCost", "homeTotalCost",
  ];
  return primaryPatterns.some((p) => id.includes(p));
}

const filingStatusField = {
  id: "filingStatus",
  label: "Filing Status",
  defaultValue: "0",
  type: "select",
  options: [
    { value: "0", label: "Single" },
    { value: "1", label: "Married Filing Jointly" },
  ],
};

const definitions = {};

for (const slug of slugs) {
  const fn = slugToFunc[slug];
  const body = funcBlocks[fn];
  if (!body) {
    console.error("Missing body for", slug, fn);
    continue;
  }
  const meta = catalog[slug];
  if (!meta) {
    console.error("Missing catalog for", slug);
    continue;
  }

  const vCalls = [...body.matchAll(/v\(values,\s*"([^"]+)"(?:,\s*([^)]+))?\)/g)];
  const fieldMap = new Map();
  function normalizeDefault(val) {
    if (!val) return "0";
    if (/^-?\d+(\.\d+)?$/.test(val)) return val;
    const fallbacks = { monthlyPayment: "400" };
    return fallbacks[val] ?? "0";
  }

  for (const v of vCalls) {
    const id = v[1];
    if (id === "filingStatus") continue;
    const defaultVal = normalizeDefault(v[2]?.trim());
    if (!fieldMap.has(id)) fieldMap.set(id, defaultVal);
  }

  const fields = [...fieldMap.entries()].map(([id, defaultVal]) => {
    const suffix = fieldSuffix(id, defaultVal);
    const step = suffix === "%" ? "0.1" : undefined;
    return {
      id,
      label: camelToLabel(id),
      defaultValue: String(defaultVal),
      ...(suffix ? { suffix } : {}),
      ...(step ? { step } : {}),
    };
  });

  if (/filingStatus\(values\)/.test(body)) {
    fields.push({ ...filingStatusField });
  }

  const returnMatch = body.match(/return\s*\{([\s\S]*?)\n\s*\};/);
  const resultKeys = [];
  if (returnMatch) {
    for (const line of returnMatch[1].split("\n")) {
      const colon = line.match(/^\s*(\w+)\s*:/);
      const shorthand = line.match(/^\s*(\w+)\s*,\s*$/);
      if (colon) resultKeys.push(colon[1]);
      else if (shorthand) resultKeys.push(shorthand[1]);
    }
  }

  const results = resultKeys.map((id) => ({
    id,
    label: resultLabel(id),
    format: resultFormat(id, slug),
    ...(isPrimaryResult(id, resultKeys) ? { highlight: true } : {}),
  }));

  definitions[slug] = { slug, ...meta, fields, results };
}

function serializeField(f) {
  const parts = [
    `id: "${f.id}"`,
    `label: "${f.label}"`,
    `defaultValue: "${f.defaultValue}"`,
  ];
  if (f.suffix) parts.push(`suffix: "${f.suffix}"`);
  if (f.step) parts.push(`step: "${f.step}"`);
  if (f.type === "select") {
    parts.push(`type: "select"`);
    parts.push(
      `options: [${f.options.map((o) => `{ value: "${o.value}", label: "${o.label}" }`).join(", ")}]`,
    );
  }
  return `{ ${parts.join(", ")} }`;
}

function serializeResult(r) {
  const parts = [`id: "${r.id}"`, `label: "${r.label}"`, `format: "${r.format}"`];
  if (r.highlight) parts.push("highlight: true");
  return `{ ${parts.join(", ")} }`;
}

let out = `import type { CalculatorDefinition } from "./types";\n`;
out += `import { calculatorCatalog, getCalculatorMeta } from "@/data/calculators/catalog";\n`;
out += `import { computeFunctions } from "./compute/all";\n\n`;
out += `function def(slug: string, fields: CalculatorDefinition["fields"], results: CalculatorDefinition["results"]): CalculatorDefinition {\n`;
out += `  const meta = getCalculatorMeta(slug)!;\n`;
out += `  return { ...meta, fields, results };\n`;
out += `}\n\n`;
out += `export const calculatorDefinitions: Record<string, CalculatorDefinition> = {\n`;

for (const slug of slugs) {
  const d = definitions[slug];
  out += `  "${slug}": def("${slug}", [\n`;
  for (const f of d.fields) {
    out += `    ${serializeField(f)},\n`;
  }
  out += `  ], [\n`;
  for (const r of d.results) {
    out += `    ${serializeResult(r)},\n`;
  }
  out += `  ]),\n`;
}

out += `};\n\n`;
out += `// Ensure all compute functions have definitions\n`;
out += `void calculatorCatalog;\n`;
out += `const _slugCheck: Record<string, CalculatorDefinition> = Object.fromEntries(\n`;
out += `  Object.keys(computeFunctions).map((slug) => [slug, calculatorDefinitions[slug]]),\n`;
out += `);\n`;

fs.writeFileSync(path.join(root, "src/lib/calculators/definitions.ts"), out);
console.log("Generated", slugs.length, "definitions");
