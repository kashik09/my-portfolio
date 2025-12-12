import { FolderKanban, FileText, Users, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  // TODO: Fetch real data from database
  const stats = [
    {
      label: 'Total Projects',
      value: '12',
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Project Requests',
      value: '8',
      icon: FileText,
      href: '/admin/requests',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Total Users',
      value: '24',
      icon: Users,
      href: '/admin/users',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Site Visits',
      value: '1,234',
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
        <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
        <p className="text-text/70">Welcome back! Here's your site overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-secondary rounded-2xl p-6 border border-border hover:border-accent transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="text-text/70 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-text">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-secondary rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="px-6 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition text-center font-medium"
          >
            + Add New Project
          </Link>
          <Link
            href="/admin/requests"
            className="px-6 py-4 bg-secondary border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition text-center font-medium"
          >
            View Requests
          </Link>
          <Link
            href="/"
            className="px-6 py-4 bg-secondary border-2 border-border text-text rounded-lg hover:bg-accent/10 transition text-center font-medium"
          >
            Visit Site
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-secondary rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-text mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-text font-medium">New project request received</p>
              <p className="text-text/70 text-sm">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-text font-medium">New user registered</p>
              <p className="text-text/70 text-sm">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-text font-medium">Calculator project viewed 45 times</p>
              <p className="text-text/70 text-sm">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}