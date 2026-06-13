'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PortfolioProject } from '@/types/admin'

const INITIAL_PROJECTS = [
  {
    id: 'nexus-commerce',
    title: 'Nexus Commerce',
    clientName: 'Nexus Retail',
    industry: 'Web Development',
    description:
      '340% increase in online revenue through a complete digital overhaul — new platform, campaign strategy, and conversion optimization.',
    bg: 'linear-gradient(135deg, #0E5D47 0%, #051f18 100%)',
    resultsAchieved: '+340% Revenue',
    tags: ['Web Development', 'Performance Marketing', 'SEO'],
    isFeatured: true,
    status: 'published',
    displayOrder: 1,
    slug: 'nexus-commerce-overhaul',
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-06-01T12:00:00.000Z'
  },
  {
    id: 'lumina-collective',
    title: 'Lumina Collective',
    clientName: 'Lumina Luxury',
    industry: 'Branding',
    description:
      'A complete brand identity for a luxury lifestyle company — from logo and visual system to brand film and social presence.',
    bg: 'linear-gradient(135deg, #6b4f0a 0%, #1a1200 100%)',
    resultsAchieved: '5M+ Impressions',
    tags: ['Branding', 'Graphic Design', 'Video Production'],
    isFeatured: true,
    status: 'published',
    displayOrder: 2,
    slug: 'lumina-collective-identity',
    createdAt: '2026-06-02T12:00:00.000Z',
    updatedAt: '2026-06-02T12:00:00.000Z'
  },
  {
    id: 'apex-mobile',
    title: 'Apex FinTech App',
    clientName: 'Apex Financial',
    industry: 'AI Solutions',
    description:
      'AI-powered personal finance mobile app with 4.9★ App Store rating, serving 80,000+ active users within 6 months of launch.',
    bg: 'linear-gradient(135deg, #1a3a6e 0%, #060e1f 100%)',
    resultsAchieved: '80K+ Users',
    tags: ['Mobile App Development', 'AI Solutions', 'UX Design'],
    isFeatured: false,
    status: 'published',
    displayOrder: 3,
    slug: 'apex-fintech-mobile-app',
    createdAt: '2026-06-03T12:00:00.000Z',
    updatedAt: '2026-06-03T12:00:00.000Z'
  },
]

export default function Portfolio() {
  const router = useRouter()
  const [projects, setProjects] = useState<PortfolioProject[]>(INITIAL_PROJECTS as PortfolioProject[])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/portfolio')
        const data = await res.json()
        if (data.success && data.data) {
          // Filter for published only and sort:
          // 1. Featured first
          // 2. Most recently updated (updatedAt descending)
          const sorted = (data.data as PortfolioProject[])
            .filter((p) => p.status === 'published')
            .sort((a, b) => {
              if (a.isFeatured && !b.isFeatured) return -1
              if (!a.isFeatured && b.isFeatured) return 1

              const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
              const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
              return timeB - timeA
            })
          
          // Show only top 3
          setProjects(sorted.slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to fetch dynamic portfolio:', err)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section
      id="portfolio"
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #080808 100%)' }}
      aria-label="Portfolio and case studies"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-label mb-4">Case Studies</div>
              <div className="section-divider" aria-hidden="true" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold text-foreground"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Our Work
              <br />
              <span className="text-gradient-gold">Speaks Volumes.</span>
            </motion.h2>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/works')}
            className="btn-outline self-start md:self-auto flex-shrink-0"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" role="list">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
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
                    background: !project.coverImage ? (project.bg || 'linear-gradient(135deg, #0E5D47 0%, #051f18 100%)') : undefined
                  }}
                  aria-hidden="true"
                >
                  {project.coverImage && (
                    <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover:bg-black/50" />
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
                  <h3 className="font-heading font-bold text-white text-xl mb-2">
                    {project.title}
                  </h3>
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
                  <h3 className="font-heading font-bold text-white text-lg">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
