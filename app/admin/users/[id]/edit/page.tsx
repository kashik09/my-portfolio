'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
interface User {
  id: string
  name: string | null
  email: string
  role: string
  accountStatus: string
  image: string | null
}
export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { showToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
      } else {
        showToast('Failed to fetch user', 'error')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      showToast('Failed to fetch user', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast, userId])
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast('User updated successfully', 'success')
        router.push('/admin/users')
      } else {
        showToast(data.error || 'Failed to update user', 'error')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      showToast('Failed to update user', 'error')
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
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">User not found</p>
        <Link href="/admin/users" className="text-primary hover:underline">
          Back to Users
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
          <p className="text-muted-foreground">Update user information and permissions</p>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={user.name || ''}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            required
          />
        </div>
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Role
          </label>
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          >
            <option value="USER">User</option>
            <option value="VIEWER">Viewer</option>
            <option value="EDITOR">Editor</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            {user.role === 'USER' && 'Regular user with basic permissions'}
            {user.role === 'VIEWER' && 'Can view data but not make changes'}
            {user.role === 'EDITOR' && 'Can edit content'}
            {user.role === 'MODERATOR' && 'Can moderate content and users'}
            {user.role === 'ADMIN' && 'Full administrative access'}
            {user.role === 'OWNER' && 'Highest level of access'}
          </p>
        </div>
        {/* Account Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Status
          </label>
          <select
            value={user.accountStatus}
            onChange={(e) => setUser({ ...user, accountStatus: e.target.value })}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          >
            <option value="ACTIVE">Active</option>
            <option value="LOCKED">Locked</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            {user.accountStatus === 'ACTIVE' && 'User can access the platform normally'}
            {user.accountStatus === 'LOCKED' && 'User account is temporarily locked'}
            {user.accountStatus === 'SUSPENDED' && 'User account is suspended'}
            {user.accountStatus === 'BANNED' && 'User is permanently banned'}
          </p>
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/users"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
