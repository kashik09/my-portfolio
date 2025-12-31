/*

export const dynamic = 'force-dynamic'
 * DEPRECATED: This CMS is no longer actively used
 *
 * The /services page has been removed and now redirects to /products.
 * This editor is kept for backward compatibility with existing API endpoints.
 * Consider removing if the services API endpoint is no longer needed.
 */
'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react'
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
  metadata: {
    lastUpdated: string
    version: string
  }
}
export default function ServicesEditorPage() {
  const [data, setData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/services')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Failed to load services data')
    } finally {
      setLoading(false)
    }
  }
  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/content/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          metadata: {
            ...data.metadata,
            lastUpdated: new Date().toISOString()
          }
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }
  const addService = () => {
    if (!data) return
    const newService: Service = {
      id: `service-${Date.now()}`,
      icon: 'Code',
      title: 'New Service',
      description: 'Service description',
      features: ['Feature 1', 'Feature 2'],
      pricing: 'From $0'
    }
    setData({
      ...data,
      services: [...data.services, newService]
    })
  }
  const removeService = (id: string) => {
    if (!data) return
    setData({
      ...data,
      services: data.services.filter(s => s.id !== id)
    })
  }
  const updateService = (id: string, field: keyof Service, value: any) => {
    if (!data) return
    setData({
      ...data,
      services: data.services.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    })
  }
  const addFeature = (serviceId: string) => {
    if (!data) return
    setData({
      ...data,
      services: data.services.map(s =>
        s.id === serviceId ? { ...s, features: [...s.features, 'New feature'] } : s
      )
    })
  }
  const removeFeature = (serviceId: string, index: number) => {
    if (!data) return
    setData({
      ...data,
      services: data.services.map(s =>
        s.id === serviceId ? { ...s, features: s.features.filter((_, i) => i !== index) } : s
      )
    })
  }
  const updateFeature = (serviceId: string, index: number, value: string) => {
    if (!data) return
    setData({
      ...data,
      services: data.services.map(s =>
        s.id === serviceId ? {
          ...s,
          features: s.features.map((f, i) => i === index ? value : f)
        } : s
      )
    })
  }
  const addFAQ = () => {
    if (!data) return
    setData({
      ...data,
      faq: [...data.faq, {
        id: `faq-${Date.now()}`,
        question: 'New question?',
        answer: 'Answer here'
      }]
    })
  }
  const removeFAQ = (id: string) => {
    if (!data) return
    setData({
      ...data,
      faq: data.faq.filter(f => f.id !== id)
    })
  }
  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    if (!data) return
    setData({
      ...data,
      faq: data.faq.map(f =>
        f.id === id ? { ...f, [field]: value } : f
      )
    })
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-foreground-muted">Loading...</p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-destructive">{error || 'Failed to load data'}</p>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Deprecation Warning */}
      <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl">
        <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-2">⚠️ Deprecated CMS</h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
          The /services page has been removed and now redirects to /products. This editor is kept for backward compatibility only.
        </p>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Services (Deprecated)</h1>
          <p className="text-foreground-muted mt-1">Manage your services page content (legacy)</p>
        </div>
        <Button onClick={handleSave} disabled={saving} icon={<Save size={20} />}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success flex items-center gap-2">
          <AlertCircle size={20} />
          Changes saved successfully!
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      {/* Page Header Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Page Header</h2>
        <Input
          label="Title"
          value={data.header.title}
          onChange={(e) => setData({ ...data, header: { ...data.header, title: e.target.value } })}
        />
        <Input
          label="Subtitle"
          value={data.header.subtitle}
          onChange={(e) => setData({ ...data, header: { ...data.header, subtitle: e.target.value } })}
        />
      </div>
      {/* Services Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Services</h2>
          <Button onClick={addService} variant="outline" icon={<Plus size={20} />}>
            Add Service
          </Button>
        </div>
        <div className="space-y-6">
          {data.services.map((service) => (
            <div key={service.id} className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{service.title}</h3>
                <button
                  onClick={() => removeService(service.id)}
                  className="text-destructive hover:text-destructive/80 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={service.title}
                  onChange={(e) => updateService(service.id, 'title', e.target.value)}
                />
                <Input
                  label="Icon (Lucide name)"
                  value={service.icon}
                  onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                  placeholder="Code, Smartphone, Palette, Zap"
                />
              </div>
              <Input
                label="Description"
                value={service.description}
                onChange={(e) => updateService(service.id, 'description', e.target.value)}
              />
              <Input
                label="Pricing"
                value={service.pricing}
                onChange={(e) => updateService(service.id, 'pricing', e.target.value)}
              />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Features</label>
                  <button
                    onClick={() => addFeature(service.id)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(service.id, index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      />
                      <button
                        onClick={() => removeFeature(service.id, index)}
                        className="text-destructive hover:text-destructive/80 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Call to Action</h2>
        <Input
          label="Heading"
          value={data.cta.heading}
          onChange={(e) => setData({ ...data, cta: { ...data.cta, heading: e.target.value } })}
        />
        <Input
          label="Text"
          value={data.cta.text}
          onChange={(e) => setData({ ...data, cta: { ...data.cta, text: e.target.value } })}
        />
        <Input
          label="Button Text"
          value={data.cta.buttonText}
          onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonText: e.target.value } })}
        />
      </div>
      {/* FAQ Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">FAQ</h2>
          <Button onClick={addFAQ} variant="outline" icon={<Plus size={20} />}>
            Add Question
          </Button>
        </div>
        <div className="space-y-4">
          {data.faq.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Question & Answer</label>
                <button
                  onClick={() => removeFAQ(item.id)}
                  className="text-destructive hover:text-destructive/80 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <Input
                label="Question"
                value={item.question}
                onChange={(e) => updateFAQ(item.id, 'question', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Answer</label>
                <textarea
                  value={item.answer}
                  onChange={(e) => updateFAQ(item.id, 'answer', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" icon={<Save size={20} />}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
