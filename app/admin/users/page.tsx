'use client'

import { useState } from 'react'
import { Search, UserPlus, Edit, Trash2, Shield, User } from 'lucide-react'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: Fetch from database
  const users = [
    {
      id: 1,
      name: 'Ashanti Kweyu',
      email: 'kashi@example.com',
      role: 'ADMIN',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'John Editor',
      email: 'editor@example.com',
      role: 'EDITOR',
      status: 'active',
      createdAt: '2024-01-15'
    }
  ]

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-destructive/20 text-destructive',
      EDITOR: 'bg-accent/20 text-accent',
      USER: 'bg-foreground/20 text-foreground'
    }

    return styles[role as keyof typeof styles] || styles.USER
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-foreground/70">Manage user accounts and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition">
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Total Users</p>
            <User className="text-accent" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">2</p>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Admins</p>
            <Shield className="text-destructive" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">1</p>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Editors</p>
            <Edit className="text-accent" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">1</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-secondary rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-foreground/70">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 w-fit ${getRoleBadge(user.role)}`}>
                      {user.role === 'ADMIN' && <Shield size={14} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-success/20 text-success text-sm rounded-full">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-accent/10 text-accent rounded-lg transition">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
