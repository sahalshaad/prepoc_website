'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Copy, Check, FileVideo, Search, Filter } from 'lucide-react'

interface MediaAsset {
  id: string
  url: string
  thumbnailUrl: string
  filename: string
  category: string
  type: 'image' | 'video'
  sizeBytes: number
  createdAt: string
}

const CATEGORIES = ['All', 'founders', 'team', 'gallery', 'services', 'portfolio', 'testimonials', 'videos']

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  
  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/media')
      const data = await res.json()
      if (data.success) {
        setAssets(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch media', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return
    
    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.url !== url))
      } else {
        alert('Failed to delete asset.')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting asset.')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredAssets = assets.filter(asset => {
    const matchesCat = selectedCat === 'All' || asset.category === selectedCat
    const matchesSearch = asset.filename.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-zinc-400">Manage all uploaded images and videos across your site.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat 
                  ? 'bg-[#D4AF37] text-black' 
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
          <Filter className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No media found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <div key={asset.url} className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors">
              
              <div className="aspect-square bg-zinc-950 relative flex items-center justify-center">
                {asset.type === 'video' ? (
                  <>
                    <Image src={asset.thumbnailUrl} alt={asset.filename} fill className="object-cover opacity-60" unoptimized />
                    <FileVideo className="w-8 h-8 text-white absolute z-10" />
                  </>
                ) : (
                  <Image src={asset.thumbnailUrl} alt={asset.filename} fill className="object-cover" unoptimized />
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handleCopyUrl(asset.url)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    title="Copy URL"
                  >
                    {copiedUrl === asset.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleDelete(asset.url)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 backdrop-blur-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-medium text-white truncate mb-1" title={asset.filename}>
                  {asset.filename}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  <span>{formatSize(asset.sizeBytes)}</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{asset.category}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
