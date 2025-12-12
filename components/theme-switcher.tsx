'use client'

import { useTheme } from '@/lib/ThemeContext'
import { getTheme, getThemeNames, type ThemeName } from '@/lib/themes'
import { Zap, Waves, Moon, Sun } from 'lucide-react'

const themeIcons: Record<ThemeName, any> = {
  'monokai': Zap,
  'one-dark-pro': Waves,
  'dracula': Moon,
  'github-light': Sun
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const themeNames = getThemeNames()

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-6">
      <div>
        <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">
          Theme Selection
        </h3>
        <p className="mb-4 text-xs sm:text-sm text-foreground-muted">
          Choose from VS Code-inspired color schemes
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {themeNames.map(themeName => {
            const themeInfo = getTheme(themeName)
            const isActive = theme === themeName
            const IconComponent = themeIcons[themeName]

            return (
              <button
                key={themeName}
                onClick={() => setTheme(themeName)}
                className={`
                  group relative overflow-hidden rounded-lg border-2 p-3 sm:p-4 text-left transition-all
                  ${
                    isActive
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-accent hover:bg-card-hover'
                  }
                `}
              >
                <div className="mb-2 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent size={18} className="text-accent flex-shrink-0" />}
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">
                      {themeInfo.displayName}
                    </h4>
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground whitespace-nowrap">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-foreground-muted mb-3">
                  {themeInfo.description}
                </p>

                {/* Color preview */}
                <div className="flex gap-1.5">
                  {[
                    themeInfo.colors.primary,
                    themeInfo.colors.secondary,
                    themeInfo.colors.accent,
                    themeInfo.colors['accent-secondary'],
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-md border border-border shadow-sm"
                      style={{ backgroundColor: `rgb(${color})` }}
                    />
                  ))}
                </div>

                {/* Hover effect */}
                <div className={`
                  absolute inset-0 rounded-lg opacity-0 transition-opacity
                  ${!isActive && 'group-hover:opacity-100 bg-accent/5'}
                `} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function QuickThemeToggle() {
  const { theme, setTheme, availableThemes } = useTheme()

  // Cycle through themes on click
  const cycleTheme = () => {
    const currentIndex = availableThemes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    setTheme(availableThemes[nextIndex])
  }

  const IconComponent = themeIcons[theme]

  return (
    <button
      onClick={cycleTheme}
      className="rounded-md border border-border bg-card p-2 transition-colors hover:bg-card-hover hover:border-accent"
      aria-label="Cycle theme"
      title={`Current: ${getTheme(theme).displayName}`}
    >
      {IconComponent && <IconComponent size={20} className="text-accent" />}
    </button>
  )
}
