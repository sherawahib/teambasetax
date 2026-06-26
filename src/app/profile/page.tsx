import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Profile",
  description: "Learn about TEAMBASED Tax Services — your trusted tax preparation partner in Germantown, MD.",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="About TEAMBASED Tax Services"
        subtitle="Thorough, accurate tax preparation with personalized service for Maryland and the DMV area."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4 prose-content">
          <p>
            At TEAMBASED Tax Services, we believe every detail matters when it comes to your taxes. That&apos;s why we
            take a personalized, high-accuracy approach to tax preparation, bookkeeping, and financial consulting for
            individuals and businesses throughout Maryland and the DMV area.
          </p>
          <h2>Our Mission</h2>
          <p>
            We provide comprehensive, hands-on tax and financial services at a fair price. Every return is thoroughly
            reviewed before submission, ensuring compliance and accuracy so our clients don&apos;t have to worry about IRS
            errors or missed deductions.
          </p>
          <h2>What Sets Us Apart</h2>
          <ul>
            <li>Personalized consultations with customized pricing estimates</li>
            <li>First-time client discounts and special pricing for seniors, military, and disabled individuals</li>
            <li>Home visits available for clients with mobility challenges</li>
            <li>Integration of tax planning, bookkeeping, and financial advisory services</li>
            <li>Member of the National Association of Tax Professionals (NATP)</li>
          </ul>
          <h2>Our Commitment</h2>
          <p>
            With referrals at an all-time high and over 200 clients served annually, TEAMBASED Tax Services has built a
            reputation for trust, accuracy, and outstanding client service. Whether you need tax prep, business
            consulting, estate planning guidance, or help navigating IRS payment options, we&apos;re here to make tax season
            simple, stress-free, and financially beneficial.
          </p>
        </div>
      </section>
      <CTASection title="Ready to work with a trusted tax professional?" subtitle="Most clients start with a phone call." />
    </>
  );
}
