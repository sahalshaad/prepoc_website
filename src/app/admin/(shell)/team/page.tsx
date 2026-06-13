'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { GenericBadge } from '@/components/admin/ui/StatusBadge'
import type { TeamMemberCMS } from '@/types/admin'
import { type TeamMember } from '@/data/aboutData'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  LinkedinIcon,
  GripVertical,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const DEPT_COLORS: Record<string, 'gold' | 'green' | 'blue' | 'red' | 'muted'> = {
  Leadership: 'gold',
  'Web Development': 'blue',
  'Digital Marketing': 'green',
  'Branding & Design': 'muted',
  'Video Production': 'red',
  'AI & Automation': 'muted',
}

const getDeptColor = (name: string) => DEPT_COLORS[name] || 'muted'

export default function TeamPage() {
  const [search, setSearch] = useState('')
  const [activeDept, setActiveDept] = useState<string>('All')
  const [members, setMembers] = useState<TeamMemberCMS[]>([])
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const depsRes = await fetch('/api/admin/departments')
        const depsData = await depsRes.json()
        if (depsData.success) {
          setDepartments(depsData.data.filter((d: any) => d.isActive))
        }

        const res = await fetch('/api/admin/team')
        const data = await res.json()
        if (data.success && data.data) {
          const cmsData = data.data.map((m: TeamMember) => ({
            id: String(m.id),
            name: m.name,
            title: m.title,
            department: m.department,
            bio: m.bio,
            image: m.image,
            linkedin: m.linkedin,
            displayOrder: m.id,
            isLeadership: typeof m.isLeadership === 'boolean' ? m.isLeadership : m.department === 'Leadership',
            isFounder: m.isFounder || false,
            isActive: typeof m.isActive === 'boolean' ? m.isActive : true,
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-06-01T00:00:00Z',
          }))
          setMembers(cmsData)
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }
    loadData()
  }, [])

  const filtered = members.filter((m) => {
    const matchDept = activeDept === 'All' || m.department === activeDept
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  const handleDelete = async (id: string) => {
    const memberToDelete = members.find((m) => m.id === id)
    if (memberToDelete?.isFounder) {
      alert('Founder cannot be deleted.')
      return
    }

    if (deleteConfirm === id) {
      const updatedMembers = members.filter((m) => m.id !== id)
      try {
        const teamDataFormat = updatedMembers.map((m) => ({
          id: Number(m.id),
          name: m.name,
          title: m.title,
          department: m.department,
          bio: m.bio,
          image: m.image,
          linkedin: m.linkedin,
          isFounder: m.isFounder,
          isLeadership: m.isLeadership,
          isActive: m.isActive
        }))
        const res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: teamDataFormat }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to delete member')
        }
        setMembers(updatedMembers)
        setDeleteConfirm(null)
        setDeleteSuccess('Team member removed.')
        setTimeout(() => setDeleteSuccess(null), 3000)
      } catch (err) {
        console.error(err)
        alert('Failed to delete team member: ' + (err instanceof Error ? err.message : String(err)))
      }
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const toggleActive = async (id: string) => {
    const targetMember = members.find((m) => m.id === id)
    if (!targetMember) return

    const newActiveState = !targetMember.isActive

    // Optimistically update UI
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: newActiveState } : m))
    )

    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: {
            id: targetMember.id,
            name: targetMember.name,
            title: targetMember.title,
            department: targetMember.department,
            bio: targetMember.bio,
            image: targetMember.image,
            linkedin: targetMember.linkedin,
            isFounder: targetMember.isFounder,
            isLeadership: targetMember.isLeadership,
            isActive: newActiveState
          }
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update active state')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to update active state: ' + (err instanceof Error ? err.message : String(err)))
      // Rollback UI state on error
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isActive: targetMember.isActive } : m))
      )
    }
  }

  return (
    <div className="p-6 max-w-[1200px]">
      <PageHeader
        title="Team"
        description={`${members.length} members across ${departments.length} departments`}
        action={
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{
              background: '#D4AF37',
              color: '#050505',
              fontFamily: 'var(--font-sora)',
            }}
          >
            <Plus size={15} />
            Add Member
          </Link>
        }
      />

      {/* Success toast */}
      {deleteSuccess && (
        <div
          className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            color: '#4ade80',
          }}
        >
          ✓ {deleteSuccess}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Department tabs */}
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveDept('All')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150"
            style={{
              background: activeDept === 'All' ? 'rgba(212,175,55,0.1)' : 'transparent',
              color: activeDept === 'All' ? '#D4AF37' : '#71717a',
              border: activeDept === 'All' ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
            }}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept.name)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150"
              style={{
                background: activeDept === dept.name ? 'rgba(212,175,55,0.1)' : 'transparent',
                color: activeDept === dept.name ? '#D4AF37' : '#71717a',
                border: activeDept === dept.name ? '1px solid rgba(212,175,55,0.2)' : '1px solid transparent',
              }}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#52525b' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-48 transition-all duration-150"
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

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #18181b' }}
      >
        {/* Table header */}
        <div
          className="grid items-center px-4 py-3 text-xs font-medium"
          style={{
            color: '#52525b',
            background: '#0f0f12',
            borderBottom: '1px solid #18181b',
            gridTemplateColumns: '32px 1fr 1fr 140px 80px 100px',
            gap: '12px',
          }}
        >
          <span />
          <span>Member</span>
          <span>Role</span>
          <span>Department</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div
            className="py-16 text-center text-sm"
            style={{ color: '#52525b', background: '#0f0f12' }}
          >
            No members found.
          </div>
        ) : (
          <div>
            {filtered.map((member, i) => (
              <div
                key={member.id}
                className="grid items-center px-4 py-3.5 transition-all duration-150"
                style={{
                  gridTemplateColumns: '32px 1fr 1fr 140px 80px 100px',
                  gap: '12px',
                  background: i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)',
                  borderBottom: i < filtered.length - 1 ? '1px solid #18181b' : 'none',
                  opacity: member.isActive ? 1 : 0.5,
                }}
              >
                {/* Drag handle */}
                <GripVertical size={14} style={{ color: '#3f3f46', cursor: 'grab' }} />

                {/* Member */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-medium truncate" style={{ color: '#F8F8F8' }}>
                        {member.name}
                      </p>
                      {member.isFounder && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                          👑 Founder
                        </span>
                      )}
                      {member.isLeadership && !member.isFounder && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                          ⭐ Leadership
                        </span>
                      )}
                      {!member.isActive && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(255,255,255,0.06)', color: '#71717a', border: '1px solid rgba(255,255,255,0.1)' }}>
                          ⚫ Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs truncate" style={{ color: '#52525b' }}>
                      {member.linkedin}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <p className="text-sm truncate" style={{ color: '#a1a1aa' }}>
                  {member.title}
                </p>

                {/* Department */}
                <GenericBadge
                  label={member.department}
                  color={getDeptColor(member.department)}
                />

                {/* Active toggle */}
                <button
                  onClick={() => toggleActive(member.id)}
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: member.isActive ? '#4ade80' : '#52525b' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: member.isActive ? '#22c55e' : '#52525b' }}
                  />
                  {member.isActive ? 'Active' : 'Hidden'}
                </button>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                    style={{ color: '#52525b' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = '#a1a1aa'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#52525b'
                    }}
                  >
                    <LinkedinIcon size={13} />
                  </a>
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
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
                    <Pencil size={13} />
                  </Link>
                  {member.isFounder ? (
                    <button
                      disabled
                      className="w-7 h-7 flex items-center justify-center rounded-lg opacity-25 cursor-not-allowed"
                      style={{ color: '#52525b' }}
                      title="Founder cannot be deleted"
                    >
                      <Trash2 size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                      style={{
                        color: deleteConfirm === member.id ? '#f87171' : '#52525b',
                        background:
                          deleteConfirm === member.id ? 'rgba(239,68,68,0.1)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (deleteConfirm !== member.id) {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                          e.currentTarget.style.color = '#f87171'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deleteConfirm !== member.id) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#52525b'
                        }
                      }}
                      title={deleteConfirm === member.id ? 'Click again to confirm' : 'Delete'}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table footer */}
        <div
          className="px-4 py-3 text-xs"
          style={{
            color: '#3f3f46',
            background: '#0f0f12',
            borderTop: '1px solid #18181b',
          }}
        >
          Showing {filtered.length} of {members.length} members
          {deleteConfirm && (
            <span className="ml-4" style={{ color: '#f87171' }}>
              ⚠ Click delete again to confirm removal
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
