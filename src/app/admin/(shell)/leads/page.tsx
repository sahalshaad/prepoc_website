'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import type { ContactLead, LeadStatus } from '@/types/admin'
import { Search, Mail, Building2, ArrowRight } from 'lucide-react'



const STATUS_OPTIONS: Array<LeadStatus | 'all'> = ['all', 'new', 'contacted', 'proposal_sent', 'converted', 'closed']

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000 / 60
  if (diff < 60) return `${Math.floor(diff)}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return `${Math.floor(diff / 1440)}d ago`
}

export default function LeadsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [leads, setLeads] = useState<ContactLead[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')

  useEffect(() => {
    setIsMounted(true)
    async function loadLeads() {
      try {
        const res = await fetch('/api/admin/leads', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          // Sort by submittedAt descending
          const sorted = (data.data as ContactLead[]).sort((a, b) => 
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          )
          setLeads(sorted)
        }
      } catch (err) {
        console.error('Failed to load leads:', err)
      }
    }
    loadLeads()
  }, [])

  const filtered = leads.filter((l) => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const newCount = leads.filter((l) => l.status === 'new').length

  const updateStatus = async (id: string, status: LeadStatus) => {
    const target = leads.find((l) => l.id === id)
    if (!target) return

    // Optimistic UI update
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            ...target,
            status
          }
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update lead status')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to update status: ' + (err instanceof Error ? err.message : String(err)))
      // Rollback UI
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: target.status } : l))
    }
  }

  if (!isMounted) return null

  return (
    <div className="p-6 max-w-[1200px]">
      <PageHeader
        title="Leads"
        description={`${newCount} new inquiries`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-1 overflow-x-auto">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-all duration-150"
              style={{
                background: filterStatus === s ? 'rgba(212,175,55,0.1)' : 'transparent',
                color: filterStatus === s ? '#D4AF37' : '#71717a',
                border: filterStatus === s ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
              }}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
              {s === 'new' && newCount > 0 && (
                <span className="ml-1.5 px-1 rounded-full text-[10px]" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-48"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = '#27272a')}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #18181b' }}>
        <div
          className="grid px-4 py-3 text-xs font-medium"
          style={{ color: '#52525b', background: '#0f0f12', borderBottom: '1px solid #18181b', gridTemplateColumns: '1fr 1fr 160px 160px 120px 40px', gap: '12px' }}
        >
          <span>Contact</span>
          <span>Message</span>
          <span>Service</span>
          <span>Status</span>
          <span>Received</span>
          <span />
        </div>

        {filtered.map((lead, i) => (
          <div
            key={lead.id}
            className="grid items-start px-4 py-4 transition-all duration-150"
            style={{
              gridTemplateColumns: '1fr 1fr 160px 160px 120px 40px',
              gap: '12px',
              background: i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)',
              borderBottom: i < filtered.length - 1 ? '1px solid #18181b' : 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)')}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>{lead.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Mail size={10} style={{ color: '#52525b' }} />
                <p className="text-xs truncate" style={{ color: '#71717a' }}>{lead.email}</p>
              </div>
              {lead.company && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 size={10} style={{ color: '#52525b' }} />
                  <p className="text-xs" style={{ color: '#71717a' }}>{lead.company}</p>
                </div>
              )}
            </div>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#a1a1aa' }}>{lead.message}</p>
            <p className="text-xs" style={{ color: '#a1a1aa' }}>{lead.serviceInterested}</p>
            <div>
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                className="text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                style={{ background: 'transparent', border: 'none', color: 'inherit', fontFamily: 'var(--font-inter)' }}
              >
                <option value="new">🔵 New</option>
                <option value="contacted">🟡 Contacted</option>
                <option value="proposal_sent">🟣 Proposal Sent</option>
                <option value="converted">🟢 Converted</option>
                <option value="closed">⚫ Closed</option>
              </select>
              <div className="mt-1"><StatusBadge status={lead.status} /></div>
            </div>
            <p className="text-xs" style={{ color: '#52525b' }}>{timeAgo(lead.submittedAt)}</p>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ color: '#52525b' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent' }}>
              <ArrowRight size={13} />
            </button>
          </div>
        ))}

        <div className="px-4 py-3 text-xs" style={{ color: '#3f3f46', background: '#0f0f12', borderTop: '1px solid #18181b' }}>
          {filtered.length} of {leads.length} leads
        </div>
      </div>
    </div>
  )
}
