"use client"

import { useEffect, useRef, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import LoadingCube from './LoadingCube'
import { useLoadingStore } from '@/store/useLoadingStore'

export default function Preloader() {
  const { isLoading, setLoading, setLanded } = useLoadingStore()
  const progressRef = useRef(0)
  const [percent, setPercent] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading) return

    // Ensure scroll is locked during loading
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline()

    // Initial centering state using GSAP
    if (wrapperRef.current) {
      gsap.set(wrapperRef.current, {
        xPercent: -50,
        yPercent: -50,
        top: '50%',
        left: '50%',
        width: Math.min(250, window.innerWidth * 0.8),
        height: Math.min(250, window.innerWidth * 0.8)
      })
    }

    // 1. Solving the cube
    const proxy = { p: 0 }
    tl.to(proxy, {
      p: 1,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        progressRef.current = proxy.p
        setPercent(Math.round(proxy.p * 100))
      }
    })

    // 2. Brief Pause (Gold pulse happens in LoadingCube based on p=1)
    tl.to({}, { duration: 0.8 })

    // 3. Fall into Hero
    tl.add(() => {
      // Find the hero container
      const heroContainer = document.getElementById('hero-cube-container')
      if (heroContainer && wrapperRef.current && overlayRef.current) {
        const rect = heroContainer.getBoundingClientRect()

        // The hero container has a child div for the square aspect ratio.
        // It's better to get the exact inner square box for precise alignment:
        const innerBox = heroContainer.firstElementChild as HTMLElement
        const targetRect = innerBox ? innerBox.getBoundingClientRect() : rect

        // Animate overlay and text fade out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: "power3.in"
        })
        gsap.to(textRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        })

        // Add subtle downward "fall" blur effect to simulate velocity
        gsap.to(wrapperRef.current, {
          filter: "blur(3px)",
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut"
        })

        // Animate Canvas wrapper down to exactly match the Hero Cube's position and size
        // Split X and Y to create a realistic parabolic arc (gravity)
        gsap.to(wrapperRef.current, {
          top: targetRect.top,
          height: targetRect.height,
          yPercent: 0,
          duration: 0.8,
          ease: "power2.in" // Gravity acceleration
        })

        gsap.to(wrapperRef.current, {
          left: targetRect.left,
          width: targetRect.width,
          xPercent: 0,
          duration: 0.8,
          ease: "power1.inOut", // Horizontal momentum
          onComplete: () => {
            setLanded(true) // Triggers the pulse on Hero Cube

            // Wait a tiny bit then unmount this overlay entirely
            setTimeout(() => {
              setLoading(false)
              document.body.style.overflow = 'auto'
            }, 100)
          }
        })
      } else {
        // Fallback if hero container is missing
        gsap.to(overlayRef.current, { opacity: 0, duration: 1 })
        setTimeout(() => {
          setLanded(true)
          setLoading(false)
          document.body.style.overflow = 'auto'
        }, 1000)
      }
    })

    return () => {
      tl.kill()
    }
  }, [isLoading, setLoading, setLanded])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Black Background Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ backgroundColor: '#050505' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
              `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* 3D Canvas Wrapper - Animates to match Hero Cube bounds */}
      <div
        ref={wrapperRef}
        className="absolute pointer-events-auto"
      >
        <Canvas camera={{ position: [6.5, 6.5, 6.5], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <Environment preset="city" />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={1} scale={1.2}>
              <LoadingCube progressRef={progressRef} />
            </Float>

            <ContactShadows
              position={[0, -4.5, 0]}
              opacity={0.4}
              scale={12}
              blur={3}
              far={5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading Percentage Text */}
      <div
        ref={textRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-[160px] flex flex-col items-center gap-4 text-center pointer-events-none"
        style={{ zIndex: 10000 }} // Ensure it stays on top of the canvas
      >
        <span className="font-heading font-bold text-white text-3xl tracking-widest tabular-nums">
          {percent}%
        </span>
        <span className="text-[10px] font-body font-medium tracking-[0.38em] uppercase text-white/45">
          Loading
        </span>
      </div>
    </div>
  )
}
