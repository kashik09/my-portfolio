'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

type ProductsWishlistLinkProps = {
  count?: number | null
}

export function ProductsWishlistLink({ count }: ProductsWishlistLinkProps) {
  return (
    <Link
      href="/products/wishlist"
      className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      aria-label="Saved for later"
    >
      <Heart className="h-4 w-4 shrink-0" />
      <span>Saved for later</span>
      {typeof count === 'number' && (
        <span className="ml-1 inline-flex min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
