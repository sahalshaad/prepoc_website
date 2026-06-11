'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only show on non-touch devices
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let animFrame: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Dot follows immediately
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    const onMouseDown = () => ring.classList.add('cursor-click')
    const onMouseUp = () => ring.classList.remove('cursor-click')

    const onMouseEnterHoverable = () => ring.classList.add('cursor-hover')
    const onMouseLeaveHoverable = () => ring.classList.remove('cursor-hover')

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    const animate = () => {
      // Ring follows with lerp for smooth trailing
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      animFrame = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // Attach hover effects to interactive elements
    const hoverables = document.querySelectorAll('a, button, [data-cursor-hover]')
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterHoverable)
      el.addEventListener('mouseleave', onMouseLeaveHoverable)
    })

    // Hide cursor when leaving window
    const onMouseLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onMouseEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterHoverable)
        el.removeEventListener('mouseleave', onMouseLeaveHoverable)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
