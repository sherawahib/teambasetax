export type ResourcePage = {
  title: string;
  subtitle: string;
  content: string[];
  list?: string[];
};

export const resourcePages: Record<string, ResourcePage> = {
  "financial-advisor-and-tax-consultant-services": {
    title: "Financial Advisor and Tax Consultant Services",
    subtitle: "Holistic financial and tax consulting for stability, growth, and long-term success.",
    content: [
      "Managing your finances can be overwhelming, especially when navigating complex tax laws, investment decisions, retirement planning, and risk management. Many individuals struggle with high fees, uncertainty, and the challenge of finding a trustworthy financial advisor and tax consultant who truly understands their needs.",
      "At TEAMBASED Tax Services, we provide expert financial and tax consulting to help you achieve stability, growth, and long-term success. Don't navigate your finances alone – reach out to TEAMBASED Tax Services for expert guidance!",
      "Tax laws are constantly evolving, making it difficult to ensure compliance while optimizing your financial situation. Without proper guidance, you may miss out on valuable deductions, credits, or tax-saving strategies. Our team stays updated on the latest regulations, helping you navigate the complexities of tax planning, preparation, and filing with confidence.",
      "We pride ourselves on providing holistic financial and tax solutions. Unlike firms that focus solely on investments or taxes, we integrate financial planning, tax strategy, and risk management for a comprehensive approach.",
    ],
    list: [
      "Proactive tax planning and minimization strategies",
      "Retirement and investment planning guidance",
      "Risk management and wealth preservation",
      "Integrated tax and financial advisory services",
    ],
  },
  "record-retention-guide": {
    title: "Record Retention Guide",
    subtitle: "Know how long to keep your tax and financial records.",
    content: [
      "Proper record retention is essential for tax compliance and audit protection. The IRS generally recommends keeping records that support income, deductions, or credits shown on your tax return until the period of limitations expires.",
    ],
    list: [
      "Tax returns: Keep indefinitely; supporting documents for at least 3–7 years",
      "W-2s, 1099s, and income records: 7 years",
      "Receipts for deductions and business expenses: 7 years",
      "Property records: Keep until 3 years after disposing of property",
      "Business records: 7 years minimum; longer for asset depreciation",
      "Bank statements and investment records: 7 years",
    ],
  },
  "irs-publications": {
    title: "IRS Publications",
    subtitle: "Key IRS publications for taxpayers and businesses.",
    content: [
      "The IRS publishes comprehensive guides to help taxpayers understand their obligations. Here are commonly referenced publications:",
    ],
    list: [
      "Pub 17 – Your Federal Income Tax (For Individuals)",
      "Pub 334 – Tax Guide for Small Business",
      "Pub 463 – Travel, Gift, and Car Expenses",
      "Pub 501 – Dependents, Standard Deduction, and Filing Information",
      "Pub 505 – Tax Withholding and Estimated Tax",
      "Pub 529 – Miscellaneous Deductions",
      "Pub 550 – Investment Income and Expenses",
      "Pub 590-A/B – IRA contributions and distributions",
    ],
  },
  "irs-forms": {
    title: "IRS Forms",
    subtitle: "Commonly used IRS tax forms.",
    content: ["Access the most frequently used IRS forms for individual and business tax filing:"],
    list: [
      "Form 1040 – U.S. Individual Income Tax Return",
      "Form 1040-ES – Estimated Tax for Individuals",
      "Form W-2 – Wage and Tax Statement",
      "Form W-4 – Employee's Withholding Certificate",
      "Form 1099 series – Various income reporting forms",
      "Form 1120 – U.S. Corporation Income Tax Return",
      "Form 1065 – U.S. Return of Partnership Income",
      "Schedule C – Profit or Loss from Business",
      "Schedule E – Supplemental Income and Loss",
    ],
  },
  "tax-appointment-checklist": {
    title: "Tax Appointment Checklist",
    subtitle: "Come prepared for your tax appointment.",
    content: ["Bring the following documents to ensure an efficient and accurate tax preparation appointment:"],
    list: [
      "Photo ID and Social Security cards for all filers and dependents",
      "Previous year's tax return",
      "All W-2s, 1099s, and other income statements",
      "Mortgage interest (Form 1098) and property tax statements",
      "Charitable contribution receipts",
      "Medical expense records (if applicable)",
      "Business income and expense records",
      "Estimated tax payment records",
      "Health insurance Form 1095",
      "Bank routing and account numbers for direct deposit",
    ],
  },
  "tax-rates": {
    title: "Tax Rates",
    subtitle: "2024 Federal income tax brackets and rates.",
    content: ["Federal income tax rates for 2024 (Single filers):"],
    list: [
      "10% – $0 to $11,600",
      "12% – $11,601 to $47,150",
      "22% – $47,151 to $100,525",
      "24% – $100,526 to $191,950",
      "32% – $191,951 to $243,725",
      "35% – $243,726 to $609,350",
      "37% – $609,351 and above",
      "Standard Deduction (Single): $14,600",
      "Standard Deduction (Married Filing Jointly): $29,200",
    ],
  },
  "tax-due-dates": {
    title: "Tax Due Dates",
    subtitle: "Important federal tax deadlines.",
    content: ["Mark these key dates on your calendar to avoid penalties:"],
    list: [
      "January 15 – Q4 estimated tax payment due",
      "January 31 – W-2s and 1099s must be mailed",
      "April 15 – Individual tax return and Q1 estimated tax due",
      "June 15 – Q2 estimated tax payment due",
      "September 15 – Q3 estimated tax payment due",
      "October 15 – Extended individual return deadline",
      "December 31 – Last day for tax moves (Roth conversions, charitable giving)",
    ],
  },
  "taxpayer-rights": {
    title: "Taxpayer Rights",
    subtitle: "Your rights when dealing with the IRS.",
    content: ["The IRS Taxpayer Bill of Rights outlines ten fundamental rights every taxpayer has:"],
    list: [
      "The Right to Be Informed",
      "The Right to Quality Service",
      "The Right to Pay No More than the Correct Amount of Tax",
      "The Right to Challenge the IRS's Position and Be Heard",
      "The Right to Appeal an IRS Decision in an Independent Forum",
      "The Right to Finality",
      "The Right to Privacy",
      "The Right to Confidentiality",
      "The Right to Retain Representation",
      "The Right to a Fair and Just Tax System",
    ],
  },
  "tax-glossary": {
    title: "Tax Glossary",
    subtitle: "Common tax terms explained.",
    content: ["Understanding tax terminology helps you make informed financial decisions:"],
    list: [
      "Adjusted Gross Income (AGI) – Total income minus specific deductions",
      "Deduction – An expense that reduces taxable income",
      "Credit – A dollar-for-dollar reduction in tax owed",
      "Withholding – Tax taken from paychecks throughout the year",
      "Estimated Tax – Quarterly payments for self-employed and others",
      "Standard Deduction – Fixed amount reducing taxable income",
      "Itemized Deductions – Specific expenses listed on Schedule A",
      "Capital Gain – Profit from selling an asset",
      "RMD – Required Minimum Distribution from retirement accounts",
      "EITC – Earned Income Tax Credit for low-to-moderate income workers",
    ],
  },
  "articles-and-guides": {
    title: "Articles & Guides",
    subtitle: "Helpful tax articles and guides from our client library.",
    content: [
      "Browse our collection of articles and guides covering tax planning strategies, deduction tips, business tax compliance, and seasonal tax advice. Our client library is updated regularly with practical information to help you stay informed.",
      "Contact us to access our full library of articles or subscribe to receive insights by email.",
    ],
  },
  "white-papers": {
    title: "White Papers",
    subtitle: "In-depth tax and financial analysis.",
    content: [
      "Our white papers provide detailed analysis on complex tax topics including entity selection, retirement planning strategies, estate tax considerations, and business tax optimization.",
      "Contact TEAMBASED Tax Services to request access to our white paper collection.",
    ],
  },
  "on-demand-videos": {
    title: "On-Demand Videos",
    subtitle: "Educational tax videos at your convenience.",
    content: [
      "Watch educational videos covering tax preparation tips, deadline reminders, deduction strategies, and business tax fundamentals. Our on-demand video library helps you learn at your own pace.",
    ],
  },
  "insights-by-email": {
    title: "Insights by Email",
    subtitle: "Tax insights delivered to your inbox.",
    content: [
      "Subscribe to receive timely tax insights, deadline reminders, and planning tips directly to your email. Stay ahead of tax season with expert guidance from TEAMBASED Tax Services.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Common questions about our tax services.",
    content: [],
    list: [
      "What documents do I need for tax preparation? – See our Tax Appointment Checklist for a complete list.",
      "Do you offer home visits? – Yes, we offer home visits for disabled individuals, even traveling an hour or more when needed.",
      "What are your fees? – We provide customized estimates during your initial consultation. First-time clients, seniors, military, and disabled individuals may qualify for special pricing.",
      "Do you handle business taxes? – Yes, we provide comprehensive business tax services including entity selection, bookkeeping, and financial statement preparation.",
      "Can you represent me before the IRS? – Yes, we offer professional IRS representation for audits, notices, and tax disputes.",
      "How do I make a payment? – Visit our Make a Payment page or contact our office directly.",
    ],
  },
  "tax-facts": {
    title: "Tax Facts",
    subtitle: "Interesting and useful tax facts.",
    content: ["Did you know?"],
    list: [
      "The federal income tax was first enacted in 1913 with the 16th Amendment.",
      "Approximately 90% of taxpayers now take the standard deduction.",
      "The IRS processes over 160 million individual tax returns annually.",
      "Self-employed individuals pay both the employee and employer portions of Social Security and Medicare taxes.",
      "Maryland is one of few states with both state income tax and county income tax.",
      "Contributing to a traditional IRA can reduce your current-year taxable income.",
    ],
  },
  "tax-history": {
    title: "Tax History",
    subtitle: "A brief history of taxation in America.",
    content: [
      "The history of taxation in the United States spans from colonial tariffs to the modern federal income tax system established in 1913. Understanding this history provides context for today's tax policies and debates.",
      "Key milestones include the Revenue Act of 1861 (first federal income tax), the 16th Amendment (1913), the Internal Revenue Code of 1954, and major reforms in 1986 and 2017.",
    ],
  },
  "subscribe-tax-tips": {
    title: "Subscribe to Tax Tips",
    subtitle: "Receive practical tax tips throughout the year.",
    content: [
      "Sign up for our tax tips newsletter to receive seasonal reminders, deduction alerts, and planning strategies. Use the newsletter signup form on our homepage or contact page to subscribe.",
    ],
  },
  "state-resources": {
    title: "State Resources",
    subtitle: "Maryland and DMV area tax resources.",
    content: ["Helpful state tax resources for Maryland and the surrounding DMV area:"],
    list: [
      "Maryland Comptroller – Individual and business tax filing",
      "Virginia Department of Taxation",
      "DC Office of Tax and Revenue",
      "Maryland county income tax rates vary by jurisdiction",
      "Maryland offers a state earned income credit",
      "Local property tax assessments by county",
    ],
  },
  "subscribe-tax-calendar": {
    title: "Subscribe to Tax Calendar",
    subtitle: "Never miss an important tax deadline.",
    content: [
      "Subscribe to our tax calendar to receive reminders for estimated tax payments, filing deadlines, and important tax dates throughout the year.",
    ],
  },
};

export const newsletterPages: Record<string, ResourcePage> = {
  blog: {
    title: "Blog",
    subtitle: "Tax tips, news, and insights from TEAMBASED Tax Services.",
    content: [
      "Stay informed with our latest blog posts covering tax law changes, planning strategies, small business tips, and seasonal tax advice. Check back regularly for new content or subscribe to our newsletter.",
    ],
  },
  "latest-edition": {
    title: "Latest Edition",
    subtitle: "Our most recent tax newsletter.",
    content: [
      "Read the latest edition of the TEAMBASED Tax Services newsletter featuring current tax updates, deadline reminders, and planning tips for the season ahead.",
      "Contact us to receive the latest edition directly or subscribe below.",
    ],
  },
  archives: {
    title: "Newsletter Archives",
    subtitle: "Browse past editions of our tax newsletter.",
    content: [
      "Access our archive of past newsletter editions covering tax topics from previous years. A valuable resource for understanding tax trends and planning strategies.",
    ],
  },
  subscribe: {
    title: "Subscribe to Our Newsletter",
    subtitle: "Get tax tips and updates delivered to your inbox.",
    content: [
      "Join our mailing list to receive tax tips, deadline reminders, and financial insights. Simply enter your name and email in the form below to subscribe.",
    ],
  },
};
