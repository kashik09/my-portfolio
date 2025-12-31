"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, isLocalImageUrl, normalizePublicPath } from "@/lib/utils";

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
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const resolvedImageUrl =
    imageUrl && (imageUrl.startsWith("blob:") || imageUrl.startsWith("data:"))
      ? imageUrl
      : normalizePublicPath(imageUrl) ?? "";
  const imageIsLocal = isLocalImageUrl(resolvedImageUrl);

  const showImage = Boolean(resolvedImageUrl) && errorSrc !== resolvedImageUrl;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200 text-base-content/70",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={name ?? email ?? "User"}
      title={name ?? email ?? "User"}
    >
      {showImage ? (
        imageIsLocal ? (
          <Image
            src={resolvedImageUrl}
            alt={name ?? "User avatar"}
            width={size}
            height={size}
            sizes={`${size}px`}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setErrorSrc(resolvedImageUrl)}
          />
        ) : (
          <img
            src={resolvedImageUrl}
            alt={name ?? "User avatar"}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setErrorSrc(resolvedImageUrl)}
            loading="lazy"
          />
        )
      ) : (
        <span className="select-none text-sm font-semibold">{initials}</span>
      )}

      {showBadgeInitials && showImage && (
        <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-base-content/70 px-1.5 py-0.5 text-[10px] font-semibold text-base-100">
          {initials}
        </span>
      )}
    </div>
  );
}
