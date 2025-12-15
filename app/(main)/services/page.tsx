import { Code, Smartphone, Palette, Zap, Check, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  Palette,
  Zap
}

interface Service {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
  pricing: string
}

interface ServicesData {
  header: {
    title: string
    subtitle: string
  }
  services: Service[]
  cta: {
    heading: string
    text: string
    buttonText: string
  }
  faq: Array<{
    id: string
    question: string
    answer: string
  }>
}

async function getServicesData(): Promise<ServicesData> {
  const filePath = join(process.cwd(), 'public', 'content', 'services.json')
  const fileContents = await readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

export default async function ServicesPage() {
  const data = await getServicesData()

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">{data.header.title}</h1>
        <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
          {data.header.subtitle}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.services.map((service) => {
          const IconComponent = iconMap[service.icon] || Code
          return (
            <div
              key={service.id}
              className="bg-card rounded-2xl p-8 border border-border hover:border-primary transition-all hover:shadow-xl"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <IconComponent className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-primary font-semibold">{service.pricing}</p>
                </div>
              </div>

              <p className="text-foreground-muted mb-6">{service.description}</p>

              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground-muted">
                    <Check className="text-primary flex-shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-4 text-white">{data.cta.heading}</h2>
        <p className="text-xl mb-8 text-white/90">
          {data.cta.text}
        </p>
        <Link href="/request">
          <Button variant="secondary" size="lg">
            {data.cta.buttonText}
          </Button>
        </Link>
      </section>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {data.faq.map((item) => (
            <div key={item.id} className="bg-card p-6 rounded-2xl border border-border hover:border-border transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-2">{item.question}</h3>
              <p className="text-foreground-muted">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}