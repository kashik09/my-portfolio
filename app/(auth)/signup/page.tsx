'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePendingAction } from '@/lib/usePendingAction'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const { status } = useSession()

  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const { isPending, run } = usePendingAction()

  // 🔁 If already logged in, skip signup entirely
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
    }
  }, [status, router, callbackUrl])

  // Timeout for stuck session loading
  useEffect(() => {
    if (status === 'loading') {
      const timeout = setTimeout(() => {
        // If still loading after 5 seconds, force redirect to login
        if (status === 'loading') {
          router.replace('/login')
        }
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    await run(async () => {
      try {
        // Create account
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          setError(data?.error || 'Failed to create account')
          return
        }

        // Auto sign-in after successful signup
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl
        })

        if (result?.error) {
          setError('Account created, but sign-in failed. Please try logging in.')
          return
        }

        if (result?.ok) {
          // Force full page reload to ensure session is picked up
          window.location.assign(callbackUrl)
          return
        }

        setError('Something went wrong. Please try logging in.')
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  // Don't show "Checking session..." - just show the form
  // If already authenticated, the useEffect will redirect
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl border border-border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
        <p className="text-muted-foreground">Get started in a few seconds</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="you@email.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
