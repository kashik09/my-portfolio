'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type SiteStatusData = {
  maintenanceMode: boolean
  availableForBusiness: boolean
  adsEnabled: boolean
  adsProvider?: string | null
  adsClientId?: string | null
  adsPlacements?: Record<string, boolean>
}

type SiteStatusResponse = {
  success: boolean
  data?: SiteStatusData
}

type AdConsentResponse = {
  success: boolean
  data?: {
    personalizedAds: boolean
  }
}

export interface AdSlotProps {
  placement: string
  className?: string
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)

  // Never render ads on admin, dashboard, or auth routes
  if (
    !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth')
  ) {
    return null
  }

  useEffect(() => {
    let cancelled = false

    async function evaluateAdVisibility() {
      try {
        const [siteRes, consentRes] = await Promise.all([
          fetch('/api/site/status'),
          fetch('/api/me/ad-consent'),
        ])

        if (!siteRes.ok) {
          return
        }

        const siteJson = (await siteRes.json()) as SiteStatusResponse
        const adsEnabled = Boolean(siteJson.data?.adsEnabled)

        if (!adsEnabled) {
          return
        }

        const placements =
          (siteJson.data?.adsPlacements as Record<string, boolean> | undefined) ||
          {}
        const placementEnabled = placements[placement] === true

        if (!placementEnabled) {
          return
        }

        if (!consentRes.ok) {
          return
        }

        const consentJson = (await consentRes.json()) as AdConsentResponse
        const personalizedAds = Boolean(consentJson.data?.personalizedAds)

        if (!cancelled) {
          setShouldRender(adsEnabled && placementEnabled && personalizedAds)
        }
      } catch {
        // If anything fails, do not render ads
        if (!cancelled) {
          setShouldRender(false)
        }
      }
    }

    evaluateAdVisibility()

    return () => {
      cancelled = true
    }
  }, [placement])

  if (!shouldRender) {
    return null
  }

  return (
    <div
      className={`border border-border bg-muted text-muted-foreground text-xs rounded-lg px-4 py-3 ${
        className || ''
      }`}
    >
      <div className="font-semibold text-foreground mb-1">
        Sponsored placement
      </div>
      <div>
        Personalized ad slot for placement: <span className="text-primary">{placement}</span>
      </div>
    </div>
  )
}

