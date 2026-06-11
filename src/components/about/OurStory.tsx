'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ABOUT_STATS } from '@/data/aboutData'
import { CheckCircle2 } from 'lucide-react'

const HIGHLIGHTS = [
  'Award-winning creative team across 5 disciplines',
  'Data-driven decision making at every stage',
  'End-to-end project delivery with zero hand-offs',
  'Dedicated account manager for every client',
  'Transparent weekly reporting & live analytics',
  'Ongoing support, optimization & growth reviews',
]

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          const duration = 2000
          const steps = 60
          const increment = value / steps
          const interval = duration / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) { setCount(value); clearInterval(timer) }
            else setCount(Math.floor(current))
          }, interval)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, started])

  return (
    <div ref={ref} className="text-center">
      <div className="stat-number mb-2" aria-label={`${value}${suffix} ${label}`} aria-live="polite">
        {count}
        <span className="text-gradient-gold">{suffix}</span>
      </div>
      <div className="text-muted text-sm tracking-wide font-medium">{label}</div>
    </div>
  )
}

export default function OurStory() {
  return (
    <section
      id="story"
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #090909 50%, #050505 100%)' }}
      aria-label="Our Story"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: narrative */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-label mb-4">Our Story</div>
              <div className="section-divider" aria-hidden="true" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold text-foreground mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              We Don&apos;t Just
              <br />
              Build — We
              <span className="text-gradient-green"> Transform.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground font-body mb-4"
              style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
            >
              PREPOC Technologies was founded in 2019 with a simple belief: every business — regardless
              of size — deserves access to world-class digital expertise. What started as a two-person
              consultancy has grown into a full-service agency of 30+ specialists across marketing,
              design, engineering, video, and AI.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="text-muted-foreground font-body mb-6"
              style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
            >
              Today we serve clients across the UAE, UK, and South Asia — delivering measurable results
              through a relentless focus on strategy, creativity, and data.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              aria-label="Why choose PREPOC"
            >
              {HIGHLIGHTS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32 + i * 0.06, duration: 0.5 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" aria-hidden="true" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right: stats + badge */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass rounded-3xl p-5 sm:p-8 md:p-12 mb-6"
            >
              <div className="grid grid-cols-2 gap-10">
                {ABOUT_STATS.map((stat) => (
                  <StatCounter key={stat.label} {...stat} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="glass rounded-2xl p-5 flex items-center gap-5"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212, 175, 55, 0.15)' }}
                aria-hidden="true"
              >
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-foreground mb-1">Top-Rated Digital Agency</div>
                <div className="text-muted text-sm">Recognized by Clutch, DesignRush &amp; GoodFirms</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
