/*

export const dynamic = 'force-dynamic'
 * DEPRECATED: This CMS is no longer actively used
 *
 * The /about page has been rewritten as a hardcoded, mindset-focused page.
 * For editing landing page content (hero, proof snapshot, philosophy),
 * use /admin/content/landing instead.
 *
 * This page is kept for backward compatibility with existing about content API.
 * Consider removing if the API endpoint is no longer needed.
 */
'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Save, AlertCircle, Briefcase, GraduationCap } from 'lucide-react'
import { ImageUploadCrop } from '@/components/shared/ImageUploadCrop'
import { YearPicker } from '@/components/ui/YearPicker'
interface AboutData {
  hero: {
    name: string
    nickname: string
    title: string
    tagline: string
    avatarUrl: string
  }
  story: Array<{
    id: string
    content: string
  }>
  skills: Array<{
    category: string
    icon: string
    items: string[]
  }>
  timeline: Array<{
    id: string
    title: string
    organization: string
    period: string
    description: string
    type: 'work' | 'education'
  }>
  social: {
    github: string
    linkedin: string
    email: string
  }
  metadata: {
    lastUpdated: string
    version: string
  }
}
export default function AboutEditorPage() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/about')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Failed to load about data')
    } finally {
      setLoading(false)
    }
  }
  const handleSave = async () => {
    if (!data) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          metadata: {
            ...data.metadata,
            lastUpdated: new Date().toISOString()
          }
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }
  const addStoryParagraph = () => {
    if (!data) return
    setData({
      ...data,
      story: [...data.story, { id: `story-${Date.now()}`, content: '' }]
    })
  }
  const removeStoryParagraph = (id: string) => {
    if (!data) return
    setData({
      ...data,
      story: data.story.filter(s => s.id !== id)
    })
  }
  const updateStoryParagraph = (id: string, content: string) => {
    if (!data) return
    setData({
      ...data,
      story: data.story.map(s => s.id === id ? { ...s, content } : s)
    })
  }
  const addTimelineItem = () => {
    if (!data) return
    setData({
      ...data,
      timeline: [...data.timeline, {
        id: `timeline-${Date.now()}`,
        title: '',
        organization: '',
        period: '',
        description: '',
        type: 'education'
      }]
    })
  }
  const removeTimelineItem = (id: string) => {
    if (!data) return
    setData({
      ...data,
      timeline: data.timeline.filter(t => t.id !== id)
    })
  }
  const updateTimelineItem = (id: string, field: keyof AboutData['timeline'][0], value: string) => {
    if (!data) return
    setData({
      ...data,
      timeline: data.timeline.map(t => t.id === id ? { ...t, [field]: value } : t)
    })
  }
  const addSkillItem = (category: string) => {
    if (!data) return
    setData({
      ...data,
      skills: data.skills.map(skill =>
        skill.category === category
          ? { ...skill, items: [...skill.items, ''] }
          : skill
      )
    })
  }
  const removeSkillItem = (category: string, index: number) => {
    if (!data) return
    setData({
      ...data,
      skills: data.skills.map(skill =>
        skill.category === category
          ? { ...skill, items: skill.items.filter((_, i) => i !== index) }
          : skill
      )
    })
  }
  const updateSkillItem = (category: string, index: number, value: string) => {
    if (!data) return
    setData({
      ...data,
      skills: data.skills.map(skill =>
        skill.category === category
          ? { ...skill, items: skill.items.map((item, i) => i === index ? value : item) }
          : skill
      )
    })
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-foreground-muted">Loading...</p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-destructive">{error || 'Failed to load data'}</p>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit About Page</h1>
          <p className="text-foreground-muted mt-1">Manage your personal information and story</p>
        </div>
        <Button onClick={handleSave} disabled={saving} icon={<Save size={20} />}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success flex items-center gap-2">
          <AlertCircle size={20} />
          Changes saved successfully!
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Hero Section</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={data.hero.name}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, name: e.target.value } })}
          />
          <Input
            label="Nickname"
            value={data.hero.nickname}
            onChange={(e) => setData({ ...data, hero: { ...data.hero, nickname: e.target.value } })}
          />
        </div>
        <Input
          label="Title"
          value={data.hero.title}
          onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
        />
        <ImageUploadCrop
          label="Avatar Image"
          currentImage={data.hero.avatarUrl}
          aspectRatio={1}
          onImageCropped={(url) => setData({ ...data, hero: { ...data.hero, avatarUrl: url } })}
        />
        <Input
          label="Tagline"
          value={data.hero.tagline}
          onChange={(e) => setData({ ...data, hero: { ...data.hero, tagline: e.target.value } })}
        />
      </div>
      {/* Story Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Story</h2>
          <Button onClick={addStoryParagraph} variant="outline" icon={<Plus size={20} />}>
            Add Paragraph
          </Button>
        </div>
        <div className="space-y-4">
          {data.story.map((para) => (
            <div key={para.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Paragraph</label>
                <button
                  onClick={() => removeStoryParagraph(para.id)}
                  className="text-destructive hover:text-destructive/80 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <textarea
                value={para.content}
                onChange={(e) => updateStoryParagraph(para.id, e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Skills Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <h2 className="text-xl font-bold text-foreground">Skills</h2>
        <div className="space-y-6">
          {data.skills.map((skillGroup) => (
            <div key={skillGroup.category} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Input
                    label="Category"
                    value={skillGroup.category}
                    onChange={(e) => setData({
                      ...data,
                      skills: data.skills.map(s =>
                        s.category === skillGroup.category
                          ? { ...s, category: e.target.value }
                          : s
                      )
                    })}
                  />
                </div>
                <button
                  onClick={() => addSkillItem(skillGroup.category)}
                  className="text-primary hover:text-primary/80 text-sm font-medium mt-6"
                >
                  + Add Skill
                </button>
              </div>
              <div className="space-y-2">
                {skillGroup.items.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkillItem(skillGroup.category, index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                    <button
                      onClick={() => removeSkillItem(skillGroup.category, index)}
                      className="text-destructive hover:text-destructive/80 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Timeline Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Timeline</h2>
          <Button onClick={addTimelineItem} variant="outline" icon={<Plus size={20} />}>
            Add Item
          </Button>
        </div>
        <div className="space-y-4">
          {data.timeline.map((item) => (
            <div key={item.id} className="border border-border rounded-xl p-5 space-y-4 bg-card hover:border-border/80 transition-colors">
              <div className="flex items-center justify-between">
                {/* Category Pill Selector */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateTimelineItem(item.id, 'type', 'work')}
                    className={`
                      flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all
                      ${item.type === 'work'
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }
                    `}
                  >
                    <Briefcase size={14} />
                    Work
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTimelineItem(item.id, 'type', 'education')}
                    className={`
                      flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all
                      ${item.type === 'education'
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }
                    `}
                  >
                    <GraduationCap size={14} />
                    Education
                  </button>
                </div>
                <button
                  onClick={() => removeTimelineItem(item.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Title"
                  value={item.title}
                  onChange={(e) => updateTimelineItem(item.id, 'title', e.target.value)}
                />
                <Input
                  label="Organization"
                  value={item.organization}
                  onChange={(e) => updateTimelineItem(item.id, 'organization', e.target.value)}
                />
              </div>
              <YearPicker
                label="Period"
                value={item.period}
                onChange={(value) => updateTimelineItem(item.id, 'period', value)}
                placeholder="Select year or range"
                allowRange={true}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateTimelineItem(item.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Social Links */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-xl font-bold text-foreground">Social Links</h2>
        <Input
          label="GitHub"
          value={data.social.github}
          onChange={(e) => setData({ ...data, social: { ...data.social, github: e.target.value } })}
        />
        <Input
          label="LinkedIn"
          value={data.social.linkedin}
          onChange={(e) => setData({ ...data, social: { ...data.social, linkedin: e.target.value } })}
        />
        <Input
          label="Email"
          value={data.social.email}
          onChange={(e) => setData({ ...data, social: { ...data.social, email: e.target.value } })}
        />
      </div>
      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg" icon={<Save size={20} />}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}
