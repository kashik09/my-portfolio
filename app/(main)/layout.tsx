export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* TODO: Add navigation header */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      {/* TODO: Add footer */}
    </div>
  )
}
