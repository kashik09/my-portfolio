'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SiteStatusResponse {
  success: boolean
  data?: {
    maintenanceMode: boolean
    availableForBusiness: boolean
    adsEnabled: boolean
  }
}

interface AdConsentResponse {
  success: boolean
  data?: {
    personalizedAds: boolean
  }
}

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [adsEnabled, setAdsEnabled] = useState(false)
  const [personalizedAds, setPersonalizedAds] = useState(false)
  const [updatingAdsConsent, setUpdatingAdsConsent] = useState(false)

  useEffect(() => {
    const acknowledged = typeof window !== 'undefined'
      ? localStorage.getItem('cookieNoticeAcknowledged')
      : null

    if (!acknowledged) {
      setTimeout(() => setIsVisible(true), 500)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchSiteStatus() {
      try {
        const res = await fetch('/api/site/status', {
          method: 'GET',
        })

        if (!res.ok) return

        const json = (await res.json()) as SiteStatusResponse
        if (!cancelled && json.success && json.data) {
          setAdsEnabled(Boolean(json.data.adsEnabled))
        }
      } catch {
        // Silently ignore - banner should never block usage
      }
    }

    async function fetchAdConsent() {
      try {
        const res = await fetch('/api/me/ad-consent', {
          method: 'GET',
        })

        if (!res.ok) return

        const json = (await res.json()) as AdConsentResponse
        if (!cancelled && json.success && json.data) {
          setPersonalizedAds(Boolean(json.data.personalizedAds))
        }
      } catch {
        // Silently ignore - treat as no personalized ads consent
      }
    }

    fetchSiteStatus()
    fetchAdConsent()

    return () => {
      cancelled = true
    }
  }, [])

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieNoticeAcknowledged', 'true')
    }
    setIsVisible(false)
  }

  const handleTogglePersonalizedAds = async () => {
    const nextValue = !personalizedAds

    setPersonalizedAds(nextValue)
    setUpdatingAdsConsent(true)

    try {
      await fetch('/api/me/ad-consent', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalizedAds: nextValue }),
      })
    } catch {
      // If the request fails (e.g., not signed in), keep local preference only
    } finally {
      setUpdatingAdsConsent(false)
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-foreground mb-1">
                Cookies & site data
              </h3>
              <p className="text-sm text-muted-foreground">
                We use essential cookies to keep the site working (such as login and security).
                We may also use limited analytics to understand usage and improve the site.
                If ads are enabled, you can control whether we use your data for personalized ads.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              {adsEnabled && (
                <button
                  type="button"
                  onClick={handleTogglePersonalizedAds}
                  disabled={updatingAdsConsent}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border border-border ${
                    personalizedAds ? 'bg-primary text-foreground' : 'bg-muted text-foreground'
                  }`}
                >
                  Personalized ads: {personalizedAds ? 'On' : 'Off'}
                </button>
              )}
              <Link
                href="/legal/privacy-policy"
                className="text-sm text-primary hover:underline font-medium whitespace-nowrap"
              >
                Learn more
              </Link>
              <button
                onClick={handleDismiss}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium whitespace-nowrap"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
