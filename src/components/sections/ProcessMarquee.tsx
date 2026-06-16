'use client'

import React from 'react'

const row1Items = [
  'From concept to launch',
  'From concept to launch',
  'From concept to launch',
  'From concept to launch',
]

const row2Items = [
  'Built to grow your business',
  'Built to grow your business',
  'Built to grow your business',
  'Built to grow your business',
]

export default function ProcessMarquee() {
  return (
    <section 
      className="relative z-20 w-full bg-white py-12 md:py-16 overflow-hidden border-y border-neutral-100 flex flex-col gap-6 md:gap-10 select-none"
      aria-hidden="true"
    >
      {/* Row 1 (Right to Left) tilted rotate-2 */}
      <div className="w-full rotate-2 scale-[1.02] origin-center my-1 md:my-2 bg-blue-50/80 py-4 md:py-6 border-y border-blue-100/30">
        <div className="marquee-container">
          <div 
            className="marquee-track flex items-center gap-10 md:gap-12 whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer"
            style={{ animationDuration: '110s', willChange: 'transform' }}
          >
            {[...row1Items, ...row1Items, ...row1Items, ...row1Items].map((text, i) => (
              <div key={`r1-${i}`} className="flex items-center gap-10 md:gap-12">
                <span 
                  className={`font-outfit font-black uppercase text-4xl md:text-6xl lg:text-7xl tracking-wide ${
                    i % 2 === 0 
                      ? 'text-black' 
                      : 'text-transparent'
                  }`}
                  style={{
                    wordSpacing: '0.18em',
                    ...(i % 2 !== 0 ? { WebkitTextStroke: '1.5px #111111' } : {})
                  }}
                >
                  {text}
                </span>
                <span className="text-2xl md:text-4xl text-blue-500">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 (Left to Right) tilted -rotate-1 */}
      <div className="w-full -rotate-1 scale-[1.02] origin-center my-1 md:my-2 bg-blue-500 py-4 md:py-6 border-y border-blue-600/20 shadow-md">
        <div className="marquee-container">
          <div 
            className="marquee-track-reverse flex items-center gap-10 md:gap-12 whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer"
            style={{ animationDuration: '110s', willChange: 'transform' }}
          >
            {[...row2Items, ...row2Items, ...row2Items, ...row2Items].map((text, i) => (
              <div key={`r2-${i}`} className="flex items-center gap-10 md:gap-12">
                <span 
                  className={`font-outfit font-black uppercase text-4xl md:text-6xl lg:text-7xl tracking-wide ${
                    i % 2 === 0 
                      ? 'text-transparent' 
                      : 'text-white'
                  }`}
                  style={{
                    wordSpacing: '0.18em',
                    ...(i % 2 === 0 ? { WebkitTextStroke: '1.5px #ffffff' } : {})
                  }}
                >
                  {text}
                </span>
                <span className="text-2xl md:text-4xl text-white">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
