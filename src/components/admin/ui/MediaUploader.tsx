'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, FileVideo, Image as ImageIcon, Loader2 } from 'lucide-react'

interface MediaUploaderProps {
  value: string
  onChange: (url: string) => void
  category: 'founders' | 'team' | 'gallery' | 'services' | 'portfolio' | 'testimonials' | 'videos' | 'blog'
  accept?: 'image' | 'video' | 'any'
  label?: string
}

export function MediaUploader({ value, onChange, category, accept = 'any', label }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'optimizing' | 'saving' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isVideo = value?.match(/\.(mp4|webm|mov)$/i)

  const handleUpload = async (file: File) => {
    if (!file) return

    setUploadState('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)

    try {
      // Basic client-side pre-validation
      if (accept === 'image' && !file.type.startsWith('image/')) {
        throw new Error('Please select an image file.')
      }
      if (accept === 'video' && !file.type.startsWith('video/')) {
        throw new Error('Please select a video file.')
      }

      setUploadState('optimizing')
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadState('saving')
      setTimeout(() => {
        onChange(data.url)
        setUploadState('idle')
      }, 500) // brief delay to show "saving" state

    } catch (err) {
      console.error(err)
      const errorMsg = err instanceof Error ? err.message : String(err)
      setErrorMsg(errorMsg)
      setUploadState('error')
      setTimeout(() => setUploadState('idle'), 5000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const removeMedia = () => {
    onChange('')
  }

  const getAcceptedTypes = () => {
    if (accept === 'image') return 'image/jpeg, image/png, image/webp, image/svg+xml'
    if (accept === 'video') return 'video/mp4, video/quicktime, video/webm'
    return 'image/*, video/*'
  }

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium mb-1.5 text-zinc-400">{label}</label>}
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={getAcceptedTypes()}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0])
          }
        }}
      />

      {value ? (
        // ── Has Media ─────────────────────────────────────────────────────────
        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 group">
          <div className="relative aspect-video w-full bg-black/40 flex items-center justify-center">
            {isVideo ? (
              <video src={value} controls className="w-full h-full object-contain" />
            ) : (
              <Image src={value} alt="Uploaded media" fill className="object-contain" unoptimized />
            )}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors backdrop-blur-md"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={removeMedia}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-lg text-sm font-medium text-red-200 transition-colors backdrop-blur-md"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // ── Empty State / Upload Area ─────────────────────────────────────────
        <div
          onClick={() => uploadState === 'idle' && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed
            transition-all duration-200 
            ${uploadState !== 'idle' ? 'cursor-wait bg-zinc-900/50 border-zinc-800' : 'cursor-pointer'}
            ${isDragging ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/50'}
            ${uploadState === 'error' ? 'border-red-500/50 bg-red-500/5' : ''}
          `}
        >
          {uploadState === 'idle' && (
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 text-zinc-400">
                {accept === 'video' ? <FileVideo /> : accept === 'image' ? <ImageIcon /> : <Upload />}
              </div>
              <p className="text-sm text-zinc-300 font-medium mb-1">Click or drag file to upload</p>
              <p className="text-xs text-zinc-500 max-w-[240px]">
                {accept === 'video' ? 'MP4, MOV, WEBM up to 500MB' : accept === 'image' ? 'JPG, PNG, WEBP, SVG up to 10MB' : 'Images up to 10MB, Videos up to 500MB'}
              </p>
            </div>
          )}

          {/* Upload Progress States */}
          {uploadState !== 'idle' && uploadState !== 'error' && (
            <div className="flex flex-col items-center text-center p-6">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-sm text-zinc-300 font-medium">
                {uploadState === 'uploading' && 'Uploading...'}
                {uploadState === 'optimizing' && 'Optimizing & Processing...'}
                {uploadState === 'saving' && 'Saving securely...'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Please do not close this window</p>
            </div>
          )}

          {/* Error State Overlay */}
          {uploadState === 'error' && (
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-xl z-10 text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mb-3">
                <X />
              </div>
              <p className="text-sm font-medium text-red-400 mb-1">Upload Failed</p>
              <p className="text-xs text-zinc-400 max-w-[260px]">{errorMsg}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
