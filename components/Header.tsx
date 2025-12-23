'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ThemeSelector } from './ThemeSelector'
import { Code2, Menu, X, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react'
import { UserAvatar } from './ui/UserAvatar'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: session, status } = useSession()
  const isAuthed = status === 'authenticated'

  const publicLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/memberships', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/request', label: 'Request' },
  ]

  const authedLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/services', label: 'Services' },
    { href: '/memberships', label: 'Pricing' },
    { href: '/about-developer', label: 'About Developer' },
    { href: '/request', label: 'Request' },
  ]

  const navLinks = isAuthed ? authedLinks : publicLinks

  const displayName =
    session?.user?.name?.split(' ')[0] ||
    session?.user?.email?.split('@')[0] ||
    'Account'

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-6 md:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition"
          >
            <Code2 size={28} className="text-primary" />
            <span className="text-primary">Kashi Kweyu</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector />

            {!isAuthed ? (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition font-medium"
              >
                <UserIcon size={16} className="text-primary" />
                <span className="text-sm text-primary">Login</span>
              </Link>
            ) : (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-full hover:bg-card-hover transition font-medium"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                >
                  <UserAvatar
                    name={session?.user?.name}
                    email={session?.user?.email}
                    imageUrl={session?.user?.image}
                    size={28}
                  />
                  <span className="text-sm">{displayName}</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition text-sm"
                      role="menuitem"
                    >
                      <UserIcon size={16} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition text-sm"
                      role="menuitem"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-destructive/10 transition text-sm text-left"
                      role="menuitem"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-card border border-border hover:bg-card-hover transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-foreground hover:text-primary hover:bg-card rounded-lg transition font-medium"
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthed ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-center"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-card border border-border rounded-lg transition font-medium text-center"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-card border border-border rounded-lg transition font-medium text-center"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg transition font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
