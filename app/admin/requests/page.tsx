'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import {
  Search, Eye, Trash2, Mail, Clock, CheckCircle, XCircle,
  Phone, Building2, Check, X, MessageSquare
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Spinner } from '@/components/ui/Spinner'
interface ProjectRequest {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  projectType: string
  budget: string
  timeline: string
  description: string
  requirements: string | null
  status: string
  createdAt: string
  respondedAt: string | null
  adminNotes: string | null
  user: {
    id: string
    name: string | null
    email: string
  } | null
}
interface Stats {
  total: number
  pending: number
  contacted: number
  completed: number
  rejected: number
}
export default function AdminRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, contacted: 0, completed: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; requestId: string | null }>({
    isOpen: false,
    requestId: null
  })
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'accept' | 'reject' | null; requestId: string | null }>({
    isOpen: false,
    type: null,
    requestId: null
  })
  const [adminNotes, setAdminNotes] = useState('')
  const { showToast } = useToast()
  const fetchRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filter !== 'all') params.append('status', filter)
      const response = await fetch(`/api/admin/requests?${params}`)
      const data = await response.json()
      if (data.success) {
        setRequests(data.data)
        setStats(data.stats)
      } else {
        showToast('Failed to fetch requests', 'error')
      }
    } catch (err) {
      console.error('Error fetching requests:', err)
      showToast('Failed to fetch requests', 'error')
    } finally {
      setLoading(false)
    }
  }, [filter, searchQuery, showToast])
  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])
  const handleAccept = async () => {
    if (!actionModal.requestId) return
    try {
      const response = await fetch(`/api/admin/requests/${actionModal.requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'IN_PROGRESS',
          adminNotes: adminNotes || 'Request accepted'
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast('Request accepted! Email notification sent.', 'success')
        fetchRequests()
        setActionModal({ isOpen: false, type: null, requestId: null })
        setAdminNotes('')
        if (showModal) setShowModal(false)
      } else {
        showToast(data.error || 'Failed to accept request', 'error')
      }
    } catch (err) {
      console.error('Error accepting request:', err)
      showToast('Failed to accept request', 'error')
    }
  }
  const handleReject = async () => {
    if (!actionModal.requestId || !adminNotes) {
      showToast('Please provide a reason for rejection', 'error')
      return
    }
    try {
      const response = await fetch(`/api/admin/requests/${actionModal.requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          adminNotes
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast('Request rejected. Email notification sent.', 'success')
        fetchRequests()
        setActionModal({ isOpen: false, type: null, requestId: null })
        setAdminNotes('')
        if (showModal) setShowModal(false)
      } else {
        showToast(data.error || 'Failed to reject request', 'error')
      }
    } catch (err) {
      console.error('Error rejecting request:', err)
      showToast('Failed to reject request', 'error')
    }
  }
  const handleDelete = async () => {
    if (!deleteModal.requestId) return
    try {
      const response = await fetch(`/api/admin/requests/${deleteModal.requestId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        showToast('Request deleted successfully', 'success')
        fetchRequests()
      } else {
        showToast(data.error || 'Failed to delete request', 'error')
      }
    } catch (err) {
      console.error('Error deleting request:', err)
      showToast('Failed to delete request', 'error')
    } finally {
      setDeleteModal({ isOpen: false, requestId: null })
    }
  }
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      REVIEWING: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      IN_PROGRESS: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
      COMPLETED: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      REJECTED: 'bg-red-500/20 text-red-700 dark:text-red-300',
      CANCELLED: 'bg-muted/50 text-muted-foreground'
    }
    return styles[status] || styles.PENDING
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} />
      case 'REVIEWING': return <Mail size={16} />
      case 'IN_PROGRESS': return <MessageSquare size={16} />
      case 'COMPLETED': return <CheckCircle size={16} />
      case 'REJECTED': return <XCircle size={16} />
      default: return <Clock size={16} />
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
        <p className="text-muted-foreground">Manage incoming project requests</p>
      </div>
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-w-[180px] px-4 py-3 pr-10 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27%3e%3cpath fill=%27%23666%27 d=%27M6 8L0 0h12z%27/%3e%3c/svg%3e')] bg-[position:right_1rem_center] bg-no-repeat"
        >
          <option value="all">All Requests</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWING">Contacted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Pending</p>
            <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Contacted</p>
            <Mail className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.contacted}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Completed</p>
            <CheckCircle className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Rejected</p>
            <XCircle className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Total</p>
            <Eye className="text-primary" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
      </div>
      {/* Requests Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{request.name}</p>
                        {request.company && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Building2 size={14} />
                            {request.company}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <a href={`mailto:${request.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Mail size={14} />
                          {request.email}
                        </a>
                        {request.phone && (
                          <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                            <Phone size={14} />
                            {request.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{request.projectType}</td>
                    <td className="px-6 py-4 text-muted-foreground">{request.budget}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 w-fit ${getStatusBadge(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {request.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => setActionModal({ isOpen: true, type: 'accept', requestId: request.id })}
                              className="p-2 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg transition"
                              title="Accept request"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setActionModal({ isOpen: true, type: 'reject', requestId: request.id })}
                              className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition"
                              title="Reject request"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowModal(true)
                          }}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, requestId: request.id })}
                          className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* View Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Request Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Client Name</h3>
                <p className="text-foreground">{selectedRequest.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Email</h3>
                  <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">
                    {selectedRequest.email}
                  </a>
                </div>
                {selectedRequest.phone && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Phone</h3>
                    <a href={`tel:${selectedRequest.phone}`} className="text-primary hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                )}
              </div>
              {selectedRequest.company && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Company</h3>
                  <p className="text-foreground">{selectedRequest.company}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Service Type</h3>
                  <p className="text-foreground">{selectedRequest.projectType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Budget</h3>
                  <p className="text-foreground">{selectedRequest.budget}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Timeline</h3>
                  <p className="text-foreground">{selectedRequest.timeline}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Description</h3>
                <p className="text-foreground whitespace-pre-wrap">{selectedRequest.description}</p>
              </div>
              {selectedRequest.requirements && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Requirements</h3>
                  <p className="text-foreground whitespace-pre-wrap">{selectedRequest.requirements}</p>
                </div>
              )}
              {selectedRequest.adminNotes && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Admin Notes</h3>
                  <p className="text-foreground whitespace-pre-wrap">{selectedRequest.adminNotes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              {selectedRequest.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setActionModal({ isOpen: true, type: 'accept', requestId: selectedRequest.id })
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setActionModal({ isOpen: true, type: 'reject', requestId: selectedRequest.id })
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Accept/Reject Modal */}
      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => {
          setActionModal({ isOpen: false, type: null, requestId: null })
          setAdminNotes('')
        }}
        onConfirm={actionModal.type === 'accept' ? handleAccept : handleReject}
        title={actionModal.type === 'accept' ? 'Accept Request' : 'Reject Request'}
        message={
          <div className="space-y-4">
            <p>
              {actionModal.type === 'accept'
                ? 'Are you sure you want to accept this request? An email notification will be sent to the client.'
                : 'Are you sure you want to reject this request? Please provide a reason that will be sent to the client.'}
            </p>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={actionModal.type === 'accept' ? 'Optional notes...' : 'Rejection reason (required)...'}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              rows={4}
              required={actionModal.type === 'reject'}
            />
          </div>
        }
        confirmText={actionModal.type === 'accept' ? 'Accept' : 'Reject'}
        type={actionModal.type === 'accept' ? 'primary' : 'danger'}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, requestId: null })}
        onConfirm={handleDelete}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
