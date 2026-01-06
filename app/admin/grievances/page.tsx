'use client'

export const dynamic = 'force-dynamic'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'

type GrievanceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

type Grievance = {
  id: string
  createdAt: string
  status: GrievanceStatus
  message: string
  name: string | null
  email: string | null
  phone: string | null
  orderNumber: string | null
  adminNotes: string | null
  user: {
    id: string
    name: string | null
    email: string | null
  } | null
}

export default function AdminGrievancesPage() {
  const { showToast } = useToast()
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})
  const [draftStatus, setDraftStatus] = useState<Record<string, GrievanceStatus>>({})

  const fetchGrievances = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/grievances')
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load complaints')
      }
      setGrievances(data.data || [])
    } catch (error: any) {
      console.error('Error fetching grievances:', error)
      showToast(error.message || 'Failed to load complaints', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchGrievances()
  }, [fetchGrievances])

  const statusLabel = useMemo(
    () => ({
      OPEN: 'Open',
      IN_PROGRESS: 'In Progress',
      RESOLVED: 'Resolved',
    }),
    []
  )

  const statusBadge = (status: GrievanceStatus) => {
    const styles: Record<GrievanceStatus, string> = {
      OPEN: 'bg-warning/10 text-warning',
      IN_PROGRESS: 'bg-info/10 text-info',
      RESOLVED: 'bg-success/10 text-success',
    }
    return styles[status]
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString()

  const handleSave = async (grievance: Grievance) => {
    setSavingId(grievance.id)
    try {
      const status = draftStatus[grievance.id] ?? grievance.status
      const adminNotes =
        draftNotes[grievance.id] ?? grievance.adminNotes ?? ''

      const response = await fetch(`/api/admin/grievances/${grievance.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update grievance')
      }
      showToast('Complaint updated', 'success')
      fetchGrievances()
    } catch (error: any) {
      console.error('Error updating grievance:', error)
      showToast(error.message || 'Failed to update complaint', 'error')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Complaints</h1>
        <p className="text-muted-foreground">
          Review and resolve customer complaints.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Created
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Message
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Order #
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((grievance) => {
                const preview =
                  grievance.message.length > 80
                    ? `${grievance.message.slice(0, 80)}...`
                    : grievance.message
                const name =
                  grievance.name || grievance.user?.name || 'Anonymous'
                const email =
                  grievance.email || grievance.user?.email || 'No email'

                return (
                  <tr
                    key={grievance.id}
                    className="border-b border-border last:border-b-0 align-top"
                  >
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(grievance.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusBadge(
                          grievance.status
                        )}`}
                      >
                        {statusLabel[grievance.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-foreground" title={grievance.message}>
                        {preview}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-foreground">{name}</div>
                      <div className="text-muted-foreground text-xs">
                        {email}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {grievance.orderNumber || '—'}
                    </td>
                    <td className="px-4 py-4 min-w-[220px]">
                      <div className="space-y-2">
                        <select
                          value={
                            draftStatus[grievance.id] ?? grievance.status
                          }
                          onChange={(event) =>
                            setDraftStatus((prev) => ({
                              ...prev,
                              [grievance.id]: event.target
                                .value as GrievanceStatus,
                            }))
                          }
                          className="w-full px-3 py-2 text-xs border border-border/60 rounded-lg bg-muted/40 text-foreground focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                        <textarea
                          rows={2}
                          value={
                            draftNotes[grievance.id] ??
                            grievance.adminNotes ??
                            ''
                          }
                          onChange={(event) =>
                            setDraftNotes((prev) => ({
                              ...prev,
                              [grievance.id]: event.target.value,
                            }))
                          }
                          placeholder="Add admin notes"
                          className="w-full px-3 py-2 text-xs bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                        />
                        <button
                          type="button"
                          onClick={() => handleSave(grievance)}
                          disabled={savingId === grievance.id}
                          className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                        >
                          {savingId === grievance.id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
