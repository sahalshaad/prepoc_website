'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { type Stat } from '@/data/aboutData'
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
      <div className="text-4xl md:text-5xl font-outfit font-bold text-black mb-2" aria-label={`${value}${suffix} ${label}`} aria-live="polite">
        {count}
        <span className="text-blue-500">{suffix}</span>
      </div>
      <div className="text-neutral-500 text-sm tracking-wide font-outfit font-medium">{label}</div>
    </div>
  )
}

export default function OurStory({ stats }: { stats: Stat[] }) {
  return (
    <section
      id="story"
      className="section-padding relative overflow-hidden bg-neutral-50"
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
              <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Our Story</div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-outfit font-medium text-black mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
            >
              We Don&apos;t Just
              <br />
              Build — We
              <span className="text-blue-500"> Transform.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-neutral-600 font-outfit mb-4"
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
              className="text-neutral-600 font-outfit mb-6"
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
                  className="flex items-start gap-3 text-sm text-neutral-600 font-outfit"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" aria-hidden="true" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right: stats + badge */}
          <div>
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group mb-6"
            >
              {/* Glowing backdrops for real glass refraction */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-white/0 to-emerald-100/40 rounded-3xl blur-2xl pointer-events-none" />
              
              <div className="relative z-10 bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-5 sm:p-8 md:p-12">
                <div className="grid grid-cols-2 gap-10">
                  {stats.map((stat) => (
                    <StatCounter key={stat.label} {...stat} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Award badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-emerald-50/30 rounded-2xl blur-xl pointer-events-none" />
              
              <div className="relative z-10 bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-2xl p-5 flex items-center gap-5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50/80 border border-blue-100/50"
                  aria-hidden="true"
                >
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <div className="font-outfit font-semibold text-black mb-1">Top-Rated Digital Agency</div>
                  <div className="text-neutral-500 font-outfit text-sm">Recognized by Clutch, DesignRush &amp; GoodFirms</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
