'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Plus, Briefcase, Search, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { PortfolioProject } from '@/types/admin'
import { MarqueeManager } from '@/components/admin/portfolio/MarqueeManager'

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/admin/portfolio', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          // Sort by displayOrder or date
          const sorted = (data.data as PortfolioProject[]).sort((a, b) => {
            const orderA = a.displayOrder ?? 999
            const orderB = b.displayOrder ?? 999
            if (orderA !== orderB) return orderA - orderB
            
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
            return timeB - timeA
          })
          setProjects(sorted)
        }
      } catch (err) {
        console.error('Failed to load portfolio projects:', err)
      }
    }
    loadProjects()
  }, [])

  const filtered = projects.filter((p) => {
    const term = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(term) ||
      (p.clientName || '').toLowerCase().includes(term) ||
      (p.industry || '').toLowerCase().includes(term)
    )
  })

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      const updatedProjects = projects.filter((p) => p.id !== id)
      try {
        const res = await fetch('/api/admin/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projects: updatedProjects }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to delete project')
        }
        setProjects(updatedProjects)
        setDeleteConfirm(null)
        setDeleteSuccess('Project successfully deleted.')
        setTimeout(() => setDeleteSuccess(null), 3000)
      } catch (err) {
        console.error(err)
        alert('Failed to delete project: ' + (err instanceof Error ? err.message : String(err)))
      }
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const toggleStatus = async (id: string) => {
    const target = projects.find((p) => p.id === id)
    if (!target) return

    const newStatus = target.status === 'published' ? 'draft' : 'published'
    
    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    )

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            ...target,
            status: newStatus
          }
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update project status')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to toggle status: ' + (err instanceof Error ? err.message : String(err)))
      // Rollback UI
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: target.status } : p))
      )
    }
  }

  return (
    <div className="p-6 max-w-[1100px]">
      <PageHeader
        title="Portfolio"
        description={`${projects.length} projects (${projects.filter(p => p.status === 'published').length} published)`}
        action={
          <Link href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90"
            style={{ background: '#D4AF37', color: '#050505', fontFamily: 'var(--font-sora)' }}>
            <Plus size={14} /> Add Project
          </Link>
        }
      />

      {/* Success notification */}
      {deleteSuccess && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
          ✓ {deleteSuccess}
        </div>
      )}

      {/* Hero Marquee Image Manager */}
      <MarqueeManager />

      {/* Search Bar */}
      <div className="flex gap-3 mb-5 justify-end">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-full transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid #27272a',
              color: '#F8F8F8',
              fontFamily: 'var(--font-inter)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = '#27272a')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl p-5 transition-all duration-150 flex flex-col justify-between"
            style={{ background: '#0f0f12', border: '1px solid #18181b' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#27272a')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#18181b')}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
                    <Briefcase size={14} style={{ color: '#a855f7' }} />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-semibold tracking-wider"
                    style={{ background: p.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)', color: p.status === 'published' ? '#4ade80' : '#71717a' }}>
                    {p.status}
                  </span>
                  {p.isFeatured && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                      ★ Featured
                    </span>
                  )}
                </div>
                
                {/* Publish Toggle Button */}
                <button
                  onClick={() => toggleStatus(p.id)}
                  title={p.status === 'published' ? 'Revert to Draft' : 'Publish Project'}
                  className="p-1 rounded hover:bg-zinc-800 transition-colors"
                  style={{ color: p.status === 'published' ? '#4ade80' : '#71717a' }}
                >
                  {p.status === 'published' ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              <h3 className="text-sm font-medium mb-1" style={{ color: '#F8F8F8' }}>{p.title}</h3>
              <p className="text-xs mb-2" style={{ color: '#71717a' }}>{p.clientName} · {p.industry}</p>
              <p className="text-xs mb-4 line-clamp-2" style={{ color: '#52525b', minHeight: '2rem' }}>{p.description}</p>
              
              <div className="flex gap-1 flex-wrap">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#71717a' }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #18181b' }}>
              <Link href={`/admin/portfolio/${p.id}`} className="text-xs transition-colors duration-150 hover:underline" style={{ color: '#D4AF37' }}>
                Edit Project →
              </Link>
              
              <button
                onClick={() => handleDelete(p.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                style={{
                  color: deleteConfirm === p.id ? '#f87171' : '#52525b',
                  background: deleteConfirm === p.id ? 'rgba(239,68,68,0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (deleteConfirm !== p.id) {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                    e.currentTarget.style.color = '#f87171'
                  }
                }}
                onMouseLeave={(e) => {
                  if (deleteConfirm !== p.id) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#52525b'
                  }
                }}
                title={deleteConfirm === p.id ? 'Click again to confirm' : 'Delete'}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="px-4 py-3 text-xs mt-4 rounded-xl flex items-center justify-between" style={{ color: '#3f3f46', background: '#0f0f12', border: '1px solid #18181b' }}>
        <span>Showing {filtered.length} of {projects.length} projects</span>
        {deleteConfirm && (
          <span style={{ color: '#f87171' }}>⚠ Click trash icon again to confirm delete</span>
        )}
      </div>
    </div>
  )
}
