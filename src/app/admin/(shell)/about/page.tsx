'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Save, ChevronDown, ChevronUp, Plus, Trash2, UserCircle } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { type Value } from '@/data/aboutData'

const MediaUploader = dynamic(
  () => import('@/components/admin/ui/MediaUploader').then((mod) => mod.MediaUploader),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse flex items-center justify-center">
        <span className="text-xs text-zinc-500">Loading Uploader...</span>
      </div>
    ),
  }
)

// ─── Types ────────────────────────────────────────────────────────────────────

interface FounderData {
  id: number
  name: string
  position: string
  message: string
  messageExtended: string
  linkedin: string
  image: string
  credentials: string[]
  founderOrder: number
}

const emptyFounder = (order: number): FounderData => ({
  id: Date.now(),
  name: '',
  position: '',
  message: '',
  messageExtended: '',
  linkedin: '',
  image: '',
  credentials: [],
  founderOrder: order,
})

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AboutEditorPage() {
  const [openSection, setOpenSection] = useState<string | null>('founder-0')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [founders, setFounders] = useState<FounderData[]>([])
  const [values, setValues] = useState<Value[]>([])

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/about')
        const data = await res.json()
        if (data.success && data.data) {
          if (Array.isArray(data.data.founders) && data.data.founders.length > 0) {
            setFounders(data.data.founders)
          } else if (data.data.founder) {
            // Legacy single-founder response
            setFounders([{ ...data.data.founder, id: 1, founderOrder: 0 }])
          }
          if (data.data.values) setValues(data.data.values)
        }
      } catch (err) {
        console.error('Failed to load about data:', err)
      }
    }
    load()
  }, [])

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ founders, values }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save changes')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggle = (s: string) => setOpenSection(openSection === s ? null : s)

  const updateFounder = (index: number, patch: Partial<FounderData>) => {
    setFounders((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  const updateCredential = (fi: number, ci: number, val: string) => {
    const creds = [...founders[fi].credentials]
    creds[ci] = val
    updateFounder(fi, { credentials: creds })
  }

  const removeCredential = (fi: number, ci: number) => {
    const creds = founders[fi].credentials.filter((_, i) => i !== ci)
    updateFounder(fi, { credentials: creds })
  }

  const addCredential = (fi: number) => {
    updateFounder(fi, { credentials: [...founders[fi].credentials, ''] })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-[860px]">
      <PageHeader
        title="About Page"
        description="Manage all sections on the about page"
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{
              background: saved ? 'rgba(34,197,94,0.15)' : '#D4AF37',
              color: saved ? '#4ade80' : '#050505',
              fontFamily: 'var(--font-sora)',
              border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
            }}
          >
            <Save size={14} />
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        }
      />

      <div className="space-y-3">

        {/* ── One accordion section per founder ─────────────────────────── */}
        {founders.map((founder, index) => {
          const sectionKey = `founder-${index}`
          const label = founder.position
            ? `Leadership Spotlight — ${founder.position}`
            : `Leadership Spotlight — Person ${index + 1}`

          return (
            <Section
              key={founder.id}
              title={label}
              open={openSection === sectionKey}
              onToggle={() => toggle(sectionKey)}
              badge={index === 0 ? 'Founder' : 'CEO'}
            >
              <div className="space-y-5">

                {/* Name + Position */}
                <div className="grid grid-cols-2 gap-4">
                  <CmsField label="Name">
                    <CmsInput
                      value={founder.name}
                      onChange={(v) => updateFounder(index, { name: v })}
                      placeholder="e.g. Aslam"
                    />
                  </CmsField>
                  <CmsField label="Position / Title">
                    <CmsInput
                      value={founder.position}
                      onChange={(v) => updateFounder(index, { position: v })}
                      placeholder="e.g. Founder"
                    />
                  </CmsField>
                </div>

                {/* Message */}
                <CmsField label="Message (shown in quote block)">
                  <CmsTextarea
                    value={founder.message}
                    onChange={(v) => updateFounder(index, { message: v })}
                    rows={4}
                    maxLength={350}
                    placeholder="Write a short quote or bio excerpt…"
                  />
                </CmsField>

                {/* Extended Message */}
                <CmsField label="Extended Message (optional — shown below main quote)">
                  <CmsTextarea
                    value={founder.messageExtended}
                    onChange={(v) => updateFounder(index, { messageExtended: v })}
                    rows={2}
                    maxLength={180}
                    placeholder="Additional context or continuation…"
                  />
                </CmsField>

                {/* LinkedIn */}
                <CmsField label="LinkedIn URL">
                  <CmsInput
                    value={founder.linkedin}
                    onChange={(v) => updateFounder(index, { linkedin: v })}
                    placeholder="https://linkedin.com/in/…"
                  />
                </CmsField>

                {/* Photo uploader */}
                <MediaUploader
                  label="Photo"
                  value={founder.image}
                  onChange={(v) => updateFounder(index, { image: v })}
                  category="founders"
                  accept="image"
                />

                {/* Preview card */}
                <div
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #18181b' }}
                >
                  {founder.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image src={founder.image} alt="Photo preview" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px dashed #3f3f46' }}
                    >
                      <UserCircle size={22} style={{ color: '#52525b' }} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>
                      {founder.name || <span style={{ color: '#52525b' }}>No name yet</span>}
                    </p>
                    <p className="text-xs" style={{ color: '#71717a' }}>
                      {founder.position || '—'}
                    </p>
                  </div>
                </div>

                {/* Credential tags */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>
                    Credential Tags (shown as pills)
                  </label>
                  <div className="space-y-2">
                    {founder.credentials.map((cred, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <CmsInput
                          value={cred}
                          onChange={(v) => updateCredential(index, ci, v)}
                          placeholder={`e.g. 10+ Years Experience`}
                        />
                        <button
                          onClick={() => removeCredential(index, ci)}
                          className="w-7 h-7 flex items-center justify-center rounded shrink-0"
                          style={{ color: '#52525b' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addCredential(index)}
                      className="flex items-center gap-1.5 text-xs mt-1"
                      style={{ color: '#D4AF37' }}
                    >
                      <Plus size={13} /> Add Credential
                    </button>
                  </div>
                </div>

              </div>
            </Section>
          )
        })}

        {/* ── Core Values ──────────────────────────────────────────────────── */}
        <Section title="Core Values" open={openSection === 'values'} onToggle={() => toggle('values')}>
          <div className="space-y-3">
            {values.map((val, i) => (
              <div
                key={i}
                className="p-4 rounded-lg space-y-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #18181b' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{val.icon}</span>
                  <button
                    onClick={() => setValues(values.filter((_, idx) => idx !== i))}
                    className="w-6 h-6 flex items-center justify-center rounded"
                    style={{ color: '#52525b' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <CmsField label="Icon (emoji)">
                    <CmsInput
                      value={val.icon}
                      onChange={(v) => {
                        const updated = [...values]
                        updated[i] = { ...updated[i], icon: v }
                        setValues(updated)
                      }}
                    />
                  </CmsField>
                  <CmsField label="Title">
                    <CmsInput
                      value={val.title}
                      onChange={(v) => {
                        const updated = [...values]
                        updated[i] = { ...updated[i], title: v }
                        setValues(updated)
                      }}
                    />
                  </CmsField>
                </div>
                <CmsField label="Description">
                  <CmsTextarea
                    value={val.description}
                    onChange={(v) => {
                      const updated = [...values]
                      updated[i] = { ...updated[i], description: v }
                      setValues(updated)
                    }}
                    rows={2}
                  />
                </CmsField>
              </div>
            ))}
            <button
              onClick={() => setValues([...values, { icon: '✨', title: '', description: '' }])}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: '#D4AF37' }}
            >
              <Plus size={13} /> Add Value
            </button>
          </div>
        </Section>

      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title, open, onToggle, badge, children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-left"
        style={{ color: '#F8F8F8' }}
      >
        <span className="flex items-center gap-2.5">
          {title}
          {badge && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              {badge}
            </span>
          )}
        </span>
        {open
          ? <ChevronUp size={15} style={{ color: '#52525b' }} />
          : <ChevronDown size={15} style={{ color: '#52525b' }} />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: '#18181b' }}>
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  )
}

function CmsField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
  outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a',
  color: '#F8F8F8', fontFamily: 'var(--font-inter)',
}

function CmsInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)' }}
      onBlur={(e) => { e.target.style.borderColor = '#27272a' }}
    />
  )
}

function CmsTextarea({ value, onChange, rows = 3, placeholder, maxLength }: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  maxLength?: number
}) {
  const count = value.length
  const isNearLimit = maxLength && count >= maxLength * 0.85
  const isAtLimit = maxLength && count >= maxLength

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => {
          const next = e.target.value
          if (maxLength && next.length > maxLength) return
          onChange(next)
        }}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ ...inputStyle, resize: 'none', paddingBottom: maxLength ? '24px' : '8px' }}
        onFocus={(e) => { e.target.style.borderColor = isAtLimit ? 'rgba(248,113,113,0.5)' : 'rgba(212,175,55,0.5)' }}
        onBlur={(e) => { e.target.style.borderColor = '#27272a' }}
      />
      {maxLength && (
        <span
          className="absolute bottom-2 right-3 text-[10px] font-mono pointer-events-none select-none"
          style={{
            color: isAtLimit ? '#f87171' : isNearLimit ? '#facc15' : '#52525b',
            transition: 'color 0.2s',
          }}
        >
          {count}/{maxLength}
        </span>
      )}
    </div>
  )
}
