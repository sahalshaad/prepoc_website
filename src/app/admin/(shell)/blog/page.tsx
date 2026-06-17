'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Eye, Calendar } from 'lucide-react'
import { GenericBadge } from '@/components/admin/ui/StatusBadge'
import { PageHeader } from '@/components/admin/ui/PageHeader'

interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  views: number
  publishedAt: string | null
  category: { name: string } | null
  author: { name: string } | null
}

export default function AdminBlogPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | 'all'>('all')

  useEffect(() => {
    setIsMounted(true)
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const filtered = posts.filter(post => {
    const matchStatus = filterStatus === 'all' || post.status === filterStatus
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.slug.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  if (!isMounted) return null

  return (
    <div className="p-6 max-w-[1200px]">
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content and articles."
        action={
          <Link href="/admin/blog/new" className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b08d27] text-black text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus size={16} />
            Create Post
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 mt-4">
        <div className="flex gap-1 overflow-x-auto">
          {['all', 'PUBLISHED', 'DRAFT'].map((s) => (
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
              {s === 'all' ? 'All' : s.toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#52525b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none w-48"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = '#27272a')}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #18181b' }}>
        <div
          className="grid px-4 py-3 text-xs font-medium"
          style={{ color: '#52525b', background: '#0f0f12', borderBottom: '1px solid #18181b', gridTemplateColumns: '2fr 1fr 1fr 100px 80px 120px 80px', gap: '12px' }}
        >
          <span>Title</span>
          <span>Category</span>
          <span>Author</span>
          <span>Status</span>
          <span>Views</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-center text-xs" style={{ color: '#52525b', background: '#0f0f12' }}>Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs" style={{ color: '#52525b', background: '#0f0f12' }}>No posts found.</div>
        ) : (
          filtered.map((post, i) => (
            <div
              key={post.id}
              className="grid items-center px-4 py-3 transition-all duration-150"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr 100px 80px 120px 80px',
                gap: '12px',
                background: i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)',
                borderBottom: i < filtered.length - 1 ? '1px solid #18181b' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)')}
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-medium truncate" style={{ color: '#F8F8F8' }}>{post.title}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#71717a' }}>{post.slug}</p>
              </div>
              <div className="text-xs" style={{ color: '#a1a1aa' }}>
                {post.category?.name || 'Uncategorized'}
              </div>
              <div className="text-xs truncate" style={{ color: '#a1a1aa' }}>
                {post.author?.name || 'Unknown'}
              </div>
              <div>
                <GenericBadge label={post.status} color={post.status === 'PUBLISHED' ? 'green' : 'muted'} />
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#a1a1aa' }}>
                <Eye size={12} /> {post.views}
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#71717a' }}>
                <Calendar size={12} />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/blog/edit/${post.id}`} className="p-1.5 rounded hover:bg-white/5 transition-colors" style={{ color: '#a1a1aa' }}>
                  <Edit2 size={14} />
                </Link>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded hover:bg-red-500/10 transition-colors" style={{ color: '#f87171' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}

        <div className="px-4 py-3 text-xs" style={{ color: '#3f3f46', background: '#0f0f12', borderTop: '1px solid #18181b' }}>
          {filtered.length} of {posts.length} posts
        </div>
      </div>
    </div>
  )
}
