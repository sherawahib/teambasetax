import { NextResponse } from "next/server";
import { addTestimonial, averageRating, readTestimonials } from "@/lib/testimonials-store";
import type { TestimonialInput } from "@/types/testimonial";

const SERVICE_OPTIONS = [
  "Personal Tax Services",
  "Business Tax Services",
  "Bookkeeping Services",
  "IRS Representation",
  "Retirement Planning",
  "Estate Tax Planning",
  "Other",
];

export async function GET() {
  const testimonials = await readTestimonials();
  return NextResponse.json({
    testimonials,
    averageRating: averageRating(testimonials),
    count: testimonials.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TestimonialInput;

    if (!body.name?.trim() || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Please select a star rating." }, { status: 400 });
    }
    if (!body.service || !SERVICE_OPTIONS.includes(body.service)) {
      return NextResponse.json({ error: "Please select a service." }, { status: 400 });
    }
    if (!body.text?.trim() || body.text.trim().length < 20) {
      return NextResponse.json({ error: "Please write at least 20 characters in your feedback." }, { status: 400 });
    }
    if (!body.recommend) {
      return NextResponse.json({ error: "Please confirm you would recommend our services." }, { status: 400 });
    }

    const testimonial = await addTestimonial(body);
    const testimonials = await readTestimonials();

    return NextResponse.json({
      testimonial,
      averageRating: averageRating(testimonials),
      count: testimonials.length,
    });
  } catch {
    return NextResponse.json({ error: "Unable to save your testimonial. Please try again." }, { status: 500 });
  }
}
