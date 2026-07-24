import Link from "next/link";

type Props = {
  variant?: "default" | "footer" | "hero" | "compact";
  /** Use on dark backgrounds (footer, dark header strips) */
  onDark?: boolean;
  className?: string;
  linkToHome?: boolean;
};

const sizeMap = {
  default: "h-auto w-[min(220px,58vw)] max-w-[220px] min-w-0",
  footer: "h-auto w-[min(240px,72vw)] max-w-[240px] min-w-0",
  hero: "h-12 sm:h-14 md:h-16 w-auto min-w-0 max-w-[min(320px,85vw)]",
  compact: "h-8 w-auto min-w-[110px] max-w-[150px]",
};

export default function Logo({
  variant = "default",
  onDark = false,
  className = "",
  linkToHome = true,
}: Props) {
  const sizeClass = sizeMap[variant];
  // logo-light.png = transparent original colors for dark backgrounds
  // logo.png = light-background friendly (white service text remapped to navy)
  const src = onDark ? "/logo-light.png" : "/logo.png";

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="TeamBased Tax"
      width={240}
      height={100}
      decoding="async"
      loading={variant === "default" ? "eager" : "lazy"}
      className={`object-contain object-left block ${sizeClass} ${className}`}
    />
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        className="inline-flex items-center shrink-0 hover:opacity-90 transition-opacity"
        aria-label="TeamBased Tax — Home"
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex items-center shrink-0">{image}</span>;
}
