'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamicImport from 'next/dynamic'

const MediaUploader = dynamicImport(
  () => import('@/components/admin/ui/MediaUploader').then((mod) => mod.MediaUploader),
  { ssr: false, loading: () => <div className="w-full h-24 rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse flex items-center justify-center"><span className="text-xs text-zinc-500">Loading Uploader...</span></div> }
)

const PRESET_GRADIENTS = [
  { name: 'Emerald Forest (Green)', value: 'linear-gradient(135deg, #0E5D47 0%, #051f18 100%)' },
  { name: 'Lux Gold (Gold)', value: 'linear-gradient(135deg, #6b4f0a 0%, #1a1200 100%)' },
  { name: 'Deep Ocean (Blue)', value: 'linear-gradient(135deg, #1a3a6e 0%, #060e1f 100%)' },
  { name: 'Burgundy Crimson (Red)', value: 'linear-gradient(135deg, #3a1c1c 0%, #140808 100%)' },
  { name: 'Royal Velvet (Purple)', value: 'linear-gradient(135deg, #2c1a3f 0%, #0e0717 100%)' },
  { name: 'Dark Slate (Grey)', value: 'linear-gradient(135deg, #1e3b3b 0%, #0a1414 100%)' }
]

export default function NewPortfolioPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    clientName: '',
    industry: 'Web Development',
    description: '',
    resultsAchieved: '',
    tagsString: '',
    coverImage: '',
    bg: 'linear-gradient(135deg, #0E5D47 0%, #051f18 100%)',
    customBg: '',
    isFeatured: false,
    status: 'published' as 'published' | 'draft',
    displayOrder: 0,
    slug: ''
  })

  // Auto-generate slug and ID from title
  const handleTitleChange = (title: string) => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setForm(prev => ({ ...prev, title, slug: prev.slug ? prev.slug : generatedSlug }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Parse tags by comma
    const tags = form.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const finalBg = form.bg === 'custom' ? form.customBg : form.bg

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            title: form.title,
            clientName: form.clientName,
            industry: form.industry,
            description: form.description,
            resultsAchieved: form.resultsAchieved,
            tags,
            coverImage: form.coverImage,
            bg: finalBg,
            isFeatured: form.isFeatured,
            status: form.status,
            displayOrder: Number(form.displayOrder),
            slug: form.slug
          }
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create portfolio project')
      }

      setSaved(true)
      setTimeout(() => {
        router.refresh()
        router.push('/admin/portfolio')
      }, 1200)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-[760px]">
      <div className="mb-6">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
          style={{ color: '#71717a' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
        <PageHeader
          title="Add Portfolio Project"
          description="Create a new case study or client project"
        />
      </div>

      {saved && (
        <div
          className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
        >
          ✓ Project added! Redirecting to dashboard…
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover Image Upload */}
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <MediaUploader
            label="Cover Image (Optional — uses background color/gradient if empty)"
            value={form.coverImage}
            onChange={(v) => setForm({ ...form, coverImage: v })}
            category="portfolio"
            accept="image"
          />
        </div>

        {/* Basic Info */}
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>
            Project Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Project Title"
              id="title"
              required
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Nexus Commerce Overhaul"
            />
            <FormField
              label="Client Name"
              id="clientName"
              required
              value={form.clientName}
              onChange={(v) => setForm({ ...form, clientName: v })}
              placeholder="Nexus Retail Group"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
                Industry / Category <span style={{ color: '#D4AF37' }}>*</span>
              </label>
              <select
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #27272a',
                  color: '#F8F8F8',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                <option value="Web Development" style={{ background: '#18181b' }}>Web Development</option>
                <option value="Digital Marketing" style={{ background: '#18181b' }}>Digital Marketing</option>
                <option value="Branding" style={{ background: '#18181b' }}>Branding</option>
                <option value="Video Production" style={{ background: '#18181b' }}>Video Production</option>
                <option value="AI Solutions" style={{ background: '#18181b' }}>AI Solutions</option>
              </select>
            </div>

            <FormField
              label="Results Achieved"
              id="resultsAchieved"
              required
              value={form.resultsAchieved}
              onChange={(v) => setForm({ ...form, resultsAchieved: v })}
              placeholder="e.g. +340% Revenue or 80K+ Users"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Case Study URL Slug"
              id="slug"
              required
              value={form.slug}
              onChange={(v) => setForm({ ...form, slug: v })}
              placeholder="nexus-commerce-overhaul"
            />

            <FormField
              label="Tags (Comma separated)"
              id="tags"
              required
              value={form.tagsString}
              onChange={(v) => setForm({ ...form, tagsString: v })}
              placeholder="e.g. Web Dev, SEO, Marketing"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
              Project Description <span style={{ color: '#D4AF37' }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              required
              placeholder="Describe the project achievements, challenges solved, and solutions delivered..."
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #27272a',
                color: '#F8F8F8',
                fontFamily: 'var(--font-inter)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(212,175,55,0.5)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#27272a'
              }}
            />
          </div>
        </div>

        {/* Styling Options */}
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>
            Design & Styling Fallbacks
          </h3>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
              Card Background Style (Used as fallback/gradient)
            </label>
            <select
              value={form.bg}
              onChange={(e) => setForm({ ...form, bg: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none mb-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #27272a',
                color: '#F8F8F8',
                fontFamily: 'var(--font-inter)',
              }}
            >
              {PRESET_GRADIENTS.map(grad => (
                <option key={grad.value} value={grad.value} style={{ background: '#18181b' }}>
                  {grad.name}
                </option>
              ))}
              <option value="custom" style={{ background: '#18181b' }}>Custom Gradient CSS...</option>
            </select>

            {form.bg === 'custom' && (
              <FormField
                label="Custom CSS Background Code"
                id="customBg"
                required
                value={form.customBg}
                onChange={(v) => setForm({ ...form, customBg: v })}
                placeholder="linear-gradient(135deg, #123456 0%, #000 100%)"
              />
            )}
          </div>
        </div>

        {/* Settings */}
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <h3 className="text-sm font-medium" style={{ color: '#F8F8F8' }}>
            Settings & Ordering
          </h3>

          <div className="grid grid-cols-2 gap-4 items-end">
            <FormField
              label="Display Order (priority sorting)"
              id="displayOrder"
              type="number"
              required
              value={String(form.displayOrder)}
              onChange={(v) => setForm({ ...form, displayOrder: Number(v) })}
              placeholder="0"
            />

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #27272a',
                  color: '#F8F8F8',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                <option value="published" style={{ background: '#18181b' }}>Published (Visible on site)</option>
                <option value="draft" style={{ background: '#18181b' }}>Draft (Admin only)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/50 space-y-3">
            <Toggle
              label="Featured Project"
              description="Pins this project to the top of the portfolio pages"
              checked={form.isFeatured}
              onChange={(v) => setForm({ ...form, isFeatured: v })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || saved}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90"
            style={{
              background: '#D4AF37',
              color: '#050505',
              fontFamily: 'var(--font-sora)',
              opacity: saving || saved ? 0.7 : 1,
            }}
          >
            {saving ? 'Creating…' : saved ? 'Created ✓' : 'Add Project'}
          </button>
          <Link
            href="/admin/portfolio"
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-zinc-900 border border-zinc-800"
            style={{ color: '#71717a' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function FormField({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
        {label} {required && <span style={{ color: '#D4AF37' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid #27272a',
          color: '#F8F8F8',
          fontFamily: 'var(--font-inter)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212,175,55,0.5)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#27272a'
        }}
      />
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium" style={{ color: '#a1a1aa' }}>{label}</p>
        <p className="text-xs" style={{ color: '#52525b' }}>{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="w-9 h-5 rounded-full transition-all duration-200 relative"
        style={{ background: checked ? '#D4AF37' : '#27272a' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
          style={{
            background: '#F8F8F8',
            left: checked ? '18px' : '2px',
          }}
        />
      </button>
    </div>
  )
}
