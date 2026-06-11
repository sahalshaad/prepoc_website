'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Megaphone, TrendingUp, Search, Palette, PenTool,
  Video, Code, Smartphone, Brain, Zap,
} from 'lucide-react'

const services = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Strategic campaigns across all digital channels to maximize reach, engagement, and ROI for your brand.',
    icon: Megaphone,
    color: '#0E5D47',
  },
  {
    id: 'performance-marketing',
    title: 'Performance Marketing',
    description: 'Data-driven paid advertising on Google, Meta, and programmatic platforms — optimized for conversions.',
    icon: TrendingUp,
    color: '#D4AF37',
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'Dominate search rankings with technical SEO, content strategy, and authoritative link building.',
    icon: Search,
    color: '#0E5D47',
  },
  {
    id: 'branding',
    title: 'Branding',
    description: 'Build a compelling brand identity that resonates deeply with your target audience and drives loyalty.',
    icon: Palette,
    color: '#D4AF37',
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Stunning visual assets — from print to digital — that communicate your brand with precision and flair.',
    icon: PenTool,
    color: '#0E5D47',
  },
  {
    id: 'video-production',
    title: 'Video Production',
    description: 'Cinematic brand films, commercials, explainer videos, and social content that captivates audiences.',
    icon: Video,
    color: '#D4AF37',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'High-performance, conversion-optimized websites and web apps built with cutting-edge technologies.',
    icon: Code,
    color: '#0E5D47',
  },
  {
    id: 'mobile-apps',
    title: 'Mobile App Development',
    description: 'Native iOS and Android apps, and cross-platform solutions that deliver exceptional user experiences.',
    icon: Smartphone,
    color: '#D4AF37',
  },
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    description: 'Intelligent automation, machine learning models, and AI-powered tools tailored to your business needs.',
    icon: Brain,
    color: '#0E5D47',
  },
  {
    id: 'business-automation',
    title: 'Business Automation',
    description: 'Streamline operations with smart workflow automation, CRM integrations, and process optimization.',
    icon: Zap,
    color: '#D4AF37',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-padding bg-bg relative overflow-hidden"
      aria-label="Services"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 grid-texture opacity-50 pointer-events-none" aria-hidden="true" />

      <div className="container-wide relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-4">What We Do</div>
            <div className="section-divider" aria-hidden="true" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-foreground mb-6"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Everything You Need
            <br />
            <span className="text-gradient-gold">to Grow &amp; Scale.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground font-body"
            style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
          >
            From strategy to execution, we provide end-to-end digital solutions that
            drive measurable results. One partner. Every solution.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          role="list"
          aria-label="Services list"
        >
          {services.map((service) => {
            const Icon = service.icon
            const isGold = service.color === '#D4AF37'

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="service-card group"
                role="listitem"
                data-cursor-hover
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: isGold
                      ? 'rgba(212, 175, 55, 0.12)'
                      : 'rgba(14, 93, 71, 0.15)',
                  }}
                  aria-hidden="true"
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: service.color }}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-heading font-semibold text-foreground mb-3 leading-tight"
                  style={{ fontSize: '1rem' }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="text-muted font-body leading-relaxed"
                  style={{ fontSize: '0.825rem' }}
                >
                  {service.description}
                </p>

                {/* Hover arrow */}
                <div
                  className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  style={{ color: service.color }}
                  aria-hidden="true"
                >
                  Learn more
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
