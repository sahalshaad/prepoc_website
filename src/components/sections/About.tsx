'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const stats = [
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 50, suffix: '+', label: 'Happy Clients' },
  { value: 5, suffix: '+', label: 'Years of Excellence' },
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
]

const highlights = [
  'Award-winning creative team',
  'Data-driven decision making',
  'End-to-end project delivery',
  'Dedicated account management',
  'Transparent reporting & analytics',
  'Ongoing support & optimization',
]

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          const duration = 2000
          const steps = 60
          const increment = value / steps
          const interval = duration / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, interval)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasStarted])

  return (
    <div ref={ref} className="text-center group">
      <div
        className="stat-number mb-2"
        aria-label={`${value}${suffix} ${label}`}
        aria-live="polite"
      >
        {count}
        <span className="text-blue-500">{suffix}</span>
      </div>
      <div className="text-muted text-sm tracking-wide font-medium">{label}</div>
    </div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-white"
      aria-label="About PREPOC Technologies"
    >
      {/* Large watermark text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-outfit font-black text-black/5 whitespace-nowrap"
          style={{ fontSize: 'clamp(6rem, 20vw, 20rem)', letterSpacing: '-0.05em' }}
        >
          PREPOC
        </span>
      </div>

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4">Why PREPOC</div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-outfit font-medium text-black mb-4"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
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
              className="text-neutral-600 font-outfit mb-6"
              style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
            >
              PREPOC Technologies was founded on a simple belief: every business deserves
              access to world-class digital expertise. We&apos;re a team of strategists,
              designers, developers, and marketers united by a passion for driving
              exceptional results.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
              aria-label="Our highlights"
            >
              {highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                  className="flex items-center gap-3 text-sm text-neutral-800"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2
                      className="w-3 h-3"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </div>
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors font-medium text-sm mt-4"
            >
              Learn Our Story
            </motion.button>
          </div>

          {/* Right: Stats */}
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
              
              <div className="relative z-10 bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-8 md:p-12">
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
                  <div className="font-outfit font-semibold text-black mb-1">
                    Top-Rated Digital Agency
                  </div>
                  <div className="text-neutral-500 text-sm">
                    Recognized by Clutch, DesignRush &amp; GoodFirms
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
