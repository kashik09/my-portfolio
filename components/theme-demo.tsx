'use client'

export function ThemeDemo() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Color Palette
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Primary */}
          <div className="space-y-2">
            <div className="h-20 rounded-md bg-primary" />
            <p className="text-sm font-medium text-foreground">Primary</p>
          </div>

          {/* Secondary */}
          <div className="space-y-2">
            <div className="h-20 rounded-md bg-secondary" />
            <p className="text-sm font-medium text-foreground">Secondary</p>
          </div>

          {/* Accent */}
          <div className="space-y-2">
            <div className="h-20 rounded-md bg-accent" />
            <p className="text-sm font-medium text-foreground">Accent</p>
          </div>

          {/* Accent Secondary */}
          <div className="space-y-2">
            <div className="h-20 rounded-md bg-accent-secondary" />
            <p className="text-sm font-medium text-foreground">
              Accent Secondary
            </p>
          </div>

          {/* Background */}
          <div className="space-y-2">
            <div className="h-20 rounded-md border border-border bg-background" />
            <p className="text-sm font-medium text-foreground">Background</p>
          </div>

          {/* Card */}
          <div className="space-y-2">
            <div className="h-20 rounded-md border border-border bg-card" />
            <p className="text-sm font-medium text-foreground">Card</p>
          </div>

          {/* Muted */}
          <div className="space-y-2">
            <div className="h-20 rounded-md bg-muted" />
            <p className="text-sm font-medium text-foreground">Muted</p>
          </div>

          {/* Border */}
          <div className="space-y-2">
            <div className="h-20 rounded-md border-4 border-border bg-background" />
            <p className="text-sm font-medium text-foreground">Border</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Status Colors
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <div className="h-20 rounded-md bg-success" />
            <p className="text-sm font-medium text-foreground">Success</p>
          </div>

          <div className="space-y-2">
            <div className="h-20 rounded-md bg-warning" />
            <p className="text-sm font-medium text-foreground">Warning</p>
          </div>

          <div className="space-y-2">
            <div className="h-20 rounded-md bg-destructive" />
            <p className="text-sm font-medium text-foreground">Destructive</p>
          </div>

          <div className="space-y-2">
            <div className="h-20 rounded-md bg-info" />
            <p className="text-sm font-medium text-foreground">Info</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Alpha Channel Support
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[100, 80, 60, 40, 20].map(opacity => (
            <div key={opacity} className="space-y-2">
              <div
                className="h-20 rounded-md bg-primary"
                style={{ opacity: opacity / 100 }}
              />
              <p className="text-sm font-medium text-foreground">
                {opacity}% Opacity
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          UI Components
        </h2>
        <div className="space-y-4">
          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
              Primary Button
            </button>
            <button className="rounded-md bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/90">
              Secondary Button
            </button>
            <button className="rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground hover:bg-accent/90">
              Accent Button
            </button>
            <button className="rounded-md border border-border bg-card px-4 py-2 font-medium text-foreground hover:bg-card-hover">
              Outline Button
            </button>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 hover:bg-card-hover">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Card Title
              </h3>
              <p className="text-foreground-muted">
                This is a card with themed colors. Hover to see the hover
                effect.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Another Card
              </h3>
              <p className="text-foreground-muted">
                Cards adapt to the selected theme automatically.
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Text input"
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              placeholder="Textarea"
              rows={3}
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
