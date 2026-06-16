'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'

interface MediaItem {
  id: string
  url: string
  thumbnailUrl: string
  filename: string
  category: string
  type: string
}

export function MarqueeManager() {
  const [images, setImages] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/media?category=marquee&t=${Date.now()}`)
      const data = await res.json()
      if (data.success) {
        setImages(data.data)
      }
    } catch (err) {
      console.error('Failed to load marquee images:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', 'marquee')

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (!data.success) {
          alert(`Failed to upload ${file.name}: ${data.error}`)
        }
      }
      await loadImages()
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setImages(prev => prev.filter(img => img.url !== url))
      } else {
        alert(data.error || 'Failed to delete')
      }
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div className="mb-10 rounded-xl p-6" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#F8F8F8' }}>
            <ImageIcon size={18} style={{ color: '#D4AF37' }} />
            Hero Marquee Images
          </h2>
          <p className="text-sm mt-1" style={{ color: '#71717a' }}>
            Manage the scrolling portfolio images displayed on the homepage hero section.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm" style={{ color: '#71717a' }}>Loading images...</div>
      ) : images.length === 0 ? (
        <div className="py-8 text-center text-sm" style={{ color: '#52525b', border: '1px dashed #27272a', borderRadius: '0.5rem' }}>
          No marquee images uploaded yet. The homepage will use default demo images.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden border transition-colors duration-200" style={{ borderColor: '#27272a', aspectRatio: '4/3' }}>
              <img src={img.thumbnailUrl || img.url} alt="Marquee" className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.url)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
