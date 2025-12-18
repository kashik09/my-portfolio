'use client'

import { useState, useEffect } from 'react'
import { Search, UserPlus, Edit, Trash2, Shield, User, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { UserAvatar } from '@/components/ui/UserAvatar'

interface UserType {
  id: string
  name: string | null
  email: string
  role: string
  accountStatus: string
  createdAt: string
  image: string | null
  _count: {
    projectRequests: number
    serviceProjects: number
  }
}

interface StatsType {
  total: number
  admins: number
  editors: number
  users: number
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserType[]>([])
  const [stats, setStats] = useState<StatsType>({ total: 0, admins: 0, editors: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null
  })
  const { showToast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [searchQuery])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setStats(data.stats)
      } else {
        showToast('Failed to fetch users', 'error')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      showToast('Failed to fetch users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.userId) return

    try {
      const response = await fetch(`/api/admin/users/${deleteModal.userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        showToast('User deleted successfully', 'success')
        fetchUsers()
      } else {
        showToast(data.error || 'Failed to delete user', 'error')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      showToast('Failed to delete user', 'error')
    } finally {
      setDeleteModal({ isOpen: false, userId: null })
    }
  }

  const handleToggleLock = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'LOCKED' ? 'ACTIVE' : 'LOCKED'

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountStatus: newStatus,
          lockReason: newStatus === 'LOCKED' ? 'Locked by admin' : undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        showToast(`User ${newStatus === 'LOCKED' ? 'locked' : 'unlocked'} successfully`, 'success')
        fetchUsers()
      } else {
        showToast(data.error || 'Failed to update user', 'error')
      }
    } catch (err) {
      console.error('Error updating user:', err)
      showToast('Failed to update user', 'error')
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      OWNER: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
      ADMIN: 'bg-red-500/20 text-red-700 dark:text-red-300',
      MODERATOR: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
      EDITOR: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      VIEWER: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
      USER: 'bg-muted text-foreground'
    }

    return styles[role as keyof typeof styles] || styles.USER
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      LOCKED: 'bg-red-500/20 text-red-700 dark:text-red-300',
      BANNED: 'bg-red-500/30 text-red-800 dark:text-red-200',
      SUSPENDED: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
    }

    return styles[status as keyof typeof styles] || styles.ACTIVE
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          <UserPlus size={20} />
          Add User
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Total Users</p>
            <User className="text-primary" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Admins</p>
            <Shield className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Editors</p>
            <Edit className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.editors}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Regular Users</p>
            <User className="text-muted-foreground" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.users}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Requests</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.name}
                          email={user.email}
                          imageUrl={user.image}
                          size={32}
                        />
                        <span className="font-medium text-foreground">{user.name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 w-fit ${getRoleBadge(user.role)}`}>
                        {(user.role === 'ADMIN' || user.role === 'OWNER') && <Shield size={14} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(user.accountStatus)}`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/requests?user=${user.id}`}
                        className="text-primary hover:underline"
                      >
                        {user._count.projectRequests + user._count.serviceProjects}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleLock(user.id, user.accountStatus)}
                          className="p-2 hover:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg transition"
                          title={user.accountStatus === 'LOCKED' ? 'Unlock account' : 'Lock account'}
                        >
                          {user.accountStatus === 'LOCKED' ? <Unlock size={18} /> : <Lock size={18} />}
                        </button>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, userId: user.id })}
                          className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition"
                          disabled={user.role === 'OWNER'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone. All their data will be permanently removed."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
