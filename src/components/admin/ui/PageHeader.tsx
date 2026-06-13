interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-sora)', color: '#F8F8F8' }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm" style={{ color: '#71717a' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  )
}
