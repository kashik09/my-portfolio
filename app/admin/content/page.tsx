'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react'

interface HeroData {
  name: string
  nickname: string
  title: string
  location: string
  tagline: string
  avatarUrl: string
}

interface StoryParagraph {
  id: string
  content: string
}

interface SkillCategory {
  category: string
  icon: string
  items: string[]
}

interface TimelineItem {
  id: string
  title: string
  organization: string
  period: string
  description: string
  type: string
}

interface SocialLinks {
  github: string
  linkedin: string
  email: string
}

interface AboutContent {
  hero: HeroData
  story: StoryParagraph[]
  skills: SkillCategory[]
  timeline: TimelineItem[]
  social: SocialLinks
}

export default function ContentEditorPage() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/about')
      const response = await res.json()

      if (response.success) {
        setContent(response.data)
      } else {
        setMessage({ type: 'error', text: 'Failed to load content' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading content' })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!content) return

    try {
      setSaving(true)
      setMessage(null)

      const res = await fetch('/api/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      const response = await res.json()

      if (response.success) {
        setMessage({ type: 'success', text: 'Content saved successfully!' })
        setContent(response.data)
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to save content' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving content' })
    } finally {
      setSaving(false)
    }
  }

  const addStoryParagraph = () => {
    if (!content) return
    const newParagraph: StoryParagraph = {
      id: `paragraph-${Date.now()}`,
      content: ''
    }
    setContent({
      ...content,
      story: [...content.story, newParagraph]
    })
  }

  const removeStoryParagraph = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      story: content.story.filter(p => p.id !== id)
    })
  }

  const updateStoryParagraph = (id: string, newContent: string) => {
    if (!content) return
    setContent({
      ...content,
      story: content.story.map(p => p.id === id ? { ...p, content: newContent } : p)
    })
  }

  const addSkillCategory = () => {
    if (!content) return
    const newCategory: SkillCategory = {
      category: '',
      icon: 'Code2',
      items: []
    }
    setContent({
      ...content,
      skills: [...content.skills, newCategory]
    })
  }

  const removeSkillCategory = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      skills: content.skills.filter((_, i) => i !== index)
    })
  }

  const updateSkillCategory = (index: number, field: keyof SkillCategory, value: any) => {
    if (!content) return
    setContent({
      ...content,
      skills: content.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    })
  }

  const addTimelineItem = () => {
    if (!content) return
    const newItem: TimelineItem = {
      id: `timeline-${Date.now()}`,
      title: '',
      organization: '',
      period: '',
      description: '',
      type: 'education'
    }
    setContent({
      ...content,
      timeline: [...content.timeline, newItem]
    })
  }

  const removeTimelineItem = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      timeline: content.timeline.filter(item => item.id !== id)
    })
  }

  const updateTimelineItem = (id: string, field: keyof TimelineItem, value: string) => {
    if (!content) return
    setContent({
      ...content,
      timeline: content.timeline.map(item =>
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
          <h1 className="text-3xl font-bold text-foreground">Content Editor</h1>
          <p className="text-foreground/70 mt-1">Edit your About page content</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">Name</label>
            <input
              type="text"
              value={content.hero.name}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, name: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">Nickname</label>
            <input
              type="text"
              value={content.hero.nickname}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, nickname: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
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
            <label className="block text-sm font-medium text-foreground/70 mb-2">Location</label>
            <input
              type="text"
              value={content.hero.location}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, location: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground/70 mb-2">Tagline</label>
            <input
              type="text"
              value={content.hero.tagline}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground/70 mb-2">Avatar URL</label>
            <input
              type="text"
              value={content.hero.avatarUrl}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, avatarUrl: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Story Paragraphs</h2>
          <button
            onClick={addStoryParagraph}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Add Paragraph
          </button>
        </div>
        <div className="space-y-4">
          {content.story.map((paragraph, index) => (
            <div key={paragraph.id} className="relative">
              <label className="block text-sm font-medium text-foreground/70 mb-2">
                Paragraph {index + 1}
              </label>
              <div className="flex gap-2">
                <textarea
                  value={paragraph.content}
                  onChange={(e) => updateStoryParagraph(paragraph.id, e.target.value)}
                  rows={4}
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none"
                />
                <button
                  onClick={() => removeStoryParagraph(paragraph.id)}
                  className="px-3 py-2 bg-destructive/10 border border-destructive text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Skills & Technologies</h2>
          <button
            onClick={addSkillCategory}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
        <div className="space-y-6">
          {content.skills.map((skill, index) => (
            <div key={index} className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">Icon (Lucide name)</label>
                    <input
                      type="text"
                      value={skill.icon}
                      onChange={(e) => updateSkillCategory(index, 'icon', e.target.value)}
                      placeholder="Code2, Palette, Database, Zap"
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeSkillCategory(index)}
                  className="mt-7 px-3 py-2 bg-destructive/10 border border-destructive text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={skill.items.join(', ')}
                  onChange={(e) => updateSkillCategory(index, 'items', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="React, Next.js, TypeScript"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Timeline / Experience</h2>
          <button
            onClick={addTimelineItem}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
        <div className="space-y-6">
          {content.timeline.map((item, index) => (
            <div key={item.id} className="bg-background p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Item {index + 1}</h3>
                <button
                  onClick={() => removeTimelineItem(item.id)}
                  className="px-3 py-2 bg-destructive/10 border border-destructive text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateTimelineItem(item.id, 'title', e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Organization</label>
                  <input
                    type="text"
                    value={item.organization}
                    onChange={(e) => updateTimelineItem(item.id, 'organization', e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Period</label>
                  <input
                    type="text"
                    value={item.period}
                    onChange={(e) => updateTimelineItem(item.id, 'period', e.target.value)}
                    placeholder="2024 - Present"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Type</label>
                  <select
                    value={item.type}
                    onChange={(e) => updateTimelineItem(item.id, 'type', e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  >
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateTimelineItem(item.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-secondary p-6 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Social Links</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">GitHub URL</label>
            <input
              type="url"
              value={content.social.github}
              onChange={(e) => setContent({ ...content, social: { ...content.social, github: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={content.social.linkedin}
              onChange={(e) => setContent({ ...content, social: { ...content.social, linkedin: e.target.value } })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">Email</label>
            <input
              type="email"
              value={content.social.email}
              onChange={(e) => setContent({ ...content, social: { ...content.social, email: e.target.value } })}
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
