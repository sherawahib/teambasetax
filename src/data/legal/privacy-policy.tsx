import type { LegalSection } from "@/components/LegalDocumentLayout";
import { contact } from "@/data/site";
import Link from "next/link";

const LAST_UPDATED = "June 19, 2026";
const EFFECTIVE_DATE = "June 19, 2026";

export const privacyPolicyMeta = {
  title: "Privacy Policy",
  subtitle:
    "How TEAMBASED Tax Services collects, uses, protects, and retains your personal and tax-related information.",
  lastUpdated: LAST_UPDATED,
  effectiveDate: EFFECTIVE_DATE,
  summary: [
    "We collect information only as needed to provide tax and financial services.",
    "Tax data is treated as highly confidential and protected with strict safeguards.",
    "We do not sell your personal information to third parties.",
    "You may request access, correction, or deletion of your data where applicable.",
    "Financial calculators run locally — no data is sent to external services.",
    "We comply with applicable federal and Maryland privacy requirements.",
  ],
  relatedLinks: [
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Accessibility Statement", href: "/accessibility" },
  ],
};

export const privacyPolicySections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction & Scope",
    content: (
      <>
        <p>
          TEAMBASED Tax Services (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website at{" "}
          <strong>tbtaxservice.com</strong> and provides tax preparation, bookkeeping, IRS representation, and related
          financial consulting services from our office in Germantown, Maryland.
        </p>
        <p>
          This Privacy Policy describes how we collect, use, disclose, retain, and protect information when you visit
          our website, submit forms, schedule appointments, subscribe to our newsletter, use our financial calculators,
          or engage our professional services.
        </p>
        <p>
          This policy applies to all visitors, prospective clients, and current clients. By using our website or
          services, you agree to the practices described herein. If you do not agree, please discontinue use of our
          website and contact us to discuss alternatives.
        </p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: (
      <>
        <p>We collect information in the following categories depending on how you interact with us:</p>
        <h3>Information You Provide Directly</h3>
        <ul>
          <li>
            <strong>Contact information:</strong> Name, email address, phone number, mailing address, and preferred
            contact method.
          </li>
          <li>
            <strong>Appointment & inquiry data:</strong> Service requests, scheduling preferences, tax year, filing
            status, business entity type, document readiness, and messages submitted through contact or appointment
            forms.
          </li>
          <li>
            <strong>Newsletter subscriptions:</strong> Name and email address when you opt in to tax tips or newsletter
            communications.
          </li>
          <li>
            <strong>Client tax & financial data:</strong> Social Security numbers, income records, W-2 and 1099 forms,
            deduction documentation, business records, prior-year returns, and other information necessary to prepare
            accurate tax returns and provide advisory services.
          </li>
          <li>
            <strong>Payment information:</strong> Billing details processed through our authorized payment providers. We
            do not store full credit card numbers on our servers.
          </li>
        </ul>
        <h3>Information Collected Automatically</h3>
        <ul>
          <li>
            <strong>Website usage data:</strong> IP address, browser type, device type, pages visited, referring URLs,
            and general location (city/state level) through standard server logs and analytics tools.
          </li>
          <li>
            <strong>Cookies & similar technologies:</strong> Session cookies for site functionality and optional
            analytics cookies to improve user experience. See Section 8 for details.
          </li>
        </ul>
        <h3>Information We Do Not Collect via Calculators</h3>
        <p>
          Our financial and tax calculators operate entirely in your browser. Calculator inputs and results are{" "}
          <strong>not transmitted</strong> to our servers or any third-party API unless you separately submit that
          information through a contact form.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use collected information for legitimate business purposes, including:</p>
        <ul>
          <li>Responding to inquiries and scheduling consultations or appointments;</li>
          <li>Preparing, reviewing, and filing federal, state, and local tax returns;</li>
          <li>Providing bookkeeping, payroll, IRS representation, and financial advisory services;</li>
          <li>Communicating about deadlines, document requests, appointment confirmations, and service updates;</li>
          <li>Sending newsletters and tax tips to subscribers who have opted in;</li>
          <li>Processing payments and maintaining billing records;</li>
          <li>Complying with legal, regulatory, and professional obligations applicable to tax practitioners;</li>
          <li>Improving our website, services, and client experience through aggregated analytics;</li>
          <li>Detecting, preventing, and addressing fraud, security incidents, or unauthorized access.</li>
        </ul>
        <p>
          We will not use your tax or financial information for purposes unrelated to providing services without your
          consent, except as required by law or professional standards.
        </p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal Bases for Processing",
    content: (
      <>
        <p>Depending on the context, we process personal information based on:</p>
        <ul>
          <li>
            <strong>Contractual necessity:</strong> To perform services you have requested or to take steps at your
            request before entering into a client engagement.
          </li>
          <li>
            <strong>Consent:</strong> For newsletter communications, optional cookies, and certain marketing
            communications you may withdraw at any time.
          </li>
          <li>
            <strong>Legal obligation:</strong> To comply with IRS Circular 230 requirements, state board regulations,
            anti-money laundering rules, court orders, and lawful government requests.
          </li>
          <li>
            <strong>Legitimate interests:</strong> To operate and secure our business, prevent fraud, and improve our
            services, balanced against your privacy rights.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How We Share Information",
    content: (
      <>
        <p>
          <strong>We do not sell, rent, or trade your personal information.</strong> We may share information only in
          the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Tax authorities:</strong> Filing tax returns and related documents with the IRS, Maryland Comptroller,
            and other applicable federal, state, or local agencies as authorized by you.
          </li>
          <li>
            <strong>Service providers:</strong> Trusted vendors who assist with secure document storage, email delivery,
            appointment scheduling, payment processing, and website hosting — bound by confidentiality agreements.
          </li>
          <li>
            <strong>Professional advisors:</strong> Attorneys, financial advisors, or other professionals when you
            authorize coordinated services.
          </li>
          <li>
            <strong>Legal requirements:</strong> When required by subpoena, court order, regulatory inquiry, or to
            protect the rights, property, or safety of TEAMBASED Tax Services, our clients, or others.
          </li>
          <li>
            <strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, with
            continued protection of your information.
          </li>
        </ul>
        <p>
          We require third parties to use your information solely for the purposes for which it was shared and to
          maintain appropriate security measures.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain personal and tax information for as long as necessary to fulfill the purposes described in this
          policy and to meet legal and professional obligations.
        </p>
        <ul>
          <li>
            <strong>Tax records:</strong> Retained in accordance with IRS and Maryland record retention guidelines,
            typically a minimum of three to seven years depending on document type and circumstances.
          </li>
          <li>
            <strong>Client engagement files:</strong> Maintained for the duration of the client relationship and
            applicable post-engagement periods required by law.
          </li>
          <li>
            <strong>Website form submissions:</strong> Retained as long as needed to respond to inquiries and for
            reasonable business record-keeping, then securely deleted or anonymized.
          </li>
          <li>
            <strong>Marketing data:</strong> Retained until you unsubscribe or request deletion, subject to legal
            suppression list requirements.
          </li>
        </ul>
        <p>
          When information is no longer needed, we securely destroy or de-identify it using industry-standard methods.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security Measures",
    content: (
      <>
        <p>
          We implement administrative, technical, and physical safeguards designed to protect your information against
          unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul>
          <li>Encrypted transmission (SSL/TLS) for data submitted through our website;</li>
          <li>Access controls limiting employee access to client data on a need-to-know basis;</li>
          <li>Secure storage of physical and electronic tax documents;</li>
          <li>Password-protected systems and multi-factor authentication where applicable;</li>
          <li>Regular review of security practices and vendor compliance;</li>
          <li>Staff training on confidentiality and data handling procedures.</li>
        </ul>
        <p>
          No method of transmission or storage is 100% secure. While we strive to protect your information, we cannot
          guarantee absolute security. You are responsible for maintaining the confidentiality of any portal credentials
          we provide.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Tracking Technologies",
    content: (
      <>
        <p>Our website may use cookies and similar technologies to:</p>
        <ul>
          <li>Enable essential site functionality and navigation;</li>
          <li>Remember preferences during your session;</li>
          <li>Analyze aggregated traffic patterns to improve content and usability.</li>
        </ul>
        <p>You can control cookies through your browser settings. Disabling cookies may affect certain website features. We do not use cookies to collect tax or financial data entered into our local calculators.</p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Privacy Rights & Choices",
    content: (
      <>
        <p>Depending on your location and applicable law, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you;</li>
          <li>Request correction of inaccurate or incomplete information;</li>
          <li>Request deletion of information, subject to legal and professional retention requirements;</li>
          <li>Opt out of marketing emails by using the unsubscribe link or contacting us directly;</li>
          <li>Withdraw consent where processing is consent-based;</li>
          <li>Receive a copy of your data in a portable format where technically feasible.</li>
        </ul>
        <p>
          To exercise these rights, contact us using the information in Section 12. We will respond within a reasonable
          timeframe and may require identity verification. Note that tax practitioners may be legally required to retain
          certain records even after a deletion request.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Our website and services are not directed to individuals under the age of 18. We do not knowingly collect
          personal information from children. If you believe we have inadvertently collected information from a minor,
          please contact us immediately so we can promptly delete it.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links & Services",
    content: (
      <>
        <p>
          Our website may contain links to third-party sites such as the IRS, state tax agencies, client portals, and
          payment processors. We are not responsible for the privacy practices of those external sites. We encourage you
          to review their privacy policies before providing any personal information.
        </p>
        <p>
          Engagement of TEAMBASED Tax Services through our website does not create a client relationship until a formal
          engagement letter or agreement is executed.
        </p>
      </>
    ),
  },
  {
    id: "contact-changes",
    title: "Contact Us & Policy Updates",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, contact:
        </p>
        <div className="rounded-xl bg-surface border border-border p-5 not-prose my-4">
          <p className="font-semibold text-foreground">TEAMBASED Tax Services — Privacy Officer</p>
          <p className="text-sm text-muted mt-2">{contact.address}</p>
          <p className="text-sm text-muted">
            Email:{" "}
            <a href={`mailto:${contact.email}`} className="text-gold hover:underline">
              {contact.email}
            </a>
          </p>
          <p className="text-sm text-muted">
            Phone:{" "}
            <a href={contact.phoneHref} className="text-gold hover:underline">
              {contact.phone}
            </a>
          </p>
        </div>
        <p>
          We may update this Privacy Policy periodically to reflect changes in law, technology, or our business
          practices. Material changes will be posted on this page with an updated &quot;Last Updated&quot; date.
          Continued use of our website after changes constitutes acceptance of the revised policy.
        </p>
        <p>
          See also our <Link href="/terms-of-use" className="text-gold hover:underline">Terms of Use</Link> and{" "}
          <Link href="/accessibility" className="text-gold hover:underline">Accessibility Statement</Link>.
        </p>
      </>
    ),
  },
];
