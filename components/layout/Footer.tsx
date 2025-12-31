'use client'

import Link from 'next/link'
import { PreferencesPanel } from '@/components/features/preferences/PreferencesPanel'
import { Code2 } from 'lucide-react'

export default function Footer({ pathname }: { pathname?: string }) {
  const currentYear = new Date().getFullYear()
  const showPreferences = !pathname?.startsWith('/admin')
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href))

  const linkClass = (href: string) =>
    `transition-all duration-300 text-sm relative group ${
      isActive(href)
        ? 'text-primary font-medium'
        : 'text-muted hover:text-primary hover:translate-x-2'
    }`

  return (
    <footer className="footer-texture relative surface-app border-t border-app mt-auto overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-16 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '5s' }} />
        <div className="absolute top-1/2 -right-10 w-52 h-52 bg-primary/15 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '10s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 group">
                <Code2 size={28} className="accent" />
              <h3 className="text-xl font-bold accent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                kashi kweyu
              </h3>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-app mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/projects', label: 'Projects' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About' },
                { href: '/request', label: 'Request Service' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass(link.href)}>
                    <span className="relative">
                      <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        ▸
                      </span>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-app mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/legal/privacy-policy', label: 'Privacy Policy' },
                { href: '/legal/terms', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass(link.href)}>
                    <span className="relative">
                      <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        ▸
                      </span>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-app mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  href: 'https://github.com/kashik09',
                  label: 'GitHub',
                  icon: (
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  ),
                },
                {
                  href: 'https://linkedin.com/in/kashi-kweyu',
                  label: 'LinkedIn',
                  icon: (
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  ),
                },
                {
                  href: 'https://instagram.com/kashi_kweyu',
                  label: 'Instagram',
                  icon: (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  ),
                },
                {
                  href: 'https://wa.me/256760637783',
                  label: 'WhatsApp',
                  icon: (
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 bg-primary/10 rounded-xl border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-300 text-primary hover:text-primary-content hover:-translate-y-2 hover:rotate-3 hover:shadow-lg hover:shadow-primary/50"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </a>
              ))}
            </div>

            {showPreferences && (
              <div className="mt-6 p-4 rounded-xl bg-surface-base/50 backdrop-blur-sm border border-primary/10">
                <h4 className="font-semibold text-app mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Preferences
                </h4>
                <PreferencesPanel />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-app/50 text-center">
          <p className="text-muted text-sm">
            © {currentYear}{' '}
            <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Kashi Kweyu
            </span>
            . Built with Next.js & Tailwind CSS.{' '}
            <span className="inline-block animate-pulse">⚡</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float 20s infinite ease-in-out;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </footer>
  )
}