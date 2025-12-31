'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react'
interface HeroContent {
  title: string
  highlight: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}
interface ProofItem {
  id: string
  text: string
}
interface PhilosophySection {
  id: string
  title: string
  description: string
}
interface LandingContent {
  hero: HeroContent
  proofSnapshot: ProofItem[]
  philosophy: PhilosophySection[]
  cta: {
    text: string
    href: string
  }
}
export default function LandingContentEditor() {
  const [content, setContent] = useState<LandingContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  useEffect(() => {
    fetchContent()
  }, [])
  const fetchContent = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/landing')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setContent(data)
    } catch {
      setMessage({ type: 'error', text: 'Error loading content' })
      // Set default content if fetch fails
      setContent({
        hero: {
          title: 'hey, i\'m',
          highlight: 'kashi',
          subtitle: 'i notice things that could work better, then i build them',
          primaryCtaLabel: 'see what i\'ve built',
          primaryCtaHref: '/projects',
          secondaryCtaLabel: 'get in touch',
          secondaryCtaHref: '/contact'
        },
        proofSnapshot: [
          { id: '1', text: 'this site is fully custom-built (no templates)' },
          { id: '2', text: 'theme palette system with 6 variants' },
          { id: '3', text: 'cms-driven content + full e-commerce' },
          { id: '4', text: 'designed + built end-to-end' }
        ],
        philosophy: [
          { id: '1', title: 'notice', description: 'i pay attention to friction. when something feels harder than it should, that\'s a signal.' },
          { id: '2', title: 'build', description: 'ideas don\'t count until they\'re real. i ship working code, not concepts.' },
          { id: '3', title: 'iterate', description: 'first version ships. then i learn what actually matters and improve it.' }
        ],
        cta: {
          text: 'view all projects',
          href: '/projects'
        }
      })
    } finally {
      setLoading(false)
    }
  }
  const saveContent = async () => {
    if (!content) return
    try {
      setSaving(true)
      setMessage(null)
      const res = await fetch('/api/content/landing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })
      if (!res.ok) throw new Error('Failed to save')
      setMessage({ type: 'success', text: 'Content saved successfully!' })
    } catch {
      setMessage({ type: 'error', text: 'Error saving content' })
    } finally {
      setSaving(false)
    }
  }
  const addProofItem = () => {
    if (!content) return
    setContent({
      ...content,
      proofSnapshot: [
        ...content.proofSnapshot,
        { id: Date.now().toString(), text: '' }
      ]
    })
  }
  const removeProofItem = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      proofSnapshot: content.proofSnapshot.filter(item => item.id !== id)
    })
  }
  const updateProofItem = (id: string, text: string) => {
    if (!content) return
    setContent({
      ...content,
      proofSnapshot: content.proofSnapshot.map(item =>
        item.id === id ? { ...item, text } : item
      )
    })
  }
  const addPhilosophy = () => {
    if (!content) return
    setContent({
      ...content,
      philosophy: [
        ...content.philosophy,
        { id: Date.now().toString(), title: '', description: '' }
      ]
    })
  }
  const removePhilosophy = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      philosophy: content.philosophy.filter(item => item.id !== id)
    })
  }
  const updatePhilosophy = (id: string, field: 'title' | 'description', value: string) => {
    if (!content) return
    setContent({
      ...content,
      philosophy: content.philosophy.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    })
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-foreground/70">Loading content...</p>
        </div>
      </div>
    )
  }
  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Failed to load content</p>
      </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Landing Page Editor</h1>
          <p className="text-foreground/70 mt-1">Edit hero, proof snapshot, and philosophy sections</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchContent}
            disabled={loading}
            className="px-4 py-2 bg-secondary border border-border rounded-lg hover:border-accent transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Reload
          </button>
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-success/10 border-success text-success'
              : 'bg-destructive/10 border-destructive text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}
      {/* Hero Section */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Title</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Highlight</label>
              <input
                type="text"
                value={content.hero.highlight}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, highlight: e.target.value } })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">Subtitle</label>
            <textarea
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Primary CTA Label</label>
              <input
                type="text"
                value={content.hero.primaryCtaLabel}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCtaLabel: e.target.value } })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Primary CTA Link</label>
              <input
                type="text"
                value={content.hero.primaryCtaHref}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCtaHref: e.target.value } })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Secondary CTA Label</label>
              <input
                type="text"
                value={content.hero.secondaryCtaLabel}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryCtaLabel: e.target.value } })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Secondary CTA Link</label>
              <input
                type="text"
                value={content.hero.secondaryCtaHref}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryCtaHref: e.target.value } })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Proof Snapshot */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Proof Snapshot</h2>
          <button
            onClick={addProofItem}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
        <p className="text-sm text-foreground/60 mb-4">Short capability signals (3-5 items recommended)</p>
        <div className="space-y-3">
          {content.proofSnapshot.map((item, index) => (
            <div key={item.id} className="flex gap-2">
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateProofItem(item.id, e.target.value)}
                placeholder={`Proof signal ${index + 1}`}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
              <button
                onClick={() => removeProofItem(item.id)}
                className="px-3 py-2 bg-destructive/10 border border-destructive text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* Philosophy Sections */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">How I Work / Philosophy</h2>
          <button
            onClick={addPhilosophy}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Add Section
          </button>
        </div>
        <div className="space-y-4">
          {content.philosophy.map((item, index) => (
            <div key={item.id} className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-foreground">Section {index + 1}</h3>
                <button
                  onClick={() => removePhilosophy(item.id)}
                  className="px-3 py-2 bg-destructive/10 border border-destructive text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updatePhilosophy(item.id, 'title', e.target.value)}
                    placeholder="e.g., notice, build, iterate"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updatePhilosophy(item.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Bottom CTA</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">CTA Text</label>
            <input
              type="text"
              value={content.cta.text}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, text: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">CTA Link</label>
            <input
              type="text"
              value={content.cta.href}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, href: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
        </div>
      </section>
      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={saveContent}
          disabled={saving}
          className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 font-medium text-lg"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
