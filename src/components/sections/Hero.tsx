'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SmokeCanvas } from '@/components/ui/SmokeCanvas'
import { useLoadingStore } from '@/store/useLoadingStore'
import { MousePointerClick, Sparkles } from 'lucide-react'
import { HeroMarquee } from '@/components/ui/HeroMarquee'

export default function Hero() {
  const { isSettled, heroIntroPlayed, setHeroIntroPlayed } = useLoadingStore()

  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)

  const [partnerLogos, setPartnerLogos] = useState<string[]>([])

  // GSAP Entrance Animation
  useEffect(() => {
    if (!isSettled) return

    if (heroIntroPlayed) {
      gsap.set([contentRef.current, trustRef.current], {
        opacity: 1,
        y: 0
      })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => setHeroIntroPlayed(true)
    })

    // Initial states
    gsap.set([contentRef.current, trustRef.current], {
      opacity: 0,
      y: 30
    })

    // Sequence
    tl.to(contentRef.current, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.2)
      .to(trustRef.current, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 0.6)

    return () => { tl.kill() }
  }, [isSettled, heroIntroPlayed, setHeroIntroPlayed])

  // Fetch dynamic partner logos
  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch(`/api/admin/media?category=partner-logos&t=${Date.now()}`)
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          setPartnerLogos(data.data.map((img: any) => img.url))
        }
      } catch (err) {
        console.error('Failed to fetch partner logos:', err)
      }
    }
    fetchLogos()
  }, [])

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full h-[95vh] md:h-[100vh] bg-white overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none"
      >
        {/* WebGL Fluid Dynamics Canvas */}
        <SmokeCanvas containerRef={heroRef as React.RefObject<HTMLDivElement>} />

        {/* Light haze radial shadow for light composition */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none z-0" />



        {/* Main hero contents */}
        <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto mt-6">
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] md:text-[15vw] font-heading font-black uppercase text-black/[0.03] select-none tracking-[0.25em] whitespace-nowrap pointer-events-none">
            PREPOC
          </div>

          <div className="flex flex-col items-center">
            {/* Kicker badge / Heading */}
            <h3 className="font-outfit text-[32px] md:text-[49px] font-[600] leading-[1.2] md:leading-[63.7px] mb-2 pointer-events-auto text-center bg-gradient-to-r from-[#ff2d7d] via-[#6f7bff] to-[#ff9632] text-transparent bg-clip-text">
              Built For Business Growth
            </h3>

            {/* Main agency heading */}
            <h1 className="font-outfit text-[28px] md:text-[44px] font-[400] leading-[1.3] md:leading-[61.6px] text-black mb-6 pointer-events-auto text-center max-w-5xl">
              Web, Marketing &amp; AI Solutions That Scale Businesses
            </h1>

            {/* Subtitle / Description */}
            <p className="font-outfit text-[15px] md:text-[16px] font-[400] leading-[1.6] md:leading-[30.4px] text-neutral-600 max-w-3xl mx-auto mb-8 pointer-events-auto px-4 text-center">
              PREPOC Technologies helps startups and growing businesses attract customers, generate qualified leads, and increase revenue through strategic design, powerful development, and performance-driven marketing.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto mb-16">
              <a
                href="mailto:info@prepoc.in"
                className="w-full sm:w-auto px-8 py-4 bg-black text-white font-heading font-medium rounded-full hover:bg-neutral-800 transition-all shadow-[0_0_30px_rgba(0,0,0,0.15)] hover:shadow-[0_0_55px_rgba(0,0,0,0.3)] tracking-wide transform hover:-translate-y-0.5 text-center text-sm cursor-pointer"
              >
                Get Free Consultation
              </a>
              <button
                onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-black font-heading font-medium rounded-full border border-black hover:bg-black hover:text-white transition-all tracking-wide transform hover:-translate-y-0.5 text-center text-sm cursor-pointer"
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Trust Logos (Wide Container, Single Line, Adjusted Spacing) */}
        <div ref={trustRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pointer-events-auto">
          <div className="flex flex-nowrap overflow-x-auto pb-4 justify-start md:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 opacity-70 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100 scrollbar-hide">
            {partnerLogos.length > 0 ? (
              partnerLogos.map((url, idx) => (
                <img key={idx} src={url} alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
              ))
            ) : (
              <>
                <img src="https://innovix99.ae/wp-content/uploads/2026/03/invoixclutch1ff.webp" alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
                <img src="https://innovix99.ae/wp-content/uploads/2026/03/invoixawwardsff.webp" alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
                <img src="https://innovix99.ae/wp-content/uploads/2026/03/cssdesigninvoixff.webp" alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
                <img src="https://innovix99.ae/wp-content/uploads/2026/03/techinnovixff.webp" alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
                <img src="https://innovix99.ae/wp-content/uploads/2026/03/invoixlogo21ff.webp" alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
                <img src="https://innovix99.ae/wp-content/uploads/2026/03/invoixlogo11fff.webp" alt="Partner Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain shrink-0" />
              </>
            )}
          </div>
        </div>
      </section>

      <HeroMarquee />
    </>
  )
}
