'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

type AuditLog = {
  id: string
  action: string
  resource: string
  resourceId: string
  user: {
    name: string | null
    email: string
    role: string
  } | null
  createdAt: string
  details: any
}

export default function AuditLogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })

  // Filter state
  const [filters, setFilters] = useState({
    action: searchParams.get('action') || '',
    resource: searchParams.get('resource') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
  })

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      const page = searchParams.get('page') || '1'
      params.set('page', page)
      params.set('limit', '50')

      const action = searchParams.get('action') || ''
      const resource = searchParams.get('resource') || ''
      const dateFrom = searchParams.get('dateFrom') || ''
      const dateTo = searchParams.get('dateTo') || ''

      if (action) params.set('action', action)
      if (resource) params.set('resource', resource)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const response = await fetch(`/api/admin/audit?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setLogs(data.data.logs)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  function applyFilters() {
    const params = new URLSearchParams()
    if (filters.action) params.set('action', filters.action)
    if (filters.resource) params.set('resource', filters.resource)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)

    router.push(`/admin/audit?${params.toString()}`)
  }

  function clearFilters() {
    setFilters({ action: '', resource: '', dateFrom: '', dateTo: '' })
    router.push('/admin/audit')
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/admin/audit?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Audit Log</h1>
        <p className="text-muted-foreground">
          View all admin actions and system events
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Action
            </label>
            <input
              type="text"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              placeholder="e.g. USER_LOGIN"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Resource
            </label>
            <input
              type="text"
              value={filters.resource}
              onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
              placeholder="e.g. User, Order"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Logs */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Resource
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Resource ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        <div>
                          <p className="font-medium">{log.user?.name || 'System'}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{log.resource}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                        {log.resourceId.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total}{' '}
                total)
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center gap-1 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
