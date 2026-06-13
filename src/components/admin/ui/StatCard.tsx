interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon: React.ReactNode
  accentColor?: string
}

export function StatCard({
  label,
  value,
  delta,
  deltaPositive,
  icon,
  accentColor = '#D4AF37',
}: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-200"
      style={{
        background: '#0f0f12',
        border: '1px solid #18181b',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#27272a'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#18181b'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium" style={{ color: '#71717a' }}>
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}14` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
      <p
        className="text-2xl font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-sora)', color: '#F8F8F8' }}
      >
        {value}
      </p>
      {delta && (
        <p
          className="mt-1.5 text-xs"
          style={{ color: deltaPositive ? '#4ade80' : '#f87171' }}
        >
          {deltaPositive ? '↑' : '↓'} {delta}
        </p>
      )}
    </div>
  )
}
