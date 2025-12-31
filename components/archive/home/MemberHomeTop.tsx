'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, CreditCard, FileText } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

interface MembershipSummary {
  tier: string
  status: string
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  endDate: string
}

interface MeSummaryData {
  stats: {
    licensesCount: number
    requestsCount: number
    pendingRequestsCount: number
  }
  membership: MembershipSummary | null
}

function formatResetsIn(endDate?: string | null): string {
  if (!endDate) return 'Unknown'
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  if (diffTime <= 0) return 'Expired'
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return '1 day'
  if (diffDays < 30) return `${diffDays} days`
  const diffMonths = Math.round(diffDays / 30)
  return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
}

export function MemberHomeTop() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<MeSummaryData | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return

    let isActive = true

    fetch('/api/me/summary')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && isActive) {
          setData(json.data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch member summary:', err)
      })
      .finally(() => {
        if (isActive) {
          setHasLoaded(true)
        }
      })

    return () => {
      isActive = false
    }
  }, [status])

  // Return null if not authenticated (show normal homepage)
  if (status !== 'authenticated') {
    return null
  }

  const firstName = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <section className="max-w-6xl mx-auto px-4 mb-12">
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
        {status === 'authenticated' && !hasLoaded ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Welcome back, {firstName}!
              </h2>
              <p className="text-muted-foreground">
                Here's a quick overview of your account
              </p>
            </div>

            {/* Status Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pending Requests */}
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                    <p className="text-xl font-bold text-foreground">
                      {data?.stats.pendingRequestsCount ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credits Remaining */}
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="text-xl font-bold text-foreground">
                      {data?.membership?.remainingCredits ?? 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resets In */}
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resets In</p>
                    <p className="text-xl font-bold text-foreground">
                      {data?.membership
                        ? formatResetsIn(data.membership.endDate)
                        : 'No plan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
                  Dashboard
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/dashboard/requests">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg hover:bg-muted transition font-medium text-foreground">
                  Requests
                </button>
              </Link>
              <Link href="/dashboard/downloads">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg hover:bg-muted transition font-medium text-foreground">
                  Downloads
                </button>
              </Link>
              <Link href="/request">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-lg hover:bg-muted transition font-medium text-foreground">
                  Request Service
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
