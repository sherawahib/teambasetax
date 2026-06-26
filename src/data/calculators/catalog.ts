import type { CalculatorCategory, CalculatorMeta } from "@/lib/calculators/types";

export const CALCULATOR_CATEGORIES: { id: CalculatorCategory; label: string }[] = [
  { id: "automobile", label: "Automobile" },
  { id: "business", label: "Business" },
  { id: "credit-cards", label: "Credit Cards" },
  { id: "mortgage", label: "Mortgage" },
  { id: "retirement", label: "Retirement" },
  { id: "insurance", label: "Insurance" },
  { id: "kids", label: "Kids" },
  { id: "investment", label: "Investment" },
  { id: "loans", label: "Loans" },
  { id: "paycheck", label: "Paycheck" },
  { id: "real-estate", label: "Real Estate" },
  { id: "savings", label: "Savings" },
  { id: "tax", label: "Tax" },
  { id: "young-adults", label: "Young Adults" },
];

export const calculatorCatalog: CalculatorMeta[] = [
  // Automobile
  { slug: "accelerated-payoff-auto", category: "automobile", title: "Accelerated Payoff Calculator", description: "See how extra payments shorten your auto loan and reduce interest." },
  { slug: "car-depreciation", category: "automobile", title: "Car Depreciation Calculator", description: "Estimate vehicle value decline over time using straight-line depreciation." },
  { slug: "ev-savings", category: "automobile", title: "Electric Vehicle (EV) Savings", description: "Compare fuel and maintenance costs of an EV versus a gas vehicle." },
  { slug: "car-affordability", category: "automobile", title: "How Much Can I Afford For A Car?", description: "Estimate a comfortable car price based on income and existing debt." },
  { slug: "car-payments", category: "automobile", title: "How Much Will My Car Payments Be?", description: "Calculate monthly auto-payments for a vehicle purchase." },
  { slug: "lease-or-buy-car", category: "automobile", title: "Lease or Buy a Car?", description: "Compare total cost of leasing versus buying a vehicle." },
  { slug: "auto-loan-ltv", category: "automobile", title: "Loan to Value Ratio – Auto Loan Calculator", description: "Calculate your auto loan-to-value ratio and equity position." },
  { slug: "loan-vs-dealer-financing", category: "automobile", title: "Loan vs. 0% Dealer Financing", description: "Compare bank loan interest cost against a 0% dealer promotion." },

  // Business
  { slug: "business-valuation", category: "business", title: "Business Valuation Calculator", description: "Estimate business value using a multiple of annual earnings." },
  { slug: "debt-to-equity", category: "business", title: "Debt-to-Equity Ratio Calculator", description: "Measure financial leverage from total debt and equity." },
  { slug: "cash-flow-projection", category: "business", title: "Cash Flow Projection Calculator", description: "Project operating cash flow over multiple years." },
  { slug: "cagr", category: "business", title: "Compound Annual Growth Rate (CAGR) Calculator", description: "Calculate CAGR between beginning and ending values." },
  { slug: "freelancer-rate", category: "business", title: "Freelancer Rate", description: "Determine hourly rate needed to meet income and expense goals." },
  { slug: "net-profit-margin", category: "business", title: "Net Profit Margin Calculator", description: "Calculate net profit as a percentage of revenue." },
  { slug: "roi", category: "business", title: "ROI Calculator", description: "Measure return on investment from gain and cost basis." },

  // Credit Cards
  { slug: "buy-now-vs-wait", category: "credit-cards", title: "Buy Now vs. Wait Calculator", description: "Compare buying today versus saving and buying later with interest." },
  { slug: "credit-card-balance-transfer", category: "credit-cards", title: "Credit Card Balance Transfer Savings", description: "Estimate savings from transferring a balance to a lower-rate card." },
  { slug: "credit-card-cash-advance", category: "credit-cards", title: "Credit Card Cash Advance", description: "Estimate fees and interest on a credit card cash advance." },
  { slug: "credit-card-minimum-payment", category: "credit-cards", title: "Credit Card Minimum Payment", description: "See payoff time and interest when paying only minimums." },
  { slug: "credit-card-payoff", category: "credit-cards", title: "Credit Card Payoff Calculator", description: "Calculate months to pay off credit card debt at a fixed payment." },
  { slug: "credit-card-rewards", category: "credit-cards", title: "Credit Card Rewards", description: "Estimate annual rewards value minus annual fees." },
  { slug: "extra-debt-payments", category: "credit-cards", title: "The Impact of Making Extra Payments On My Debt", description: "See interest and time saved from additional debt payments." },

  // Mortgage
  { slug: "adjustable-rate-mortgage", category: "mortgage", title: "Adjustable Rate Mortgage Calculator", description: "Compare fixed vs. adjustable rate mortgage payments over time.", custom: true },
  { slug: "closing-costs-impact", category: "mortgage", title: "Do Closing Costs Impact Interest Rates?", description: "Compare effective rate when paying points versus higher rate." },
  { slug: "home-affordability", category: "mortgage", title: "How Much Can I Afford For A Home?", description: "Estimate affordable home price from income and debts." },
  { slug: "interest-only-vs-traditional", category: "mortgage", title: "Interest-Only vs. Traditional Mortgage", description: "Compare interest-only and fully amortizing mortgage payments." },
  { slug: "mortgage-refinance", category: "mortgage", title: "Is Refinancing My Mortgage a Good Idea?", description: "Estimate break-even and savings from refinancing." },
  { slug: "mortgage", category: "mortgage", title: "Mortgage Calculator", description: "Estimate monthly payments, total interest, and amortization.", custom: true },
  { slug: "buy-or-rent", category: "mortgage", title: "Should I Buy or Rent", description: "Compare net cost of buying a home versus renting." },
  { slug: "mortgage-points", category: "mortgage", title: "Should You Pay Points for a Lower Mortgage Rate?", description: "Calculate break-even on discount points." },

  // Retirement
  { slug: "401k-future-value", category: "retirement", title: "401(k) Future Value Calculator", description: "Project the future value of your 401(k) contributions.", custom: true },
  { slug: "retirement-savings-sufficient", category: "retirement", title: "Are My Current Retirement Savings Sufficient?", description: "Compare projected savings to retirement income needs." },
  { slug: "inflation-retirement-income", category: "retirement", title: "Does Inflation Impact My Retirement Income Needs?", description: "Project future income needs adjusted for inflation." },
  { slug: "when-start-saving-retirement", category: "retirement", title: "When Should I Start Saving for Retirement?", description: "Compare starting savings now versus delaying." },
  { slug: "social-security-income", category: "retirement", title: "Social Security Income Estimation", description: "Estimate your potential Social Security retirement benefits.", custom: true },

  // Insurance
  { slug: "burial-final-expenses", category: "insurance", title: "Burial And Final Expenses", description: "Estimate total final expense and monthly savings needed." },
  { slug: "disability-insurance-needed", category: "insurance", title: "Disability Income Insurance Needed", description: "Estimate monthly disability coverage to replace income." },
  { slug: "future-value-annuity", category: "insurance", title: "Future Value of Annuity", description: "Project future value of regular annuity contributions." },
  { slug: "hsa-vs-comprehensive", category: "insurance", title: "High Deductible Plan With HSA vs. Comprehensive", description: "Compare HDHP with HSA versus traditional health plan costs." },
  { slug: "life-insurance-proceeds-duration", category: "insurance", title: "How Long Will My Current Life Insurance Proceeds Last?", description: "Estimate how long a death benefit supports beneficiaries." },
  { slug: "life-insurance-needed", category: "insurance", title: "How Much Life Insurance Do I Need?", description: "Estimate life insurance coverage using income replacement." },
  { slug: "retired-savings-duration", category: "insurance", title: "I'm Retired – How Long Will My Savings Last?", description: "Project how long retirement savings will last with withdrawals." },
  { slug: "lifetime-earnings", category: "insurance", title: "Lifetime Earnings Calculator", description: "Estimate total career earnings with annual raises." },
  { slug: "long-term-care-insurance", category: "insurance", title: "Long-Term Care Insurance Needs", description: "Estimate potential long-term care costs and coverage gap." },

  // Kids
  { slug: "allowance-investment-return", category: "kids", title: "Allowance Investment Return", description: "Show how investing allowance grows over time." },
  { slug: "chore-value-kids", category: "kids", title: "Chore Value Calculator for Kids", description: "Convert chore time into earned allowance value." },
  { slug: "compound-interest-kids", category: "kids", title: "Importance of Compound Interest", description: "Demonstrate compound growth for young savers." },
  { slug: "lemonade-stand", category: "kids", title: "Lemonade Stand Calculator", description: "Calculate profit from a simple lemonade stand business." },
  { slug: "penny-doubles", category: "kids", title: "Would You Rather Have A Penny That Doubles Each Day For A Month Or $1 Million?", description: "Compare penny-doubling versus a lump sum." },

  // Investment
  { slug: "asset-allocation", category: "investment", title: "Asset Allocation", description: "Calculate portfolio weights across asset classes." },
  { slug: "dividend-reinvestment", category: "investment", title: "Dividend Reinvestment", description: "Project growth with dividends reinvested." },
  { slug: "employee-stock-options", category: "investment", title: "Future Value of My Employee Stock Options", description: "Estimate value of in-the-money stock options." },
  { slug: "invest-or-pay-debt", category: "investment", title: "Invest My Money or Pay Off My Debt?", description: "Compare investing returns versus paying down debt." },
  { slug: "lump-sum-vs-dca", category: "investment", title: "Lump Sum vs. Dollar Cost Averaging Calculator", description: "Compare lump-sum investing to periodic contributions." },
  { slug: "percentage-change", category: "investment", title: "Percentage Change Calculator", description: "Calculate percent change between two values." },
  { slug: "portfolio-rebalancing", category: "investment", title: "Portfolio Rebalancing", description: "Calculate trades needed to restore target allocation." },
  { slug: "roth-vs-traditional-ira", category: "investment", title: "Roth vs. Traditional IRA", description: "Compare after-tax value of Roth and Traditional IRA." },
  { slug: "exercise-stock-options", category: "investment", title: "Should I Exercise My 'In-the-Money' Stock Options?", description: "Compare exercising now versus holding options." },

  // Loans
  { slug: "apr-vs-interest-rate", category: "loans", title: "APR vs. Interest Rate", description: "Compare stated interest rate to APR including fees." },
  { slug: "balloon-payment", category: "loans", title: "Balloon Payment Calculator", description: "Calculate balloon loan payments and final balance." },
  { slug: "loan-simulator", category: "loans", title: "Custom Visual Loan Simulator", description: "Simulate loan payoff with extra payments and view totals." },
  { slug: "debt-consolidation", category: "loans", title: "Should I Consolidate My Debt?", description: "Compare multiple debts versus a consolidated loan." },
  { slug: "student-loan-repayment", category: "loans", title: "Student Loan Repayment", description: "Estimate student loan payment and total interest." },

  // Paycheck
  { slug: "401k-contribution-impact", category: "paycheck", title: "401(k) Contribution Impact Calculator", description: "See take-home pay change from 401(k) contributions." },
  { slug: "garnishment", category: "paycheck", title: "Garnishment Calculator", description: "Estimate disposable income after wage garnishment limits." },
  { slug: "hourly-to-salary", category: "paycheck", title: "Hourly to Salary Converter", description: "Convert hourly wage to annual salary and vice versa." },
  { slug: "overtime-pay", category: "paycheck", title: "Overtime Pay Calculator", description: "Calculate overtime earnings at time-and-a-half." },
  { slug: "paycheck-comparison", category: "paycheck", title: "Paycheck Comparison Tool", description: "Compare net pay between two job offers." },
  { slug: "pay-frequency-impact", category: "paycheck", title: "Pay Frequency Impact Tool", description: "Compare annual totals across pay frequencies." },

  // Real Estate
  { slug: "fix-and-flip", category: "real-estate", title: "Fix & Flip Calculator", description: "Estimate profit on a fix-and-flip property investment." },
  { slug: "gross-rent-multiplier", category: "real-estate", title: "Gross Rent Multiplier", description: "Calculate GRM from property price and annual rent." },
  { slug: "land-value", category: "real-estate", title: "Land Value", description: "Estimate land value as a percentage of total property value." },
  { slug: "real-estate-cap-rate", category: "real-estate", title: "Real Estate Cap Rate", description: "Calculate capitalization rate for investment property." },
  { slug: "real-estate-commission", category: "real-estate", title: "Real Estate Commission Calculator", description: "Estimate agent commission on a property sale." },
  { slug: "rental-property", category: "real-estate", title: "Rental Property Calculator", description: "Analyze cash flow and ROI on rental property." },

  // Savings
  { slug: "becoming-millionaire", category: "savings", title: "Becoming a Millionaire", description: "Estimate years to reach a million-dollar savings goal." },
  { slug: "cd-calculator", category: "savings", title: "Certificate of Deposit Calculator", description: "Calculate CD maturity value with compound interest." },
  { slug: "college-savings", category: "savings", title: "College Savings Calculator", description: "Project college savings growth toward a tuition goal." },
  { slug: "compare-savings-rates", category: "savings", title: "Compare Savings Rates Calculator", description: "Compare ending balances at different interest rates." },
  { slug: "household-budget", category: "savings", title: "Comprehensive Household Budgeting Calculator", description: "Summarize monthly income, expenses, and surplus." },
  { slug: "impact-delaying-savings", category: "savings", title: "Impact of Delaying Savings", description: "Compare saving now versus starting later." },
  { slug: "fixed-deposit-returns", category: "savings", title: "Returns On Fixed Deposit", description: "Calculate returns on a fixed-term deposit." },
  { slug: "rule-of-72", category: "savings", title: "Rule of 72 for Investing Calculator", description: "Estimate years to double an investment at a given rate." },
  { slug: "simple-savings", category: "savings", title: "Simple Savings Calculator", description: "Project savings balance with regular contributions." },
  { slug: "inflation-calculator", category: "savings", title: "Inflation Calculator", description: "See how inflation erodes purchasing power over time." },
  { slug: "savings-growth", category: "savings", title: "What Could My Current Savings Grow To?", description: "Project future value of current savings and contributions." },

  // Tax
  { slug: "social-security-taxable", category: "tax", title: "Are My Social Security Benefits Taxable?", description: "Estimate taxable portion of Social Security benefits." },
  { slug: "capital-gains-loss", category: "tax", title: "Capital Gains/Loss Tax Estimator", description: "Estimate taxes on investment gains and losses.", custom: true },
  { slug: "earned-income-credit", category: "tax", title: "Earned Income Credit (EIC)", description: "Estimate federal earned income tax credit." },
  { slug: "investment-growth-comparison", category: "tax", title: "Growth of Taxable, Tax-Deferred, and Tax-Free Investments", description: "Compare how different account types grow over time.", custom: true },
  { slug: "marginal-vs-effective-tax", category: "tax", title: "Marginal vs. Effective Tax Rate", description: "Understand your marginal and effective federal tax rates.", custom: true },
  { slug: "standard-vs-itemized", category: "tax", title: "Standard Deduction vs. Itemized", description: "Determine whether itemizing deductions saves you more.", custom: true },
  { slug: "annuity-tax-advantages", category: "tax", title: "Tax Advantages of an Annuity", description: "Explore tax-deferred growth benefits of annuities.", custom: true },
  { slug: "tax-credit-vs-deduction", category: "tax", title: "Tax Credit vs. Tax Deduction", description: "See the dollar impact difference between credits and deductions.", custom: true },
  { slug: "traditional-ira-rmd", category: "tax", title: "Traditional IRA RMD Calculator", description: "Calculate required minimum distributions from your IRA.", custom: true },
  { slug: "tax-savings-interest", category: "tax", title: "Potential Tax Savings on Interest You Pay", description: "Estimate tax savings from deductible interest." },
  { slug: "taxable-equivalent-yield", category: "tax", title: "What is My Taxable-Equivalent Yield?", description: "Convert tax-free yield to taxable-equivalent yield." },
  { slug: "federal-tax-refund", category: "tax", title: "Individual Federal Tax Refund/Owed Estimator", description: "Estimate your federal tax refund or amount owed.", custom: true },
  { slug: "self-employment-tax", category: "tax", title: "Self-Employment Tax Owed", description: "Calculate self-employment tax on net business income.", custom: true },

  // Young Adults
  { slug: "career-path-affordability", category: "young-adults", title: "Career Path Affordability", description: "Compare education cost and expected salary by career path." },
  { slug: "college-budget", category: "young-adults", title: "College Budget Calculator", description: "Build a monthly college budget from income and expenses." },
  { slug: "campus-vs-home", category: "young-adults", title: "Should I Live on Campus or at Home?", description: "Compare total cost of on-campus versus commuting from home." },
  { slug: "student-loan-extra-payment", category: "young-adults", title: "Student Loan Extra Payment Impact", description: "See savings from extra student loan payments." },
  { slug: "summer-job-tax", category: "young-adults", title: "Summer Job Tax Calculator", description: "Estimate federal tax on summer job earnings." },
  { slug: "college-education-value", category: "young-adults", title: "What is the Value of a College Education?", description: "Compare lifetime earnings with and without a degree." },
];

export function getCalculatorsByCategory() {
  return CALCULATOR_CATEGORIES.map((cat) => ({
    ...cat,
    calculators: calculatorCatalog.filter((c) => c.category === cat.id),
  })).filter((g) => g.calculators.length > 0);
}

export function getCalculatorMeta(slug: string) {
  return calculatorCatalog.find((c) => c.slug === slug);
}

export const calculatorCount = calculatorCatalog.length;
