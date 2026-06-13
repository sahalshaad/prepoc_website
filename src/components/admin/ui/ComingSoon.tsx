// Shared "Coming Soon" component for Phase 2/3 pages
interface ComingSoonProps {
  title: string
  phase?: 2 | 3
}

export function ComingSoonPage({ title, phase = 2 }: ComingSoonProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-sora)', color: '#F8F8F8' }}>
          {title}
        </h1>
      </div>
      <div
        className="flex flex-col items-center justify-center py-24 rounded-2xl text-center"
        style={{ background: '#0f0f12', border: '1px dashed #27272a' }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl"
          style={{ background: 'rgba(212,175,55,0.08)' }}
        >
          🚧
        </div>
        <h2 className="text-sm font-medium mb-1" style={{ color: '#F8F8F8' }}>
          Coming in Phase {phase}
        </h2>
        <p className="text-xs max-w-xs" style={{ color: '#52525b' }}>
          This section is designed and ready for implementation. Full functionality arrives in Phase {phase} of the PREPOC CMS rollout.
        </p>
        <div
          className="mt-4 px-3 py-1 rounded-full text-[10px] font-medium"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.15)',
            color: '#D4AF37',
          }}
        >
          Phase {phase} Roadmap
        </div>
      </div>
    </div>
  )
}
