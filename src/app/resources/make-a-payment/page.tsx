import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CreditCard, Mail, Phone, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PaymentRequestForm from "@/components/PaymentRequestForm";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Make a Payment",
  description:
    "Pay your TEAMBASED Tax Services invoice securely. Request a payment link, pay by phone, or mail a check.",
};

export default function MakePaymentPage() {
  return (
    <>
      <PageHeader
        title="Make a Payment"
        subtitle="Pay invoices for tax preparation, bookkeeping, and related services — right here on teambasedtax.com."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources/financial-calculators" },
          { label: "Make a Payment" },
        ]}
      />

      <section className="py-10 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Request a secure payment</h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Submit the form and our office will email you a secure payment link or confirm your preferred method.
              All payment requests are reviewed by our team at {contact.email}.
            </p>
            <div className="mt-8">
              <PaymentRequestForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gold">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold text-foreground">Payment options</h3>
              </div>
              <ul className="mt-4 space-y-4 text-sm text-slate-700">
                <li className="flex gap-3">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong>Secure online / card link</strong> — Request below and we&apos;ll send a payment link for
                    your invoice.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong>Pay by phone</strong> — Call{" "}
                    <a href={contact.phoneHref} className="font-medium text-gold hover:underline">
                      {contact.phone}
                    </a>{" "}
                    during business hours.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong>Check by mail</strong> — Payable to TEAMBASED Tax Services
                    <br />
                    {contact.addressLine1}
                    <br />
                    {contact.addressLine2}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    <strong>Email questions</strong> —{" "}
                    <a href={`mailto:${contact.email}`} className="font-medium text-gold hover:underline">
                      {contact.email}
                    </a>
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-semibold text-foreground">Already a portal client?</h3>
              <p className="mt-2 text-sm text-muted">
                View invoices and balances in your secure client portal, then return here to request payment.
              </p>
              <Link
                href="/resources/client-portal"
                className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-gold px-4 text-sm font-semibold text-gold hover:bg-gold hover:text-white transition-colors"
              >
                Open Client Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
