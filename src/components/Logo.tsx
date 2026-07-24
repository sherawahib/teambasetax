import Link from "next/link";

type Props = {
  variant?: "default" | "footer" | "hero" | "compact";
  /** Use on dark backgrounds (footer, dark header strips) */
  onDark?: boolean;
  className?: string;
  linkToHome?: boolean;
};

const sizeMap = {
  default: "h-auto w-[min(250px,64vw)] max-w-[250px] min-w-0",
  footer: "h-auto w-[min(270px,78vw)] max-w-[270px] min-w-0",
  hero: "h-14 sm:h-16 md:h-20 w-auto min-w-0 max-w-[min(360px,85vw)]",
  compact: "h-8 w-auto min-w-[120px] max-w-[160px]",
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
