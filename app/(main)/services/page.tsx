'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Code, Smartphone, Palette, MessageSquare, CheckCircle } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

type Service = {
  id: string
  name: string
  icon: any
  description: string
  price: string
  features: string[]
}

export default function ServicesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pricing, setPricing] = useState<any>(null)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/content/pricing').then((r) => r.json()),
      fetch('/api/site/status').then((r) => r.json()),
    ])
      .then(([pricingData, statusData]) => {
        setPricing(pricingData)
        setIsAvailable(statusData.data?.availableForBusiness !== false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const services: Service[] = [
    {
      id: 'web-dev',
      name: 'Web Development',
      icon: Code,
      description: 'Full-stack web applications built with modern frameworks. From landing pages to complex web platforms.',
      price: pricing?.items?.['web-dev']?.displayFormat || 'From $500',
      features: [
        'Next.js, React, TypeScript',
        'Responsive & mobile-first',
        'SEO optimized',
        'Database integration',
        'Authentication & security',
      ],
    },
    {
      id: 'mobile-dev',
      name: 'Mobile Development',
      icon: Smartphone,
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      price: pricing?.items?.['mobile-dev']?.displayFormat || 'From $1,500',
      features: [
        'iOS & Android apps',
        'React Native or native development',
        'Backend integration',
        'App Store deployment',
        'Push notifications',
      ],
    },
    {
      id: 'ui-ux',
      name: 'UI/UX Design',
      icon: Palette,
      description: 'Beautiful, user-centered design systems and interfaces that users love.',
      price: pricing?.items?.['ui-ux']?.displayFormat || 'From $300',
      features: [
        'Figma design files',
        'Design system creation',
        'Wireframes & prototypes',
        'User research',
        'Accessibility compliance',
      ],
    },
    {
      id: 'consulting',
      name: 'Consulting',
      icon: MessageSquare,
      description: 'Technical consulting for architecture, code reviews, and strategic planning.',
      price: pricing?.items?.consulting?.displayFormat || 'From $100/hr',
      features: [
        'Architecture review',
        'Code audits',
        'Technology selection',
        'Performance optimization',
        'Team mentoring',
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">Services</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From idea to launch, I help bring your digital products to life with clean code and thoughtful design.
          </p>
        </div>

        {/* Availability Banner */}
        {!isAvailable && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    Currently Unavailable for New Projects
                  </h3>
                  <p className="text-sm text-yellow-800">
                    I'm currently at capacity with existing client work. Feel free to reach out, and I'll let you know when availability opens up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="bg-card rounded-xl border border-border p-8 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{service.price}</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3">{service.name}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isAvailable ? "Let's Build Something Great" : 'Interested in Working Together?'}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {isAvailable
                ? 'Have a project in mind? Get in touch to discuss your ideas and get a custom quote.'
                : 'Reach out to discuss your project. I\'ll notify you when I have availability.'}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Discovery</h3>
              <p className="text-sm text-muted-foreground">
                We discuss your project goals, requirements, and timeline
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Build</h3>
              <p className="text-sm text-muted-foreground">
                I design and develop your solution with regular check-ins
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Launch</h3>
              <p className="text-sm text-muted-foreground">
                We deploy your project and ensure everything runs smoothly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
