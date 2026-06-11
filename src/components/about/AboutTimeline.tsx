'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  BookOpen,
  Heart,
  Users,
  Building2,
  Mail,
  Crown,
} from 'lucide-react'

// ─── Section definitions ──────────────────────────────────────────────────────
// To add / remove sections: edit only this array.
const SECTIONS = [
  { id: 'hero',       label: 'About PREPOC',      Icon: Sparkles  },
  { id: 'story',      label: 'Our Story',          Icon: BookOpen  },
  { id: 'leadership', label: 'Leadership',          Icon: Crown     },
  { id: 'values',     label: 'Our Values',          Icon: Heart     },
  { id: 'team',       label: 'Meet the Team',       Icon: Users     },
  { id: 'office',     label: 'Inside PREPOC',       Icon: Building2 },
  { id: 'cta',        label: "Let's Connect",       Icon: Mail      },
] as const

export default function AboutTimeline() {
  const [activeId, setActiveId] = useState<string>('hero')
  const [hovered, setHovered] = useState<string | null>(null)
  const [navHovered, setNavHovered] = useState(false)

  // ── Active section tracking via IntersectionObserver ─────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        {
          // Fire when the section occupies the middle band of the viewport
          rootMargin: '-40% 0px -40% 0px',
          threshold: 0,
        }
      )

      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // ── Smooth scroll handler ──────────────────────────────────────────────────
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [])

  return (
    // Hidden on mobile, visible md+
    <nav
      className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-start"
      aria-label="About page section navigation"
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={() => setNavHovered(false)}
    >
      {/* Glass pill container */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-1 py-3 px-2 rounded-2xl transition-all duration-500"
        style={{
          background: navHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
          backdropFilter: navHovered ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: navHovered ? 'blur(20px)' : 'blur(0px)',
          border: navHovered ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          boxShadow: navHovered ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Vertical connector line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-5 bottom-5 w-px pointer-events-none transition-opacity duration-500"
          style={{ 
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
            opacity: navHovered ? 1 : 0 
          }}
          aria-hidden="true"
        />

        {SECTIONS.map(({ id, label, Icon }) => {
          const isActive = activeId === id
          const isHovered = hovered === id

          return (
            <div key={id} className="relative">
              <button
                onClick={() => scrollTo(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Go to ${label}`}
                aria-current={isActive ? 'true' : undefined}
                className="relative flex items-center gap-0 focus-visible:outline-none group h-8 min-w-[2rem]"
                style={{ outline: 'none' }}
              >
                {/* Center wrapper to keep hit area large and dot centered */}
                <div className="w-8 flex justify-center items-center h-full relative z-10">
                  <motion.div
                    animate={{
                      width: isActive || isHovered ? 32 : 6,
                      height: isActive || isHovered ? 32 : 6,
                      backgroundColor: isActive
                        ? 'rgba(14, 93, 71, 0.35)'
                        : isHovered
                        ? 'rgba(212, 175, 55, 0.12)'
                        : 'rgba(255,255,255,0.2)',
                      borderColor: isActive
                        ? 'rgba(14, 93, 71, 0.7)'
                        : isHovered
                        ? 'rgba(212, 175, 55, 0.4)'
                        : 'transparent',
                      borderRadius: isActive || isHovered ? 12 : 9999,
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex items-center justify-center border"
                  >
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          key="icon"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{
                              color: isActive ? '#0E5D47' : '#D4AF37',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Expandable label — slides in from left on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -8, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      exit={{ opacity: 0, x: -8, width: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="ml-2 pr-3 text-xs font-medium whitespace-nowrap overflow-hidden"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: isActive ? '#F8F8F8' : '#D4AF37',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Focus ring — visible on keyboard nav */}
              <motion.div
                animate={{ opacity: 0 }}
                whileFocus={{ opacity: 1 }}
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: '0 0 0 2px rgba(212,175,55,0.7)' }}
                aria-hidden="true"
              />
            </div>
          )
        })}
      </motion.div>
    </nav>
  )
}
