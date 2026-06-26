import Link from "next/link";

import { ArrowRight, Phone } from "lucide-react";

import { contact } from "@/data/site";



type Props = {

  title: string;

  subtitle?: string;

  primaryHref?: string;

  primaryLabel?: string;

  secondaryHref?: string;

  secondaryLabel?: string;

};



export default function CTASection({

  title,

  subtitle,

  primaryHref = "/contact/request-appointment",

  primaryLabel = "Schedule Appointment",

  secondaryHref,

  secondaryLabel,

}: Props) {

  return (

    <section className="bg-black text-white">

      <div className="mx-auto max-w-7xl px-4 py-10 md:py-16 text-center">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>

        {subtitle && <p className="mt-3 text-white max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>}

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">

          <Link

            href={primaryHref}

            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-white hover:bg-gold-light transition-colors shadow-lg w-full sm:w-auto min-h-11"

          >

            {primaryLabel}

            <ArrowRight className="h-4 w-4" />

          </Link>

          {secondaryHref && secondaryLabel && (

            <Link

              href={secondaryHref}

              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto min-h-11"

            >

              {secondaryLabel}

            </Link>

          )}

          <a

            href={contact.phoneHref}

            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto min-h-11"

          >

            <Phone className="h-4 w-4 shrink-0" />

            {contact.phone}

          </a>

        </div>

      </div>

    </section>

  );

}

