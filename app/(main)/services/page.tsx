import { Code, Smartphone, Palette, Zap, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies',
      features: [
        'Responsive design',
        'SEO optimization',
        'Performance focused',
        'Cross-browser compatible'
      ],
      pricing: 'From $500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications',
      features: [
        'iOS & Android',
        'React Native',
        'App store deployment',
        'Push notifications'
      ],
      pricing: 'From $1,500'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, user-centered design that converts',
      features: [
        'Wireframing',
        'Prototyping',
        'User research',
        'Design systems'
      ],
      pricing: 'From $300'
    },
    {
      icon: Zap,
      title: 'Consulting',
      description: 'Technical guidance and code reviews',
      features: [
        'Architecture review',
        'Performance audit',
        'Best practices',
        'Team training'
      ],
      pricing: 'From $100/hr'
    }
  ]

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Services</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Professional development services tailored to your needs
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-secondary rounded-2xl p-8 border border-border hover:border-accent transition-all hover:shadow-xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-accent/10 rounded-xl">
                <service.icon className="text-accent" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-accent font-semibold">{service.pricing}</p>
              </div>
            </div>
            
            <p className="text-foreground/70 mb-6">{service.description}</p>
            
            <ul className="space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <Check className="text-accent flex-shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent to-accent-secondary rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
        <p className="text-lg mb-8 opacity-90">
          Let's discuss how I can help bring your ideas to life
        </p>
        <Link href="/request">
          <Button variant="secondary" size="lg">
            Request a Quote
          </Button>
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-secondary p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">What's your typical turnaround time?</h3>
            <p className="text-foreground/70">
              Most projects take 2-4 weeks depending on complexity. Rush delivery is available for an additional fee.
            </p>
          </div>
          <div className="bg-secondary p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">Do you offer maintenance and support?</h3>
            <p className="text-foreground/70">
              Yes! I offer ongoing maintenance packages to keep your project running smoothly and up-to-date.
            </p>
          </div>
          <div className="bg-secondary p-6 rounded-2xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">What payment methods do you accept?</h3>
            <p className="text-foreground/70">
              I accept bank transfers, PayPal, and most major credit cards. Payment terms are typically 50% upfront, 50% on completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}