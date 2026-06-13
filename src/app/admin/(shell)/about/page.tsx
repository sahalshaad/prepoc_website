'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Save, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { type Value } from '@/data/aboutData'

const MediaUploader = dynamic(
  () => import('@/components/admin/ui/MediaUploader').then((mod) => mod.MediaUploader),
  { ssr: false, loading: () => <div className="w-full aspect-video rounded-xl border border-zinc-800 bg-zinc-900/50 animate-pulse flex items-center justify-center"><span className="text-xs text-zinc-500">Loading Uploader...</span></div> }
)
export default function AboutEditorPage() {
  const [openSection, setOpenSection] = useState<string | null>('founder')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [founder, setFounder] = useState({
    name: '',
    position: '',
    message: '',
    messageExtended: '',
    linkedin: '',
    image: '',
    credentials: [] as string[]
  })
  const [values, setValues] = useState<Value[]>([])

  useEffect(() => {
    async function loadAboutData() {
      try {
        const res = await fetch('/api/admin/about')
        const data = await res.json()
        if (data.success && data.data) {
          if (data.data.founder) {
            setFounder(data.data.founder)
          }
          if (data.data.values) {
            setValues(data.data.values)
          }
        }
      } catch (err) {
        console.error('Failed to load about data:', err)
      }
    }
    loadAboutData()
  }, [])
  const [cta, setCta] = useState({
    title: 'Ready to Transform Your Business?',
    description: 'Join 150+ brands that have scaled with PREPOC.',
    primaryCTA: { label: 'Start a Project', href: '#contact' },
    secondaryCTA: { label: 'View Portfolio', href: '/portfolio' },
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ founder, values }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save changes')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  const toggle = (s: string) => setOpenSection(openSection === s ? null : s)

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
        {/* Founder */}
        <Section title="Leadership Spotlight — Founder" open={openSection === 'founder'} onToggle={() => toggle('founder')}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CmsField label="Founder Name">
                <CmsInput value={founder.name} onChange={(v) => setFounder({ ...founder, name: v })} />
              </CmsField>
              <CmsField label="Position">
                <CmsInput value={founder.position} onChange={(v) => setFounder({ ...founder, position: v })} />
              </CmsField>
            </div>
            <CmsField label="Message">
              <CmsTextarea value={founder.message} onChange={(v) => setFounder({ ...founder, message: v })} rows={3} />
            </CmsField>
            <CmsField label="Extended Message (optional)">
              <CmsTextarea value={founder.messageExtended || ''} onChange={(v) => setFounder({ ...founder, messageExtended: v })} rows={2} />
            </CmsField>
            <CmsField label="LinkedIn URL">
              <CmsInput value={founder.linkedin} onChange={(v) => setFounder({ ...founder, linkedin: v })} placeholder="https://linkedin.com/in/…" />
            </CmsField>
            
            <MediaUploader 
              label="Photo"
              value={founder.image} 
              onChange={(v) => setFounder({ ...founder, image: v })} 
              category="founders"
              accept="image"
            />
            
            <div className="flex items-center gap-3 p-3 rounded-lg mt-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #18181b' }}>
              {founder.image && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={founder.image} alt="Founder preview" fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>{founder.name}</p>
                <p className="text-xs" style={{ color: '#71717a' }}>{founder.position}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Core Values */}
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
                      onChange={(v) => { const updated = [...values]; updated[i] = { ...updated[i], icon: v }; setValues(updated) }}
                    />
                  </CmsField>
                  <CmsField label="Title">
                    <CmsInput
                      value={val.title}
                      onChange={(v) => { const updated = [...values]; updated[i] = { ...updated[i], title: v }; setValues(updated) }}
                    />
                  </CmsField>
                </div>
                <CmsField label="Description">
                  <CmsTextarea
                    value={val.description}
                    onChange={(v) => { const updated = [...values]; updated[i] = { ...updated[i], description: v }; setValues(updated) }}
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

        {/* CTA Section */}
        <Section title="CTA Section" open={openSection === 'cta'} onToggle={() => toggle('cta')}>
          <div className="space-y-4">
            <CmsField label="Title">
              <CmsInput value={cta.title} onChange={(v) => setCta({ ...cta, title: v })} />
            </CmsField>
            <CmsField label="Description">
              <CmsTextarea value={cta.description} onChange={(v) => setCta({ ...cta, description: v })} rows={2} />
            </CmsField>
            <div className="grid grid-cols-2 gap-4">
              <CmsField label="Primary CTA Label">
                <CmsInput value={cta.primaryCTA.label} onChange={(v) => setCta({ ...cta, primaryCTA: { ...cta.primaryCTA, label: v } })} />
              </CmsField>
              <CmsField label="Secondary CTA Label">
                <CmsInput value={cta.secondaryCTA.label} onChange={(v) => setCta({ ...cta, secondaryCTA: { ...cta.secondaryCTA, label: v } })} />
              </CmsField>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────

function Section({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-left" style={{ color: '#F8F8F8' }}>
        {title}
        {open ? <ChevronUp size={15} style={{ color: '#52525b' }} /> : <ChevronDown size={15} style={{ color: '#52525b' }} />}
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

function CmsTextarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{ ...inputStyle, resize: 'none' }}
      onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)' }}
      onBlur={(e) => { e.target.style.borderColor = '#27272a' }}
    />
  )
}
