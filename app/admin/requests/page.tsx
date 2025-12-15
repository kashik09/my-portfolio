'use client'

import { useState } from 'react'
import { Search, Eye, Trash2, Mail, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AdminRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // TODO: Fetch from database
  const requests = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      serviceType: 'Web Development',
      budget: '$1,000 - $2,500',
      timeline: 'Normal (2-4 weeks)',
      status: 'pending',
      createdAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      serviceType: 'Mobile Development',
      budget: '$2,500+',
      timeline: 'ASAP (1-2 weeks)',
      status: 'contacted',
      createdAt: '2024-01-19'
    }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-warning/20 text-warning',
      contacted: 'bg-info/20 text-info',
      completed: 'bg-success/20 text-success',
      rejected: 'bg-destructive/20 text-destructive'
    }

    return styles[status as keyof typeof styles] || styles.pending
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={16} />
      case 'contacted': return <Mail size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
        <p className="text-foreground/70">Manage incoming project requests</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-secondary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Pending</p>
            <Clock className="text-warning" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">5</p>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Contacted</p>
            <Mail className="text-info" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">3</p>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Completed</p>
            <CheckCircle className="text-success" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">12</p>
        </div>
        <div className="bg-secondary rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground/70 text-sm">Total</p>
            <Eye className="text-accent" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">20</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-secondary rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Timeline</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-primary/50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{request.name}</p>
                      <p className="text-sm text-foreground/70">{request.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{request.serviceType}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                      {request.budget}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{request.timeline}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 w-fit ${getStatusBadge(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{request.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-accent/10 text-accent rounded-lg transition">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
