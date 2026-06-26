import type { LegalSection } from "@/components/LegalDocumentLayout";
import { contact } from "@/data/site";
import Link from "next/link";

const LAST_UPDATED = "June 19, 2026";
const EFFECTIVE_DATE = "June 19, 2026";

export const termsOfUseMeta = {
  title: "Terms of Use",
  subtitle:
    "Terms and conditions governing your access to and use of the TEAMBASED Tax Services website, tools, and online resources.",
  lastUpdated: LAST_UPDATED,
  effectiveDate: EFFECTIVE_DATE,
  summary: [
    "Use of this website does not create a client relationship until formally agreed.",
    "All content and calculators are for informational purposes only — not professional advice.",
    "Financial calculators run locally; results are estimates, not guarantees.",
    "You agree not to misuse the site or attempt unauthorized access.",
    "We are not liable for decisions made based solely on website content.",
    "Maryland law governs these terms unless otherwise required by applicable law.",
  ],
  relatedLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Accessibility Statement", href: "/accessibility" },
  ],
};

export const termsOfUseSections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          Welcome to the website of TEAMBASED Tax Services (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). These Terms of Use (&quot;Terms&quot;) govern your access to and use of our website,
          including all pages, content, financial calculators, forms, downloadable resources, and related online
          services (collectively, the &quot;Site&quot;).
        </p>
        <p>
          By accessing or using the Site, you agree to be bound by these Terms and our{" "}
          <Link href="/privacy-policy" className="text-gold hover:underline">
            Privacy Policy
          </Link>
          , which is incorporated herein by reference. If you do not agree to these Terms, you must not access or use
          the Site.
        </p>
        <p>
          We reserve the right to modify these Terms at any time. Changes are effective upon posting to this page with
          an updated effective date. Your continued use of the Site after changes constitutes acceptance of the revised
          Terms.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility & Account Access",
    content: (
      <>
        <p>
          The Site is intended for users who are at least 18 years of age and located in the United States. By using
          the Site, you represent that you meet these requirements and have the legal capacity to enter into these Terms.
        </p>
        <p>
          Certain areas of the Site, including client portals and payment systems, may require separate credentials or
          agreements. You are responsible for maintaining the confidentiality of any login credentials and for all
          activities conducted under your account. Notify us immediately at{" "}
          <a href={`mailto:${contact.email}`} className="text-gold hover:underline">
            {contact.email}
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </>
    ),
  },
  {
    id: "no-client-relationship",
    title: "No Client Relationship Created",
    content: (
      <>
        <p>
          <strong>
            Use of this website, submission of contact forms, appointment requests, or newsletter signups does not
            create a tax practitioner-client relationship.
          </strong>
        </p>
        <p>
          A professional engagement is established only when both parties agree in writing through an engagement
          letter, service agreement, or other formal authorization, and we have accepted you as a client after completing
          any required conflict and identity verification procedures.
        </p>
        <p>
          Information submitted through website forms prior to engagement may not be treated as protected tax
          practitioner communication in all circumstances. Do not submit highly sensitive documents until a client
          relationship has been confirmed.
        </p>
      </>
    ),
  },
  {
    id: "permitted-use",
    title: "Permitted Use of the Site",
    content: (
      <>
        <p>You may use the Site for lawful purposes only, including:</p>
        <ul>
          <li>Learning about our tax preparation, bookkeeping, and advisory services;</li>
          <li>Requesting appointments or contacting our office;</li>
          <li>Using financial calculators for personal educational and planning purposes;</li>
          <li>Accessing resources such as tax guides, FAQs, and newsletter content;</li>
          <li>Navigating to authorized client portals and payment systems linked from the Site.</li>
        </ul>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Site in any way that violates applicable federal, state, or local law;</li>
          <li>Attempt to gain unauthorized access to any systems, networks, or data;</li>
          <li>Introduce viruses, malware, or other harmful code;</li>
          <li>Scrape, crawl, or harvest data from the Site without prior written consent;</li>
          <li>Impersonate any person or entity or misrepresent your affiliation;</li>
          <li>Interfere with or disrupt the Site&apos;s operation or security features;</li>
          <li>Use automated tools to submit forms or overwhelm our systems;</li>
          <li>Reproduce, republish, or commercially exploit Site content without authorization.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    content: (
      <>
        <p>
          All content on the Site — including text, graphics, logos, images, calculator interfaces, layout, design, and
          software — is the property of TEAMBASED Tax Services or its licensors and is protected by United States
          copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Site for
          personal, non-commercial purposes. This license does not include the right to modify, distribute, reproduce,
          or create derivative works from Site content except as permitted by law.
        </p>
        <p>
          The TEAMBASED Tax Services name, logo, and related marks may not be used without our prior written permission.
        </p>
      </>
    ),
  },
  {
    id: "informational-only",
    title: "Informational Purposes & No Professional Advice",
    content: (
      <>
        <p>
          <strong>
            All content on this Site is provided for general informational and educational purposes only.
          </strong>{" "}
          Nothing on the Site constitutes tax, legal, accounting, financial, or investment advice, nor does it create
          any professional duty or obligation.
        </p>
        <p>
          Tax laws are complex and change frequently. Information on the Site may not reflect the most current legal
          developments or apply to your specific circumstances. You should not act or refrain from acting based solely
          on Site content without consulting a qualified professional who can review your complete financial picture.
        </p>
        <p>
          IRS Circular 230 Disclosure: To ensure compliance with requirements imposed by the IRS, we inform you that
          any U.S. federal tax advice contained in this website (including any attachments) is not intended or written
          to be used, and cannot be used, for the purpose of (i) avoiding penalties under the Internal Revenue Code or
          (ii) promoting, marketing, or recommending to another party any transaction or matter addressed herein.
        </p>
      </>
    ),
  },
  {
    id: "calculators",
    title: "Financial Calculators Disclaimer",
    content: (
      <>
        <p>
          The Site provides interactive financial and tax calculators that operate{" "}
          <strong>locally in your browser</strong>. Calculator inputs and outputs are not transmitted to external
          third-party calculator services.
        </p>
        <p>
          Calculator results are <strong>estimates only</strong> based on the information you enter and standard
          financial formulas. They are provided as self-help tools for independent use and are not intended to provide
          investment or tax advice. We cannot and do not guarantee their applicability or accuracy regarding your
          individual circumstances.
        </p>
        <p>
          All calculator examples are hypothetical and for illustrative purposes. Actual tax liability, mortgage
          payments, retirement projections, and other outcomes may differ materially. Always seek personalized advice
          from qualified professionals before making financial decisions.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Links & Services",
    content: (
      <>
        <p>
          The Site may contain links to third-party websites and services, including but not limited to the IRS, state
          tax agencies, client portals, payment processors, Google Maps, and professional directories. These links are
          provided for convenience only.
        </p>
        <p>
          We do not control, endorse, or assume responsibility for third-party content, privacy practices, or
          availability. Your use of third-party services is governed by their respective terms and policies. We
          encourage you to review those terms before use.
        </p>
      </>
    ),
  },
  {
    id: "forms-communications",
    title: "Forms, Communications & Electronic Consent",
    content: (
      <>
        <p>
          When you submit contact forms, appointment requests, testimonial forms, or newsletter subscriptions, you agree
          that:
        </p>
        <ul>
          <li>The information you provide is accurate to the best of your knowledge;</li>
          <li>We may contact you using the methods you specify regarding your inquiry;</li>
          <li>Newsletter communications may be sent until you opt out;</li>
          <li>Electronic communications may not always be secure — avoid sending Social Security numbers or full tax
            documents through unsecured web forms unless explicitly directed by our office.</li>
        </ul>
        <p>
          Submitting a form does not guarantee appointment availability, service acceptance, or specific pricing.
          Final fees are determined after consultation based on the complexity of your tax situation.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers of Warranties",
    content: (
      <>
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT
          WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY.
        </p>
        <p>
          We do not warrant that the Site will be uninterrupted, error-free, secure, or free of viruses or other harmful
          components. We make no warranty regarding the accuracy, completeness, or timeliness of any content,
          including tax rates, due dates, and regulatory information.
        </p>
      </>
    ),
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TEAMBASED TAX SERVICES AND ITS OFFICERS, EMPLOYEES, AGENTS,
          AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          OR ANY LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR
          USE OF OR INABILITY TO USE THE SITE.
        </p>
        <p>
          IN NO EVENT SHALL OUR TOTAL LIABILITY FOR ALL CLAIMS RELATED TO THE SITE EXCEED ONE HUNDRED DOLLARS ($100) OR
          THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.
        </p>
        <p>
          Some jurisdictions do not allow certain limitations of liability. In such cases, our liability is limited to
          the maximum extent permitted by law. Nothing in these Terms limits liability for gross negligence, willful
          misconduct, or other liabilities that cannot be excluded by law.
        </p>
      </>
    ),
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <>
        <p>
          You agree to indemnify, defend, and hold harmless TEAMBASED Tax Services and its officers, employees, and
          agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable
          attorneys&apos; fees) arising out of or related to:
        </p>
        <ul>
          <li>Your violation of these Terms;</li>
          <li>Your misuse of the Site;</li>
          <li>Your violation of any third-party rights;</li>
          <li>Information you submit through the Site that infringes or misrepresents any party.</li>
        </ul>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law & Dispute Resolution",
    content: (
      <>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Maryland, without
          regard to its conflict of law principles.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms or the Site shall first be addressed through good-faith
          negotiation. If unresolved, disputes shall be submitted to the state or federal courts located in Montgomery
          County, Maryland, and you consent to the personal jurisdiction of such courts.
        </p>
        <p>
          For clients with separate engagement agreements, the dispute resolution provisions of those agreements may
          supersede this section where applicable.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination & Suspension",
    content: (
      <>
        <p>
          We may suspend or terminate your access to the Site at any time, with or without notice, for conduct that we
          believe violates these Terms, poses a security risk, or is harmful to other users or our business.
        </p>
        <p>
          Upon termination, provisions that by their nature should survive — including intellectual property,
          disclaimers, limitation of liability, indemnification, and governing law — shall remain in effect.
        </p>
      </>
    ),
  },
  {
    id: "general",
    title: "General Provisions",
    content: (
      <>
        <ul>
          <li>
            <strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire
            agreement regarding Site use and supersede prior understandings on this subject.
          </li>
          <li>
            <strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in
            full force and effect.
          </li>
          <li>
            <strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver of that provision or
            any other provision.
          </li>
          <li>
            <strong>Assignment:</strong> You may not assign your rights under these Terms. We may assign our rights in
            connection with a merger, acquisition, or sale of assets.
          </li>
          <li>
            <strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our
            reasonable control, including natural disasters, government actions, or internet outages.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    content: (
      <>
        <p>For questions about these Terms of Use, contact:</p>
        <div className="rounded-xl bg-surface border border-border p-5 not-prose my-4">
          <p className="font-semibold text-foreground">TEAMBASED Tax Services</p>
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
          See also our <Link href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>,{" "}
          <Link href="/accessibility" className="text-gold hover:underline">Accessibility Statement</Link>, and{" "}
          <Link href="/contact" className="text-gold hover:underline">Contact page</Link>.
        </p>
      </>
    ),
  },
];
