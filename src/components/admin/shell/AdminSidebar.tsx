'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logoutAction } from '@/lib/admin/auth'
import {
  LayoutDashboard,
  Home,
  Info,
  Users,
  Zap,
  Briefcase,
  Star,
  Image,
  Mail,
  FolderOpen,
  Search,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  UserPlus,
  FileText,
  Building2,
  Send,
  HelpCircle,
  BookOpen,
  type LucideIcon
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Home Page', href: '/admin/home', icon: Home },
      { label: 'About Page', href: '/admin/about', icon: Info },
      { label: 'Blog', href: '/admin/blog', icon: BookOpen },
      { label: 'Team', href: '/admin/team', icon: Users },
      { label: 'Services', href: '/admin/services', icon: Zap },
      { label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
      { label: 'Gallery', href: '/admin/gallery', icon: Image },
      { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: Mail, badge: 7 },
      { label: 'Newsletter', href: '/admin/newsletter', icon: Send },
      { label: 'Careers', href: '/admin/careers', icon: UserPlus },
      { label: 'Job Applications', href: '/admin/job-applications', icon: FileText },
      { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Departments', href: '/admin/departments', icon: Building2 },
      { label: 'SEO', href: '/admin/seo', icon: Search },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Users', href: '/admin/users', icon: UserCog },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logoutAction()
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      className="flex flex-col h-screen border-r shrink-0 transition-all duration-300 relative"
      style={{
        width: collapsed ? '64px' : '240px',
        background: '#09090b',
        borderColor: '#18181b',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-14 px-4 border-b shrink-0"
        style={{ borderColor: '#18181b' }}
      >
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #f0d460)',
              color: '#050505',
              fontFamily: 'var(--font-sora)',
            }}
          >
            P
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span
                className="text-sm font-semibold tracking-tight block whitespace-nowrap"
                style={{ fontFamily: 'var(--font-sora)', color: '#F8F8F8' }}
              >
                PREPOC CMS
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p
                className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: '#3f3f46' }}
              >
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative group"
                      style={{
                        color: active ? '#D4AF37' : '#71717a',
                        background: active ? 'rgba(212,175,55,0.08)' : 'transparent',
                        borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = '#a1a1aa'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = '#71717a'
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      <Icon size={16} className="shrink-0" style={{}} />
                      {!collapsed && (
                        <span className="flex-1 whitespace-nowrap">{item.label}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            color: '#f87171',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {/* Tooltip when collapsed */}
                      {collapsed && (
                        <div
                          className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
                          style={{
                            background: '#18181b',
                            border: '1px solid #27272a',
                            color: '#F8F8F8',
                          }}
                        >
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: View Site + Logout */}
      <div
        className="border-t p-2 space-y-1 shrink-0"
        style={{ borderColor: '#18181b' }}
      >
        {/* View public site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? 'View Site' : undefined}
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all duration-150 group relative"
          style={{ color: '#52525b' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#a1a1aa'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#52525b'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <Globe size={16} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">View Site</span>}
          {collapsed && (
            <div
              className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
              style={{ background: '#18181b', border: '1px solid #27272a', color: '#F8F8F8' }}
            >
              View Site
            </div>
          )}
        </a>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all duration-150 group relative"
          style={{ color: '#52525b' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171'
            e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#52525b'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && (
            <span className="whitespace-nowrap">
              {loggingOut ? 'Signing out…' : 'Sign Out'}
            </span>
          )}
          {collapsed && (
            <div
              className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
              style={{ background: '#18181b', border: '1px solid #27272a', color: '#F8F8F8' }}
            >
              Sign Out
            </div>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[56px] w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 z-10"
        style={{
          background: '#18181b',
          border: '1px solid #27272a',
          color: '#52525b',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#a1a1aa'
          e.currentTarget.style.borderColor = '#3f3f46'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#52525b'
          e.currentTarget.style.borderColor = '#27272a'
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
