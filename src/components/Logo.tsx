import Link from "next/link";

type Props = {
  variant?: "default" | "footer" | "hero" | "compact";
  /** Use on dark/green backgrounds (header, footer, hero) */
  onDark?: boolean;
  className?: string;
  linkToHome?: boolean;
};

const sizeMap = {
  default: "h-auto w-[min(200px,55vw)] max-w-[200px] min-w-0",
  footer: "h-auto w-[min(200px,70vw)] max-w-[200px] min-w-0",
  hero: "h-14 sm:h-16 md:h-20 w-auto min-w-0 max-w-[min(340px,85vw)]",
  compact: "h-8 w-auto min-w-[120px] max-w-[160px]",
};

export default function Logo({
  variant = "default",
  onDark = false,
  className = "",
  linkToHome = true,
}: Props) {
  const sizeClass = sizeMap[variant];
  const src = onDark ? "/logo-light.png" : "/logo.png";

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Team Based Tax Services"
      width={200}
      height={80}
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
        aria-label="Team Based Tax Services — Home"
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex items-center shrink-0">{image}</span>;
}
