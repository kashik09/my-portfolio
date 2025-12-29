// components/ui/Badge.tsx
import * as React from "react";

type BadgeVariant = "default" | "secondary" | "outline";

export function Badge({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";

  const variants: Record<BadgeVariant, string> = {
    default:
      "bg-primary/10 text-primary border-primary/20",
    secondary:
      "bg-base-200 text-base-content border-base-300",
    outline:
      "bg-transparent text-base-content border-base-300",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

export default Badge;
