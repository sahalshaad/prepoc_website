'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { JobApplication, ApplicationStatus } from '@/types/admin'
import { Search, Mail, FileText, ArrowRight, Download, Link as LinkIcon, MapPin, Briefcase } from 'lucide-react'

const STATUS_OPTIONS: Array<ApplicationStatus | 'all'> = ['all', 'new', 'reviewed', 'shortlisted', 'interview_scheduled', 'hired', 'rejected']

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000 / 60
  if (diff < 60) return `${Math.floor(diff)}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`
  return `${Math.floor(diff / 10080)}w ago`
}

export default function JobApplicationsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all')

  useEffect(() => {
    setIsMounted(true)
    async function loadApplications() {
      try {
        const res = await fetch('/api/admin/job-applications', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          const sorted = (data.data as JobApplication[]).sort((a, b) => 
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          )
          setApplications(sorted)
        }
      } catch (err) {
        console.error('Failed to load applications:', err)
      }
    }
    loadApplications()
  }, [])

  const filtered = applications.filter((a) => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const newCount = applications.filter((a) => a.status === 'new').length

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    const target = applications.find((a) => a.id === id)
    if (!target) return

    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))

    try {
      const res = await fetch('/api/admin/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application: { ...target, status } }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)
    } catch (err) {
      console.error(err)
      alert('Failed to update status: ' + (err instanceof Error ? err.message : String(err)))
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: target.status } : a))
    }
  }

  if (!isMounted) return null

  return (
    <div className="p-6 max-w-[1200px]">
      <PageHeader
        title="Job Applications"
        description={`${newCount} new applications`}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
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
        <div className="relative sm:ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants…"
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-full sm:w-48"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = '#27272a')}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden overflow-x-auto" style={{ border: '1px solid #18181b' }}>
        <div className="min-w-[900px]">
          <div className="grid px-4 py-3 text-xs font-medium"
            style={{ color: '#52525b', background: '#0f0f12', borderBottom: '1px solid #18181b', gridTemplateColumns: '2fr 1.5fr 1fr 140px 100px 80px', gap: '12px' }}>
            <span>Applicant</span>
            <span>Applied Position</span>
            <span>Links</span>
            <span>Status</span>
            <span>Applied</span>
            <span />
          </div>

          {filtered.map((app, i) => (
            <div key={app.id} className="grid items-start px-4 py-4 transition-all duration-150"
              style={{
                gridTemplateColumns: '2fr 1.5fr 1fr 140px 100px 80px',
                gap: '12px',
                background: i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)',
                borderBottom: i < filtered.length - 1 ? '1px solid #18181b' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)')}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>{app.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Mail size={10} style={{ color: '#52525b' }} />
                  <p className="text-xs truncate" style={{ color: '#71717a' }}>{app.email}</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={10} style={{ color: '#52525b' }} />
                  <p className="text-xs truncate" style={{ color: '#71717a' }}>{app.location}</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Briefcase size={12} style={{ color: '#52525b' }} />
                  <p className="text-sm font-medium" style={{ color: '#D4AF37' }}>{app.jobTitle}</p>
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#a1a1aa' }}>{app.coverLetter}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                {app.resumeUrl && (
                  <a href={app.resumeUrl} download className="flex items-center gap-1 text-[11px] hover:underline" style={{ color: '#3b82f6' }}>
                    <Download size={10} /> Download Resume
                  </a>
                )}
                {app.linkedinUrl && (
                  <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] hover:underline" style={{ color: '#6366f1' }}>
                    <LinkIcon size={10} /> LinkedIn
                  </a>
                )}
                {app.portfolioUrl && (
                  <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] hover:underline" style={{ color: '#D4AF37' }}>
                    <LinkIcon size={10} /> Portfolio
                  </a>
                )}
              </div>

              <div>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                  className="text-xs rounded-lg px-2 py-1 outline-none cursor-pointer mb-1 w-full"
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
                <StatusBadge status={app.status as any} />
              </div>

              <p className="text-xs" style={{ color: '#52525b' }}>{timeAgo(app.submittedAt)}</p>
              
              <button className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ color: '#52525b' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent' }}>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: '#71717a' }}>
              No job applications found.
            </div>
          )}
        </div>

        <div className="px-4 py-3 text-xs" style={{ color: '#3f3f46', background: '#0f0f12', borderTop: '1px solid #18181b' }}>
          {filtered.length} of {applications.length} applications
        </div>
      </div>
    </div>
  )
}
