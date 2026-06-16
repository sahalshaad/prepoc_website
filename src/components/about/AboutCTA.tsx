'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function AboutCTA() {
  return (
    <section
      id="cta"
      className="section-padding relative overflow-hidden bg-neutral-50"
      aria-label="Work with PREPOC"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-4"
        >
          Ready to Grow?
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-outfit font-medium text-black mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
        >
          Let&apos;s Build Something
          <br />
          <span className="text-blue-500">Remarkable Together.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-neutral-600 font-outfit max-w-lg mx-auto mb-10"
          style={{ fontSize: '1.05rem', lineHeight: 1.75 }}
        >
          Join the 50+ businesses that trust PREPOC to drive their digital growth.
          Let&apos;s talk about your goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
        >
          <Link href="/#contact" className="btn-primary w-full sm:w-auto justify-center font-outfit">
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="mailto:info@prepoc.in"
            className="btn-outline flex items-center gap-2 w-full sm:w-auto justify-center text-black border-neutral-300 hover:bg-neutral-100 font-outfit"
          >
            info@prepoc.in
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
