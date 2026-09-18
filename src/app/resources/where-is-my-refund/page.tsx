import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileSearch } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { contact, externalLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "Where Is My Refund?",
  description:
    "Check your federal tax refund status. TEAMBASED Tax Services guides you to the official IRS Where's My Refund tool.",
};

export default function WhereIsMyRefundPage() {
  return (
    <>
      <PageHeader
        title="Where Is My Refund?"
        subtitle="Track your federal refund using the official IRS tool. We're here if you need help understanding the status."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources/financial-calculators" },
          { label: "Where Is My Refund?" },
        ]}
      />

      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <FileSearch className="mt-1 h-6 w-6 text-gold shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Check your IRS refund status</h2>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  Refund tracking is handled by the IRS. Use their official &quot;Where&apos;s My Refund&quot; tool with
                  your Social Security number, filing status, and exact refund amount from your return.
                </p>
                <a
                  href={externalLinks.refundStatus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-light"
                >
                  Open IRS Where&apos;s My Refund <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-sm text-slate-700 space-y-3">
            <p>
              <strong>Need help?</strong> If your refund is delayed or you received an IRS notice, contact us and we can
              review your filing.
            </p>
            <p>
              Phone:{" "}
              <a href={contact.phoneHref} className="text-gold font-medium hover:underline">
                {contact.phone}
              </a>
              <br />
              Email:{" "}
              <a href={`mailto:${contact.email}`} className="text-gold font-medium hover:underline">
                {contact.email}
              </a>
            </p>
            <Link href="/contact/request-appointment" className="inline-block text-gold font-medium hover:underline">
              Schedule an appointment →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
