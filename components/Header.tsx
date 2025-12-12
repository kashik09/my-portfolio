'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/ThemeContext'
import { Menu, X, Code2 } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const themes = [
    { value: 'monokai', label: 'Monokai', emoji: '🌙' },
    { value: 'one-dark-pro', label: 'One Dark Pro', emoji: '💎' },
    { value: 'dracula', label: 'Dracula', emoji: '🧛' },
    { value: 'github-light', label: 'GitHub Light', emoji: '☀️' }
  ]

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/request', label: 'Request' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-accent hover:opacity-80 transition">
            <Code2 size={28} />
            <span>KashiCoding</span>
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

          {/* Theme Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
            >
              {themes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-secondary border border-border hover:bg-accent/10 transition"
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
                  className="px-4 py-2 text-foreground hover:text-accent hover:bg-secondary rounded-lg transition font-medium"
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
