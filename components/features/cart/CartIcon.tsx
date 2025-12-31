'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export function CartIcon() {
  const { data: session } = useSession()
  const [itemCount, setItemCount] = useState(0)

  const fetchCartCount = useCallback(async () => {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) return

      const data = await response.json()
      setItemCount(data.cart?.items?.length || 0)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchCartCount()
    }
  }, [fetchCartCount, session])

  if (!session) {
    return null
  }

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-accent rounded-lg transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5 text-foreground" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}
