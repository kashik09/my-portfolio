'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Save, AlertCircle, FileText } from 'lucide-react'
interface LegalPageContent {
  title: string
  content: string
  published: boolean
  lastUpdated: string
}
type PageType = 'terms' | 'privacy-policy'
export default function LegalContentEditorPage() {
  const [activeTab, setActiveTab] = useState<PageType>('terms')
  const [termsContent, setTermsContent] = useState<LegalPageContent | null>(null)
  const [privacyContent, setPrivacyContent] = useState<LegalPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      setLoading(true)
      const [termsRes, privacyRes] = await Promise.all([
        fetch('/api/content/terms'),
        fetch('/api/content/privacy-policy')
      ])
      const termsData = await termsRes.json()
      const privacyData = await privacyRes.json()
      if (termsData.success) setTermsContent(termsData.data)
      if (privacyData.success) setPrivacyContent(privacyData.data)
    } catch {
      setError('Failed to load legal content')
    } finally {
      setLoading(false)
    }
  }
  const handleSave = async (type: PageType) => {
    const content = type === 'terms' ? termsContent : privacyContent
    if (!content) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch(`/api/content/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })
      const result = await res.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to save')
      }
      if (type === 'terms') {
        setTermsContent(result.data)
      } else {
        setPrivacyContent(result.data)
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }
  const currentContent = activeTab === 'terms' ? termsContent : privacyContent
  const setCurrentContent = (data: LegalPageContent) => {
    if (activeTab === 'terms') {
      setTermsContent(data)
    } else {
      setPrivacyContent(data)
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-foreground-muted">Loading...</p>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Legal Pages Editor</h1>
          <p className="text-foreground-muted mt-1">Edit Terms of Service and Privacy Policy</p>
        </div>
        <Button
          onClick={() => handleSave(activeTab)}
          disabled={saving || !currentContent}
          icon={<Save size={20} />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success flex items-center gap-2">
          <AlertCircle size={20} />
          Content saved successfully!
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-primary text-foreground font-medium'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Terms of Service
            </div>
          </button>
          <button
            onClick={() => setActiveTab('privacy-policy')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'privacy-policy'
                ? 'border-primary text-foreground font-medium'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Privacy Policy
            </div>
          </button>
        </nav>
      </div>
      {/* Content Editor */}
      {currentContent && (
        <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={currentContent.title}
              onChange={(e) =>
                setCurrentContent({ ...currentContent, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Published
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentContent.published}
                onChange={(e) =>
                  setCurrentContent({ ...currentContent, published: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm text-foreground-muted">
                {currentContent.published ? 'Visible to public' : 'Hidden from public'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content (HTML)
            </label>
            <p className="text-sm text-foreground-muted mb-2">
              You can use HTML tags for formatting. Common tags: &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;section&gt;
            </p>
            <textarea
              value={currentContent.content}
              onChange={(e) =>
                setCurrentContent({ ...currentContent, content: e.target.value })
              }
              rows={20}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none font-mono text-sm"
            />
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-foreground-muted">
              <strong>Last Updated:</strong>{' '}
              {new Date(currentContent.lastUpdated).toLocaleString()}
            </p>
          </div>
          {/* Preview Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
            <div className="border border-border rounded-lg p-6 bg-background">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {currentContent.title}
              </h1>
              <p className="text-muted-foreground mb-8">
                Last updated:{' '}
                {new Date(currentContent.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: currentContent.content }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button
          onClick={() => handleSave(activeTab)}
          disabled={saving || !currentContent}
          size="lg"
          icon={<Save size={20} />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
