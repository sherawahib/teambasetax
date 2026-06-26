import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader title="Accessibility" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-4xl px-4 prose-content">
          <p>
            TEAMBASED Tax Services is committed to ensuring digital accessibility for people with disabilities. We
            continually improve the user experience for everyone and apply relevant accessibility standards.
          </p>
          <p>
            If you experience difficulty accessing any part of this website, please contact us at{" "}
            <a href="mailto:michael.reis@teambasedtax.com" className="text-gold hover:underline">
              michael.reis@teambasedtax.com
            </a>{" "}
            or call (240) 780-6910 and we will work with you to provide the information you need.
          </p>
        </div>
      </section>
    </>
  );
}
