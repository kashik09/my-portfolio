'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload } from 'lucide-react'

export default function RequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    budget: '',
    timeline: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Request submitted successfully!')
        router.push('/services')
      } else {
        setError('Failed to submit request. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Request a Service</h1>
        <p className="text-xl text-foreground/70">
          Tell me about your project and I'll get back to you within 24 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-secondary rounded-2xl p-8 border border-border space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Service Type</label>
          <select
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
            required
          >
            <option value="">Select a service...</option>
            <option value="web">Web Development</option>
            <option value="mobile">Mobile Development</option>
            <option value="design">UI/UX Design</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Budget Range</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
              required
            >
              <option value="">Select budget...</option>
              <option value="<500">Under $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500+">$2,500+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
              required
            >
              <option value="">Select timeline...</option>
              <option value="urgent">ASAP (1-2 weeks)</option>
              <option value="normal">Normal (2-4 weeks)</option>
              <option value="flexible">Flexible (1-2 months)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Project Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 bg-primary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none"
            placeholder="Tell me about your project, goals, and any specific requirements..."
            required
          />
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
          <Upload className="mx-auto mb-4 text-foreground/50" size={32} />
          <p className="text-foreground/70 mb-2">Upload project files (optional)</p>
          <p className="text-foreground/50 text-sm">Drag and drop or click to browse</p>
          <input type="file" multiple className="hidden" />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>

        <p className="text-center text-sm text-foreground/70">
          By submitting this form, you agree to our{' '}
          <a href="/terms" className="text-accent hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
        </p>
      </form>
    </div>
  )
}