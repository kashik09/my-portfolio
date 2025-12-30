'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Shield, Check, AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
export default function SecurityPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [setupStep, setSetupStep] = useState<'initial' | 'qr' | 'verify' | 'complete'>('initial')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    checkTwoFactorStatus()
  }, [])
  const checkTwoFactorStatus = async () => {
    try {
      setLoading(true)
      // In a real implementation, we'd fetch the user's 2FA status from an API
      // For now, we'll check the session
      const user = session?.user as any
      setTwoFactorEnabled(user?.twoFactorEnabled || false)
    } catch (error) {
      console.error('Error checking 2FA status:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleSetup2FA = async () => {
    try {
      setSubmitting(true)
      setError(null)
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success) {
        setQrCode(data.data.qrCode)
        setSecret(data.data.secret)
        setBackupCodes(data.data.backupCodes)
        setSetupStep('qr')
      } else {
        setError(data.error || 'Failed to set up 2FA')
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error)
      setError('Failed to set up 2FA')
    } finally {
      setSubmitting(false)
    }
  }
  const handleVerify2FA = async () => {
    try {
      setSubmitting(true)
      setError(null)
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationCode })
      })
      const data = await response.json()
      if (data.success) {
        setSetupStep('complete')
        setTwoFactorEnabled(true)
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      setError('Failed to verify 2FA')
    } finally {
      setSubmitting(false)
    }
  }
  const handleDownloadBackupCodes = () => {
    const text = backupCodes.join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '2fa-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Security Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage two-factor authentication for your account
        </p>
      </div>
      {/* 2FA Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            twoFactorEnabled ? 'bg-green-500/10' : 'bg-yellow-500/10'
          }`}>
            <Shield className={twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              {twoFactorEnabled
                ? 'Your account is protected with 2FA'
                : 'Add an extra layer of security to your account'}
            </p>
          </div>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        {/* Initial State */}
        {setupStep === 'initial' && !twoFactorEnabled && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Two-factor authentication (2FA) is required for all admin users. Enable it now to secure your account.
            </p>
            <Button onClick={handleSetup2FA} disabled={submitting}>
              {submitting ? 'Setting up...' : 'Enable 2FA'}
            </Button>
          </div>
        )}
        {/* QR Code Step */}
        {setupStep === 'qr' && qrCode && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Scan QR Code</h3>
              <p className="text-muted-foreground mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <div className="flex justify-center mb-4">
                <img
                  src={qrCode}
                  alt="2FA QR Code"
                  width={256}
                  height={256}
                  className="h-64 w-64"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Or manually enter this secret: <code className="font-mono text-foreground">{secret}</code>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Backup Codes</h3>
              <p className="text-muted-foreground mb-4">
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="bg-background border border-border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="text-foreground">{code}</div>
                  ))}
                </div>
              </div>
              <Button variant="outline" onClick={handleDownloadBackupCodes} size="sm">
                <Download size={16} className="mr-2" />
                Download Backup Codes
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Verify Setup</h3>
              <p className="text-muted-foreground mb-4">
                Enter the 6-digit code from your authenticator app to complete setup
              </p>
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="max-w-xs"
                />
                <Button
                  onClick={handleVerify2FA}
                  disabled={submitting || verificationCode.length !== 6}
                >
                  {submitting ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Complete Step */}
        {setupStep === 'complete' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">2FA Enabled Successfully!</h3>
            <p className="text-muted-foreground mb-6">
              Your account is now protected with two-factor authentication
            </p>
            <Button onClick={() => window.location.reload()}>Done</Button>
          </div>
        )}
        {/* Already Enabled */}
        {twoFactorEnabled && setupStep === 'initial' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <Check size={20} />
              <span className="font-medium">2FA is currently enabled</span>
            </div>
            <p className="text-muted-foreground">
              Your account is secured with two-factor authentication. You'll be prompted for a code each time you log in.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
