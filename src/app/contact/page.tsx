import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import OfficeMap from "@/components/OfficeMap";
import NewsletterSignup from "@/components/NewsletterSignup";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact TEAMBASED Tax Services in Germantown, MD. Call (240) 780-6910 or send us a message.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We're here to help with all your tax and financial needs."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us an Email</h2>
              <ContactForm />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Main Office</h2>
              <div className="rounded-2xl border border-border overflow-hidden shadow-sm mb-8">
                <OfficeMap embedded />
                <div className="p-6 bg-surface space-y-3">
                  <p><strong>Address:</strong> {contact.address}</p>
                  <p><strong>Phone:</strong> <a href={contact.phoneHref} className="text-gold hover:underline">{contact.phone}</a></p>
                  <p><strong>Email:</strong> <a href={`mailto:${contact.email}`} className="text-gold hover:underline">{contact.email}</a></p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Sign Up for Our Tax Newsletter</h3>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
