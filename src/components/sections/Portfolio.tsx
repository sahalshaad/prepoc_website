'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [allProjects, setAllProjects] = useState<PortfolioProject[]>(INITIAL_PROJECTS as PortfolioProject[])
  const [activeCategory, setActiveCategory] = useState('All')

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
          
          setAllProjects(sorted)
        }
      } catch (err) {
        console.error('Failed to fetch dynamic portfolio:', err)
      }
    }
    fetchProjects()
  }, [])

  // Extract unique industries dynamically
  const dynamicCategories = Array.from(
    new Set(allProjects.map((p) => p.industry))
  ).filter(Boolean) as string[]

  const categories = ['All', ...dynamicCategories]

  // Filter projects by active category
  const filteredProjects = activeCategory === 'All'
    ? allProjects
    : allProjects.filter((p) => p.industry === activeCategory)

  return (
    <section
      id="portfolio"
      className="section-padding relative overflow-hidden bg-white"
      aria-label="Our featured projects"
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
              <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Our Work</div>
            </motion.div>
 
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-outfit font-medium text-black mb-6"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Work That Speaks
              <br />
              <span className="text-blue-500">For Itself.</span>
            </motion.h2>
          </div>
 
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-600 font-outfit"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
          >
            A curated selection of our digital transformation projects that delivered measurable impact for our clients.
          </motion.p>
        </div>

        {/* Dynamic Category Filtering Bar */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
            aria-label="Project categories"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border focus:outline-none ${
                    isActive 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm' 
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </motion.div>
        )}
 
        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                role="listitem"
                className="bg-neutral-50 border border-neutral-200 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                onClick={() => router.push(`/portfolio/${project.slug}`)}
              >
                {/* Image/Visual Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                  {project.coverImage ? (
                    <img 
                      src={project.coverImage} 
                      alt={project.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative z-10 w-4/5 h-4/5 glass rounded-xl flex items-center justify-center border border-neutral-200/50 shadow-sm bg-white/80">
                      <span className="font-outfit font-semibold text-neutral-800 text-xl md:text-2xl opacity-70">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>
 
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-outfit font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                        {project.industry}
                      </span>
                      <span className="text-sm font-outfit font-bold text-black">
                        {project.resultsAchieved}
                      </span>
                    </div>
 
                    <h3 className="font-outfit text-2xl font-semibold text-black mb-3">
                      {project.title}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-6 font-outfit line-clamp-2">
                      {project.description}
                    </p>
                  </div>
 
                  <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-sm font-outfit font-medium text-black">
                      View Case Study
                    </span>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-black transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-12"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
