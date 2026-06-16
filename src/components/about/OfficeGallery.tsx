'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ZoomIn } from 'lucide-react'
import { type GalleryItem } from '@/data/aboutData'

function GalleryCard({ item, onClick }: { item: GalleryItem; onClick: (item: GalleryItem) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-neutral-200 bg-neutral-100 shadow-sm"
      style={{ aspectRatio: item.size === 'tall' ? '3/4' : item.size === 'wide' ? '16/7' : '4/3' }}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      aria-label={`View: ${item.caption}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        unoptimized // Remove when using local assets
      />

      {/* Video play icon */}
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-neutral-200 shadow-sm bg-white">
            <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-0.5" />
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}
        aria-hidden="true"
      >
        <div className="flex items-end justify-between">
          <p className="text-white font-outfit font-semibold text-sm">{item.caption}</p>
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 bg-white/10">
            {item.type === 'video' ? <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" /> : <ZoomIn className="w-3.5 h-3.5 text-white" />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={item.caption}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-5xl w-full rounded-2xl overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === 'video' && item.videoSrc ? (
            <video src={item.videoSrc} controls autoPlay className="w-full" />
          ) : (
            <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
              <Image src={item.src} alt={item.alt} fill className="object-cover" unoptimized />
            </div>
          )}

          {/* Caption bar */}
          <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.9), transparent)' }}>
            <p className="text-white font-outfit font-semibold">{item.caption}</p>
          </div>
        </motion.div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default function OfficeGallery({ items }: { items: GalleryItem[] }) {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)

  return (
    <section
      id="office"
      className="section-padding relative overflow-hidden bg-neutral-50"
      aria-label="Inside PREPOC office gallery"
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: '450px', height: '450px', top: '5%', left: '-100px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Behind the Scenes</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-outfit font-medium text-black mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
          >
            Inside <span className="text-blue-500">PREPOC</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-600 font-outfit max-w-xl mx-auto"
            style={{ fontSize: '1.05rem', lineHeight: 1.75 }}
          >
            A glimpse into the spaces, culture, and energy that power our work every day.
          </motion.p>
        </div>

        {/* Pinterest-style Masonry layout */}
        <div
          className="columns-2 lg:columns-3 gap-2 sm:gap-4"
          role="list"
          aria-label="Office photo gallery"
        >
          {items.map((item) => (
            <div key={item.id} role="listitem" className="break-inside-avoid mb-2 sm:mb-4">
              <GalleryCard item={item} onClick={setLightboxItem} />
            </div>
          ))}
        </div>

        {/* Demo note — remove before launch */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-muted/50 text-xs mt-10 italic"
        >
          {/* Remove this paragraph in production */}
          Demo images — replace with real PREPOC office photos in <code>/src/data/aboutData.ts</code>
        </motion.p>
      </div>

      {/* Lightbox */}
      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </section>
  )
}
