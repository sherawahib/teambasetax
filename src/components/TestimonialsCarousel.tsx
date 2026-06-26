"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Quote } from "lucide-react";
import { StarRatingDisplay } from "@/components/StarRating";
import type { Testimonial } from "@/types/testimonial";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[360px] rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <StarRatingDisplay rating={testimonial.rating} size="md" />
        <span className="text-xs text-muted shrink-0">{formatDate(testimonial.createdAt)}</span>
      </div>
      <Quote className="h-5 w-5 text-gold/40 mb-2" aria-hidden />
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-5 min-h-[6.5rem]">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
        <p className="text-xs text-muted mt-0.5">
          {testimonial.service}
          {testimonial.location ? ` · ${testimonial.location}` : ""}
        </p>
      </div>
    </article>
  );
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(data.testimonials ?? []);
        setAverageRating(data.averageRating ?? 0);
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const loopItems = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [...testimonials, ...testimonials];
  }, [testimonials]);

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-surface overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[340px] h-52 bg-slate-100 rounded-2xl animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const durationSeconds = Math.max(testimonials.length * 12, 40);

  return (
    <section className="py-10 md:py-16 bg-surface overflow-hidden" aria-label="Client reviews">
      <div className="mx-auto max-w-7xl px-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold mb-2">Client Reviews</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What Our Clients Say</h2>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <StarRatingDisplay rating={averageRating} size="md" showValue />
              <span className="text-sm text-muted">
                Based on {testimonials.length} review{testimonials.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <Link
            href="/contact/share-testimonial"
            className="inline-flex items-center justify-center rounded-lg border border-gold text-gold px-5 py-2.5 text-sm font-semibold hover:bg-gold hover:text-white transition-colors min-h-11 shrink-0"
          >
            Write a Review
          </Link>
        </div>
      </div>

      <div className="relative group">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-surface to-transparent z-10" />

        <div className="overflow-hidden">
          <div
            className="flex gap-4 sm:gap-5 w-max testimonials-track group-hover:[animation-play-state:paused]"
            style={{ animationDuration: `${durationSeconds}s` }}
          >
            {loopItems.map((t, i) => (
              <ReviewCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
