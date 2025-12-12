'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // TODO: Fetch from database
  const projects = [
    {
      id: 1,
      title: 'JS Calculator',
      category: 'CLASS',
      status: 'Published',
      views: 234,
      createdAt: '2024-01-15'
    },
    // Add more mock projects
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Projects</h1>
          <p className="text-text/70">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
        >
          <Plus size={20} />
          Add Project
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-secondary rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Views</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-primary/50 transition">
                  <td className="px-6 py-4 text-text font-medium">{project.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-500 text-sm rounded-full">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text/70">{project.views}</td>
                  <td className="px-6 py-4 text-text/70">{project.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-accent/10 text-accent rounded-lg transition">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-accent/10 text-accent rounded-lg transition">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition">
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