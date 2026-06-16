'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'

const defaultRow1 = [
  "https://innovix99.ae/wp-content/uploads/2026/04/httpshpx.kkb_.mybluehost.mewebsite_de4fd1e9.jpg",
  "https://innovix99.ae/wp-content/uploads/2026/04/httpsemerginghaus.com_.webp",
  "https://innovix99.ae/wp-content/uploads/2026/04/SS-1.jpg",
  "https://innovix99.ae/wp-content/uploads/2026/04/Dubaiwheels-1.jpg",
  "https://innovix99.ae/wp-content/uploads/2026/02/Screenshot-2022-12-02-at-17.webp"
]

const defaultRow2 = [
  "https://innovix99.ae/wp-content/uploads/2026/02/Screenshot-2022-12-02-at-17-2.webp",
  "https://innovix99.ae/wp-content/uploads/2026/02/Screenshot-2022-12-02-at-16-3.webp",
  "https://innovix99.ae/wp-content/uploads/2026/02/Screenshot-2022-12-02-at-16-2.webp",
  "https://innovix99.ae/wp-content/uploads/2026/02/Screenshot-2022-12-02-at-16-1.webp"
]

export function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [row1, setRow1] = useState<string[]>(defaultRow1)
  const [row2, setRow2] = useState<string[]>(defaultRow2)

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`/api/admin/media?category=marquee&t=${Date.now()}`)
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          const urls = data.data.map((img: any) => img.url)
          // Split the urls into two rows
          const half = Math.ceil(urls.length / 2)
          setRow1(urls.slice(0, half))
          setRow2(urls.slice(half))
        }
      } catch (err) {
        console.error('Failed to load marquee images:', err)
      }
    }
    fetchImages()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Set up continuous loop motion values for slow auto-movement
  const autoOffset1 = useMotionValue(0)
  const autoOffset2 = useMotionValue(0)

  useEffect(() => {
    // Row 1 moves left slowly
    const controls1 = animate(autoOffset1, [0, -25], {
      ease: "linear",
      duration: 50,
      repeat: Infinity,
      repeatType: "loop"
    })
    
    // Row 2 moves right slowly
    const controls2 = animate(autoOffset2, [-25, 0], {
      ease: "linear",
      duration: 50,
      repeat: Infinity,
      repeatType: "loop"
    })

    return () => {
      controls1.stop()
      controls2.stop()
    }
  }, [])

  // Combine scroll progress and auto offset
  const x1 = useTransform(
    [scrollYProgress, autoOffset1],
    ([scrollVal, autoVal]) => {
      // scrollVal is between 0 and 1. We map it to [0, -10] percent shift
      const scrollOffset = (scrollVal as number) * -10
      const autoOffset = autoVal as number
      return `${scrollOffset + autoOffset}%`
    }
  )

  const x2 = useTransform(
    [scrollYProgress, autoOffset2],
    ([scrollVal, autoVal]) => {
      // scrollVal is between 0 and 1. We map it to [-10, 0] percent shift
      const scrollOffset = (1 - (scrollVal as number)) * -10
      const autoOffset = autoVal as number
      return `${scrollOffset + autoOffset}%`
    }
  )

  // Repeat the images to ensure the track doesn't run out during scroll
  const repeatedRow1 = [...row1, ...row1, ...row1, ...row1]
  const repeatedRow2 = [...row2, ...row2, ...row2, ...row2]

  // Increased image size
  const imageClass = "w-[340px] md:w-[400px] h-[220px] md:h-[260px] object-cover rounded-xl shadow-sm border border-black/5 shrink-0"

  return (
    <div ref={containerRef} className="relative z-20 w-full bg-white overflow-hidden -mt-10 pb-20 pt-10">
      {/* Scrolling Images */}
      <div className="w-full flex flex-col gap-6 md:gap-8">
        {/* Row 1 */}
        <div className="w-full overflow-hidden flex">
          <motion.div style={{ x: x1 }} className="flex w-max gap-4 md:gap-6">
            {repeatedRow1.map((src, i) => (
              <img
                key={'r1' + i}
                src={src}
                alt="Portfolio"
                className={imageClass}
                loading="lazy"
              />
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="w-full overflow-hidden flex">
          <motion.div style={{ x: x2 }} className="flex w-max gap-4 md:gap-6">
            {repeatedRow2.map((src, i) => (
              <img
                key={'r2' + i}
                src={src}
                alt="Portfolio"
                className={imageClass}
                loading="lazy"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
