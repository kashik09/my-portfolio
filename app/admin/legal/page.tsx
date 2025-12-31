'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { Save, FileText } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
interface ContentPage {
  slug: string
  title: string
  type: string
  content: string
  updatedAt: string
}
export default function LegalContentEditorPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')
  const [terms, setTerms] = useState<ContentPage | null>(null)
  const [privacy, setPrivacy] = useState<ContentPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()
  const fetchContent = useCallback(async () => {
    try {
      const [termsRes, privacyRes] = await Promise.all([
        fetch('/api/content/terms'),
        fetch('/api/content/privacy-policy')
      ])
      const [termsData, privacyData] = await Promise.all([
        termsRes.json(),
        privacyRes.json()
      ])
      if (termsData.success) setTerms(termsData.data)
      if (privacyData.success) setPrivacy(privacyData.data)
    } catch (error) {
      console.error('Error fetching content:', error)
      showToast('Failed to load content', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])
  useEffect(() => {
    fetchContent()
  }, [fetchContent])
  const saveContent = async (type: 'terms' | 'privacy') => {
    const content = type === 'terms' ? terms : privacy
    if (!content) return
    try {
      setSaving(true)
      const response = await fetch(`/api/admin/content/${content.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content.title,
          content: content.content
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast(`${content.title} updated successfully`, 'success')
        if (type === 'terms') setTerms(data.data)
        else setPrivacy(data.data)
      } else {
        showToast(data.error || 'Failed to update content', 'error')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      showToast('Failed to save content', 'error')
    } finally {
      setSaving(false)
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }
  const currentContent = activeTab === 'terms' ? terms : privacy
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Legal Content Editor</h1>
        <p className="text-muted-foreground">Edit Terms of Service and Privacy Policy</p>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'terms'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={18} />
            Terms of Service
          </span>
          {activeTab === 'terms' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'privacy'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={18} />
            Privacy Policy
          </span>
          {activeTab === 'privacy' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
        </button>
      </div>
      {currentContent ? (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={currentContent.title}
              onChange={(e) => {
                if (activeTab === 'terms' && terms) {
                  setTerms({ ...terms, title: e.target.value })
                } else if (privacy) {
                  setPrivacy({ ...privacy, title: e.target.value })
                }
              }}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
            />
          </div>
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content (Markdown supported)
            </label>
            <textarea
              value={currentContent.content}
              onChange={(e) => {
                if (activeTab === 'terms' && terms) {
                  setTerms({ ...terms, content: e.target.value })
                } else if (privacy) {
                  setPrivacy({ ...privacy, content: e.target.value })
                }
              }}
              rows={25}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none font-mono text-sm text-foreground"
              placeholder="Enter content here..."
            />
          </div>
          {/* Last Updated */}
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(currentContent.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={() => saveContent(activeTab)}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Content not found. Please create it first.</p>
        </div>
      )}
    </div>
  )
}
