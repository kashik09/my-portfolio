'use client'

import { useTheme } from './theme-provider'
import { getTheme, getThemeNames, type ThemeName } from '@/lib/themes'

export function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme()
  const themeNames = getThemeNames()

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          Theme Selection
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themeNames.map(themeName => {
            const themeInfo = getTheme(themeName)
            const isActive = theme === themeName

            return (
              <button
                key={themeName}
                onClick={() => setTheme(themeName)}
                className={`
                  group relative overflow-hidden rounded-md border-2 p-4 text-left transition-all
                  ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-accent hover:bg-card-hover'
                  }
                `}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">
                    {themeInfo.displayName}
                  </h4>
                  {isActive && (
                    <span className="text-xs font-medium text-primary">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground-muted">
                  {themeInfo.description}
                </p>

                {/* Color preview */}
                <div className="mt-3 flex gap-1">
                  {[
                    themeInfo[mode].primary,
                    themeInfo[mode].secondary,
                    themeInfo[mode].accent,
                    themeInfo[mode]['accent-secondary'],
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: `rgb(${color})` }}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div>
          <h4 className="font-semibold text-foreground">Dark Mode</h4>
          <p className="text-sm text-foreground-muted">
            Toggle between light and dark mode
          </p>
        </div>
        <button
          onClick={toggleMode}
          className="rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground transition-colors hover:bg-card-hover"
        >
          {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </div>
  )
}

export function QuickThemeToggle() {
  const { mode, toggleMode } = useTheme()

  return (
    <button
      onClick={toggleMode}
      className="rounded-md border border-border bg-card p-2 transition-colors hover:bg-card-hover"
      aria-label="Toggle theme"
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
