import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { averageRating, deleteTestimonial, readTestimonials } from "@/lib/testimonials-store";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteTestimonial(id);
  if (!removed) {
    return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
  }

  const testimonials = await readTestimonials();
  return NextResponse.json({
    success: true,
    averageRating: averageRating(testimonials),
    count: testimonials.length,
  });
}
