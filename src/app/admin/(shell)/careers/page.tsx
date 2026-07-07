'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Plus, Search, Trash2, Eye, EyeOff, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { JobVacancy } from '@/types/admin'

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000 / 60
  if (diff < 60) return `${Math.floor(diff)}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`
  return `${Math.floor(diff / 10080)}w ago`
}

export default function CareersPage() {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([])
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadVacancies() {
      try {
        const res = await fetch('/api/admin/careers', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          const sorted = (data.data as JobVacancy[]).sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
          setVacancies(sorted)
        }
      } catch (err) {
        console.error('Failed to load careers:', err)
      }
    }
    loadVacancies()
  }, [])

  const filtered = vacancies.filter((v) => {
    const term = search.toLowerCase()
    return (
      v.title.toLowerCase().includes(term) ||
      v.department.toLowerCase().includes(term) ||
      v.location.toLowerCase().includes(term)
    )
  })

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      const updated = vacancies.filter((v) => v.id !== id)
      try {
        const res = await fetch('/api/admin/careers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error)
        setVacancies(updated)
        setDeleteConfirm(null)
        setDeleteSuccess('Vacancy deleted.')
        setTimeout(() => setDeleteSuccess(null), 3000)
      } catch (err) {
        console.error(err)
        alert('Failed to delete: ' + (err instanceof Error ? err.message : String(err)))
      }
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const toggleStatus = async (id: string) => {
    const target = vacancies.find((v) => v.id === id)
    if (!target) return
    const newStatus = !target.isActive
    setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, isActive: newStatus } : v)))
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancy: { ...target, isActive: newStatus } }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        let errMsg = data.error || 'Failed to update status'
        if (data.errors) {
          errMsg += ': ' + JSON.stringify(data.errors)
        }
        throw new Error(errMsg)
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : String(err))
      setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, isActive: target.isActive } : v)))
    }
  }

  return (
    <div className="p-6 max-w-[1100px]">
      <PageHeader
        title="Careers"
        description={`${vacancies.length} total vacancies (${vacancies.filter(v => v.isActive).length} active)`}
        action={
          <Link href="/admin/careers/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90"
            style={{ background: '#D4AF37', color: '#050505', fontFamily: 'var(--font-sora)' }}>
            <Plus size={14} /> Add Vacancy
          </Link>
        }
      />

      {deleteSuccess && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
          ✓ {deleteSuccess}
        </div>
      )}

      <div className="flex gap-3 mb-5 justify-end">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vacancies…"
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-full transition-all duration-150"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = '#27272a')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <div key={v.id} className="rounded-xl p-5 transition-all duration-150 flex flex-col justify-between" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <UserPlus size={14} style={{ color: '#3b82f6' }} />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-semibold tracking-wider"
                    style={{ background: v.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)', color: v.isActive ? '#4ade80' : '#71717a' }}>
                    {v.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleStatus(v.id)}
                  title={v.isActive ? 'Hide Vacancy' : 'Publish Vacancy'}
                  className="p-1 rounded hover:bg-zinc-800 transition-colors"
                  style={{ color: v.isActive ? '#4ade80' : '#71717a' }}
                >
                  {v.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              <h3 className="text-sm font-medium mb-1" style={{ color: '#F8F8F8' }}>{v.title}</h3>
              <p className="text-xs mb-2" style={{ color: '#71717a' }}>{v.department} · {v.type}</p>
              <p className="text-xs mb-2" style={{ color: '#71717a' }}>{v.location}</p>
              <p className="text-[10px] mb-4" style={{ color: '#52525b' }}>Posted {timeAgo(v.createdAt)}</p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #18181b' }}>
              <Link href={`/admin/careers/${v.id}`} className="text-xs transition-colors duration-150 hover:underline" style={{ color: '#D4AF37' }}>
                Edit Vacancy →
              </Link>
              
              <button
                onClick={() => handleDelete(v.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                style={{ color: deleteConfirm === v.id ? '#f87171' : '#52525b', background: deleteConfirm === v.id ? 'rgba(239,68,68,0.1)' : 'transparent' }}
                onMouseEnter={(e) => { if (deleteConfirm !== v.id) { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' } }}
                onMouseLeave={(e) => { if (deleteConfirm !== v.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#52525b' } }}
                title={deleteConfirm === v.id ? 'Click again to confirm' : 'Delete'}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
