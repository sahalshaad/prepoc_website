'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '@/components/admin/ui/StatCard'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import type { ContactLead, ActivityEvent } from '@/types/admin'
import {
  Mail,
  Users,
  Zap,
  Briefcase,
  TrendingUp,
  Globe,
  CheckCircle,

  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

// ─── Mock Data ────────────────────────────────────────────────
const MOCK_LEADS: ContactLead[] = [
  {
    id: '1',
    name: 'Hassan Al-Farouq',
    email: 'hassan@ventures.ae',
    company: 'Gulf Ventures',
    serviceInterested: 'Web Development',
    message: '',
    status: 'new',
    submittedAt: '2026-06-11T06:00:00Z',
    updatedAt: '2026-06-11T06:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@techbrand.in',
    company: 'TechBrand India',
    serviceInterested: 'Digital Marketing',
    message: '',
    status: 'contacted',
    submittedAt: '2026-06-10T14:30:00Z',
    updatedAt: '2026-06-10T16:00:00Z',
  },
  {
    id: '3',
    name: 'James Whitfield',
    email: 'james@cloudops.io',
    company: 'CloudOps',
    serviceInterested: 'AI & Automation',
    message: '',
    status: 'proposal_sent',
    submittedAt: '2026-06-09T09:00:00Z',
    updatedAt: '2026-06-09T11:00:00Z',
  },
  {
    id: '4',
    name: 'Fatima Al-Rashid',
    email: 'fatima@luxeretail.com',
    company: 'Luxe Retail',
    serviceInterested: 'Branding & Design',
    message: '',
    status: 'converted',
    submittedAt: '2026-06-07T10:00:00Z',
    updatedAt: '2026-06-08T12:00:00Z',
  },
  {
    id: '5',
    name: 'Oliver Chen',
    email: 'oliver@startfast.co',
    company: 'StartFast',
    serviceInterested: 'Web Development',
    message: '',
    status: 'new',
    submittedAt: '2026-06-11T04:00:00Z',
    updatedAt: '2026-06-11T04:00:00Z',
  },
]

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: '1',
    type: 'lead',
    message: 'New lead from Hassan Al-Farouq (Gulf Ventures)',
    user: 'System',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    type: 'team',
    message: 'Team member Zara Ahmed profile updated',
    user: 'Admin',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'portfolio',
    message: 'Project "E-Commerce Rebrand" published',
    user: 'Admin',
    timestamp: '3 hours ago',
  },
  {
    id: '4',
    type: 'lead',
    message: 'Lead from Oliver Chen (StartFast) received',
    user: 'System',
    timestamp: '5 hours ago',
  },
  {
    id: '5',
    type: 'service',
    message: 'AI & Automation service updated',
    user: 'Admin',
    timestamp: 'Yesterday',
  },
  {
    id: '6',
    type: 'auth',
    message: 'Admin signed in from 192.168.1.1',
    user: 'Admin',
    timestamp: 'Yesterday',
  },
]

const ACTIVITY_ICONS: Record<string, { icon: typeof Mail; color: string }> = {
  lead: { icon: Mail, color: '#60a5fa' },
  team: { icon: Users, color: '#D4AF37' },
  portfolio: { icon: Briefcase, color: '#a855f7' },
  service: { icon: Zap, color: '#4ade80' },
  media: { icon: Globe, color: '#f59e0b' },
  auth: { icon: CheckCircle, color: '#52525b' },
}

function timeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = (now.getTime() - date.getTime()) / 1000 / 60
  if (diff < 1) return 'just now'
  if (diff < 60) return `${Math.floor(diff)}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return `${Math.floor(diff / 1440)}d ago`
}

// ─── Dashboard Page ───────────────────────────────────────────

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const newLeads = MOCK_LEADS.filter((l) => l.status === 'new').length

  return (
    <div className="p-6 max-w-[1400px]">
      {/* Header with live indicator */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-sora)', color: '#F8F8F8' }}
          >
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: '#71717a' }}>
            PREPOC Technologies — Website overview
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            color: '#4ade80',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#22c55e' }}
          />
          Website Live
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="New Leads"
          value={newLeads}
          delta="2 since yesterday"
          deltaPositive
          icon={<Mail size={16} />}
          accentColor="#60a5fa"
        />
        <StatCard
          label="Team Members"
          value={10}
          delta="1 added this week"
          deltaPositive
          icon={<Users size={16} />}
          accentColor="#D4AF37"
        />
        <StatCard
          label="Active Services"
          value={6}
          icon={<Zap size={16} />}
          accentColor="#4ade80"
        />
        <StatCard
          label="Portfolio Projects"
          value={12}
          delta="1 published today"
          deltaPositive
          icon={<Briefcase size={16} />}
          accentColor="#a855f7"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Leads — left 2/3 */}
        <div
          className="lg:col-span-2 rounded-xl"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: '#18181b' }}
          >
            <h2 className="text-sm font-medium" style={{ color: '#F8F8F8' }}>
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1 text-xs transition-colors duration-150"
              style={{ color: '#71717a' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: '#18181b' }}>
            {MOCK_LEADS.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-all duration-150"
                style={{ borderColor: '#18181b' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    color: '#D4AF37',
                    fontFamily: 'var(--font-sora)',
                  }}
                >
                  {lead.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#F8F8F8' }}>
                    {lead.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#71717a' }}>
                    {lead.company} · {lead.serviceInterested}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <StatusBadge status={lead.status} />
                </div>

                {/* Time */}
                <p
                  className="text-xs shrink-0 hidden sm:block"
                  style={{ color: '#52525b' }}
                >
                  {isMounted ? timeAgo(lead.submittedAt) : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed — right 1/3 */}
        <div
          className="rounded-xl"
          style={{ background: '#0f0f12', border: '1px solid #18181b' }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: '#18181b' }}
          >
            <h2 className="text-sm font-medium" style={{ color: '#F8F8F8' }}>
              Activity
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {MOCK_ACTIVITY.map((event) => {
              const cfg = ACTIVITY_ICONS[event.type] || ACTIVITY_ICONS.auth
              const Icon = cfg.icon
              return (
                <div key={event.id} className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${cfg.color}14` }}
                  >
                    <Icon size={13} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug" style={{ color: '#a1a1aa' }}>
                      {event.message}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#3f3f46' }}>
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#0f0f12', border: '1px solid #18181b' }}
      >
        <h2 className="text-sm font-medium mb-4" style={{ color: '#F8F8F8' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Team Member', href: '/admin/team/new', icon: Users, color: '#D4AF37' },
            { label: 'New Portfolio Project', href: '/admin/portfolio/new', icon: Briefcase, color: '#a855f7' },
            { label: 'Edit Home Page', href: '/admin/home', icon: TrendingUp, color: '#60a5fa' },
            { label: 'Manage Leads', href: '/admin/leads', icon: Mail, color: '#4ade80' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid #18181b',
                  color: '#a1a1aa',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#27272a'
                  e.currentTarget.style.color = '#F8F8F8'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#18181b'
                  e.currentTarget.style.color = '#a1a1aa'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}14` }}
                >
                  <Icon size={14} style={{ color: item.color }} />
                </div>
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
