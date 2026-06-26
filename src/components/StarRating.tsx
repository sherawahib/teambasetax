"use client";

import { Star } from "lucide-react";

type DisplayProps = {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
};

export function StarRatingDisplay({ rating, size = "sm", showValue = false }: DisplayProps) {
  const starClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${i < Math.round(rating) ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
      {showValue && <span className="ml-1.5 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
}

type InputProps = {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
};

export function StarRatingInput({ value, onChange, error }: InputProps) {
  return (
    <div>
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const filled = starValue <= value;
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              onClick={() => onChange(starValue)}
              className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <Star className={`h-8 w-8 ${filled ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"}`} />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-muted">{value > 0 ? `${value}/5` : "Select rating"}</span>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
