'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/ThemeContext'
import { getThemesArray } from '@/lib/themes'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const themesArray = getThemesArray()
  const currentTheme = themesArray.find(t => t.key === theme)

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/request', label: 'Request' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-accent hover:opacity-80 transition">
            KashiCoding
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-accent transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
              >
                {currentTheme && <currentTheme.icon size={16} className="text-accent" />}
                <span>{currentTheme?.name}</span>
                <ChevronDown size={14} className={`transition-transform ${themeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Theme Dropdown */}
              {themeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setThemeMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-20">
                    {themesArray.map(({ key, name, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setTheme(key)
                          setThemeMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                          theme === key
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'text-foreground hover:bg-card-hover'
                        }`}
                      >
                        <Icon size={16} className={theme === key ? 'text-accent' : 'text-foreground/70'} />
                        <span>{name}</span>
                        {theme === key && (
                          <span className="ml-auto text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-card border border-border hover:bg-accent/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-foreground hover:text-accent hover:bg-card rounded-lg transition font-medium"
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