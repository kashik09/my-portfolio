import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

const proofItems = [
  'custom-built (no templates)',
  'component-driven ui',
  'json-based cms content',
  'designed + built end-to-end',
  'mobile-first responsive'
]

export function ProofSnapshot() {
  return (
    <Section id="proof" className="py-4 md:py-6">
      <Container>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {proofItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  )
}
