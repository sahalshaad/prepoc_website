import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Process from '@/components/sections/Process'
import ProcessMarquee from '@/components/sections/ProcessMarquee'
import Portfolio from '@/components/sections/Portfolio'
import Testimonials from '@/components/sections/Testimonials'
import Technologies from '@/components/sections/Technologies'
import CTA from '@/components/sections/CTA'
import FAQClient from '@/components/sections/FAQClient'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  console.time('faq-query')
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, question: true, answer: true },
  })
  console.timeEnd('faq-query')

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
      <ProcessMarquee />
      <Portfolio />
      <Technologies />
      <Testimonials />
      <CTA />
      <FAQClient faqs={faqs} />

      <Footer />
    </main>
  )
}

