'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { PartnerLogosManager } from '@/components/admin/home/PartnerLogosManager'

const INITIAL_HERO = {
  heading: 'Grow Your Business with',
  highlightedWords: ['Premium Digital', 'Strategies'],
  description:
    'PREPOC Technologies is a full-service digital agency delivering measurable growth through performance marketing, cutting-edge web development, and AI-powered automation.',
  primaryCTA: { label: 'Start Your Project', href: '#contact' },
  secondaryCTA: { label: 'View Our Work', href: '#portfolio' },
  stats: [
    { value: 150, suffix: '+', label: 'Projects Delivered' },
    { value: 50, suffix: '+', label: 'Happy Clients' },
    { value: 5, suffix: '+', label: 'Years of Excellence' },
    { value: 99, suffix: '%', label: 'Client Satisfaction' },
  ],
  marqueeItems: [
    'Digital Marketing', 'SEO & Growth', 'Web Development', 'Mobile Apps',
    'AI Solutions', 'Brand Identity', 'Video Production', 'Performance Ads',
  ],
}

export default function HomeEditorPage() {
  const [form, setForm] = useState(INITIAL_HERO)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('hero')

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleSection = (s: string) =>
    setOpenSection(openSection === s ? null : s)

  return (
    <div className="p-6 max-w-[860px]">
      <PageHeader
        title="Home Page"
        description="Edit all content sections on the homepage"
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
        {/* Hero Section */}
        <EditorSection
          title="Hero Section"
          open={openSection === 'hero'}
          onToggle={() => toggleSection('hero')}
        >
          <div className="space-y-4">
            <Field label="Main Heading">
              <input
                value={form.heading}
                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                className="w-full"
              />
            </Field>
            <Field label="Highlighted Words (comma separated)">
              <input
                value={form.highlightedWords.join(', ')}
                onChange={(e) =>
                  setForm({
                    ...form,
                    highlightedWords: e.target.value.split(', '),
                  })
                }
                className="w-full"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full resize-none"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary CTA Label">
                <input
                  value={form.primaryCTA.label}
                  onChange={(e) =>
                    setForm({ ...form, primaryCTA: { ...form.primaryCTA, label: e.target.value } })
                  }
                  className="w-full"
                />
              </Field>
              <Field label="Secondary CTA Label">
                <input
                  value={form.secondaryCTA.label}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      secondaryCTA: { ...form.secondaryCTA, label: e.target.value },
                    })
                  }
                  className="w-full"
                />
              </Field>
            </div>
            
            <div className="pt-4 border-t mt-6" style={{ borderColor: '#27272a' }}>
              <PartnerLogosManager />
            </div>
          </div>
        </EditorSection>

        {/* Stats */}
        <EditorSection
          title="Hero Statistics"
          open={openSection === 'stats'}
          onToggle={() => toggleSection('stats')}
        >
          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-3 gap-3">
                <Field label="Value">
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...form.stats]
                      stats[i] = { ...stats[i], value: Number(e.target.value) }
                      setForm({ ...form, stats })
                    }}
                    className="w-full"
                  />
                </Field>
                <Field label="Suffix">
                  <input
                    value={stat.suffix}
                    onChange={(e) => {
                      const stats = [...form.stats]
                      stats[i] = { ...stats[i], suffix: e.target.value }
                      setForm({ ...form, stats })
                    }}
                    className="w-full"
                    placeholder="+, %, x"
                  />
                </Field>
                <Field label="Label">
                  <input
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...form.stats]
                      stats[i] = { ...stats[i], label: e.target.value }
                      setForm({ ...form, stats })
                    }}
                    className="w-full"
                  />
                </Field>
              </div>
            ))}
          </div>
        </EditorSection>

        {/* Marquee */}
        <EditorSection
          title="Service Marquee Items"
          open={openSection === 'marquee'}
          onToggle={() => toggleSection('marquee')}
        >
          <div className="space-y-2">
            {form.marqueeItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const items = [...form.marqueeItems]
                    items[i] = e.target.value
                    setForm({ ...form, marqueeItems: items })
                  }}
                  className="flex-1"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#F8F8F8',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'var(--font-inter)',
                  }}
                />
                <button
                  onClick={() => {
                    const items = form.marqueeItems.filter((_, idx) => idx !== i)
                    setForm({ ...form, marqueeItems: items })
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ color: '#52525b' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setForm({ ...form, marqueeItems: [...form.marqueeItems, ''] })}
              className="flex items-center gap-1.5 text-xs mt-2 transition-colors duration-150"
              style={{ color: '#D4AF37' }}
            >
              <Plus size={13} /> Add item
            </button>
          </div>
        </EditorSection>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function EditorSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#0f0f12', border: '1px solid #18181b' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-left transition-all duration-150"
        style={{ color: '#F8F8F8' }}
      >
        {title}
        {open ? (
          <ChevronUp size={15} style={{ color: '#52525b' }} />
        ) : (
          <ChevronDown size={15} style={{ color: '#52525b' }} />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: '#18181b' }}>
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
        {label}
      </label>
      <div
        style={{
          '--input-style': '1',
        } as React.CSSProperties}
        className="[&_input]:w-full [&_input]:px-3 [&_input]:py-2.5 [&_input]:rounded-lg [&_input]:text-sm [&_input]:outline-none [&_input]:transition-all [&_input]:[background:rgba(255,255,255,0.04)] [&_input]:[border:1px_solid_#27272a] [&_input]:[color:#F8F8F8] [&_textarea]:w-full [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:rounded-lg [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea]:[background:rgba(255,255,255,0.04)] [&_textarea]:[border:1px_solid_#27272a] [&_textarea]:[color:#F8F8F8]"
      >
        {children}
      </div>
    </div>
  )
}
