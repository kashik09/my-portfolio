import Link from 'next/link'
import { LayoutDashboard, FolderKanban, FileText, Users, Settings, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/admin/requests', icon: FileText, label: 'Requests' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-primary">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-secondary border-r border-border">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-accent mb-8">Admin Panel</h2>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-border">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
              >
                <LogOut size={20} />
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}