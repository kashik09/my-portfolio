'use client'

import { useEffect, useState } from 'react'
import { Save, AlertTriangle, Mail, Server, Shield, Settings as SettingsIcon, Megaphone } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface AdminSiteSettings {
  maintenanceMode: boolean
  availableForBusiness: boolean
  avatarUrl: string
}

interface AdminAdsSettings {
  adsEnabled: boolean
  adsProvider: string
  adsClientId: string
  placements: Record<string, boolean>
}

type EmailProvider = 'gmail' | 'outlook' | 'yahoo' | 'icloud' | 'custom'

const emailProviders: { value: EmailProvider; label: string }[] = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'yahoo', label: 'Yahoo' },
  { value: 'icloud', label: 'iCloud' },
  { value: 'custom', label: 'Custom' },
]

const providerPresets: Record<
  EmailProvider,
  { host: string; port: string; secure: boolean; help: string }
> = {
  gmail: {
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    help: 'Gmail requires an app password when 2-step verification is enabled. Create one in Google Account security settings.',
  },
  outlook: {
    host: 'smtp.office365.com',
    port: '587',
    secure: false,
    help: 'Outlook and Office 365 use SMTP auth. If MFA is enabled, create an app password in your Microsoft account.',
  },
  yahoo: {
    host: 'smtp.mail.yahoo.com',
    port: '587',
    secure: false,
    help: 'Yahoo Mail requires an app password. Generate one in Yahoo Account Security.',
  },
  icloud: {
    host: 'smtp.mail.me.com',
    port: '587',
    secure: false,
    help: 'iCloud Mail needs an app-specific password from your Apple ID security settings.',
  },
  custom: {
    host: '',
    port: '',
    secure: false,
    help: 'Enter the SMTP host, port, and security settings provided by your email provider.',
  },
}

const detectProvider = (email: string): EmailProvider => {
  const domain = email.split('@')[1]?.trim().toLowerCase()
  if (!domain) return 'custom'
  if (domain === 'gmail.com' || domain === 'googlemail.com') return 'gmail'
  if (['outlook.com', 'hotmail.com', 'live.com', 'msn.com'].includes(domain)) {
    return 'outlook'
  }
  if (domain === 'yahoo.com') return 'yahoo'
  if (['icloud.com', 'me.com', 'mac.com'].includes(domain)) return 'icloud'
  return 'custom'
}

export default function AdminSettingsPage() {
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [activeModal, setActiveModal] = useState<'reset' | 'clear' | null>(null)

  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings>({
    maintenanceMode: false,
    availableForBusiness: true,
    avatarUrl: ''
  })

  const [adsSettings, setAdsSettings] = useState<AdminAdsSettings>({
    adsEnabled: false,
    adsProvider: '',
    adsClientId: '',
    placements: {
      homepage_hero: false
    }
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'your-email@gmail.com',
    smtpPassword: '',
    smtpSecure: false,
  })
  const [emailProvider, setEmailProvider] = useState<EmailProvider>('gmail')
  const [showEmailAdvanced, setShowEmailAdvanced] = useState(false)
  const [hasManualHostOverride, setHasManualHostOverride] = useState(false)
  const [hasManualPortOverride, setHasManualPortOverride] = useState(false)

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    twoFactorEnabled: false
  })

  useEffect(() => {
    let cancelled = false

    async function loadSiteSettings() {
      try {
        const res = await fetch('/api/admin/site-settings')
        if (!res.ok) {
          throw new Error('Failed to load site settings')
        }
        const json = await res.json()
        if (!json.success || !json.data || cancelled) return

        const data = json.data as {
          maintenanceMode: boolean
          availableForBusiness: boolean
          avatarUrl?: string | null
          adsEnabled: boolean
          adsProvider: string
          adsClientId: string | null
          adsPlacements: Record<string, boolean> | null
          smtpHost?: string | null
          smtpPort?: number | null
          smtpUsername?: string | null
          smtpPassword?: string | null
          smtpSecure?: boolean | null
        }

        setSiteSettings({
          maintenanceMode: data.maintenanceMode,
          availableForBusiness: data.availableForBusiness,
          avatarUrl: data.avatarUrl || '',
        })

        setAdsSettings(prev => ({
          adsEnabled: data.adsEnabled,
          adsProvider: data.adsProvider || '',
          adsClientId: data.adsClientId || '',
          placements: {
            homepage_hero:
              (data.adsPlacements && data.adsPlacements['homepage_hero']) ??
              false,
            ...prev.placements,
          },
        }))

        const resolvedHost = data.smtpHost || emailSettings.smtpHost
        const resolvedPort =
          data.smtpPort !== null && data.smtpPort !== undefined
            ? String(data.smtpPort)
            : emailSettings.smtpPort
        const resolvedUsername =
          data.smtpUsername || emailSettings.smtpUsername
        const resolvedPassword =
          data.smtpPassword || emailSettings.smtpPassword
        const resolvedSecure =
          data.smtpSecure ?? emailSettings.smtpSecure

        setEmailSettings(prev => ({
          ...prev,
          smtpHost: resolvedHost,
          smtpPort: resolvedPort,
          smtpUsername: resolvedUsername,
          smtpPassword: resolvedPassword,
          smtpSecure: resolvedSecure,
        }))

        const detectedProvider = detectProvider(resolvedUsername)
        setEmailProvider(detectedProvider)
        if (detectedProvider === 'custom') {
          setHasManualHostOverride(false)
          setHasManualPortOverride(false)
        } else {
          const preset = providerPresets[detectedProvider]
          setHasManualHostOverride(resolvedHost !== preset.host)
          setHasManualPortOverride(resolvedPort !== preset.port)
        }
        setShowEmailAdvanced(false)
      } catch (error) {
        console.error('Error loading site settings:', error)
        if (!cancelled) {
          showToast('Failed to load site settings', 'error')
        }
      }
    }

    loadSiteSettings()

    return () => {
      cancelled = true
    }
  }, [showToast])

  useEffect(() => {
    const detected = detectProvider(emailSettings.smtpUsername)
    setEmailProvider(prev => (prev === detected ? prev : detected))
  }, [emailSettings.smtpUsername])

  useEffect(() => {
    if (emailProvider === 'custom') return
    const preset = providerPresets[emailProvider]
    setEmailSettings(prev => ({
      ...prev,
      smtpHost: hasManualHostOverride ? prev.smtpHost : preset.host,
      smtpPort: hasManualPortOverride ? prev.smtpPort : preset.port,
      smtpSecure: preset.secure,
    }))
    if (!hasManualHostOverride && !hasManualPortOverride) {
      setShowEmailAdvanced(false)
    }
  }, [emailProvider, hasManualHostOverride, hasManualPortOverride])

  // Auto-switch port when secure toggle changes (for default ports only)
  useEffect(() => {
    setEmailSettings(prev => {
      const currentPort = prev.smtpPort.trim()
      const isDefaultPort = currentPort === '587' || currentPort === '465'
      // Only auto-switch if current port is a default (587 or 465)
      if (!isDefaultPort) return prev

      if (prev.smtpSecure && currentPort !== '465') {
        return { ...prev, smtpPort: '465' }
      }
      if (!prev.smtpSecure && currentPort !== '587') {
        return { ...prev, smtpPort: '587' }
      }
      return prev
    })
  }, [emailSettings.smtpSecure])

  const handleSaveSite = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceMode: siteSettings.maintenanceMode,
          availableForBusiness: siteSettings.availableForBusiness,
          avatarUrl: siteSettings.avatarUrl.trim() || null,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        showToast(
          (data && data.error) || 'Failed to save site settings',
          'error'
        )
        return
      }

      showToast('Site settings saved successfully', 'success')
    } catch (error) {
      console.error('Error saving site settings:', error)
      showToast('Failed to save site settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAds = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adsEnabled: adsSettings.adsEnabled,
          adsProvider: adsSettings.adsProvider,
          adsClientId: adsSettings.adsClientId || null,
          adsPlacements: adsSettings.placements,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        showToast(
          (data && data.error) || 'Failed to save ads settings',
          'error'
        )
        return
      }

      showToast('Ads settings saved successfully', 'success')
    } catch (error) {
      console.error('Error saving ads settings:', error)
      showToast('Failed to save ads settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEmail = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailSettings)
      })

      const data = await response.json()

      if (data.success) {
        showToast('Email settings saved successfully', 'success')
      } else {
        showToast(data.error || 'Failed to save email settings', 'error')
      }
    } catch (error) {
      showToast('Failed to save email settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/admin/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailSettings,
          testEmail: emailSettings.smtpUsername
        })
      })

      const data = await response.json()

      if (data.success) {
        showToast('Test email sent successfully! Check your inbox.', 'success')
      } else {
        showToast(data.error || 'Failed to send test email', 'error')
      }
    } catch (error) {
      showToast('Failed to send test email', 'error')
    }
  }

  const handleSaveSecurity = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    showToast('Security settings saved successfully', 'success')
  }

  const handleResetSettings = async () => {
    setActiveModal(null)
    showToast('Settings reset to defaults', 'success')
    setSiteSettings({
      maintenanceMode: false,
      availableForBusiness: true,
      avatarUrl: ''
    })
  }

  const handleClearData = async () => {
    setActiveModal(null)
    showToast('All data cleared successfully', 'success')
  }

  const handleProviderSelect = (provider: EmailProvider) => {
    setHasManualHostOverride(false)
    setHasManualPortOverride(false)
    setEmailProvider(provider)
  }

  const isCustomProvider = emailProvider === 'custom'
  const isEmailLocked = !isCustomProvider && !showEmailAdvanced
  const providerHelp = providerPresets[emailProvider].help

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your site configuration</p>
      </div>

      {/* Site Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Site Settings</h2>
            <p className="text-sm text-muted-foreground">Basic site configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
            <div>
              <p className="font-medium text-foreground">Maintenance mode</p>
              <p className="text-sm text-muted-foreground">
                Temporarily place the site into maintenance for visitors.
              </p>
            </div>
            <input
              type="checkbox"
              checked={siteSettings.maintenanceMode}
              onChange={(e) =>
                setSiteSettings({
                  ...siteSettings,
                  maintenanceMode: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-border"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
            <div>
              <p className="font-medium text-foreground">Available for business</p>
              <p className="text-sm text-muted-foreground">
                Controls whether new project requests are accepted on public
                pages and in the user dashboard.
              </p>
            </div>
            <input
              type="checkbox"
              checked={siteSettings.availableForBusiness}
              onChange={(e) =>
                setSiteSettings({
                  ...siteSettings,
                  availableForBusiness: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-border"
            />
          </label>

          <div className="space-y-2 rounded-lg border border-border bg-muted p-4">
            <label className="text-sm font-medium text-foreground" htmlFor="avatarUrl">
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              value={siteSettings.avatarUrl}
              onChange={(e) =>
                setSiteSettings({
                  ...siteSettings,
                  avatarUrl: e.target.value,
                })
              }
              placeholder="https://example.com/avatar.png"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Used on the home intro. Leave blank to fall back to /public/avatar.png.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSite}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Site Settings'}
        </button>
      </div>

      {/* Ads Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Megaphone className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Ads</h2>
            <p className="text-sm text-muted-foreground">
              Control personalized ads on public pages.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
            <div>
              <p className="font-medium text-foreground">Enable ads</p>
              <p className="text-sm text-muted-foreground">
                When enabled, personalized ads may appear on public pages for
                users who have opted in.
              </p>
            </div>
            <input
              type="checkbox"
              checked={adsSettings.adsEnabled}
              onChange={e =>
                setAdsSettings({
                  ...adsSettings,
                  adsEnabled: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-border"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ads provider
              </label>
              <input
                type="text"
                value={adsSettings.adsProvider}
                onChange={e =>
                  setAdsSettings({
                    ...adsSettings,
                    adsProvider: e.target.value,
                  })
                }
                placeholder="e.g. stub-provider"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={adsSettings.adsClientId}
                onChange={e =>
                  setAdsSettings({
                    ...adsSettings,
                    adsClientId: e.target.value,
                  })
                }
                placeholder="Optional client identifier"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-foreground mb-2">
              Placements
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Toggle where ads are allowed to appear. Ads are never shown on
              admin, dashboard, or auth pages.
            </p>
            <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
              <div>
                <p className="font-medium text-foreground">
                  Homepage – below hero
                </p>
                <p className="text-sm text-muted-foreground">
                  Controls the ad slot rendered under the homepage hero section.
                </p>
              </div>
              <input
                type="checkbox"
                checked={adsSettings.placements.homepage_hero}
                onChange={e =>
                  setAdsSettings({
                    ...adsSettings,
                    placements: {
                      ...adsSettings.placements,
                      homepage_hero: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5 rounded border-border"
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSaveAds}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Ads Settings'}
        </button>
      </div>

      {/* Email Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[color:rgb(var(--primary)/0.12)] rounded-lg">
            <Mail className="text-[color:rgb(var(--primary))]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-app">Email Settings</h2>
            <p className="text-sm text-muted">SMTP configuration for notifications</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Provider
          </p>
          <div className="flex flex-wrap gap-2">
            {emailProviders.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleProviderSelect(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 ring-app ring-offset-2 ring-offset-app ${
                  emailProvider === option.value
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'surface-app border-app text-app hover:bg-app'
                }`}
                aria-pressed={emailProvider === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">{providerHelp}</p>
          {!isCustomProvider && (
            <button
              type="button"
              onClick={() => setShowEmailAdvanced(value => !value)}
              className="text-sm font-medium text-app underline-offset-4 hover:underline"
              aria-expanded={showEmailAdvanced}
            >
              {showEmailAdvanced ? 'Hide advanced settings' : 'Advanced settings'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-app mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              value={emailSettings.smtpHost}
              onChange={(e) => {
                setHasManualHostOverride(true)
                setEmailSettings({
                  ...emailSettings,
                  smtpHost: e.target.value,
                })
              }}
              readOnly={isEmailLocked}
              aria-readonly={isEmailLocked}
              className={`w-full px-4 py-2 surface-app border border-app rounded-lg text-sm text-app placeholder:text-[color:rgb(var(--muted)/0.75)] focus:border-[color:rgb(var(--ring)/0.6)] focus:ring-2 focus:ring-[color:rgb(var(--ring)/0.35)] outline-none transition ${
                isEmailLocked ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-app mb-2">
              SMTP Port
            </label>
            <input
              type="text"
              value={emailSettings.smtpPort}
              onChange={(e) => {
                const newPort = e.target.value.trim()
                // Only track as manual override if it's a non-default port
                const isDefault = newPort === '587' || newPort === '465' || newPort === ''
                setHasManualPortOverride(!isDefault)
                setEmailSettings({
                  ...emailSettings,
                  smtpPort: e.target.value,
                })
              }}
              readOnly={isEmailLocked}
              aria-readonly={isEmailLocked}
              className={`w-full px-4 py-2 surface-app border border-app rounded-lg text-sm text-app placeholder:text-[color:rgb(var(--muted)/0.75)] focus:border-[color:rgb(var(--ring)/0.6)] focus:ring-2 focus:ring-[color:rgb(var(--ring)/0.35)] outline-none transition ${
                isEmailLocked ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-app mb-2">
              SMTP Username
            </label>
            <input
              type="email"
              value={emailSettings.smtpUsername}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  smtpUsername: e.target.value,
                })
              }
              className="w-full px-4 py-2 surface-app border border-app rounded-lg text-sm text-app placeholder:text-[color:rgb(var(--muted)/0.75)] focus:border-[color:rgb(var(--ring)/0.6)] focus:ring-2 focus:ring-[color:rgb(var(--ring)/0.35)] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-app mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={emailSettings.smtpPassword}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  smtpPassword: e.target.value,
                })
              }
              placeholder="••••••••"
              className="w-full px-4 py-2 surface-app border border-app rounded-lg text-sm text-app placeholder:text-[color:rgb(var(--muted)/0.75)] focus:border-[color:rgb(var(--ring)/0.6)] focus:ring-2 focus:ring-[color:rgb(var(--ring)/0.35)] outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-app surface-app px-4 py-3">
              <div>
                <p className="text-sm font-medium text-app">
                  Secure connection
                </p>
                <p className="text-xs text-muted">
                  Port 587 uses STARTTLS. Port 465 uses SSL or TLS.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.smtpSecure}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    smtpSecure: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-app text-[color:rgb(var(--primary))] focus:ring-2 focus:ring-[color:rgb(var(--ring)/0.35)]"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveEmail}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Email Settings'}
          </button>
          <button
            onClick={handleTestEmail}
            className="flex items-center gap-2 px-6 py-3 surface-app text-app rounded-lg hover:bg-app transition border border-app"
          >
            <Mail size={20} />
            Test Email
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
            <p className="text-sm text-muted-foreground">Authentication and session management</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Session Timeout
            </label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="1440">24 hours</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-border"
            />
          </label>
        </div>

        <button
          onClick={handleSaveSecurity}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Security Settings'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl border border-red-500/30 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-medium text-foreground mb-1">Reset All Settings</h3>
            <p className="text-sm text-muted-foreground mb-3">Restore all settings to default values</p>
            <button
              onClick={() => setActiveModal('reset')}
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition border border-border text-sm"
            >
              Reset Settings
            </button>
          </div>

          <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
            <h3 className="font-medium text-red-600 dark:text-red-400 mb-1">Clear All Data</h3>
            <p className="text-sm text-muted-foreground mb-3">Permanently delete all projects, requests, and user data</p>
            <button
              onClick={() => setActiveModal('clear')}
              className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition border border-red-500/30 text-sm"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={activeModal === 'reset'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleResetSettings}
        title="Reset All Settings"
        message="Are you sure you want to reset all settings to their default values? This action cannot be undone."
        confirmText="Reset Settings"
        type="warning"
      />

      {/* Clear Data Confirmation Modal */}
      <ConfirmModal
        isOpen={activeModal === 'clear'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="⚠️ DANGER: This will permanently delete all projects, requests, users, and settings. This action CANNOT be undone. Are you absolutely sure?"
        confirmText="Yes, Delete Everything"
        type="danger"
      />
    </div>
  )
}
