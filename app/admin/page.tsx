import { FolderKanban, FileText, Users, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  // TODO: Fetch real data from database
  const stats = [
    {
      label: 'Total Projects',
      value: '0',
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      label: 'Project Requests',
      value: '0',
      icon: FileText,
      href: '/admin/requests',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Total Users',
      value: '0',
      icon: Users,
      href: '/admin/users',
      color: 'text-purple-500',
      bg: 'bg-secondary/10'
    },
    {
      label: 'Site Visits',
      value: '0',
      icon: Eye,
      href: '/admin/analytics',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-foreground-muted">Welcome back! Here's your site overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="text-foreground-muted text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Content Management */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/content/services"
            className="px-6 py-4 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition text-center font-medium shadow-sm"
          >
            Edit Services Page
          </Link>
          <Link
            href="/admin/content/request-form"
            className="px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center font-medium shadow-sm"
          >
            Edit Request Form
          </Link>
          <Link
            href="/admin/content/about"
            className="px-6 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-center font-medium shadow-sm"
          >
            Edit About Page
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-center font-medium shadow-sm"
          >
            + Add New Project
          </Link>
          <Link
            href="/admin/requests"
            className="px-6 py-4 bg-card border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition text-center font-medium"
          >
            View Requests
          </Link>
          <Link
            href="/"
            className="px-6 py-4 bg-card border-2 border-border text-foreground-muted rounded-lg hover:bg-card-hover transition text-center font-medium"
          >
            Visit Site
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-foreground-muted">
          <Eye className="mx-auto mb-4 text-foreground-muted" size={48} />
          <p className="text-lg font-medium mb-2">No recent activity yet</p>
          <p className="text-sm">Data will appear here once your site has visitors and interactions.</p>
        </div>
      </div>
    </div>
  )
}
