import type { LeadStatus } from '@/types/admin'

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  new: {
    label: 'New',
    bg: 'rgba(59,130,246,0.1)',
    text: '#60a5fa',
    dot: '#3b82f6',
  },
  contacted: {
    label: 'Contacted',
    bg: 'rgba(245,158,11,0.1)',
    text: '#fbbf24',
    dot: '#f59e0b',
  },
  proposal_sent: {
    label: 'Proposal Sent',
    bg: 'rgba(168,85,247,0.1)',
    text: '#c084fc',
    dot: '#a855f7',
  },
  converted: {
    label: 'Converted',
    bg: 'rgba(34,197,94,0.1)',
    text: '#4ade80',
    dot: '#22c55e',
  },
  closed: {
    label: 'Closed',
    bg: 'rgba(113,113,122,0.1)',
    text: '#71717a',
    dot: '#52525b',
  },
}

interface StatusBadgeProps {
  status: LeadStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}

// Generic string status badge
interface GenericBadgeProps {
  label: string
  color?: 'gold' | 'green' | 'blue' | 'red' | 'muted'
}

const GENERIC_COLORS = {
  gold: { bg: 'rgba(212,175,55,0.1)', text: '#D4AF37' },
  green: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80' },
  blue: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa' },
  red: { bg: 'rgba(239,68,68,0.1)', text: '#f87171' },
  muted: { bg: 'rgba(113,113,122,0.1)', text: '#71717a' },
}

export function GenericBadge({ label, color = 'muted' }: GenericBadgeProps) {
  const cfg = GENERIC_COLORS[color]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {label}
    </span>
  )
}
