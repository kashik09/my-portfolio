'use client'

export const dynamic = 'force-dynamic'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Download, FileText, Settings, ArrowLeft, Menu, X, User, AlertTriangle, Palette } from 'lucide-react'
import { useState, useEffect } from 'react'
import DashboardShell from '@/components/features/dashboard/DashboardShell'
import { Spinner } from '@/components/ui/Spinner'
import { usePreferences } from '@/lib/preferences/PreferencesContext'
import { getPossessive } from '@/lib/strings'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const { openModal } = usePreferences()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const displayName = (() => {
    const name = session?.user?.name?.trim()
    if (name) return name
    const email = session?.user?.email?.trim()
    if (email) {
      const localPart = email.split('@')[0]
      return localPart || email
    }
    return ''
  })()
  const dashboardTitle = displayName
    ? `${getPossessive(displayName)} Dashboard`
    : 'Dashboard'
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/downloads', icon: Download, label: 'My Downloads' },
    { href: '/dashboard/requests', icon: FileText, label: 'My Requests' },
    { href: '/support', icon: AlertTriangle, label: 'Complaints' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard')
    }
  }, [status, router])
  useEffect(() => {
    let cancelled = false
    async function loadSiteStatus() {
      try {
        const res = await fetch('/api/site/status')
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled && json.success && json.data) {
          setMaintenanceMode(Boolean(json.data.maintenanceMode))
        }
      } catch {
        // Ignore errors – dashboard should remain usable
      }
    }
    loadSiteStatus()
    return () => {
      cancelled = true
    }
  }, [])
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 text-base-content">
        <Spinner size="lg" />
      </div>
    )
  }
  if (!session) {
    return null
  }
  const header = (
    <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="text-xl font-bold text-primary">D</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-foreground">{dashboardTitle}</h1>
                <p className="text-xs text-muted-foreground">Personal Account</p>
              </div>
            </Link>
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Preferences Button */}
            <button
              onClick={openModal}
              className="p-2 rounded-lg bg-muted border border-border hover:bg-muted/70 transition"
              aria-label="Open preferences"
            >
              <Palette size={20} />
            </button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <User size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {session.user.name || session.user.email}
              </span>
            </div>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg bg-muted border border-border hover:bg-muted/70 transition"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
  const sidebar = (
    <div className="p-6">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 pt-8 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  )
  const mobileNav = sidebarOpen ? (
    <div
      className="md:hidden fixed inset-0 z-40 bg-base-200/50 backdrop-blur-sm"
      onClick={() => setSidebarOpen(false)}
    >
      <aside
        className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="mt-8 pt-8 border-t border-border">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </div>
  ) : null
  return (
    <DashboardShell
      header={header}
      sidebar={sidebar}
      mobileNav={mobileNav}
      sidebarClassName="w-64 min-h-[calc(100vh-73px)] bg-card border-r border-border sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto"
      mainClassName="p-4 md:p-8 bg-base-100"
    >
      {maintenanceMode && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 text-primary" size={16} />
          <p>
            The site is currently in maintenance mode. Your dashboard remains
            available, but some public features may be limited.
          </p>
        </div>
      )}
      {children}
    </DashboardShell>
  )
}
