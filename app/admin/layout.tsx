'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FolderKanban, FileText, Users, Settings, LogOut, Shield, Megaphone, ArrowUp, Package } from 'lucide-react'
import AdminHeader from '@/components/AdminHeader'
import { ToastProvider } from '@/components/ui/Toast'
import { SessionProvider } from 'next-auth/react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/admin/digital-products', icon: Package, label: 'Digital Products' },
    { href: '/admin/requests', icon: FileText, label: 'Requests' },
    { href: '/admin/ads', icon: Megaphone, label: 'Ads' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/security', icon: Shield, label: 'Security' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen bg-app text-app">
        <AdminHeader />

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 min-h-[calc(100vh-65px)] surface-app border-r border-app sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto backdrop-blur-sm">
            <div className="p-5">
              <h2 className="text-xs font-bold text-muted-app uppercase tracking-wider mb-4 px-3">Navigation</h2>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-app opacity-80 hover:opacity-100 hover:bg-app hover:text-[color:rgb(var(--primary))] transition-all group"
                  >
                    <item.icon size={18} className="text-muted-app group-hover:text-[color:rgb(var(--primary))] transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-app">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-app opacity-80 hover:opacity-100 hover:bg-app hover:text-[color:rgb(var(--primary))] transition-all group"
                >
                  <LogOut size={18} className="text-muted-app group-hover:text-[color:rgb(var(--primary))] transition-colors" />
                  <span>Back to Site</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-app max-w-[1600px]">
            <div className="pointer-events-auto space-y-6">
              {children}
            </div>
          </main>
        </div>

        {/* Scroll to Top Button */}
        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-11 h-11 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 z-50 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </ToastProvider>
    </SessionProvider>
  )
}
