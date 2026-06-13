'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Bell, Search, ChevronRight } from 'lucide-react'
import { CommandPalette } from './CommandPalette'

// Derive page title from pathname
function getPageTitle(pathname: string): { title: string; crumbs: string[] } {
  const segments = pathname.replace('/admin/', '').split('/')
  const map: Record<string, string> = {
    dashboard: 'Dashboard',
    home: 'Home Page',
    about: 'About Page',
    team: 'Team',
    services: 'Services',
    portfolio: 'Portfolio',
    testimonials: 'Testimonials',
    gallery: 'Gallery',
    leads: 'Leads',
    media: 'Media Library',
    seo: 'SEO',
    settings: 'Settings',
    users: 'Users',
    new: 'New',
  }
  const crumbs = segments.map((s) => map[s] || s.charAt(0).toUpperCase() + s.slice(1))
  return { title: crumbs[crumbs.length - 1] || 'Dashboard', crumbs }
}

export function AdminTopbar() {
  const pathname = usePathname()
  const { crumbs } = getPageTitle(pathname)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(open => !open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header
      className="flex items-center justify-between h-14 px-5 border-b shrink-0"
      style={{ background: '#09090b', borderColor: '#18181b' }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span style={{ color: '#52525b' }}>Admin</span>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} style={{ color: '#3f3f46' }} />
            <span
              style={{
                color: i === crumbs.length - 1 ? '#F8F8F8' : '#52525b',
                fontWeight: i === crumbs.length - 1 ? 500 : 400,
                fontFamily: 'var(--font-inter)',
              }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #27272a',
            color: '#52525b',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3f3f46'
            e.currentTarget.style.color = '#a1a1aa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#27272a'
            e.currentTarget.style.color = '#52525b'
          }}
        >
          <Search size={12} />
          <span style={{ fontFamily: 'var(--font-inter)' }}>Search…</span>
          <kbd
            className="px-1 py-0.5 rounded text-[10px]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid #27272a',
              color: '#3f3f46',
              fontFamily: 'inherit',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
          style={{ color: '#52525b' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = '#a1a1aa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#52525b'
          }}
        >
          <Bell size={15} />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#D4AF37' }}
          />
        </button>

        {/* Avatar */}
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #f0d460)',
            color: '#050505',
            fontFamily: 'var(--font-sora)',
          }}
        >
          A
        </button>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
