'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Save, AlertCircle, DollarSign, TrendingUp } from 'lucide-react'
interface PricingItem {
  id: string
  name: string
  value: number
  prefix?: string
  suffix?: string
  displayFormat: string
  description: string
  category: 'service' | 'membership' | 'budget-range'
  active: boolean
  metadata?: Record<string, any>
}
interface PricingData {
  version: string
  lastUpdated: string
  currency: string
  items: Record<string, PricingItem>
  notes?: string[]
}
export default function PricingEditorPage() {
  const [data, setData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/pricing')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Failed to load pricing data')
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
      const res = await fetch('/api/content/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to save')
      const result = await res.json()
      setData(result.data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }
  const updateItem = (id: string, field: keyof PricingItem, value: any) => {
    if (!data) return
    const item = data.items[id]
    const updatedItem = { ...item, [field]: value }
    // Auto-generate display format when value, prefix, or suffix changes
    if (field === 'value' || field === 'prefix' || field === 'suffix') {
      const prefix = field === 'prefix' ? value : updatedItem.prefix || ''
      const suffix = field === 'suffix' ? value : updatedItem.suffix || ''
      const numValue = field === 'value' ? value : updatedItem.value
      // Format number with commas
      const formattedValue = new Intl.NumberFormat('en-US').format(numValue)
      updatedItem.displayFormat = `${prefix ? prefix + ' ' : ''}$${formattedValue}${suffix || ''}`
    }
    setData({
      ...data,
      items: {
        ...data.items,
        [id]: updatedItem
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
  const itemsByCategory = {
    service: Object.values(data.items).filter(item => item.category === 'service'),
    membership: Object.values(data.items).filter(item => item.category === 'membership'),
    'budget-range': Object.values(data.items).filter(item => item.category === 'budget-range')
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pricing Editor</h1>
          <p className="text-foreground-muted mt-1">Manage all pricing across the site</p>
        </div>
        <Button onClick={handleSave} disabled={saving} icon={<Save size={20} />}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success flex items-center gap-2">
          <AlertCircle size={20} />
          Pricing updated successfully!
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      {/* Global Settings */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <DollarSign size={24} />
          Global Settings
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Currency"
            value={data.currency}
            onChange={(e) => setData({ ...data, currency: e.target.value })}
          />
          <Input
            label="Version"
            value={data.version}
            onChange={(e) => setData({ ...data, version: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Last Updated
          </label>
          <p className="text-foreground-muted text-sm">
            {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
      {/* Service Pricing */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp size={24} />
          Service Pricing ({itemsByCategory.service.length})
        </h2>
        <div className="space-y-4">
          {itemsByCategory.service.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-foreground-muted">Active</label>
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) => updateItem(item.id, 'active', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Prefix (e.g., 'From', 'Starting at')"
                  value={item.prefix || ''}
                  onChange={(e) => updateItem(item.id, 'prefix', e.target.value)}
                  placeholder="From"
                />
                <Input
                  label="Price Value (numeric)"
                  type="number"
                  value={item.value}
                  onChange={(e) => updateItem(item.id, 'value', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Suffix (e.g., '/hr', '/mo')"
                  value={item.suffix || ''}
                  onChange={(e) => updateItem(item.id, 'suffix', e.target.value)}
                  placeholder="/hr"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Format (auto-generated)
                  </label>
                  <p className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground font-semibold">
                    {item.displayFormat}
                  </p>
                </div>
                <Input
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Membership Pricing */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Membership Pricing ({itemsByCategory.membership.length})
        </h2>
        <div className="space-y-4">
          {itemsByCategory.membership.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-foreground-muted">Active</label>
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) => updateItem(item.id, 'active', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Prefix"
                  value={item.prefix || ''}
                  onChange={(e) => updateItem(item.id, 'prefix', e.target.value)}
                />
                <Input
                  label="Price Value"
                  type="number"
                  value={item.value}
                  onChange={(e) => updateItem(item.id, 'value', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Suffix"
                  value={item.suffix || ''}
                  onChange={(e) => updateItem(item.id, 'suffix', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Format
                  </label>
                  <p className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground font-semibold">
                    {item.displayFormat}
                  </p>
                </div>
                <Input
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
              </div>
              {item.metadata && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-foreground-muted">
                    Tier: <span className="font-medium text-foreground">{item.metadata.tier}</span> |
                    Credits: <span className="font-medium text-foreground">{item.metadata.credits}</span> |
                    Duration: <span className="font-medium text-foreground">{item.metadata.durationDays} days</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Budget Ranges */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Budget Ranges ({itemsByCategory['budget-range'].length})
        </h2>
        <div className="space-y-4">
          {itemsByCategory['budget-range'].map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-foreground-muted">Active</label>
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(e) => updateItem(item.id, 'active', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Format
                  </label>
                  <Input
                    value={item.displayFormat}
                    onChange={(e) => updateItem(item.id, 'displayFormat', e.target.value)}
                  />
                </div>
                <Input
                  label="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Notes */}
      {data.notes && data.notes.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground-muted">
            {data.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" icon={<Save size={20} />}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
