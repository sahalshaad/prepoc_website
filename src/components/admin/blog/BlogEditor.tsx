'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from '@/components/admin/ui/RichTextEditor'
import { MediaUploader } from '@/components/admin/ui/MediaUploader'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface BlogEditorProps {
  initialData?: any
  categories: any[]
  authors: any[]
}

export function BlogEditor({ initialData, categories, authors }: BlogEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [status, setStatus] = useState(initialData?.status || 'DRAFT')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [authorId, setAuthorId] = useState(initialData?.authorId || '')
  
  // Tags (comma separated for simple UI)
  const [tags, setTags] = useState(initialData?.tags?.map((t: any) => t.name).join(', ') || '')
  
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '')
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)

  const generateSlug = () => {
    if (!title) return
    const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setSlug(newSlug)
  }

  const handleSave = async (newStatus: string) => {
    if (!title || !slug) return alert('Title and Slug are required')
    
    setLoading(true)
    try {
      const tagArray = tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      
      const payload = {
        title, slug, content, excerpt, status: newStatus, categoryId: categoryId || null, 
        authorId: authorId || null, tags: tagArray, featuredImage, seoTitle, seoDescription, isFeatured
      }

      const method = initialData ? 'PUT' : 'POST'
      const url = initialData ? `/api/admin/blog/${initialData.id}` : '/api/admin/blog'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => {
          router.push('/admin/blog')
          router.refresh()
        }, 1000)
      } else {
        alert(data.error || 'Something went wrong')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-[1200px]">
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
          style={{ color: '#71717a' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
        >
          <ArrowLeft size={14} /> Back to Blog Posts
        </Link>
        <PageHeader
          title={initialData ? 'Edit Post' : 'New Post'}
          description="Create or edit your blog content"
        />
      </div>

      {saved && (
        <div
          className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
        >
          ✓ Post saved successfully! Redirecting…
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl p-6 space-y-4" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>Content</h3>
            
            <FormField
              label="Post Title"
              id="title"
              required
              value={title}
              onChange={setTitle}
              onBlur={generateSlug}
              placeholder="Enter compelling title..."
            />
            
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
                Slug <span style={{ color: '#D4AF37' }}>*</span>
              </label>
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #27272a', color: '#a1a1aa' }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>Content</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>Excerpt</label>
              <textarea 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none h-24 resize-none transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
                placeholder="Short summary of the post..."
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.06)' }}
                onBlur={(e) => { e.target.style.borderColor = '#27272a'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="rounded-xl p-6 space-y-4" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>SEO Settings</h3>
            <FormField
              label="Meta Title"
              id="seoTitle"
              value={seoTitle}
              onChange={setSeoTitle}
              placeholder={title || 'Leave blank to use post title'}
            />
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>Meta Description</label>
              <textarea 
                value={seoDescription} 
                onChange={e => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none h-24 resize-none transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
                placeholder={excerpt || 'Leave blank to use excerpt'}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.06)' }}
                onBlur={(e) => { e.target.style.borderColor = '#27272a'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl p-6 space-y-4" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#F8F8F8' }}>Publishing</h3>
            
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>Category</label>
              <select 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
              >
                <option value="" style={{ background: '#18181b' }}>Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#18181b' }}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>Author</label>
              <select 
                value={authorId} 
                onChange={e => setAuthorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
              >
                <option value="" style={{ background: '#18181b' }}>Select Author</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id} style={{ background: '#18181b' }}>{a.name}</option>
                ))}
              </select>
            </div>

            <FormField
              label="Tags (Comma separated)"
              id="tags"
              value={tags}
              onChange={setTags}
              placeholder="e.g. SEO, Marketing, Tech"
            />

            <div className="pt-2 border-t mt-4" style={{ borderColor: '#18181b' }}>
              <Toggle
                label="Featured Post"
                description="Highlight this post on the blog index"
                checked={isFeatured}
                onChange={setIsFeatured}
              />
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#F8F8F8' }}>Featured Image</h3>
            <MediaUploader 
              value={featuredImage}
              category="blog" 
              onChange={(url: string) => setFeaturedImage(url)} 
              accept="image"
            />
          </div>

          {/* Actions */}
          <div className="rounded-xl p-6 space-y-4" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
             <button
              type="button"
              onClick={() => handleSave('PUBLISHED')}
              disabled={loading || saved}
              className="w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{ background: '#D4AF37', color: '#050505', fontFamily: 'var(--font-sora)', opacity: loading || saved ? 0.7 : 1 }}
            >
              {loading ? 'Saving…' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => handleSave('DRAFT')}
              disabled={loading || saved}
              className="w-full px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ color: '#F8F8F8', background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a' }}
            >
              Save Draft
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function FormField({
  label, id, value, onChange, onBlur, placeholder, type = 'text', required
}: {
  label: string, id: string, value: string, onChange: (v: string) => void, onBlur?: () => void, placeholder?: string, type?: string, required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
        {label} {required && <span style={{ color: '#D4AF37' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212,175,55,0.5)'
          e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.06)'
        }}
        onBlur={(e) => {
          if(onBlur) onBlur()
          e.target.style.borderColor = '#27272a'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}

function Toggle({
  label, description, checked, onChange
}: {
  label: string, description: string, checked: boolean, onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#a1a1aa' }}>{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="w-9 h-5 rounded-full transition-all duration-200 relative"
        style={{ background: checked ? '#D4AF37' : '#27272a' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
          style={{ background: '#F8F8F8', left: checked ? '18px' : '2px' }}
        />
      </button>
    </div>
  )
}
