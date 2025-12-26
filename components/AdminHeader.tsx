'use client'

import Link from 'next/link'
import { Home, LogOut, Sparkles } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'
import { getThemeLabel, THEME_KEYS } from '@/lib/preferences/themes'
import { useResolvedAppearance } from '@/lib/preferences/useResolvedAppearance'

export default function AdminHeader() {
  const { data: session } = useSession()
  const { preferences, setTheme } = usePreferences()
  const resolvedAppearance = useResolvedAppearance()

  const getInitials = (name?: string | null) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Calculate active pill position for sliding background
  const activeIndex = THEME_KEYS.findIndex((key) => key === preferences.theme)
  const safeIndex = activeIndex < 0 ? 0 : activeIndex
  const pillWidth = 80

  return (
    <header className="sticky top-0 z-50 border-b border-app backdrop-blur-xl surface-app shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Left: Premium Brand */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-app tracking-tight">Admin Dashboard</h1>
              <p className="text-[11px] text-muted font-medium">Portfolio Management</p>
            </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Pills */}
            <div className="hidden md:flex items-center relative rounded-full border border-app surface-app p-1">
              {/* Sliding background indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-accent shadow-lg shadow-accent/30 transition-all duration-300 ease-out"
                style={{
                  width: `${pillWidth}px`,
                  left: `calc(4px + ${safeIndex * pillWidth}px)`
                }}
              />

              {THEME_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  className={`relative z-10 w-20 rounded-full py-1.5 text-[11px] font-bold transition-colors duration-200 ${
                    preferences.theme === key
                      ? 'text-white'
                      : 'text-app hover:text-app/80'
                  } focus-visible:outline-none focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-app`}
                  aria-pressed={preferences.theme === key}
                >
                  {getThemeLabel(resolvedAppearance, key)}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 h-9 px-4 surface-app border border-app rounded-full hover:bg-app transition-all text-xs font-semibold text-app hover:shadow-sm"
            >
              <Home size={14} />
              <span className="hidden md:inline">View Site</span>
            </Link>

            {session?.user && (
              <>
                {/* User Avatar Pill */}
                <div className="flex items-center gap-2 h-9 pl-1.5 pr-4 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/15 transition-all group cursor-pointer shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-[10px] font-extrabold text-primary-foreground shadow-md">
                    {getInitials(session.user.name)}
                  </div>
                  <span className="text-xs font-bold text-primary max-w-[100px] truncate">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 h-9 px-4 bg-destructive/10 border border-destructive/20 rounded-full hover:bg-destructive/15 hover:border-destructive/30 transition-all text-xs font-bold text-destructive shadow-sm"
                >
                  <LogOut size={14} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
