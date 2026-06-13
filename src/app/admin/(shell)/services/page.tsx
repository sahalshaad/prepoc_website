'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { GripVertical, Pencil, ToggleLeft, ToggleRight, Save } from 'lucide-react'

const INITIAL_SERVICES = [
  { id: '1', title: 'Digital Marketing', shortDescription: 'Data-driven campaigns that convert.', icon: '📈', color: '#0E5D47', isActive: true },
  { id: '2', title: 'SEO & Growth', shortDescription: 'Organic traffic that compounds over time.', icon: '🔍', color: '#D4AF37', isActive: true },
  { id: '3', title: 'Web Development', shortDescription: 'Fast, scalable, beautiful web apps.', icon: '💻', color: '#3b82f6', isActive: true },
  { id: '4', title: 'Mobile Apps', shortDescription: 'Cross-platform apps that users love.', icon: '📱', color: '#a855f7', isActive: true },
  { id: '5', title: 'AI & Automation', shortDescription: 'Intelligent pipelines that scale your ops.', icon: '🤖', color: '#f59e0b', isActive: true },
  { id: '6', title: 'Brand Identity', shortDescription: 'Identities that last a generation.', icon: '🎨', color: '#ec4899', isActive: true },
]

export default function ServicesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-[860px]">
      <PageHeader
        title="Services"
        description={`${services.filter((s) => s.isActive).length} of ${services.length} services active`}
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
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Order'}
          </button>
        }
      />

      <p className="text-xs mb-5" style={{ color: '#52525b' }}>
        Drag to reorder services. Toggle visibility. Click edit to update content.
      </p>

      <div className="space-y-2">
        {services.map((service, i) => (
          <div
            key={service.id}
            className="flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-150"
            style={{
              background: '#0f0f12',
              border: '1px solid #18181b',
              opacity: service.isActive ? 1 : 0.5,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#27272a')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#18181b')}
          >
            {/* Drag handle */}
            <GripVertical size={16} style={{ color: '#3f3f46', cursor: 'grab' }} />

            {/* Order number */}
            <span className="text-xs w-5 text-center" style={{ color: '#3f3f46' }}>
              {i + 1}
            </span>

            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: `${service.color}18` }}
            >
              {service.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>
                {service.title}
              </p>
              <p className="text-xs truncate" style={{ color: '#71717a' }}>
                {service.shortDescription}
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggleActive(service.id)}
              className="flex items-center gap-1.5 text-xs transition-colors duration-150"
              style={{ color: service.isActive ? '#4ade80' : '#52525b' }}
            >
              {service.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              <span>{service.isActive ? 'Live' : 'Hidden'}</span>
            </button>

            {/* Edit */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: '#52525b' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.1)'
                e.currentTarget.style.color = '#D4AF37'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#52525b'
              }}
            >
              <Pencil size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
