export type Testimonial = {
  id: string;
  name: string;
  email: string;
  rating: number;
  service: string;
  location: string;
  text: string;
  recommend: boolean;
  createdAt: string;
};

export type TestimonialInput = {
  name: string;
  email: string;
  rating: number;
  service: string;
  location?: string;
  text: string;
  recommend: boolean;
};
