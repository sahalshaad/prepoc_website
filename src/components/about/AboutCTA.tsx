'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function AboutCTA() {
  return (
    <section
      id="cta"
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080808 0%, #050505 100%)' }}
      aria-label="Work with PREPOC"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(14,93,71,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-label mb-4"
        >
          Ready to Grow?
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-bold text-foreground mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Let&apos;s Build Something
          <br />
          <span className="text-gradient-gold">Remarkable Together.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-muted-foreground max-w-lg mx-auto mb-10"
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
          <Link href="/#contact" className="btn-primary w-full sm:w-auto justify-center">
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="mailto:hello@prepoc.com"
            className="btn-outline flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            hello@prepoc.com
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
