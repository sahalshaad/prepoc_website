'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import type { Department } from '@/types/admin'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MediaUploader = dynamic(
  () => import('@/components/admin/ui/MediaUploader').then((mod) => mod.MediaUploader),
  { ssr: false, loading: () => <div className="w-full h-24 rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse flex items-center justify-center"><span className="text-xs text-zinc-500">Loading Uploader...</span></div> }
)



export default function NewTeamMemberPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '',
    title: '',
    department: '',
    bio: '',
    linkedin: '',
    email: '',
    image: '',
    isLeadership: false,
    isActive: true,
  })

  const [departments, setDepartments] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    async function loadDeps() {
      try {
        const res = await fetch('/api/admin/departments')
        const data = await res.json()
        if (data.success) {
          const active = data.data.filter((d: any) => d.isActive)
          setDepartments(active)
          if (active.length > 0) {
            setForm(f => ({ ...f, department: active[0].name }))
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadDeps()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: {
            name: form.name,
            title: form.title,
            department: form.department,
            bio: form.bio,
            linkedin: form.linkedin,
            image: form.image,
            isLeadership: form.isLeadership,
            isActive: form.isActive
          }
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save team member')
      }
      setSaved(true)
      setTimeout(() => router.push('/admin/team'), 1200)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-[720px]">
      <div className="mb-6">
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
          style={{ color: '#71717a' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
        >
          <ArrowLeft size={14} /> Back to Team
        </Link>
        <PageHeader
          title="Add Team Member"
          description="Add a new member to the PREPOC team"
        />
      </div>

      {saved && (
        <div
          className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
        >
          ✓ Team member added! Redirecting…
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Image upload */}
        <div
          className="rounded-xl p-6 mb-5 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <MediaUploader
            label="Profile Photo"
            value={form.image}
            onChange={(v) => setForm({ ...form, image: v })}
            category="team"
            accept="image"
          />
        </div>

        {/* Basic info */}
        <div
          className="rounded-xl p-6 mb-5 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>
            Basic Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              id="name"
              required
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Aisha Rahman"
            />
            <FormField
              label="Job Title"
              id="title"
              required
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
              placeholder="Chief Executive Officer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
              Department <span style={{ color: '#D4AF37' }}>*</span>
            </label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid #27272a',
                color: '#F8F8F8',
                fontFamily: 'var(--font-inter)',
              }}
            >
              <option value="" disabled style={{ background: '#18181b' }}>Select a department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name} style={{ background: '#18181b' }}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Short professional bio…"
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

        {/* Contact */}
        <div
          className="rounded-xl p-6 mb-5 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>
            Contact & Social
          </h3>
          <FormField
            label="LinkedIn URL"
            id="linkedin"
            value={form.linkedin}
            onChange={(v) => setForm({ ...form, linkedin: v })}
            placeholder="https://linkedin.com/in/…"
            type="url"
          />
          <FormField
            label="Email"
            id="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="member@prepoc.com"
            type="email"
          />
        </div>

        {/* Settings */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <h3 className="text-sm font-medium mb-4" style={{ color: '#F8F8F8' }}>
            Settings
          </h3>
          <div className="space-y-3">
            <Toggle
              label="Leadership member"
              description="Show in Leadership Spotlight section"
              checked={form.isLeadership}
              onChange={(v) => setForm({ ...form, isLeadership: v })}
            />
            <Toggle
              label="Active"
              description="Display on the public website"
              checked={form.isActive}
              onChange={(v) => setForm({ ...form, isActive: v })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || saved}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{
              background: '#D4AF37',
              color: '#050505',
              fontFamily: 'var(--font-sora)',
              opacity: saving || saved ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Add Member'}
          </button>
          <Link
            href="/admin/team"
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ color: '#71717a', border: '1px solid #27272a' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

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
          e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.06)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#27272a'
          e.target.style.boxShadow = 'none'
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
        <p className="text-sm" style={{ color: '#a1a1aa' }}>{label}</p>
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
