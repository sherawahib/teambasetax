import { promises as fs } from "fs";
import path from "path";
import type { Testimonial, TestimonialInput } from "@/types/testimonial";

const DATA_PATH = path.join(process.cwd(), "data", "testimonials.json");

export async function readTestimonials(): Promise<Testimonial[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as Testimonial[];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function addTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const testimonials = await readTestimonials();
  const entry: Testimonial = {
    id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email: input.email.trim(),
    rating: input.rating,
    service: input.service,
    location: input.location?.trim() ?? "",
    text: input.text.trim(),
    recommend: input.recommend,
    createdAt: new Date().toISOString(),
  };

  testimonials.unshift(entry);
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(testimonials, null, 2), "utf8");
  return entry;
}

export function averageRating(testimonials: Testimonial[]): number {
  if (testimonials.length === 0) return 0;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const testimonials = await readTestimonials();
  const filtered = testimonials.filter((t) => t.id !== id);
  if (filtered.length === testimonials.length) return false;
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}
