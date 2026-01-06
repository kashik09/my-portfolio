'use client'

import { useEffect, useState } from 'react'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

interface PriceDisplayProps {
  usdPrice: number
  ugxPrice?: number
  creditPrice?: number | null
  showCurrencyToggle?: boolean
  showCredits?: boolean
  className?: string
  currency?: SupportedCurrency
  onCurrencyChange?: (currency: SupportedCurrency) => void
}

export function PriceDisplay({
  usdPrice,
  ugxPrice,
  creditPrice,
  showCurrencyToggle = true,
  showCredits = true,
  className = '',
  currency,
  onCurrencyChange,
}: PriceDisplayProps) {
  const [localCurrency, setLocalCurrency] = useState<SupportedCurrency>(
    currency || 'USD'
  )
  const isControlled = currency !== undefined

  useEffect(() => {
    if (!isControlled || !currency) return
    setLocalCurrency(currency)
  }, [currency, isControlled])

  const activeCurrency = isControlled ? currency : localCurrency
  const price =
    activeCurrency === 'USD' ? usdPrice : (ugxPrice || usdPrice * 3700)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-foreground">
          {formatPriceShort(price, activeCurrency)}
        </span>
        {showCurrencyToggle && (
          <button
            onClick={() => {
              const nextCurrency =
                activeCurrency === 'USD' ? 'UGX' : 'USD'
              onCurrencyChange?.(nextCurrency)
              if (!isControlled) {
                setLocalCurrency(nextCurrency)
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Show in {activeCurrency === 'USD' ? 'UGX' : 'USD'}
          </button>
        )}
      </div>

      {showCredits && creditPrice && creditPrice > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">or</span>
          <span className="font-semibold text-primary">{creditPrice} Credits</span>
          <span className="text-muted-foreground text-xs">(with membership)</span>
        </div>
      )}

      {activeCurrency !== 'USD' && (
        <p className="text-xs text-muted-foreground">
          ≈ {formatPriceShort(usdPrice, 'USD')}
        </p>
      )}
    </div>
  )
}
