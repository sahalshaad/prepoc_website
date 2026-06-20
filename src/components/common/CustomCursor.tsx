'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // CSS hides the elements by default via `display: none`.
    // We only add the enabling class when a real mouse is confirmed.
    if (!isFinePointer || prefersReducedMotion) return

    document.documentElement.classList.add('has-fine-pointer')

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
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    const onMouseDown = () => ring.classList.add('cursor-click')
    const onMouseUp = () => ring.classList.remove('cursor-click')
    const onMouseEnterHoverable = () => ring.classList.add('cursor-hover')
    const onMouseLeaveHoverable = () => ring.classList.remove('cursor-hover')

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      animFrame = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    const hoverables = document.querySelectorAll('a, button, [data-cursor-hover]')
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterHoverable)
      el.addEventListener('mouseleave', onMouseLeaveHoverable)
    })

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
      document.documentElement.classList.remove('has-fine-pointer')
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

  // Always render the elements — CSS keeps them `display: none` until
  // `.has-fine-pointer` is added to <html> by the effect above.
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
