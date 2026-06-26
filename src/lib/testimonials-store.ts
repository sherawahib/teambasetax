import type { Testimonial, TestimonialInput } from "@/types/testimonial";
import { prisma } from "@/lib/prisma";

function mapTestimonial(row: {
  id: string;
  name: string;
  email: string;
  rating: number;
  service: string;
  location: string;
  text: string;
  recommend: boolean;
  createdAt: Date;
}): Testimonial {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    rating: row.rating,
    service: row.service,
    location: row.location,
    text: row.text,
    recommend: row.recommend,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function readTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapTestimonial);
}

export async function addTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const row = await prisma.testimonial.create({
    data: {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: input.name.trim(),
      email: input.email.trim(),
      rating: input.rating,
      service: input.service,
      location: input.location?.trim() ?? "",
      text: input.text.trim(),
      recommend: input.recommend,
    },
  });
  return mapTestimonial(row);
}

export function averageRating(testimonials: Testimonial[]): number {
  if (testimonials.length === 0) return 0;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await prisma.testimonial.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
