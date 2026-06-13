'use client'

import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Process from '@/components/sections/Process'
import Portfolio from '@/components/sections/Portfolio'
import Testimonials from '@/components/sections/Testimonials'
import Technologies from '@/components/sections/Technologies'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <main id="main-content">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent focus:text-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <Hero />
      <Services />
      <About />
      <Process />
      <Portfolio />
      <Technologies />
      <Testimonials />
      <CTA />

      <Footer />
    </main>
  )
}
