type DashboardShellProps = {
  header: React.ReactNode
  sidebar: React.ReactNode
  mobileNav?: React.ReactNode
  children: React.ReactNode
  shellClassName?: string
  sidebarClassName?: string
  mainClassName?: string
  mainInnerClassName?: string
}

const buildClassName = (...parts: Array<string | undefined>) =>
  parts.filter(Boolean).join(' ')

export default function DashboardShell({
  header,
  sidebar,
  mobileNav,
  children,
  shellClassName,
  sidebarClassName,
  mainClassName,
  mainInnerClassName,
}: DashboardShellProps) {
  return (
    <div className={buildClassName('min-h-screen bg-base-100 text-base-content', shellClassName)}>
      {header}
      {mobileNav}
      <div className="flex">
        <aside className={buildClassName('hidden md:block', sidebarClassName)}>
          {sidebar}
        </aside>
        <main className={buildClassName('flex-1', mainClassName)}>
          <div className={buildClassName('pointer-events-auto', mainInnerClassName)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
