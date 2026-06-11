'use client'

import { useEffect, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(): { position: React.MutableRefObject<MousePosition> } {
  const position = useRef<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return { position }
}
