/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client"

import { useRef, useMemo, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, Environment, ContactShadows, Center, Text3D } from '@react-three/drei'
import { SVGLoader } from 'three-stdlib'
import {
  FaMagnifyingGlass, FaChartSimple, FaBullseye, FaDatabase, FaMagnet,
  FaEnvelope, FaFileLines, FaCode, FaGlobe,
  FaRobot, FaRocket, FaWrench, FaPenNib, FaPlug, FaBolt,
  FaShieldHalved, FaBoxOpen, FaVideo, FaScissors, FaHelicopter, FaHeadphones, FaTv,
  FaReact, FaApple, FaAndroid, FaFly
} from 'react-icons/fa6'
import * as THREE from 'three'
import gsap from 'gsap'
import { useLoadingStore } from '@/store/useLoadingStore'

const SERVICES = [
  {
    name: "Marketing", normal: [0, 0, 1], rotation: [0, 0, 0], color: "#D4AF37",
    skills: [
      { text: "SEO", icon: FaMagnifyingGlass },
      { text: "Meta Ads", icon: FaChartSimple },
      { text: "Google", icon: FaBullseye },
      { text: "Data", icon: FaDatabase },
      { text: "Leads", icon: FaMagnet },
      { text: "Email", icon: FaEnvelope },
      { text: "CRO", icon: FaChartSimple },
      { text: "Retarget", icon: FaBullseye },
      { text: "Reports", icon: FaFileLines }
    ]
  },
  {
    name: "Web Dev", normal: [0, 0, -1], rotation: [0, Math.PI, 0], color: "#0E5D47",
    skills: [
      { text: "React", icon: FaReact },
      { text: "Next.js", icon: FaGlobe },
      { text: "Django", icon: FaCode },
      { text: "CSS", icon: FaPenNib },
      { text: "APIs", icon: FaPlug },
      { text: "Speed", icon: FaBolt },
      { text: "Secure", icon: FaShieldHalved },
      { text: "Cloud", icon: FaDatabase },
      { text: "SEO", icon: FaMagnifyingGlass }
    ]
  },
  {
    name: "App Dev", normal: [1, 0, 0], rotation: [0, Math.PI / 2, 0], color: "#00f3ff",
    skills: [
      { text: "iOS", icon: FaApple },
      { text: "Android", icon: FaAndroid },
      { text: "Flutter", icon: FaFly },
      { text: "UI/UX", icon: FaPenNib },
      { text: "APIs", icon: FaPlug },
      { text: "Testing", icon: FaBullseye },
      { text: "Deploy", icon: FaRocket },
      { text: "Maint.", icon: FaWrench },
      { text: "Speed", icon: FaBolt }
    ]
  },
  {
    name: "Branding", normal: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0], color: "#ff00aa",
    skills: [
      { text: "Logos", icon: FaPenNib },
      { text: "Identity", icon: FaFileLines },
      { text: "Strategy", icon: FaBullseye },
      { text: "Guides", icon: FaFileLines },
      { text: "Package", icon: FaBoxOpen },
      { text: "Position", icon: FaBullseye },
      { text: "Fonts", icon: FaPenNib },
      { text: "Research", icon: FaMagnifyingGlass },
      { text: "Message", icon: FaEnvelope }
    ]
  },
  {
    name: "Video", normal: [0, 1, 0], rotation: [-Math.PI / 2, 0, 0], color: "#ff5e00",
    skills: [
      { text: "Reels", icon: FaVideo },
      { text: "Editing", icon: FaScissors },
      { text: "Drone", icon: FaHelicopter },
      { text: "Motion", icon: FaVideo },
      { text: "Story", icon: FaFileLines },
      { text: "Colors", icon: FaPenNib },
      { text: "TV Ads", icon: FaTv },
      { text: "Audio", icon: FaHeadphones },
      { text: "Delivery", icon: FaRocket }
    ]
  },
  {
    name: "AI & Auto", normal: [0, -1, 0], rotation: [Math.PI / 2, 0, 0], color: "#9d00ff",
    skills: [
      { text: "Chatbot", icon: FaRobot },
      { text: "Agents", icon: FaRobot },
      { text: "CRM", icon: FaDatabase },
      { text: "Flows", icon: FaPlug },
      { text: "Connect", icon: FaPlug },
      { text: "Scoring", icon: FaBullseye },
      { text: "Reports", icon: FaFileLines },
      { text: "Support", icon: FaHeadphones },
      { text: "Data", icon: FaDatabase }
    ]
  }
]

// Maps 3D coordinates on a face to a 0-8 index for the skills array
function getSkillIndex(normal: number[], x: number, y: number, z: number) {
  const [nx, ny, nz] = normal
  let col = 0, row = 0
  if (nz === 1) { col = x + 1; row = 1 - y } // Front
  if (nz === -1) { col = 1 - x; row = 1 - y } // Back
  if (nx === 1) { col = 1 - z; row = 1 - y } // Right
  if (nx === -1) { col = z + 1; row = 1 - y } // Left
  if (ny === 1) { col = x + 1; row = z + 1 } // Top
  if (ny === -1) { col = x + 1; row = 1 - z } // Bottom
  return row * 3 + col
}

const ExtrudedSvg = ({ iconDef, color, ...props }: unknown) => {
  const shapes = useMemo(() => {
    if (typeof window === 'undefined' || !iconDef) return []
    try {
      const element = iconDef({})
      const iconProps = element.props
      const viewBox = (iconProps.attr && iconProps.attr.viewBox) ? iconProps.attr.viewBox : "0 0 512 512"

      let paths = []
      if (Array.isArray(iconProps.children)) {
        paths = iconProps.children.map((child: unknown) => child?.props?.d).filter(Boolean)
      } else if (iconProps.children?.props?.d) {
        paths = [iconProps.children.props.d]
      }

      const pathElements = paths.map((d: unknown) => `<path d="${d}"/>`).join('')
      const svgString = `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${pathElements}</svg>`

      const loader = new SVGLoader()
      const svgData = loader.parse(svgString)
      return svgData.paths.map((path: unknown) => path.toShapes(true))
    } catch (e) {
      console.error("Failed to parse SVG", e)
      return []
    }
  }, [iconDef])

  // FontAwesome solid SVGs usually have a width/height around 512.
  // Using Center to perfectly center the SVG regardless of its original viewBox.
  // Scale increased for better visibility; emissive glow enabled at 0.6
  const scale = 0.00042
  return (
    <group {...props}>
      <Center>
        <group scale={[scale, -scale, scale]}>
          {shapes.map((shapeArr, i) =>
            shapeArr.map((shape: unknown, j: number) => (
              <mesh key={`${i}-${j}`} castShadow receiveShadow>
                <extrudeGeometry args={[shape, { depth: 80, bevelEnabled: true, bevelThickness: 4, bevelSize: 4, bevelSegments: 4 }]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.6}
                  metalness={0.7}
                  roughness={0.15}
                  transparent
                  opacity={0}
                />
              </mesh>
            ))
          )}
        </group>
      </Center>
    </group>
  )
}

function RubiksGrid() {
  const groupRef = useRef<THREE.Group>(null)
  const cubesRef = useRef<THREE.Mesh[]>([])
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([])

  // Refs for multi-layered 3D core & animations
  const skillMatRefs = useRef<THREE.MeshStandardMaterial[]>([])
  const iconMeshRefs = useRef<THREE.Mesh[]>([])
  const iconMatRefs = useRef<THREE.MeshStandardMaterial[]>([])
  const skillPlatesRef = useRef<THREE.MeshBasicMaterial[]>([])

  const titleGroupRefs = useRef<THREE.Group[]>([])
  const titleMatRefs = useRef<THREE.MeshStandardMaterial[]>([])
  const clickPlanesRef = useRef<THREE.Mesh[]>([])
  const centerLightRef = useRef<THREE.PointLight>(null)

  const [activeFace, setActiveFace] = useState<string | null>(null)
  const [hoveredFace, setHoveredFace] = useState<string | null>(null)

  const { hasLanded, isSettled, setSettled } = useLoadingStore()
  const timeRef = useRef(0)
  const pulseRef = useRef(0)

  // Trigger GSAP rigid damped bounce when cube lands
  useEffect(() => {
    // If the cube hasn't landed yet, or it has already settled (meaning it bounced in a previous route), skip the animation.
    if (!hasLanded || isSettled || !groupRef.current) return

    // Ensure scale is completely clean — no deformation ever
    gsap.set(groupRef.current.scale, { x: 1, y: 1, z: 1 })

    // Respect prefers-reduced-motion
    const reduced = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

    if (reduced) {
      gsap.set(groupRef.current.position, { y: 0 })
      setSettled(true)
      return
    }

    // Physics model: rigid rubber ball dropped from ~100cm
    // Restitution coefficient ≈ 0.72 (each bounce ~55% of previous height)
    // Fall / rise durations ∝ sqrt(height) for realistic gravity arcs
    //
    //  Bounce   Impact    Rise      Fall dur   Rise dur
    //  ------   -------   ------    --------   --------
    //   1       -0.44     +0.30     0.18s      0.22s
    //   2       -0.16     +0.16     0.14s      0.17s
    //   3       -0.07     +0.07     0.12s      0.13s
    //   4       -0.025    +0.02     0.09s      0.10s
    //   5       -0.007    settle    0.07s      0.09s
    //
    // Total ≈ 1.61s

    const tl = gsap.timeline({
      onComplete: () => setSettled(true)
    })

    // ── Bounce 1 — primary impact ────────────────────────────────────────
    tl.to(groupRef.current.position, {
      y: -0.44,
      duration: 0.18,
      ease: 'power2.in'
    }, 0)

    tl.to(groupRef.current.position, {
      y: 0.30,
      duration: 0.22,
      ease: 'power2.out'
    })

    // ── Bounce 2 ─────────────────────────────────────────────────────────
    tl.to(groupRef.current.position, {
      y: -0.16,
      duration: 0.14,
      ease: 'power2.in'
    })

    tl.to(groupRef.current.position, {
      y: 0.16,
      duration: 0.17,
      ease: 'power2.out'
    })

    // ── Bounce 3 ─────────────────────────────────────────────────────────
    tl.to(groupRef.current.position, {
      y: -0.07,
      duration: 0.12,
      ease: 'power2.in'
    })

    tl.to(groupRef.current.position, {
      y: 0.07,
      duration: 0.13,
      ease: 'power2.out'
    })

    // ── Bounce 4 ─────────────────────────────────────────────────────────
    tl.to(groupRef.current.position, {
      y: -0.025,
      duration: 0.09,
      ease: 'power2.in'
    })

    tl.to(groupRef.current.position, {
      y: 0.02,
      duration: 0.10,
      ease: 'power2.out'
    })

    // ── Bounce 5 (barely perceptible — energy bleed-off) ─────────────────
    tl.to(groupRef.current.position, {
      y: -0.007,
      duration: 0.07,
      ease: 'power2.in'
    })

    // ── Final settle ─────────────────────────────────────────────────────
    tl.to(groupRef.current.position, {
      y: 0,
      duration: 0.09,
      ease: 'power1.out'
    })
  }, [hasLanded, setSettled])


  // Pre-calculate the 27 cubes
  const cubesData = useMemo(() => {
    const temp = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          temp.push({
            basePosition: new THREE.Vector3(x, y, z),
          })
        }
      }
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // 1. Group Rotation Logic
    if (isSettled) {
      timeRef.current += delta
    }
    const time = timeRef.current
    const baseSpinY = time * 0.15
    const baseSpinX = time * 0.08

    const mouseOffsetX = state.pointer.x * Math.PI * 0.5
    const mouseOffsetY = -state.pointer.y * Math.PI * 0.5

    const targetRotX = baseSpinX + mouseOffsetY
    const targetRotY = baseSpinY + mouseOffsetX
    const idleEuler = new THREE.Euler(targetRotX, targetRotY, 0)
    const idleQ = new THREE.Quaternion().setFromEuler(idleEuler)

    let targetQ = idleQ

    if (activeFace) {
      const activeService = SERVICES.find(s => s.name === activeFace)
      if (activeService) {
        // We want the active face to be perfectly parallel to the screen and upright.
        // The camera's quaternion represents the screen's orientation.
        const targetFaceWorldQ = state.camera.quaternion.clone()

        // The face's local orientation relative to the group
        const faceLocalQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...activeService.rotation))

        // groupWorldQ * faceLocalQ = targetFaceWorldQ
        // groupWorldQ = targetFaceWorldQ * faceLocalQ^-1
        targetQ = targetFaceWorldQ.multiply(faceLocalQ.invert())

        // Add a very slight tilt so it doesn't look completely flat and retains a 3D feel
        const slightTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, -0.05, 0))
        targetQ.multiply(slightTilt)
      }
    }

    groupRef.current.quaternion.slerp(targetQ, delta * 4)

    // 2. Central Core Light
    const targetLightIntensity = activeFace ? 60 : (hoveredFace ? 20 : 0)
    if (centerLightRef.current) {
      centerLightRef.current.intensity = THREE.MathUtils.lerp(centerLightRef.current.intensity, targetLightIntensity, delta * 5)
    }

    // 3. Animate the 27 Cubes
    cubesRef.current.forEach((mesh, i) => {
      if (!mesh) return
      const basePos = cubesData[i].basePosition

      const targetSpacing = 1.05
      const expansionOffset = new THREE.Vector3(0, 0, 0)

      let isCubeOnHoveredFace = false

      if (hoveredFace) {
        const hoveredService = SERVICES.find(s => s.name === hoveredFace)
        if (hoveredService) {
          const [hx, hy, hz] = hoveredService.normal
          isCubeOnHoveredFace = (hx * basePos.x + hy * basePos.y + hz * basePos.z) > 0.5
        }
      }

      if (activeFace) {
        const activeService = SERVICES.find(s => s.name === activeFace)
        if (activeService) {
          const [nx, ny, nz] = activeService.normal
          const isCubeOnActiveFace = (nx * basePos.x + ny * basePos.y + nz * basePos.z) > 0.5

          if (isCubeOnActiveFace) {
            expansionOffset.add(new THREE.Vector3(nx * 1.5, ny * 1.5, nz * 1.5))
            const localX = basePos.clone().projectOnPlane(new THREE.Vector3(nx, ny, nz))
            expansionOffset.add(localX.multiplyScalar(0.4))
          }
        }
      }

      const mat = materialsRef.current[i]
      if (mat) {
        // Handle energy pulse
        if (hasLanded && pulseRef.current < 1) {
          pulseRef.current += delta * 2
        } else if (!hasLanded) {
          pulseRef.current = 0
        }

        const pulseFactor = Math.max(0, 1 - pulseRef.current)
        const pulseColor = new THREE.Color("#D4AF37").multiplyScalar(pulseFactor * 2)

        const targetEmissive = isCubeOnHoveredFace ? new THREE.Color("#0E5D47") : new THREE.Color("#000000")
        targetEmissive.add(pulseColor)

        mat.emissive.lerp(targetEmissive, delta * 5)
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, isCubeOnHoveredFace ? 0.3 : 0, delta * 5)

        if (pulseFactor > 0) {
          mat.emissiveIntensity = Math.max(mat.emissiveIntensity, pulseFactor * 2)
        }
      }

      const targetPos = new THREE.Vector3(
        basePos.x * targetSpacing,
        basePos.y * targetSpacing,
        basePos.z * targetSpacing
      ).add(expansionOffset)

      mesh.position.lerp(targetPos, delta * 5)
    })

    // 4. Animate Skill Materials (Text & Icons Opacity)
    const animateMatOpacity = (matArr: unknown[], targetFn: (name: string) => number) => {
      matArr.forEach((mat) => {
        if (!mat) return
        const targetOpacity = targetFn(mat.userData.serviceName)
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 5)
        mat.transparent = true
      })
    }

    animateMatOpacity(skillMatRefs.current, (name) => (activeFace === name ? 1 : 0))
    animateMatOpacity(skillPlatesRef.current, (name) => (activeFace === name ? 0.85 : 0))

    // Update icons opacity (and keep them static so they are readable)
    iconMeshRefs.current.forEach((mesh) => {
      if (!mesh) return

      const serviceName = mesh.userData?.serviceName
      if (serviceName) {
        const targetOpacity = (activeFace === serviceName) ? 1 : 0
        mesh.traverse((child: unknown) => {
          if (child.isMesh && child.material) {
            child.material.opacity = THREE.MathUtils.lerp(child.material.opacity || 0, targetOpacity, delta * 5)
          }
        })
      }
    })

    // 5. Animate Large Title Texts Opacity & Position
    titleMatRefs.current.forEach((mat) => {
      if (!mat) return
      const serviceName = mat.userData.serviceName
      const shouldShow = (hoveredFace === serviceName) || (activeFace === serviceName)
      const targetOpacity = shouldShow ? 1 : 0
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 6)
      mat.transparent = true
    })

    titleGroupRefs.current.forEach((group) => {
      if (!group) return
      const serviceName = group.userData.serviceName
      const service = SERVICES.find(s => s.name === serviceName)
      if (service) {
        const [nx, ny, nz] = service.normal
        const dist = (activeFace === serviceName) ? 3.0 : 1.75
        const targetPos = new THREE.Vector3(nx * dist, ny * dist, nz * dist)
        group.position.lerp(targetPos, delta * 5)
      }
    })

    // 6. Animate Invisible Click Planes
    clickPlanesRef.current.forEach((planeMesh) => {
      if (!planeMesh) return
      const serviceName = planeMesh.userData.serviceName
      const service = SERVICES.find(s => s.name === serviceName)
      if (!service) return

      const [nx, ny, nz] = service.normal
      let dist = 1.65 // Collapsed
      if (activeFace === serviceName) dist = 3.15 // Expanded
      else if (activeFace !== null) dist = 1.65 // Other active

      const targetPos = new THREE.Vector3(nx * dist, ny * dist, nz * dist)
      planeMesh.position.lerp(targetPos, delta * 5)
    })
  })

  // Clear ref arrays on each render so they don't grow infinitely
  skillMatRefs.current = []
  iconMeshRefs.current = []
  iconMatRefs.current = []
  skillPlatesRef.current = []
  titleGroupRefs.current = []
  titleMatRefs.current = []
  clickPlanesRef.current = []

  return (
    <group ref={groupRef}>
      <pointLight
        ref={centerLightRef}
        color="#0E5D47"
        distance={20}
        decay={2}
        intensity={0}
      />

      {cubesData.map((cube, i) => (
        <RoundedBox
          key={i}
          ref={(el) => { cubesRef.current[i] = el as THREE.Mesh }}
          args={[1, 1, 1]}
          radius={0.12}
          smoothness={4}
          position={[cube.basePosition.x * 1.05, cube.basePosition.y * 1.05, cube.basePosition.z * 1.05]}
        >
          <meshPhysicalMaterial
            ref={(el) => { materialsRef.current[i] = el as THREE.MeshPhysicalMaterial }}
            color="#050505"
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />

          {SERVICES.map((service) => {
            const [nx, ny, nz] = service.normal
            const isCubeOnFace = (nx * cube.basePosition.x + ny * cube.basePosition.y + nz * cube.basePosition.z) > 0.5
            if (!isCubeOnFace) return null

            const skillIdx = getSkillIndex(service.normal, cube.basePosition.x, cube.basePosition.y, cube.basePosition.z)
            const skillItem = service.skills[skillIdx]

            return (
              <group
                key={service.name}
                position={[nx * 0.505, ny * 0.505, nz * 0.505]}
                rotation={service.rotation}
              >
                {/* Backing plate — richer dark contrast so icons pop */}
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[0.88, 0.88]} />
                  <meshBasicMaterial
                    ref={(el) => { if (el) { el.userData = { serviceName: service.name }; skillPlatesRef.current.push(el) } }}
                    color="#000000"
                    transparent
                    opacity={0}
                  />
                </mesh>
                {/* Icon — centered, slightly higher, clearly visible */}
                <ExtrudedSvg
                  iconDef={skillItem.icon}
                  color={service.color}
                  position={[0, 0.10, 0.06]}
                  ref={(el: unknown) => { if (el) { el.userData = { serviceName: service.name }; iconMeshRefs.current.push(el) } }}
                />
                {/* Label text — larger, pushed down cleanly below icon */}
                <Center position={[0, -0.20, 0.03]}>
                  <Text3D
                    font="/fonts/helvetiker_bold.typeface.json"
                    size={0.09}
                    height={0.025}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.006}
                    bevelSize={0.003}
                  >
                    {skillItem.text}
                    <meshStandardMaterial
                      ref={(el) => { if (el) { el.userData = { serviceName: service.name }; skillMatRefs.current.push(el) } }}
                      color="#ffffff"
                      emissive="#ffffff"
                      emissiveIntensity={0.2}
                    />
                  </Text3D>
                </Center>
              </group>
            )
          })}
        </RoundedBox>
      ))}

      {/* Large Service Titles & Invisible Click Planes */}
      {SERVICES.map((service) => (
        <group key={`ui-${service.name}`}>
          <mesh
            ref={(el) => { if (el) clickPlanesRef.current.push(el as THREE.Mesh) }}
            userData={{ serviceName: service.name }}
            position={[service.normal[0] * 1.65, service.normal[1] * 1.65, service.normal[2] * 1.65]}
            rotation={service.rotation}
            onClick={(e) => {
              e.stopPropagation()
              setActiveFace(activeFace === service.name ? null : service.name)
            }}
            onPointerEnter={(e) => {
              e.stopPropagation()
              setHoveredFace(service.name)
              document.body.style.cursor = 'pointer'
            }}
            onPointerLeave={(e) => {
              e.stopPropagation()
              setHoveredFace(null)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[3.2, 3.2]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          {/* Large Extruded 3D Title */}
          <group
            ref={(el) => { if (el) { el.userData = { serviceName: service.name }; titleGroupRefs.current.push(el) } }}
            position={[service.normal[0] * 1.75, service.normal[1] * 1.75, service.normal[2] * 1.75]}
            rotation={service.rotation}
          >
            <Center>
              <Text3D
                font="/fonts/helvetiker_bold.typeface.json"
                size={0.25}
                height={0.05} // Thick extrusion
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.01}
                bevelSize={0.005}
              >
                {service.name}
                <meshStandardMaterial
                  ref={(el) => { if (el) { el.userData = { serviceName: service.name }; titleMatRefs.current.push(el) } }}
                  color={service.color}
                  emissive={service.color}
                  emissiveIntensity={0.5}
                />
              </Text3D>
            </Center>
          </group>
        </group>
      ))}
    </group>
  )
}

export default function InteractiveCube() {
  return (
    <div className="w-full aspect-square relative">
      <Canvas camera={{ position: [6.5, 6.5, 6.5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Environment preset="city" />

          <Float speed={2} rotationIntensity={0.2} floatIntensity={1} scale={1.2}>
            <RubiksGrid />
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
  )
}
