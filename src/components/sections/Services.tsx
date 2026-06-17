'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ServiceCMS } from '@/types/admin'
import { Highlight } from '@/components/ui/Highlight'
import sanitizeHtml from 'sanitize-html'

export default function Services() {
  const [features, setFeatures] = useState<ServiceCMS[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services')
        const json = await res.json()
        if (json.success && json.data) {
          setFeatures(json.data)
        }
      } catch (err) {
        console.error('Failed to load services:', err)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (features.length === 0) return

    const observers = blockRefs.current.map((block, index) => {
      if (!block) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // When a block is intersecting the middle of the screen
            if (entry.isIntersecting) {
              setActiveIndex(index)
            }
          })
        },
        {
          rootMargin: '-40% 0px -40% 0px', // Trigger near the center of viewport
          threshold: 0
        }
      )

      observer.observe(block)
      return observer
    })

    return () => {
      observers.forEach((obs) => obs?.disconnect())
    }
  }, [features])

  if (features.length === 0) return null

  return (
    <section id="services" className="relative w-full bg-white hidden md:block section-padding">
      <div className="container-wide mb-20 text-center">
        <h2 className="text-[36px] md:text-[46px] lg:text-[54px] font-outfit font-medium text-[#111] leading-[1.3] tracking-tight">
          Designing Websites That Help
          <br className="hidden md:block" />
          <Highlight className="mt-2">Dubai Businesses</Highlight>{' '}
          Grow Online:
        </h2>
      </div>

      <div className="container-wide">
        <div className="flex w-full">

          {/* Left Column (Sticky Image Stack) */}
          <div className="w-1/2 relative h-screen sticky top-0 flex items-center justify-center overflow-hidden pr-8">
            <div className="relative w-full aspect-square max-w-[600px]">
              {features.map((feature, idx) => (
                <div
                  key={feature.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Scrolling Content) */}
          <div className="w-1/2 py-[20vh]">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                ref={(el) => {
                  blockRefs.current[idx] = el
                }}
                className="min-h-screen flex flex-col justify-center max-w-lg"
              >
                <h3 className="text-4xl font-outfit font-semibold mb-6 text-black">
                  {feature.title}
                </h3>

                <p
                  className="text-neutral-600 leading-relaxed mb-8 text-[17px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(feature.desc) }}
                />

                <ul className="space-y-4 mb-10">
                  {feature.list?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-neutral-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.text) }} />
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-4">
                  {feature.buttons?.map((btn, i) => (
                    btn.primary ? (
                      <Link
                        key={i}
                        href={btn.href || '#'}
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors font-medium text-sm"
                      >
                        {btn.label} <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <Link
                        key={i}
                        href={btn.href || '#'}
                        className="inline-flex items-center gap-2 bg-white text-black border border-black px-6 py-3 rounded-full hover:bg-neutral-50 transition-colors font-medium text-sm"
                      >
                        {btn.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
