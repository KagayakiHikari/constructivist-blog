import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "dark" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "construct-button-primary",
  secondary: "construct-button-secondary",
  dark: "construct-button-dark",
  danger: "construct-button-danger"
};

export function ConstructButton({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `construct-button ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
