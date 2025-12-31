'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { Megaphone, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
interface AdsSettings {
  adsEnabled: boolean
  adsProvider: string
  adsClientId: string
  placements: Record<string, boolean>
}
export default function AdsAdminPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [adsSettings, setAdsSettings] = useState<AdsSettings>({
    adsEnabled: false,
    adsProvider: '',
    adsClientId: '',
    placements: {
      homepage_hero: false,
      projects_sidebar: false,
      blog_footer: false
    }
  })
  const loadAdsSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/site-settings')
      const json = await response.json()
      if (json.success && json.data) {
        const data = json.data
        setAdsSettings({
          adsEnabled: data.adsEnabled || false,
          adsProvider: data.adsProvider || '',
          adsClientId: data.adsClientId || '',
          placements: {
            homepage_hero: data.adsPlacements?.homepage_hero || false,
            projects_sidebar: data.adsPlacements?.projects_sidebar || false,
            blog_footer: data.adsPlacements?.blog_footer || false
          }
        })
      }
    } catch (error) {
      console.error('Error loading ads settings:', error)
      showToast('Failed to load ads settings', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])
  useEffect(() => {
    loadAdsSettings()
  }, [loadAdsSettings])
  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adsEnabled: adsSettings.adsEnabled,
          adsProvider: adsSettings.adsProvider,
          adsClientId: adsSettings.adsClientId || null,
          adsPlacements: adsSettings.placements
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast('Ads settings saved successfully', 'success')
      } else {
        showToast(data.error || 'Failed to save ads settings', 'error')
      }
    } catch (error) {
      console.error('Error saving ads settings:', error)
      showToast('Failed to save ads settings', 'error')
    } finally {
      setSaving(false)
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ads Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure advertising settings and placements
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save size={18} className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      {/* Ads Configuration */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Megaphone className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Advertising Settings</h2>
            <p className="text-sm text-muted-foreground">
              Control personalized ads on public pages
            </p>
          </div>
        </div>
        {/* Enable Ads Toggle */}
        <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
          <div>
            <p className="font-medium text-foreground">Enable Ads</p>
            <p className="text-sm text-muted-foreground">
              When enabled, personalized ads may appear on public pages for users who have opted in
            </p>
          </div>
          <input
            type="checkbox"
            checked={adsSettings.adsEnabled}
            onChange={(e) => setAdsSettings({ ...adsSettings, adsEnabled: e.target.checked })}
            className="w-5 h-5 rounded border-border cursor-pointer"
          />
        </label>
        {/* Provider and Client ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ads Provider"
            placeholder="e.g., google-adsense, carbon-ads"
            value={adsSettings.adsProvider}
            onChange={(e) => setAdsSettings({ ...adsSettings, adsProvider: e.target.value })}
          />
          <Input
            label="Client ID"
            placeholder="Optional client identifier"
            value={adsSettings.adsClientId}
            onChange={(e) => setAdsSettings({ ...adsSettings, adsClientId: e.target.value })}
          />
        </div>
        {/* Placements */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Ad Placements</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Toggle where ads are allowed to appear. Ads are never shown on admin, dashboard, or auth pages.
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
              <div>
                <p className="font-medium text-foreground">Homepage – Below Hero</p>
                <p className="text-sm text-muted-foreground">
                  Ad slot rendered under the homepage hero section
                </p>
              </div>
              <input
                type="checkbox"
                checked={adsSettings.placements.homepage_hero}
                onChange={(e) => setAdsSettings({
                  ...adsSettings,
                  placements: { ...adsSettings.placements, homepage_hero: e.target.checked }
                })}
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
              <div>
                <p className="font-medium text-foreground">Projects – Sidebar</p>
                <p className="text-sm text-muted-foreground">
                  Ad slot in the projects page sidebar
                </p>
              </div>
              <input
                type="checkbox"
                checked={adsSettings.placements.projects_sidebar}
                onChange={(e) => setAdsSettings({
                  ...adsSettings,
                  placements: { ...adsSettings.placements, projects_sidebar: e.target.checked }
                })}
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
              <div>
                <p className="font-medium text-foreground">Blog – Footer</p>
                <p className="text-sm text-muted-foreground">
                  Ad slot at the bottom of blog posts
                </p>
              </div>
              <input
                type="checkbox"
                checked={adsSettings.placements.blog_footer}
                onChange={(e) => setAdsSettings({
                  ...adsSettings,
                  placements: { ...adsSettings.placements, blog_footer: e.target.checked }
                })}
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Note:</strong> Ads require user consent in accordance with privacy regulations (GDPR, CCPA).
          Users must opt-in to personalized advertising before any ads are displayed.
        </p>
      </div>
    </div>
  )
}
