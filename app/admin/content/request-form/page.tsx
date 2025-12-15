'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react'

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
    maxSize: number
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
  metadata: {
    lastUpdated: string
    version: string
  }
}

export default function RequestFormEditorPage() {
  const [data, setData] = useState<FormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/request-form')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError('Failed to load form config')
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
      const res = await fetch('/api/content/request-form', {
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
    } catch (err) {
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const addOption = (field: 'serviceTypes' | 'budgetRanges' | 'timelines') => {
    if (!data) return
    setData({
      ...data,
      fields: {
        ...data.fields,
        [field]: [...data.fields[field], { value: '', label: '' }]
      }
    })
  }

  const removeOption = (field: 'serviceTypes' | 'budgetRanges' | 'timelines', index: number) => {
    if (!data) return
    setData({
      ...data,
      fields: {
        ...data.fields,
        [field]: data.fields[field].filter((_, i) => i !== index)
      }
    })
  }

  const updateOption = (
    field: 'serviceTypes' | 'budgetRanges' | 'timelines',
    index: number,
    key: 'value' | 'label',
    value: string
  ) => {
    if (!data) return
    setData({
      ...data,
      fields: {
        ...data.fields,
        [field]: data.fields[field].map((item, i) =>
          i === index ? { ...item, [key]: value } : item
        )
      }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Request Form</h1>
          <p className="text-foreground-muted mt-1">Configure your project request form</p>
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

      {/* Page Header */}
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

      {/* Field Labels */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Field Labels</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name Label"
            value={data.labels.name}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, name: e.target.value } })}
          />
          <Input
            label="Email Label"
            value={data.labels.email}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, email: e.target.value } })}
          />
          <Input
            label="Service Type Label"
            value={data.labels.serviceType}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, serviceType: e.target.value } })}
          />
          <Input
            label="Budget Label"
            value={data.labels.budget}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, budget: e.target.value } })}
          />
          <Input
            label="Timeline Label"
            value={data.labels.timeline}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, timeline: e.target.value } })}
          />
          <Input
            label="Description Label"
            value={data.labels.description}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, description: e.target.value } })}
          />
          <Input
            label="Files Label"
            value={data.labels.files}
            onChange={(e) => setData({ ...data, labels: { ...data.labels, files: e.target.value } })}
          />
        </div>
      </div>

      {/* Placeholders */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Placeholders</h2>
        <Input
          label="Name Placeholder"
          value={data.placeholders.name}
          onChange={(e) => setData({ ...data, placeholders: { ...data.placeholders, name: e.target.value } })}
        />
        <Input
          label="Email Placeholder"
          value={data.placeholders.email}
          onChange={(e) => setData({ ...data, placeholders: { ...data.placeholders, email: e.target.value } })}
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description Placeholder</label>
          <textarea
            value={data.placeholders.description}
            onChange={(e) => setData({ ...data, placeholders: { ...data.placeholders, description: e.target.value } })}
            rows={3}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
          />
        </div>
      </div>

      {/* Service Types */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Service Types</h2>
          <Button onClick={() => addOption('serviceTypes')} variant="outline" icon={<Plus size={20} />}>
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {data.fields.serviceTypes.map((type, index) => (
            <div key={index} className="flex gap-3">
              <Input
                label="Value"
                value={type.value}
                onChange={(e) => updateOption('serviceTypes', index, 'value', e.target.value)}
                className="flex-1"
              />
              <Input
                label="Label"
                value={type.label}
                onChange={(e) => updateOption('serviceTypes', index, 'label', e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeOption('serviceTypes', index)}
                className="text-destructive hover:text-destructive/80 p-2 mt-6"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Ranges */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Budget Ranges</h2>
          <Button onClick={() => addOption('budgetRanges')} variant="outline" icon={<Plus size={20} />}>
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {data.fields.budgetRanges.map((range, index) => (
            <div key={index} className="flex gap-3">
              <Input
                label="Value"
                value={range.value}
                onChange={(e) => updateOption('budgetRanges', index, 'value', e.target.value)}
                className="flex-1"
              />
              <Input
                label="Label"
                value={range.label}
                onChange={(e) => updateOption('budgetRanges', index, 'label', e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeOption('budgetRanges', index)}
                className="text-destructive hover:text-destructive/80 p-2 mt-6"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Timelines */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Timeline Options</h2>
          <Button onClick={() => addOption('timelines')} variant="outline" icon={<Plus size={20} />}>
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {data.fields.timelines.map((timeline, index) => (
            <div key={index} className="flex gap-3">
              <Input
                label="Value"
                value={timeline.value}
                onChange={(e) => updateOption('timelines', index, 'value', e.target.value)}
                className="flex-1"
              />
              <Input
                label="Label"
                value={timeline.label}
                onChange={(e) => updateOption('timelines', index, 'label', e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeOption('timelines', index)}
                className="text-destructive hover:text-destructive/80 p-2 mt-6"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload Config */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">File Upload</h2>
        <Input
          label="Title"
          value={data.fileUpload.title}
          onChange={(e) => setData({ ...data, fileUpload: { ...data.fileUpload, title: e.target.value } })}
        />
        <Input
          label="Subtitle"
          value={data.fileUpload.subtitle}
          onChange={(e) => setData({ ...data, fileUpload: { ...data.fileUpload, subtitle: e.target.value } })}
        />
        <Input
          label="Accepted Formats Text"
          value={data.fileUpload.acceptedFormats}
          onChange={(e) => setData({ ...data, fileUpload: { ...data.fileUpload, acceptedFormats: e.target.value } })}
        />
      </div>

      {/* Submit Button */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Submit Button</h2>
        <Input
          label="Button Text"
          value={data.submitButton.text}
          onChange={(e) => setData({ ...data, submitButton: { ...data.submitButton, text: e.target.value } })}
        />
        <Input
          label="Loading Text"
          value={data.submitButton.loadingText}
          onChange={(e) => setData({ ...data, submitButton: { ...data.submitButton, loadingText: e.target.value } })}
        />
      </div>

      {/* Success Message */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Success Message</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            value={data.successMessage}
            onChange={(e) => setData({ ...data, successMessage: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Disclaimer</h2>
        <Input
          label="Disclaimer Text"
          value={data.disclaimer.text}
          onChange={(e) => setData({ ...data, disclaimer: { ...data.disclaimer, text: e.target.value } })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Terms Text"
            value={data.disclaimer.termsText}
            onChange={(e) => setData({ ...data, disclaimer: { ...data.disclaimer, termsText: e.target.value } })}
          />
          <Input
            label="Terms Link"
            value={data.disclaimer.termsLink}
            onChange={(e) => setData({ ...data, disclaimer: { ...data.disclaimer, termsLink: e.target.value } })}
          />
          <Input
            label="Privacy Text"
            value={data.disclaimer.privacyText}
            onChange={(e) => setData({ ...data, disclaimer: { ...data.disclaimer, privacyText: e.target.value } })}
          />
          <Input
            label="Privacy Link"
            value={data.disclaimer.privacyLink}
            onChange={(e) => setData({ ...data, disclaimer: { ...data.disclaimer, privacyLink: e.target.value } })}
          />
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
