'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'

export default function AboutHero() {
  const scrollToStory = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #080808 100%)' }}
      aria-label="About PREPOC hero"
    >
      {/* Ambient orbs */}
      <div
        className="orb orb-primary absolute"
        style={{ width: '600px', height: '600px', top: '-100px', left: '-100px', opacity: 0.35 }}
        aria-hidden="true"
      />
      <div
        className="orb orb-accent absolute"
        style={{ width: '400px', height: '400px', bottom: '0', right: '-80px', opacity: 0.2 }}
        aria-hidden="true"
      />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span
          className="font-heading font-black text-white whitespace-nowrap"
          style={{ fontSize: 'clamp(8rem, 22vw, 22rem)', letterSpacing: '-0.05em', opacity: 0.015 }}
        >
          ABOUT
        </span>
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="container-wide relative z-10 text-center pt-24 sm:pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            Est. 2019 · Premium Digital Agency
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-bold text-foreground mb-6"
          style={{ fontSize: 'clamp(2.2rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}
        >
          The Minds Behind
          <br />
          <span className="text-gradient-green">PREPOC</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-muted-foreground font-body max-w-2xl mx-auto mb-12"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.8 }}
        >
          We are a team of strategists, designers, developers, and storytellers united
          by one belief: every business deserves world-class digital expertise.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
        >
          <button onClick={scrollToStory} className="btn-primary w-full sm:w-auto">
            Meet the Team
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link href="/#contact" className="btn-outline w-full sm:w-auto text-center">
            Work With Us
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToStory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-xs tracking-widest uppercase"
          aria-label="Scroll to Our Story"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}
