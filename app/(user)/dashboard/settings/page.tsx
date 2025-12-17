'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/ThemeContext'
import { defaultTheme, ThemeName } from '@/lib/themes'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { ArrowLeft, User, Lock, Bell, Shield } from 'lucide-react'
import Link from 'next/link'

type UserThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM'

interface UserProfileResponse {
  success: boolean
  data?: {
    name: string | null
    email: string
    image: string | null
    theme: UserThemePreference
    emailNotifications: boolean
    hasPassword: boolean
  }
}

interface AdConsentResponse {
  success: boolean
  data?: {
    personalizedAds: boolean
  }
}

interface NotificationsResponse {
  success: boolean
  data?: {
    emailNotifications: boolean
  }
}

function mapUserThemeToAppTheme(theme: UserThemePreference): ThemeName {
  if (theme === 'LIGHT') return 'ayulight'
  if (theme === 'DARK') return 'dracula'
  return defaultTheme
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [themePreference, setThemePreference] =
    useState<UserThemePreference>('SYSTEM')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [personalizedAds, setPersonalizedAds] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [savingAdsConsent, setSavingAdsConsent] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)

        const [profileRes, adConsentRes] = await Promise.all([
          fetch('/api/me/profile'),
          fetch('/api/me/ad-consent'),
        ])

        if (profileRes.ok) {
          const profileJson = (await profileRes.json()) as UserProfileResponse
          if (!cancelled && profileJson.success && profileJson.data) {
            const data = profileJson.data
            setName(data.name || '')
            setEmail(data.email)
            setAvatarUrl(data.image || '')
            setThemePreference(data.theme || 'SYSTEM')
            setEmailNotifications(Boolean(data.emailNotifications))
            setHasPassword(Boolean(data.hasPassword))

            const appTheme = mapUserThemeToAppTheme(
              data.theme || 'SYSTEM'
            ) as ThemeName
            if (theme !== appTheme) {
              setTheme(appTheme)
            }
          }
        } else {
          throw new Error('Failed to load profile')
        }

        if (adConsentRes.ok) {
          const consentJson = (await adConsentRes.json()) as AdConsentResponse
          if (!cancelled && consentJson.success && consentJson.data) {
            setPersonalizedAds(Boolean(consentJson.data.personalizedAds))
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        if (!cancelled) {
          showToast('Failed to load settings', 'error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [setTheme, showToast, theme])

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true)
      const res = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          image: avatarUrl || null,
          theme: themePreference,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message = (body && body.error) || 'Failed to save profile'
        showToast(message, 'error')
        return
      }

      const appTheme = mapUserThemeToAppTheme(themePreference)
      if (theme !== appTheme) {
        setTheme(appTheme)
      }

      showToast('Profile updated successfully', 'success')
    } catch (error) {
      console.error('Error saving profile:', error)
      showToast('Failed to save profile', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (!hasPassword) {
      showToast('Password change is not available for this account.', 'info')
      return
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    try {
      setSavingPassword(true)
      const res = await fetch('/api/me/password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const body = await res.json().catch(() => null)

      if (!res.ok || !body?.success) {
        const message = (body && body.error) || 'Failed to change password'
        showToast(message, 'error')
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showToast('Password updated successfully', 'success')
    } catch (error) {
      console.error('Error changing password:', error)
      showToast('Failed to change password', 'error')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSaveNotifications = async () => {
    try {
      setSavingNotifications(true)
      const res = await fetch('/api/me/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotifications,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | NotificationsResponse
          | null
        const message =
          (body && (body as any).error) ||
          'Failed to update notification preferences'
        showToast(message, 'error')
        return
      }

      showToast('Notification preferences updated', 'success')
    } catch (error) {
      console.error('Error saving notifications:', error)
      showToast('Failed to update notification preferences', 'error')
    } finally {
      setSavingNotifications(false)
    }
  }

  const handleToggleAdsConsent = async () => {
    const nextValue = !personalizedAds
    setPersonalizedAds(nextValue)
    setSavingAdsConsent(true)

    try {
      const res = await fetch('/api/me/ad-consent', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizedAds: nextValue,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message =
          (body && body.error) || 'Failed to update ads preference'
        showToast(message, 'error')
      } else {
        showToast('Ads preference updated', 'success')
      }
    } catch (error) {
      console.error('Error updating ads consent:', error)
      showToast('Failed to update ads preference', 'error')
    } finally {
      setSavingAdsConsent(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/me/profile', {
        method: 'DELETE',
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message =
          (body && body.error) || 'Failed to delete your account'
        showToast(message, 'error')
        return
      }

      showToast(
        'Your account has been scheduled for deletion.',
        'success'
      )
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast('Failed to delete your account', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile, preferences, and account.
        </p>
      </div>

      {/* Profile */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your basic account information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-70"
        >
          {savingProfile ? 'Saving...' : 'Save profile'}
        </button>
      </section>

      {/* Security */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lock className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Security
            </h2>
            <p className="text-sm text-muted-foreground">
              Change your password for credential-based logins.
            </p>
          </div>
        </div>

        {hasPassword ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your account is managed through a third-party provider. Password
            changes are not available here.
          </p>
        )}

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={savingPassword || !hasPassword}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-70"
        >
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </section>

      {/* Preferences */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Preferences
            </h2>
            <p className="text-sm text-muted-foreground">
              Theme, notifications, and personalized ads.
            </p>
          </div>
        </div>

        {/* Theme preference */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Theme preference
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Choose how the dashboard should look across devices.
          </p>
          <div className="flex flex-wrap gap-3">
            {(['SYSTEM', 'LIGHT', 'DARK'] as UserThemePreference[]).map(
              value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setThemePreference(value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    themePreference === value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border'
                  }`}
                >
                  {value === 'SYSTEM'
                    ? 'Match system'
                    : value === 'LIGHT'
                    ? 'Light'
                    : 'Dark'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Email notifications */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Email notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Receive updates when your project requests change status or new
              downloads are available.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEmailNotifications(prev => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border border-border ${
              emailNotifications ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {emailNotifications ? 'On' : 'Off'}
          </button>
        </div>

        {/* Personalized ads */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Personalized ads
            </p>
            <p className="text-sm text-muted-foreground">
              When ads are enabled, controls whether we can use your data to
              show personalized placements on public pages. Ads never appear in
              the dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAdsConsent}
            disabled={savingAdsConsent}
            className={`px-4 py-2 rounded-lg text-sm font-medium border border-border ${
              personalizedAds ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            } disabled:opacity-70`}
          >
            {personalizedAds ? 'On' : 'Off'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSaveNotifications}
          disabled={savingNotifications}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-70"
        >
          {savingNotifications ? 'Saving...' : 'Save preferences'}
        </button>
      </section>

      {/* Danger zone */}
      <section className="bg-destructive/5 rounded-2xl border-2 border-destructive/20 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <Shield className="text-destructive" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-destructive">
              Delete account
            </h2>
            <p className="text-sm text-muted-foreground">
              Permanently remove your account and personal data from this
              portfolio app. This action cannot be undone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition"
        >
          Delete my account
        </button>

        {showDeleteModal && (
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            title="Delete your account"
            message="This will permanently delete your account, project requests, memberships, and download history. This action cannot be undone."
            confirmText="Yes, delete my account"
            cancelText="Cancel"
            type="danger"
          />
        )}
      </section>
    </div>
  )
}

