'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Shield, Copy, Check } from 'lucide-react'

export default function Setup2FAPage() {
  const { update } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<'start' | 'qr' | 'verify'>('start')
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleStart = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setQrCode(data.qrCode)
        setSecret(data.secret)
        setBackupCodes(data.backupCodes)
        setStep('qr')
      } else {
        setError(data.error || 'Failed to generate 2FA setup')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (data.success) {
        // Update session to refresh 2FA status
        await update()
        router.push('/admin')
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-2">
          Two-Factor Authentication Required
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Protect your admin account with an extra layer of security
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 'start' && (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">What you'll need:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>An authenticator app (Google Authenticator, Authy, 1Password, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Your phone or device with the app installed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>A safe place to store your backup codes</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleStart}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Setting up...' : 'Begin Setup'}
            </Button>
          </div>
        )}

        {step === 'qr' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-4">Scan this QR Code</h3>
              <div className="inline-block p-4 bg-white rounded-lg">
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    className="w-64 h-64"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Or enter this code manually:
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <code className="px-4 py-2 bg-muted rounded font-mono text-sm">
                  {secret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(secret)}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2 text-sm">
                Backup Codes
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Save these codes in a secure place. You can use them to access your account if you lose your device.
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-background rounded px-3 py-1">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep('verify')}
              className="w-full"
              size="lg"
            >
              I've Saved My Codes - Continue
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Verify Your Setup</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <Input
              label="Verification Code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="text-center text-2xl font-mono tracking-widest"
              autoFocus
            />

            <Button
              onClick={handleVerify}
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {loading ? <Spinner size="sm" /> : 'Verify & Enable 2FA'}
            </Button>

            <button
              onClick={() => setStep('qr')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition"
            >
              Back to QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
