'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<unknown>(null)

  useEffect(() => {
    let lenis: {
      raf: (time: number) => void
      destroy: () => void
    } | null = null

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis')
        const Lenis = LenisModule.default

        lenis = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 2,
        })

        lenisRef.current = lenis

        function raf(time: number) {
          lenis?.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      } catch (error) {
        console.warn('Lenis failed to initialize:', error)
      }
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
    }
  }, [])

  return <>{children}</>
}
