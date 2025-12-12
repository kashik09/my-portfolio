'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/ThemeContext'
import { Menu, X, Code2, Zap, Waves, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const themes = [
    { value: 'monokai', label: 'Monokai', Icon: Zap },
    { value: 'one-dark-pro', label: 'One Dark Pro', Icon: Waves },
    { value: 'dracula', label: 'Dracula', Icon: Moon },
    { value: 'github-light', label: 'GitHub Light', Icon: Sun }
  ]

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/request', label: 'Request' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl md:text-2xl font-bold text-accent hover:opacity-80 transition flex-shrink-0">
            <Code2 size={24} className="sm:w-7 sm:h-7" />
            <span className="hidden xs:inline">KashiCoding</span>
            <span className="xs:hidden">KC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm lg:text-base text-foreground hover:text-accent transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Selector */}
            <div className="relative">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="appearance-none pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-secondary border border-border rounded-lg text-xs sm:text-sm font-medium text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition cursor-pointer"
              >
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {themes.find(t => t.value === theme)?.Icon && (
                  (() => {
                    const IconComponent = themes.find(t => t.value === theme)!.Icon
                    return <IconComponent size={14} className="sm:w-4 sm:h-4 text-accent" />
                  })()
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg bg-secondary border border-border hover:bg-accent/10 transition flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} className="sm:w-5 sm:h-5 text-foreground" /> : <Menu size={18} className="sm:w-5 sm:h-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-foreground hover:text-accent hover:bg-secondary rounded-lg transition font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
