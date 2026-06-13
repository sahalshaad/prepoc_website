'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'

const InteractiveCube = dynamic(() => import('@/components/ui/InteractiveCube'), { ssr: false })
import gsap from 'gsap'
import { useLoadingStore } from '@/store/useLoadingStore'

// ─── Data ────────────────────────────────────────────────────────────────────

const marqueeItems = [
  'Digital Marketing', 'Performance Marketing', 'SEO', 'Branding', 'Graphic Design',
  'Video Production', 'Web Development', 'Mobile Apps', 'AI Solutions', 'Business Automation',
]

const floatingStats = [
  { value: '150+', label: 'Projects' },
  { value: '50+',  label: 'Clients'  },
  { value: '5★',   label: 'Rating'   },
]

const cyclingWords = [
  'Digital Marketing',
  'Web Development',
  'AI Solutions',
  'SEO & Growth',
  'Branding',
  'Automation',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SplitChars({
  text,
  baseDelay = 0,
  charDelay = 0.028,
}: {
  text: string
  baseDelay?: number
  charDelay?: number
}) {
  return (
    <span className="split-word" style={{ display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char"
          style={{
            display: 'inline-block',
            opacity: 0,
            transform: 'translateY(0.45em)',
          }}
          data-char-delay={baseDelay + i * charDelay}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

function SplitWords({
  text,
  baseDelay = 0,
}: {
  text: string
  baseDelay?: number
}) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="split-word-item"
          style={{
            display: 'inline-block',
            opacity: 0,
            transform: 'translateY(0.3em)',
            marginRight: '0.28em',
          }}
          data-word-delay={baseDelay + i * 0.045}
        >
          {word}
        </span>
      ))}
    </>
  )
}

// ─── Framer Motion variants ───────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const orbVariants = {
  hidden:   { opacity: 0, scale: 0.85 },
  visible:  { opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeOut' } },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Hero() {
  const { isSettled, heroIntroPlayed, setHeroIntroPlayed } = useLoadingStore()
  const heroRef    = useRef<HTMLDivElement>(null)
  const wordRefs   = useRef<(HTMLSpanElement | null)[]>([])
  const srWordRef  = useRef<HTMLSpanElement>(null)
  const cycleIdxRef = useRef(0)

  // ── Orb parallax on mouse move ────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const hero = heroRef.current
    if (!hero) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10
      hero.querySelectorAll<HTMLElement>('.orb').forEach((orb, i) => {
        const f = i % 2 === 0 ? 1 : -0.6
        orb.style.transform = `translate(${x * f}px, ${y * f}px)`
      })
    }

    hero.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // ── GSAP Reveal on load ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isSettled) return

    // If intro has already played during this session, just snap to visible state
    if (heroIntroPlayed) {
      gsap.set('.split-char, .split-word-item', { opacity: 1, y: 0 })
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set('.split-char, .split-word-item', { opacity: 1, y: 0 })
      setHeroIntroPlayed(true)
      return
    }

    const tl = gsap.timeline({ 
      delay: 0.1,
      onComplete: () => setHeroIntroPlayed(true)
    })
    const hero = heroRef.current
    if (!hero) return

    // Reveal characters
    const chars = hero.querySelectorAll<HTMLElement>('.split-char')
    chars.forEach((char) => {
      const delay = parseFloat(char.dataset.charDelay ?? '0')
      tl.fromTo(
        char,
        { opacity: 0, y: '0.45em' },
        { opacity: 1, y: '0em', duration: 0.55, ease: 'power3.out' },
        0.15 + delay,
      )
    })

    // Reveal words
    const words = hero.querySelectorAll<HTMLElement>('.split-word-item')
    words.forEach((word) => {
      const delay = parseFloat(word.dataset.wordDelay ?? '0')
      tl.fromTo(
        word,
        { opacity: 0, y: '0.3em' },
        { opacity: 1, y: '0em', duration: 0.5, ease: 'power2.out' },
        0.55 + delay,
      )
    })

    return () => { tl.kill() }
  }, [isSettled, heroIntroPlayed, setHeroIntroPlayed])

  // ── Zero-CLS cycling word — char-level scaleX reveal (GSAP reference style) ─────
  useEffect(() => {
    if (!isSettled) return

    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[]
    if (words.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Set initial state — first word fully visible, rest collapsed
    words.forEach((wordEl, i) => {
      const chars = wordEl.querySelectorAll<HTMLElement>('.cycle-char')
      gsap.set(chars, {
        scaleX:          i === 0 ? 1 : 0,
        opacity:         i === 0 ? 1 : 0,
        transformOrigin: '0% 50%',
      })
    })
    
    if (reduced) return

    const cycle = () => {
      const currentEl = words[cycleIdxRef.current]
      const nextIdx   = (cycleIdxRef.current + 1) % words.length
      const nextEl    = words[nextIdx]

      const currentChars = currentEl.querySelectorAll<HTMLElement>('.cycle-char')
      const nextChars    = nextEl.querySelectorAll<HTMLElement>('.cycle-char')

      // Kill any conflicting tweens just in case to be perfectly safe
      gsap.killTweensOf([currentChars, nextChars])

      // ─ Exit: collapse chars right-to-left ─────────────────────────────────
      gsap.to(currentChars, {
        scaleX:          0,
        opacity:         0,
        duration:        0.22,
        stagger:         { each: 0.018, from: 'end' },
        ease:            'power2.in',
        transformOrigin: '0% 50%',
      })

      // ─ Enter: expand chars left-to-right ──────────────────────────────
      gsap.fromTo(
        nextChars,
        { scaleX: 0, opacity: 0, transformOrigin: '0% 50%' },
        {
          scaleX:          1,
          opacity:         1,
          duration:        0.28,
          stagger:         { each: 0.024, from: 'start' },
          ease:            'power2.out',
          delay:           0.18,
          onStart: () => {
            if (srWordRef.current) srWordRef.current.textContent = cyclingWords[nextIdx]
          },
        },
      )

      cycleIdxRef.current = nextIdx
      
      // Schedule the next cycle perfectly synced with GSAP's ticker
      gsap.delayedCall(2.4, cycle)
    }

    // Initial trigger
    gsap.delayedCall(2.4, cycle)

    return () => {
      gsap.killTweensOf(cycle)
      words.forEach(word => gsap.killTweensOf(word.querySelectorAll('.cycle-char')))
    }
  }, [isSettled])

  const scrollToServices = () =>
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden bg-bg grid-texture"
      aria-label="Hero section"
    >
      {/* ── Gradient Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          variants={orbVariants} initial="hidden" animate={isSettled ? "visible" : "hidden"}
          className="orb orb-primary"
          style={{ width: 'clamp(400px,50vw,700px)', height: 'clamp(400px,50vw,700px)', top: '-10%', right: '-5%' }}
        />
        <motion.div
          variants={orbVariants} initial="hidden" animate={isSettled ? "visible" : "hidden"} transition={{ delay: 0.3 }}
          className="orb orb-accent"
          style={{ width: 'clamp(300px,35vw,500px)', height: 'clamp(300px,35vw,500px)', bottom: '10%', left: '-8%' }}
        />
        <motion.div
          variants={orbVariants} initial="hidden" animate={isSettled ? "visible" : "hidden"} transition={{ delay: 0.6 }}
          className="orb orb-primary"
          style={{ width: 'clamp(200px,25vw,350px)', height: 'clamp(200px,25vw,350px)', top: '50%', left: '30%', opacity: 0.28 }}
        />
      </div>

      {/* ── Subtle horizontal dividers ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[25, 50, 75].map((pos) => (
          <div key={pos} className="absolute left-0 right-0 border-t border-white/[0.02]" style={{ top: `${pos}%` }} />
        ))}
      </div>

      {/* ════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════ */}
      <div className="container-wide !mx-0 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 pt-32 lg:pt-40 pb-16 relative z-10 text-left">
        {/* ── Left Side Content ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isSettled ? "visible" : "hidden"}
          className="w-full lg:w-[55%] min-w-0 max-w-4xl text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="hero-badge" role="text">
              <span className="badge-dot" aria-hidden="true" />
              Award-Winning Digital Agency
            </span>
          </motion.div>

          {/* ── Headline ── */}
          <h1
            className="font-heading font-bold text-foreground mb-6 w-full text-left"
            style={{ fontSize: 'clamp(1.3rem, 3.6vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
            aria-label="Scale Your Business — accelerating with digital solutions"
          >
            {/* Line 1 */}
            <span className="block overflow-hidden" style={{ paddingBottom: '0.04em' }}>
              <SplitChars text="Scale Your" baseDelay={0} charDelay={0.028} />
            </span>

            {/* Line 2 — "Business" + zero-CLS cycling word */}
            <span className="block" style={{ paddingBottom: '0.04em', overflowX: 'clip', overflowY: 'visible' }}>
              <SplitChars text="Business " baseDelay={0.28} charDelay={0.028} />

              {/*
                Zero-CLS container:
                Using CSS Grid to stack all words exactly on top of each other.
                The grid automatically sizes itself to perfectly fit the widest physical word (e.g., 'Web Development'),
                so no words ever get clipped or cut off.
              */}
              <span
                style={{ display: 'inline-grid', verticalAlign: 'bottom', overflow: 'visible' }}
                aria-hidden="true"
              >
                {cyclingWords.map((word, i) => (
                  <span
                    key={word}
                    ref={(el) => { wordRefs.current[i] = el }}
                    style={{
                      gridArea:   '1 / 1 / 2 / 2',
                      display:    'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {word.split('').map((char, ci) => (
                      <span
                        key={ci}
                        className="cycle-char text-gradient-gold"
                        style={{
                          display:         'inline-block',
                          transformOrigin: '0% 50%',
                          // initial state is set by GSAP in useEffect
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>

              {/* Screen-reader live region */}
              <span ref={srWordRef} aria-live="polite" aria-atomic="true" className="sr-only">
                {cyclingWords[0]}
              </span>
            </span>

            {/* Line 3 */}
            <span className="block overflow-hidden" style={{ paddingBottom: '0.04em' }}>
              <SplitChars text="Solutions" baseDelay={0.58} charDelay={0.034} />
              <span
                className="split-char"
                style={{ display: 'inline-block', opacity: 0, transform: 'translateY(0.4em)', color: '#0E5D47' }}
                data-char-delay={0.58 + 9 * 0.034}
              >
                .
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="font-body text-muted-foreground max-w-2xl mb-10 text-left"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: 1.75 }}
          >
            <SplitWords
              text="PREPOC Technologies is a full-service digital agency that transforms brands into market leaders through data-driven strategies, cutting-edge technology, and world-class creative execution."
              baseDelay={0}
            />
          </p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-16 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-base py-4 px-8 w-full sm:w-auto"
            >
              Start a Project
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline text-base py-4 px-8 w-full sm:w-auto"
            >
              View Our Work
            </motion.button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5 sm:gap-8">
            {floatingStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-8 bg-white/10" aria-hidden="true" />}
                <div>
                  <div
                    className="font-heading font-bold text-foreground"
                    style={{ fontSize: '1.4rem', lineHeight: 1, letterSpacing: '-0.03em' }}
                    aria-label={`${stat.value} ${stat.label}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-muted text-xs tracking-wider uppercase mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right Side Interactive 3D Cube ── */}
        <motion.div
          id="hero-cube-container"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-lg lg:w-[45%] xl:w-[40%] mx-auto lg:ml-auto lg:mr-0 mt-4 lg:mt-0"
        >
          <div className="w-full aspect-square relative z-20">
            <InteractiveCube />
          </div>
        </motion.div>
      </div>

      {/* ── Services Marquee ── */}
      <div className="relative z-10 border-t border-white/[0.04] py-5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-6 px-6 text-sm text-muted font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isSettled ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={scrollToServices}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-muted hover:text-foreground transition-colors z-10 hidden md:flex"
        aria-label="Scroll to services"
      >
        <span className="text-xs tracking-widest uppercase rotate-90 origin-center mb-4">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  )
}
