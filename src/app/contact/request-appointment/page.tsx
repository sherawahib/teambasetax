import PageHeader from "@/components/PageHeader";

import AppointmentRequestForm from "@/components/AppointmentRequestForm";

import { contact } from "@/data/site";

import { Calendar, Clock, MapPin, Phone, Shield } from "lucide-react";

import type { Metadata } from "next";



export const metadata: Metadata = {

  title: "Request Appointment",

  description: "Schedule a tax consultation with TEAMBASED Tax Services in Germantown, MD.",

};



const highlights = [

  {

    icon: Calendar,

    title: "Flexible Scheduling",

    text: "In-office, phone, video, or home visits available.",

  },

  {

    icon: Clock,

    title: "Quick Response",

    text: "We confirm appointments within 1 business day.",

  },

  {

    icon: Shield,

    title: "Confidential Review",

    text: "Your information is handled with strict confidentiality.",

  },

  {

    icon: MapPin,

    title: "Germantown Office",

    text: contact.address,

  },

];



export default function RequestAppointmentPage() {

  return (

    <>

      <PageHeader

        title="Request Appointment"

        subtitle="Schedule a personalized consultation with our tax professionals."

        breadcrumbs={[

          { label: "Home", href: "/" },

          { label: "Contact", href: "/contact" },

          { label: "Request Appointment" },

        ]}

      />

      <section className="py-10 md:py-16 bg-surface">

        <div className="mx-auto max-w-6xl px-4">

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

            <div className="lg:hidden rounded-2xl bg-navy text-white p-5 mb-2">

              <p className="text-sm text-white">Prefer to talk now?</p>

              <a href={contact.phoneHref} className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-black bg-white px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-11">

                <Phone className="h-5 w-5 shrink-0 text-black" />

                {contact.phone}

              </a>

            </div>



            <AppointmentRequestForm />



            <aside className="space-y-4 lg:sticky lg:top-28 order-last lg:order-none">

              <div className="rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6 shadow-sm">

                <h3 className="font-semibold text-foreground mb-4">Why schedule with us?</h3>

                <ul className="space-y-4">

                  {highlights.map(({ icon: Icon, title, text }) => (

                    <li key={title} className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">

                        <Icon className="h-4 w-4" />

                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-medium text-foreground">{title}</p>

                        <p className="text-xs text-muted mt-0.5 leading-relaxed break-words">{text}</p>

                      </div>

                    </li>

                  ))}

                </ul>

              </div>



              <div className="hidden lg:block rounded-2xl bg-navy text-white p-6">

                <p className="text-sm text-white">Prefer to talk now?</p>

                <a href={contact.phoneHref} className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-black bg-white px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">

                  <Phone className="h-5 w-5 text-black" />

                  {contact.phone}

                </a>

                <p className="text-xs text-white/90 mt-3">

                  Most clients start with a phone call. We offer first-time client discounts and special pricing for

                  seniors, military, and disabled individuals.

                </p>

              </div>



              <div className="rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6 shadow-sm">

                <h3 className="font-semibold text-foreground mb-2">What to expect</h3>

                <ol className="space-y-2 text-sm text-muted list-decimal list-inside">

                  <li>Complete the appointment request form</li>

                  <li>Our team reviews your tax profile</li>

                  <li>We contact you to confirm date & time</li>

                  <li>Receive a customized fee estimate at consultation</li>

                </ol>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </>

  );

}

