"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function getInitials(name?: string | null, email?: string | null) {
  const base = (name?.trim() || "").length ? name!.trim() : (email?.split("@")[0] || "");
  const parts = base.replace(/[._-]+/g, " ").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

export function UserAvatar({
  name,
  email,
  imageUrl,
  className,
  size = 36,
  showBadgeInitials = false,
}: {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  className?: string;
  size?: number;
  showBadgeInitials?: boolean;
}) {
  const initials = getInitials(name, email);
  const [imgError, setImgError] = useState(false);

  // Reset error state when imageUrl changes
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const showImage = imageUrl && !imgError;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={name ?? email ?? "User"}
      title={name ?? email ?? "User"}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name ?? "User avatar"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="select-none text-sm font-semibold">{initials}</span>
      )}

      {showBadgeInitials && showImage && (
        <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {initials}
        </span>
      )}
    </div>
  );
}
