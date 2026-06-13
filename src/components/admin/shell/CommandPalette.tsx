'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, FolderPlus, FilePlus, ImagePlus, Users, Building2, Clock } from 'lucide-react'

export interface SearchIndexItem {
  id: string
  title: string
  subtitle: string
  category: string
  href: string
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

const QUICK_ACTIONS = [
  { id: 'action-team', title: 'Create Team Member', subtitle: 'Quick Action', category: 'Actions', href: '/admin/team/new', icon: UserPlus },
  { id: 'action-portfolio', title: 'Create Portfolio Project', subtitle: 'Quick Action', category: 'Actions', href: '/admin/portfolio/new', icon: FolderPlus },
  { id: 'action-vacancy', title: 'Create Job Vacancy', subtitle: 'Quick Action', category: 'Actions', href: '/admin/careers/new', icon: FilePlus },
  { id: 'action-media', title: 'Upload Media', subtitle: 'Quick Action', category: 'Actions', href: '/admin/media', icon: ImagePlus },
  { id: 'action-leads', title: 'View Leads', subtitle: 'Quick Action', category: 'Actions', href: '/admin/leads', icon: Users },
  { id: 'action-departments', title: 'Manage Departments', subtitle: 'Quick Action', category: 'Actions', href: '/admin/departments', icon: Building2 },
]

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [indexData, setIndexData] = useState<SearchIndexItem[]>([])
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<SearchIndexItem[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 1. Fetch search index globally on mount
  useEffect(() => {
    async function loadIndex() {
      try {
        const res = await fetch('/api/admin/search-index')
        const data = await res.json()
        if (data.success && data.data) {
          setIndexData(data.data)
        }
      } catch (err) {
        console.error('Failed to load search index:', err)
      }
    }
    loadIndex()

    const stored = localStorage.getItem('prepoc-recent-searches')
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)) } catch (e) {}
    }
  }, [])

  // 2. Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  // 3. Filter results
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    const term = debouncedQuery.toLowerCase()
    const matches = indexData.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.subtitle.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    )
    return matches.slice(0, 10) // Top 10 matches
  }, [debouncedQuery, indexData])

  const isEmpty = !debouncedQuery.trim()

  const itemsToDisplay = isEmpty 
    ? [...recentSearches, ...QUICK_ACTIONS.map(a => ({...a, isAction: true}))] 
    : filteredResults

  // Group items by category for rendering
  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {}
    itemsToDisplay.forEach(item => {
      const cat = isEmpty ? (item.isAction ? 'Quick Actions' : 'Recent Searches') : item.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [itemsToDisplay, isEmpty])

  // Flat list of display items for keyboard navigation
  const flatItems = useMemo(() => {
    const flat: any[] = []
    Object.values(groupedItems).forEach(group => flat.push(...group))
    return flat
  }, [groupedItems])

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [flatItems.length])

  // Highlight matching text
  const highlightMatch = (text: string, term: string) => {
    if (!term) return text
    const parts = text.split(new RegExp(`(${term})`, 'gi'))
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} style={{ color: '#D4AF37', fontWeight: 600 }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    )
  }

  const handleSelect = (item: any) => {
    // Add to recent searches if not a quick action
    if (!item.isAction) {
      const updatedRecent = [item, ...recentSearches.filter(r => r.id !== item.id)].slice(0, 5)
      setRecentSearches(updatedRecent)
      localStorage.setItem('prepoc-recent-searches', JSON.stringify(updatedRecent))
    }
    onClose()
    router.push(item.href)
  }

  // Keyboard Navigation
  useEffect(() => {
    if (!open) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % flatItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (flatItems[selectedIndex]) {
          handleSelect(flatItems[selectedIndex])
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (flatItems[selectedIndex] && !flatItems[selectedIndex].isAction) {
          setQuery(flatItems[selectedIndex].title)
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, flatItems, selectedIndex])

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setDebouncedQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && flatItems.length > 0) {
      const activeEl = listRef.current.querySelector('[data-active="true"]') as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex, flatItems.length])

  if (!open) return null

  let globalItemIndex = 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[80vh]"
        style={{
          background: '#0f0f12',
          border: '1px solid #27272a',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b shrink-0"
          style={{ borderColor: '#18181b' }}
        >
          <Search size={16} style={{ color: '#52525b' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, content, leads…"
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
          />
          <kbd
            className="px-1.5 py-0.5 rounded text-xs"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #27272a', color: '#52525b' }}
          >
            Esc
          </kbd>
        </div>

        <div className="overflow-y-auto" ref={listRef} style={{ padding: '8px' }}>
          {isEmpty && recentSearches.length === 0 && (
            <div className="px-4 py-6 text-center text-sm" style={{ color: '#52525b' }}>
              No recent searches yet.<br/>
              Use Cmd + K to quickly navigate the CMS.
            </div>
          )}

          {!isEmpty && filteredResults.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: '#52525b' }}>
              No results found.<br/>
              Try another keyword.
            </div>
          ) : (
            Object.keys(groupedItems).map((categoryName) => (
              <div key={categoryName} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#52525b' }}>
                  {categoryName}
                </div>
                {groupedItems[categoryName].map((item) => {
                  const isSelected = globalItemIndex === selectedIndex
                  const currentIndex = globalItemIndex++
                  const Icon = item.icon
                  
                  return (
                    <div
                      key={`${categoryName}-${item.id}`}
                      data-active={isSelected}
                      onClick={() => handleSelect(item)}
                      className="px-3 py-2.5 rounded-lg flex items-center gap-3 cursor-pointer transition-colors duration-100"
                      style={{
                        background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                      }}
                      onMouseMove={() => {
                        if (selectedIndex !== currentIndex) setSelectedIndex(currentIndex)
                      }}
                    >
                      {item.isAction ? (
                        <div className="w-8 h-8 rounded bg-zinc-800/50 flex items-center justify-center shrink-0">
                          {Icon && <Icon size={14} style={{ color: '#a1a1aa' }} />}
                        </div>
                      ) : categoryName === 'Recent Searches' ? (
                        <div className="w-8 h-8 rounded bg-zinc-800/50 flex items-center justify-center shrink-0">
                          <Clock size={14} style={{ color: '#a1a1aa' }} />
                        </div>
                      ) : null}

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: isSelected ? '#F8F8F8' : '#e4e4e7' }}>
                          {highlightMatch(item.title, debouncedQuery)}
                        </div>
                        <div className="text-xs truncate" style={{ color: '#71717a' }}>
                          {highlightMatch(item.subtitle, debouncedQuery)}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="shrink-0 text-xs text-zinc-500 flex gap-1">
                          {item.isAction ? 'Execute' : 'Open'}
                          <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">↵</kbd>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
