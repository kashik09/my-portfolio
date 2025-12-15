'use client'

import Link from 'next/link'
import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeSelector } from './ThemeSelector'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/request', label: 'Request' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-6 md:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-accent hover:opacity-80 transition">
            <Code2 size={28} className="text-accent" />
            <span className="text-accent">Kashi Kweyu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                className="text-foreground hover:text-accent transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme Selector & Mobile Menu */}
          <div className="flex items-center gap-3">
            <ThemeSelector />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-card border border-border hover:bg-card-hover transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
