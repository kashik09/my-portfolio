'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Table2, LayoutGrid } from 'lucide-react'

type Column<T> = {
  key: keyof T | string
  label: string
  render?: (item: T) => ReactNode
  className?: string
}

type ResponsiveTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  renderCard: (item: T, index: number) => ReactNode
  keyExtractor: (item: T) => string
  storageKey: string
  emptyState?: ReactNode
}

export default function ResponsiveTable<T>({
  data,
  columns,
  renderCard,
  keyExtractor,
  storageKey,
  emptyState,
}: ResponsiveTableProps<T>) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
    if (typeof window === 'undefined') return 'cards'
    const saved = localStorage.getItem(storageKey)
    return saved === 'cards' || saved === 'table' ? saved : 'cards'
  })
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleView = () => {
    const newMode = viewMode === 'cards' ? 'table' : 'cards'
    setViewMode(newMode)
    localStorage.setItem(storageKey, newMode)
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8">
        {emptyState || (
          <div className="text-center text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Toggle (Mobile Only) */}
      {isMobile && (
        <div className="flex justify-end">
          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
          >
            {viewMode === 'cards' ? (
              <>
                <Table2 size={16} />
                View as Table
              </>
            ) : (
              <>
                <LayoutGrid size={16} />
                View as Cards
              </>
            )}
          </button>
        </div>
      )}

      {/* Content */}
      {isMobile && viewMode === 'cards' ? (
        // Card View (Mobile)
        <div className="space-y-4">{data.map((item, index) => renderCard(item, index))}</div>
      ) : (
        // Table View (Desktop or Mobile Toggle)
        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div className="bg-card rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${
                        column.className || ''
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 text-sm text-foreground ${
                          column.className || ''
                        }`}
                      >
                        {column.render
                          ? column.render(item)
                          : String(item[column.key as keyof T] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
