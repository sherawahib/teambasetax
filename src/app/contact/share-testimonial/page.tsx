import PageHeader from "@/components/PageHeader";
import TestimonialForm from "@/components/TestimonialForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Testimonial",
  description: "Share your experience and rate TEAMBASED Tax Services. Your review helps others in Maryland and the DMV area.",
};

export default function ShareTestimonialPage() {
  return (
    <>
      <PageHeader
        title="Share Your Review"
        subtitle="Rate our service and tell others about your experience — your feedback appears on our homepage."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "Share Testimonial" },
        ]}
      />
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-2xl px-4">
          <TestimonialForm />
        </div>
      </section>
    </>
  );
}
