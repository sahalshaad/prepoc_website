'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  once?: boolean
}

export default function AnimatedText({
  children,
  className,
  delay = 0,
  tag: Tag = 'div',
  once = true,
}: AnimatedTextProps) {
  const elementRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const element = elementRef.current
    if (!element) return

    element.style.opacity = '0'
    element.style.transform = 'translateY(30px)'
    element.style.transition = `opacity 0.8s cubic-bezier(0.0, 0.0, 0.2, 1) ${delay}ms, transform 0.8s cubic-bezier(0.0, 0.0, 0.2, 1) ${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated.current) return
            hasAnimated.current = true
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
          } else if (!once) {
            element.style.opacity = '0'
            element.style.transform = 'translateY(30px)'
            hasAnimated.current = false
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, once])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={elementRef as any}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}
