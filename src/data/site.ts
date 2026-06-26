export const contact = {
  email: "michael.reis@teambasedtax.com",
  phone: "(240) 780-6910",
  phoneHref: "tel:+12407806910",
  address: "2 Village Green Court, Germantown MD 20876",
  addressLine1: "2 Village Green Court",
  addressLine2: "Germantown, MD 20876",
  mapQuery: "2+Village+Green+Court,+Germantown,+MD+20876,+USA",
  mapCenter: { lat: 39.129062, lng: -77.286089 },
};

export const externalLinks = {
  clientPortal: "/resources/client-portal",
  makePayment: "https://tbtaxservice.com/resources/make-a-payment/",
  refundStatus: "https://www.irs.gov/refunds",
  irsWithholding: "https://www.irs.gov/individuals/tax-withholding-estimator",
  natp: "https://www.natptax.com/",
};

export type NavItem = {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  {
    label: "Services",
    children: [
      { label: "Services Overview", href: "/services" },
      {
        label: "Tax Planning & Preparation",
        children: [
          { label: "Personal Tax Services", href: "/services/personal-tax-services" },
          { label: "Retirement Planning Services", href: "/services/retirement-planning-services" },
          { label: "Estate Tax Planning", href: "/services/estate-tax-planning" },
        ],
      },
      { label: "IRS Representation", href: "/services/irs-representation" },
      {
        label: "Business Tax Consulting",
        children: [
          { label: "Business Tax Services", href: "/services/business-tax-services" },
          { label: "Business Entity Selection", href: "/services/business-entity-selection" },
          { label: "Financial Statement Preparation", href: "/services/financial-statement-preparation" },
          { label: "Management Advisory", href: "/services/management-advisory" },
          { label: "Bookkeeping Services", href: "/services/bookkeeping-services" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    children: [
      {
        label: "Client Library",
        children: [
          { label: "Articles & Guides", href: "/resources/articles-and-guides" },
          { label: "White Papers", href: "/resources/white-papers" },
          { label: "On-Demand Videos", href: "/resources/on-demand-videos" },
          { label: "Insights by Email", href: "/resources/insights-by-email" },
          { label: "Frequently Asked Questions", href: "/resources/faq" },
          { label: "Tax Facts", href: "/resources/tax-facts" },
          { label: "Tax History", href: "/resources/tax-history" },
          { label: "Subscribe to Tax Tips", href: "/resources/subscribe-tax-tips" },
          { label: "State Resources", href: "/resources/state-resources" },
        ],
      },
      { label: "Financial Calculators", href: "/resources/financial-calculators" },
      {
        label: "Tax Resources",
        children: [
          { label: "Financial Advisor and Tax Consultant Services", href: "/resources/financial-advisor-and-tax-consultant-services" },
          { label: "Record Retention Guide", href: "/resources/record-retention-guide" },
          { label: "IRS Publications", href: "/resources/irs-publications" },
          { label: "IRS Forms", href: "/resources/irs-forms" },
          { label: "Tax Appointment Checklist", href: "/resources/tax-appointment-checklist" },
          { label: "Tax Rates", href: "/resources/tax-rates" },
          { label: "Tax Due Dates", href: "/resources/tax-due-dates" },
          { label: "Taxpayer Rights", href: "/resources/taxpayer-rights" },
          { label: "Tax Glossary", href: "/resources/tax-glossary" },
          { label: "Subscribe to Tax Calendar", href: "/resources/subscribe-tax-calendar" },
          { label: "IRS Withholding Calculator", href: externalLinks.irsWithholding, external: true },
        ],
      },
      { label: "Client Portal", href: "/resources/client-portal" },
      { label: "Admin Portal", href: "/admin" },
      { label: "Make a Payment", href: externalLinks.makePayment, external: true },
      { label: "Where is My Refund?", href: externalLinks.refundStatus, external: true },
    ],
  },
  {
    label: "Newsletter",
    children: [
      { label: "Blog", href: "/newsletter/blog" },
      { label: "Latest Edition", href: "/newsletter/latest-edition" },
      { label: "Newsletter Archives", href: "/newsletter/archives" },
      { label: "Subscribe", href: "/newsletter/subscribe" },
    ],
  },
  {
    label: "Contact",
    children: [
      { label: "Contact", href: "/contact" },
      { label: "Request Appointment", href: "/contact/request-appointment" },
      { label: "Share Testimonial", href: "/contact/share-testimonial" },
    ],
  },
];

export { calculatorCatalog as calculators, calculatorCount, getCalculatorsByCategory, CALCULATOR_CATEGORIES } from "@/data/calculators/catalog";

export const servicePages: Record<string, { title: string; subtitle: string; content: string[] }> = {
  "personal-tax-services": {
    title: "Personal Tax Services",
    subtitle: "Accurate, personalized tax preparation for individuals and families.",
    content: [
      "At TEAMBASED Tax Services, we provide thorough personal tax preparation tailored to your unique financial situation. Whether you have W-2 income, investments, rental properties, or multiple income streams, we ensure every deduction and credit is identified.",
      "Our team takes a detail-oriented approach to every return, double-checking calculations and reviewing documentation before submission. We help you navigate complex situations including itemized deductions, capital gains, education credits, and state tax obligations.",
      "Unlike automated tax software, we offer hands-on guidance and answer your questions throughout the process. First-time clients, seniors, military personnel, and disabled individuals may qualify for special pricing—contact us for a personalized estimate.",
    ],
  },
  "retirement-planning-services": {
    title: "Retirement Planning Services",
    subtitle: "Strategic planning to secure your financial future.",
    content: [
      "Retirement planning goes beyond tax preparation—it requires a forward-looking strategy that aligns your savings, investments, and tax planning. Our retirement planning services help you maximize tax-advantaged accounts, optimize withdrawal strategies, and plan for long-term financial security.",
      "We analyze your current retirement savings, projected Social Security benefits, pension income, and investment portfolio to create a comprehensive picture of your retirement readiness. Our team stays current on IRA, 401(k), and Roth conversion rules to help you make informed decisions.",
      "Whether you're decades from retirement or approaching your target date, we provide personalized guidance to help you achieve your goals with confidence and peace of mind.",
    ],
  },
  "estate-tax-planning": {
    title: "Estate Tax Planning",
    subtitle: "Protect your legacy with proactive estate tax strategies.",
    content: [
      "Estate tax planning helps ensure your assets transfer according to your wishes while minimizing tax burdens on your heirs. We work with individuals and families to evaluate estate tax exposure, gifting strategies, and trust planning considerations.",
      "Our approach includes reviewing your current estate plan, identifying potential tax liabilities, and recommending strategies to preserve wealth for future generations. We coordinate with your legal and financial advisors when needed to provide integrated guidance.",
      "Proactive estate planning can make a significant difference in the value passed to your beneficiaries. Contact us to discuss your estate planning needs and develop a strategy tailored to your goals.",
    ],
  },
  "irs-representation": {
    title: "IRS Representation",
    subtitle: "Expert advocacy when you need it most.",
    content: [
      "Facing an IRS audit, notice, or tax dispute can be stressful. TEAMBASED Tax Services provides professional IRS representation to protect your rights and resolve issues efficiently. We communicate directly with the IRS on your behalf, handling correspondence, negotiations, and appeals.",
      "Our experienced team helps with audit defense, installment agreements, offers in compromise, penalty abatement, and unfiled return situations. We understand IRS procedures and work to achieve the best possible outcome for your situation.",
      "Don't navigate IRS challenges alone. With professional representation, you gain an advocate who understands tax law and can guide you through every step of the resolution process.",
    ],
  },
  "business-tax-services": {
    title: "Business Tax Services",
    subtitle: "Comprehensive tax solutions for businesses of all sizes.",
    content: [
      "We provide a full range of business tax services, from proactive tax planning to meticulous preparation and filing. Whether you operate as a sole proprietor, partnership, S-Corporation, or C-Corporation, we handle payroll taxes, estimated payments, deductions, and credits.",
      "Our team helps identify tax-saving opportunities throughout the year—not just at filing time. We ensure compliance with federal, state, and local requirements while optimizing your tax position.",
      "Trust us as your one-stop solution for business tax needs. Contact us to schedule a consultation and learn how we can support your business's financial success.",
    ],
  },
  "business-entity-selection": {
    title: "Business Entity Selection",
    subtitle: "Choose the right structure for tax efficiency and liability protection.",
    content: [
      "Selecting the right business entity—sole proprietorship, LLC, S-Corp, or C-Corp—has significant tax and legal implications. We help you evaluate the pros and cons of each structure based on your business goals, income level, and growth plans.",
      "Our analysis considers self-employment tax, pass-through taxation, corporate tax rates, retirement plan options, and administrative requirements. The right entity choice can save thousands in taxes annually.",
      "Whether you're starting a new business or considering a restructure, we provide clear, actionable guidance to help you make an informed decision.",
    ],
  },
  "financial-statement-preparation": {
    title: "Financial Statement Preparation",
    subtitle: "Professional financial statements you can rely on.",
    content: [
      "Accurate financial statements are essential for business decision-making, loan applications, and tax preparation. We prepare income statements, balance sheets, and cash flow statements that reflect your business's true financial position.",
      "Our team ensures your financial records are organized, compliant, and ready for review by lenders, investors, or regulatory bodies. We work closely with your bookkeeping records to produce timely, accurate reports.",
      "Gain clarity into your business performance with professionally prepared financial statements tailored to your needs.",
    ],
  },
  "management-advisory": {
    title: "Management Advisory",
    subtitle: "Strategic financial guidance for business growth.",
    content: [
      "Beyond compliance, we offer management advisory services to help you make smarter financial decisions. Our advisory services include budgeting, cash flow analysis, profitability reviews, and growth planning.",
      "We act as a trusted advisor, providing insights that help you identify opportunities, control costs, and improve operational efficiency. Our holistic approach integrates tax strategy with business financial planning.",
      "Partner with TEAMBASED Tax Services for advisory support that drives long-term business success.",
    ],
  },
  "bookkeeping-services": {
    title: "Bookkeeping Services",
    subtitle: "Accurate records that keep your business on track.",
    content: [
      "Small business owners balance countless responsibilities, and bookkeeping often becomes an overwhelming challenge. Managing day-to-day finances, keeping accurate records, and ensuring compliance can take focus away from growth and profitability.",
      "Professional bookkeeping services guarantee accuracy and adherence to regulations. Mistakes in financial records can lead to compliance issues, tax penalties, or missed deduction opportunities. We utilize proven tools and standards to maintain precise records.",
      "Our bookkeeping integrates seamlessly with tax planning and preparation, ensuring all financial documents are in order ahead of tax deadlines. This comprehensive approach helps reduce tax burdens and makes tax season stress-free.",
    ],
  },
};
