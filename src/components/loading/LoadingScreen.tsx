'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import gsap from 'gsap'

// Dynamically import the heavy Three.js canvas — no SSR
const ThreeSceneCanvas = dynamic(() => import('./ThreeSceneCanvas'), { ssr: false })

// ─── Types ────────────────────────────────────────────────────────────────────
export type SceneId = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface LoadingScreenProps {
  onComplete: () => void
}

const SCENE_LABELS: Partial<Record<SceneId, string>> = {
  2: 'Content & Reach',
  3: 'Growth Network',
  4: 'Digital Architecture',
  5: 'Intelligent Systems',
}

const PROGRESS_SCENES: SceneId[] = [1, 2, 3, 4, 5, 6]

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentScene, setCurrentScene] = useState<SceneId>(0)
  const [isVisible, setIsVisible] = useState(true)

  // Scene 01 refs
  const lineRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  // Scene 2-5 label refs
  const labelRef = useRef<HTMLDivElement>(null)

  // Scene 06 refs
  const glowRef = useRef<HTMLDivElement>(null)
  const logoBlockRef = useRef<HTMLDivElement>(null)
  const techLabelRef = useRef<HTMLSpanElement>(null)
  const goldLineRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    // Reduced motion: flash logo briefly, then reveal page
    if (prefersReduced) {
      setCurrentScene(6)
      setTimeout(() => setIsVisible(false), 400)
      return
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    // ─── SCENE 01: Glowing line expands → tagline fades in → fades out ────────
    tl.set(lineRef.current, { scaleX: 0, opacity: 1 })
    tl.set(taglineRef.current, { opacity: 0, y: 16 })

    tl.to(lineRef.current, { scaleX: 1, duration: 0.75, ease: 'power3.inOut' })
    tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.15')
    tl.to([lineRef.current, taglineRef.current], {
      opacity: 0, y: -14, duration: 0.35, ease: 'power2.in',
    }, '+=0.35')

    if (!isMobile) {
      // ─── SCENE 02: Camera ─────────────────────────────────────────────────
      tl.call(() => setCurrentScene(2))
      tl.set(labelRef.current, { opacity: 0, y: 14 })
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, '+=0.12')
      tl.to(labelRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, '+=0.38')

      // ─── SCENE 03: Dashboard ──────────────────────────────────────────────
      tl.call(() => setCurrentScene(3))
      tl.set(labelRef.current, { opacity: 0, y: 14 })
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.38 }, '+=0.1')
      tl.to(labelRef.current, { opacity: 0, y: -10, duration: 0.3 }, '+=0.38')

      // ─── SCENE 04: Laptop ─────────────────────────────────────────────────
      tl.call(() => setCurrentScene(4))
      tl.set(labelRef.current, { opacity: 0, y: 14 })
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.38 }, '+=0.1')
      tl.to(labelRef.current, { opacity: 0, y: -10, duration: 0.3 }, '+=0.38')

      // ─── SCENE 05: Neural Sphere ──────────────────────────────────────────
      tl.call(() => setCurrentScene(5))
      tl.set(labelRef.current, { opacity: 0, y: 14 })
      tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.38 }, '+=0.1')
      tl.to(labelRef.current, { opacity: 0, y: -10, duration: 0.3 }, '+=0.38')
    }

    // ─── SCENE 06: Brand Merge ────────────────────────────────────────────────
    tl.call(() => setCurrentScene(6))

    tl.set(glowRef.current, { scale: 0, opacity: 0 })
    tl.set(logoBlockRef.current, { opacity: 0, scale: 0.82, filter: 'blur(22px)' })
    tl.set(techLabelRef.current, { opacity: 0, y: 12 })
    tl.set(goldLineRef.current, { scaleX: 0 })
    tl.set(servicesRef.current, { opacity: 0, y: 8 })

    // Energy pulse burst
    tl.to(glowRef.current, {
      scale: 1.3, opacity: 0.75, duration: 0.35, ease: 'power2.out',
    }, '+=0.06')
    tl.to(glowRef.current, {
      scale: 4.5, opacity: 0, duration: 0.55, ease: 'power2.in',
    })

    // Logo emerges from blur
    tl.to(logoBlockRef.current, {
      opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out',
    }, '-=0.38')

    // "Technologies" subtitle
    tl.to(techLabelRef.current, {
      opacity: 1, y: 0, duration: 0.45, ease: 'power2.out',
    }, '-=0.3')

    // Gold line sweeps in
    tl.to(goldLineRef.current, {
      scaleX: 1, duration: 0.65, ease: 'power3.out',
    }, '-=0.35')

    // Services tagline
    tl.to(servicesRef.current, {
      opacity: 1, y: 0, duration: 0.4,
    }, '-=0.22')

    // Hold, then reveal page
    tl.to({}, { duration: 0.55 })
    tl.call(() => setIsVisible(false))

    return () => { tl.kill() }
  }, [])

  const currentLabel = SCENE_LABELS[currentScene]

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
          style={{ backgroundColor: '#050505' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          aria-label="Loading PREPOC Technologies"
          aria-live="polite"
          role="status"
        >
          {/* ── Animated grid background ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
            }}
            aria-hidden="true"
          />

          {/* ── Ambient center glow ── */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{
              background: currentScene === 6
                ? 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(14,93,71,0.28) 0%, rgba(212,175,55,0.06) 50%, transparent 72%)'
                : 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(14,93,71,0.14) 0%, transparent 68%)',
            }}
            aria-hidden="true"
          />

          {/* ─── SCENE 01: Glowing line + tagline ─── */}
          {currentScene <= 1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-7" aria-hidden="true">
              <div
                ref={lineRef}
                style={{
                  height: '1px',
                  width: '280px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
                  boxShadow: '0 0 18px rgba(255,255,255,0.22)',
                  transformOrigin: 'center',
                }}
              />
              <p
                ref={taglineRef}
                className="text-[10px] font-body font-medium tracking-[0.38em] uppercase text-white/45"
              >
                Building Growth Through Innovation
              </p>
            </div>
          )}

          {/* ─── SCENES 02–05: Three.js canvas ─── */}
          <AnimatePresence>
            {currentScene >= 2 && currentScene <= 5 && (
              <motion.div
                key="three-canvas"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                aria-hidden="true"
              >
                <ThreeSceneCanvas currentScene={currentScene} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Scene label (scenes 2–5) ─── */}
          <div
            ref={labelRef}
            className="absolute flex flex-col items-center gap-2.5 pointer-events-none"
            style={{ bottom: '28%', left: 0, right: 0, opacity: 0 }}
            aria-hidden="true"
          >
            <span className="text-[9px] font-body font-bold tracking-[0.45em] uppercase text-primary/90">
              {currentLabel ?? ''}
            </span>
            <div
              style={{
                height: '1px',
                width: '36px',
                background: 'linear-gradient(90deg, transparent, #0E5D47, transparent)',
              }}
            />
          </div>

          {/* ─── SCENE 06: Brand Merge ─── */}
          <AnimatePresence>
            {currentScene === 6 && (
              <motion.div
                key="brand-scene"
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 1 }}
                aria-hidden="true"
              >
                {/* Energy pulse ring */}
                <div
                  ref={glowRef}
                  className="absolute"
                  style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14,93,71,0.85), rgba(212,175,55,0.35) 55%, transparent 75%)',
                    boxShadow: '0 0 80px rgba(14,93,71,0.95)',
                  }}
                />

                {/* Logo block */}
                <div
                  ref={logoBlockRef}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Logo mark + wordmark */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-13 h-13 flex-shrink-0" style={{ width: '52px', height: '52px' }}>
                      <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: '#0E5D47',
                          transform: 'rotate(6deg)',
                          boxShadow: '0 0 50px rgba(14,93,71,0.95), 0 0 20px rgba(14,93,71,0.5)',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="font-heading font-bold text-white relative z-10"
                          style={{ fontSize: '1.3rem' }}
                        >
                          P
                        </span>
                      </div>
                    </div>

                    <span
                      className="font-heading font-bold text-white leading-none"
                      style={{
                        fontSize: 'clamp(2.4rem, 6.5vw, 4rem)',
                        letterSpacing: '-0.035em',
                      }}
                    >
                      PREPOC
                    </span>
                  </div>

                  {/* "Technologies" */}
                  <span
                    ref={techLabelRef}
                    className="font-body text-white/35 tracking-[0.45em] uppercase"
                    style={{ fontSize: '0.65rem' }}
                  >
                    Technologies
                  </span>

                  {/* Gold divider line */}
                  <div
                    ref={goldLineRef}
                    style={{
                      height: '1px',
                      width: '210px',
                      background: 'linear-gradient(90deg, transparent, #D4AF37 35%, #D4AF37 65%, transparent)',
                      boxShadow: '0 0 14px rgba(212,175,55,0.55)',
                      transformOrigin: 'center',
                    }}
                  />

                  {/* Services tagline */}
                  <div
                    ref={servicesRef}
                    className="font-body text-white/22 tracking-[0.28em] uppercase text-center"
                    style={{ fontSize: '0.58rem' }}
                  >
                    Digital Growth&nbsp;&nbsp;•&nbsp;&nbsp;Branding&nbsp;&nbsp;•&nbsp;&nbsp;Development&nbsp;&nbsp;•&nbsp;&nbsp;AI
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Progress indicator ─── */}
          <div
            className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2"
            aria-hidden="true"
          >
            {PROGRESS_SCENES.map((s) => {
              const active = currentScene >= s
              const isCurrent = currentScene === s
              return (
                <div
                  key={s}
                  style={{
                    width: isCurrent ? '22px' : '4px',
                    height: '4px',
                    borderRadius: '2px',
                    background: active ? '#0E5D47' : 'rgba(255,255,255,0.08)',
                    boxShadow: active ? '0 0 6px rgba(14,93,71,0.6)' : 'none',
                    transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
