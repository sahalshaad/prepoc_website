'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import { PortfolioProject } from '@/types/admin'
import { Highlight } from '@/components/ui/Highlight'

interface WorksClientProps {
  initialProjects: PortfolioProject[]
}

export default function WorksClient({ initialProjects }: WorksClientProps) {
  // Filter for published only
  const publishedProjects = initialProjects.filter((p) => p.status === 'published')

  // Extract unique industries/categories dynamically (ignore empty)
  const dynamicCategories = Array.from(
    new Set(
      publishedProjects.map((p) => p.industry)
    )
  ).filter(Boolean) as string[]

  const categories = ['All', ...dynamicCategories]
  const [activeCategory, setActiveCategory] = useState('All')

  // Filter projects by active category
  const filteredProjects = activeCategory === 'All'
    ? publishedProjects
    : publishedProjects.filter((p) => p.industry === activeCategory)

  return (
    <>
      <main id="main-content" className="relative min-h-screen overflow-hidden" style={{ background: '#050505' }}>
        {/* Ambient orbs to maintain visual design */}
        <div
          className="orb orb-primary absolute"
          style={{ width: '600px', height: '600px', top: '-100px', left: '-100px', opacity: 0.2 }}
          aria-hidden="true"
        />
        <div
          className="orb orb-accent absolute"
          style={{ width: '400px', height: '400px', bottom: '20%', right: '-80px', opacity: 0.15 }}
          aria-hidden="true"
        />

        {/* Grid texture background */}
        <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" aria-hidden="true" />

        <div className="container-wide relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="hero-badge">
                <span className="badge-dot" aria-hidden="true" />
                Our Work
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold text-foreground mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Projects That Drive <Highlight color="text-[#d4af37]/30"><span className="text-gradient-gold">Results</span></Highlight>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-muted font-body max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
              style={{ color: '#a1a1aa' }}
            >
              Explore the digital experiences, campaigns, and solutions we&apos;ve crafted to help businesses grow.
            </motion.p>
          </div>

          {/* Dynamic Category Filtering Bar */}
          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-12 md:mb-16"
              aria-label="Project categories"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border focus:outline-none"
                    style={{
                      background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isActive ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                        e.currentTarget.style.color = '#F8F8F8'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                      }
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* Projects Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 10 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  role="listitem"
                >
                  <div className="portfolio-card group" data-cursor-hover>
                    {/* Project BG */}
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 bg-cover bg-center"
                      style={{
                        backgroundImage: project.coverImage ? `url(${project.coverImage})` : undefined,
                        background: !project.coverImage ? (project.bg || 'linear-gradient(135deg, #0e5d47 0%, #051f18 100%)') : undefined
                      }}
                      aria-hidden="true"
                    >
                      {project.coverImage && (
                        <div className="absolute inset-0 bg-black/65 transition-opacity duration-300 group-hover:bg-black/55" />
                      )}
                    </div>

                    {/* Decorative pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Result badge - always visible */}
                    <div className="absolute top-5 right-5 z-10">
                      <span className="bg-black/50 backdrop-blur-sm border border-white/10 text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                        {project.resultsAchieved}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute top-5 left-5 z-10">
                      <span className="text-xs font-semibold tracking-widest uppercase text-white/60">
                        {project.industry}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="portfolio-overlay z-10" aria-hidden="true">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-heading font-bold text-white text-xl mb-2">
                        {project.title}
                      </h2>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent">
                        View Case Study
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom info — always visible on mobile, hides on desktop hover */}
                    <div className="absolute bottom-5 left-5 right-5 z-10 group-hover:opacity-0 sm:group-hover:opacity-0 transition-opacity duration-300">
                      <h2 className="font-heading font-bold text-white text-lg">
                        {project.title}
                      </h2>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p style={{ color: 'rgba(255, 255, 255, 0.4)' }}>No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
