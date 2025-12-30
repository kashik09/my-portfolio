import ClientChrome from '@/components/layout/ClientChrome'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientChrome>{children}</ClientChrome>
}
