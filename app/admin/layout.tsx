export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* TODO: Add admin sidebar navigation */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-md">
          {/* Sidebar content */}
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
