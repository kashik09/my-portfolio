export default function AboutPage() {
  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <div className="container-md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section)' }}>
        {/* Header */}
        <section className="space-y-3">
          <h1 className="text-h1 font-bold text-foreground">about</h1>
          <p className="text-body text-muted-foreground/90">
            how i think about building things
          </p>
        </section>

        {/* Philosophy / Mindset */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-block)' }}>
          <div className="space-y-3">
            <h2 className="text-h2 font-bold text-foreground">i build to understand</h2>
            <p className="text-body text-muted-foreground/90 leading-relaxed">
              most things make sense once you've tried to build them yourself. reading docs helps, but actually implementing something — breaking it, fixing it, shipping it — that's when it clicks.
            </p>
            <p className="text-body text-muted-foreground/90 leading-relaxed">
              i learn by doing. every project is either solving a real problem or teaching me something new. usually both.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-h2 font-bold text-foreground">early-career doesn't mean less capable</h2>
            <p className="text-body text-muted-foreground/90 leading-relaxed">
              i'm early in my career, but that just means i'm learning fast. i approach problems fresh, without assumptions about "how it's always been done."
            </p>
            <p className="text-body text-muted-foreground/90 leading-relaxed">
              what i lack in years i make up for in curiosity and momentum. i ship working code, not excuses.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-h2 font-bold text-foreground">iteration over perfection</h2>
            <p className="text-body text-muted-foreground/90 leading-relaxed">
              first version doesn't have to be perfect. it has to exist. then you learn what actually matters and make it better.
            </p>
            <p className="text-body text-muted-foreground/90 leading-relaxed">
              this site itself is proof of that. it's not a template. it's custom-built, iteratively improved, and reflects how i think about products.
            </p>
          </div>
        </section>

        {/* What drives me */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-item)' }}>
          <h2 className="text-h2 font-bold text-foreground">what drives me</h2>
          <div className="grid gap-4 sm:gap-6">
            <div>
              <h3 className="text-h3 font-semibold text-foreground mb-1.5">solving real friction</h3>
              <p className="text-body text-muted-foreground/90 leading-relaxed">
                when something feels unnecessarily hard, that's a signal. i notice those moments and build solutions.
              </p>
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-foreground mb-1.5">learning in public</h3>
              <p className="text-body text-muted-foreground/90 leading-relaxed">
                not everything i build is polished. some projects are experiments. some are learning exercises. i keep them visible because the journey matters.
              </p>
            </div>
            <div>
              <h3 className="text-h3 font-semibold text-foreground mb-1.5">building products, not just features</h3>
              <p className="text-body text-muted-foreground/90 leading-relaxed">
                i think end-to-end. design, code, deployment, iteration. i want to understand the whole product lifecycle, not just one piece of it.
              </p>
            </div>
          </div>
        </section>

        {/* Current focus */}
        <section className="space-y-3">
          <h2 className="text-h2 font-bold text-foreground">where i'm at now</h2>
          <p className="text-body text-muted-foreground/90 leading-relaxed">
            based in kampala, uganda. building full-stack projects with next.js, react, tailwind, and postgres. shipping digital products, experimenting with new ideas, and figuring out what works.
          </p>
          <p className="text-body text-muted-foreground/90 leading-relaxed">
            actively looking for opportunities to work on real products with real users. if you're building something interesting, let's talk.
          </p>
        </section>
      </div>
    </div>
  )
}

/*
 * Note: About page is intentionally hardcoded for now.
 * Content is philosophical and rarely changes.
 * If dynamic content needed, consider creating a simple CMS
 * for philosophy sections only (not full résumé structure).
 */
