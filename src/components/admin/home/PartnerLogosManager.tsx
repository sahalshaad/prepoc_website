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

export function PartnerLogosManager() {
  const [images, setImages] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/media?category=partner-logos&t=${Date.now()}`)
      const data = await res.json()
      if (data.success) {
        setImages(data.data)
      }
    } catch (err) {
      console.error('Failed to load partner logos:', err)
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
        formData.append('category', 'partner-logos')

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
    if (!confirm('Are you sure you want to delete this logo?')) return
    
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
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium" style={{ color: '#E4E4E7' }}>Partner Logos</h3>
          <p className="text-xs mt-1" style={{ color: '#71717a' }}>Upload logos to display below the hero section.</p>
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 disabled:opacity-50"
            style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            {uploading ? 'Uploading...' : 'Upload Logos'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs" style={{ color: '#71717a' }}>Loading logos...</div>
      ) : images.length === 0 ? (
        <div className="py-6 text-center text-xs" style={{ color: '#52525b', border: '1px dashed #27272a', borderRadius: '0.5rem' }}>
          No partner logos uploaded yet. The homepage will use default demo logos.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map(img => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden border bg-white/5 flex items-center justify-center p-2 transition-colors duration-200" style={{ borderColor: '#27272a', height: '60px' }}>
              <img src={img.thumbnailUrl || img.url} alt="Partner Logo" className="max-w-full max-h-full object-contain" />
              
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(img.url)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Logo"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
