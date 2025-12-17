'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload, X, File } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface FormConfig {
  header: {
    title: string
    subtitle: string
  }
  fields: {
    serviceTypes: Array<{ value: string; label: string }>
    budgetRanges: Array<{ value: string; label: string }>
    timelines: Array<{ value: string; label: string }>
  }
  placeholders: {
    name: string
    email: string
    description: string
  }
  labels: {
    name: string
    email: string
    serviceType: string
    budget: string
    timeline: string
    description: string
    files: string
  }
  fileUpload: {
    title: string
    subtitle: string
    acceptedFormats: string
  }
  submitButton: {
    text: string
    loadingText: string
  }
  successMessage: string
  disclaimer: {
    text: string
    termsText: string
    termsLink: string
    privacyText: string
    privacyLink: string
  }
}

export default function RequestPage() {
  const [config, setConfig] = useState<FormConfig | null>(null)
  const router = useRouter()

  const { data: session, status } = useSession()
  const isAuthed = status === 'authenticated'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    budget: '',
    timeline: '',
    description: ''
  })

  useEffect(() => {
    fetch('/api/content/request-form')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load form config:', err))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) setSelectedFiles(prev => [...prev, ...Array.from(files)])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client-side validation
    if (!isAuthed && (!formData.name || !formData.email)) {
      setError('Please provide your name and email.')
      setLoading(false)
      return
    }

    if (!formData.serviceType || !formData.budget || !formData.timeline || !formData.description) {
      setError('Please fill out all required fields.')
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      ...(isAuthed && {
        name: session?.user?.name ?? formData.name,
        email: session?.user?.email ?? formData.email
      })
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        setError(errorData?.error || 'Failed to submit request. Please try again.')
        setLoading(false)
        return
      }

      try {
        const notifResponse = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const notifData = await notifResponse.json()
        if (notifData.whatsappUrl) {
          // optional: window.open(notifData.whatsappUrl, '_blank')
        }
      } catch (notifError) {
        console.error('Notification failed:', notifError)
      }

      alert(config?.successMessage || "Request submitted successfully! I'll get back to you within 24 hours.")
      router.push('/services')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!config) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-foreground-muted">Loading form...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{config.header.title}</h1>
        <p className="text-xl text-foreground-muted">{config.header.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
            {error}
          </div>
        )}

        {!isAuthed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={config.labels.name}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={config.placeholders.name}
              required
            />

            <Input
              label={config.labels.email}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={config.placeholders.email}
              required
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground">
            Requesting as{' '}
            <span className="font-medium">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{config.labels.serviceType}</label>
          <select
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            required
          >
            <option value="">Select a service...</option>
            {config.fields.serviceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{config.labels.budget}</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
            >
              <option value="">Select budget...</option>
              {config.fields.budgetRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{config.labels.timeline}</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
            >
              <option value="">Select timeline...</option>
              {config.fields.timelines.map(timeline => (
                <option key={timeline.value} value={timeline.value}>{timeline.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{config.labels.description}</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
            placeholder={config.placeholders.description}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{config.labels.files}</label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <Upload className="mx-auto mb-4 text-foreground/50 group-hover:text-primary transition-colors" size={32} />
            <p className="text-foreground-muted mb-2 font-medium">{config.fileUpload.title}</p>
            <p className="text-foreground/50 text-sm">{config.fileUpload.subtitle}</p>
            <p className="text-foreground/40 text-xs mt-2">{config.fileUpload.acceptedFormats}</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground-muted">
                Selected Files ({selectedFiles.length})
              </p>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                      <File className="text-primary" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-foreground/50">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-destructive/10 transition-colors group"
                    aria-label="Remove file"
                  >
                    <X className="text-foreground/50 group-hover:text-destructive" size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? config.submitButton.loadingText : config.submitButton.text}
        </Button>

        <p className="text-center text-sm text-foreground-muted">
          {config.disclaimer.text}{' '}
          <a href={config.disclaimer.termsLink} className="text-primary hover:underline">{config.disclaimer.termsText}</a>
          {' '}and{' '}
          <a href={config.disclaimer.privacyLink} className="text-primary hover:underline">{config.disclaimer.privacyText}</a>
        </p>
      </form>
    </div>
  )
}
