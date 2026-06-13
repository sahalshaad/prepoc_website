'use client'

import { useState, useEffect, use } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { useRouter } from 'next/navigation'
import { JobVacancy } from '@/types/admin'

export default function CareerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const isNew = id === 'new'

  const [form, setForm] = useState<Partial<JobVacancy>>({
    title: '',
    department: 'Web Development',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const depsRes = await fetch('/api/admin/departments')
        const depsData = await depsRes.json()
        if (depsData.success) {
          const active = depsData.data.filter((d: any) => d.isActive)
          setDepartments(active)
          if (isNew && active.length > 0) {
            setForm(f => ({ ...f, department: active[0].name }))
          }
        }

        if (isNew) {
          setLoading(false)
          return
        }

        const res = await fetch('/api/admin/careers', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          const found = (data.data as JobVacancy[]).find(v => v.id === id)
          if (found) {
            setForm(found)
          } else {
            alert('Vacancy not found')
            router.push('/admin/careers')
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, isNew, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancy: form }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)
      
      router.refresh()
      router.push('/admin/careers')
    } catch (err) {
      console.error(err)
      alert('Failed to save: ' + (err instanceof Error ? err.message : String(err)))
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-sm" style={{ color: '#a1a1aa' }}>Loading vacancy details...</div>
  }

  return (
    <div className="p-6 max-w-[800px]">
      <PageHeader
        title={isNew ? 'New Vacancy' : 'Edit Vacancy'}
        description="Fill out the details below to publish a job opening."
      />

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Job Title</label>
            <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Department</label>
            <select required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }}>
              <option value="" disabled>Select a department</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Location</label>
            <input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              placeholder="e.g. Remote, Dubai, London"
              style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Employment Type</label>
            <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Description</label>
          <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Requirements</label>
          <textarea required rows={4} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })}
            placeholder="Separate with newlines for bullet points"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Responsibilities</label>
          <textarea required rows={4} value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })}
            placeholder="Separate with newlines for bullet points"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Benefits</label>
          <textarea required rows={3} value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })}
            placeholder="Separate with newlines for bullet points"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#F8F8F8' }} />
        </div>

        <div className="flex items-center gap-3 py-2">
          <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 rounded" style={{ accentColor: '#D4AF37' }} />
          <label htmlFor="isActive" className="text-sm font-medium" style={{ color: '#F8F8F8' }}>Is Active (Published)</label>
        </div>

        <div className="flex justify-end pt-6" style={{ borderTop: '1px solid #18181b' }}>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50"
            style={{ background: '#D4AF37', color: '#050505' }}>
            {saving ? 'Saving...' : 'Save Vacancy'}
          </button>
        </div>
      </form>
    </div>
  )
}
