'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { SceneId } from './LoadingScreen'

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 02 — THE SIGNAL
// Abstract: Concentric rings expanding from a luminous origin point.
// Represents: Content reaching progressively wider audiences — broadcast, reach, narrative.
// Motion: Slow wave-like expansion. Like a stone dropped in still water.
// ─────────────────────────────────────────────────────────────────────────────

function buildSignal(): THREE.Group {
  const g = new THREE.Group()

  // Central origin — the source of the story
  g.add(
    Object.assign(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 24, 24),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color('#D4AF37'),
          emissive: new THREE.Color('#D4AF37'),
          emissiveIntensity: 2.5,
          transparent: true,
          opacity: 0,
          roughness: 0,
          metalness: 0.1,
        })
      ),
      { userData: { id: 'origin' } }
    )
  )

  // 4 expanding rings — staggered phases
  const ringDefs = [
    { baseR: 0.48, color: '#D4AF37', phase: 0.00, thickness: 0.014 },
    { baseR: 0.48, color: '#0E5D47', phase: 0.55, thickness: 0.010 },
    { baseR: 0.48, color: '#D4AF37', phase: 1.10, thickness: 0.008 },
    { baseR: 0.48, color: '#0E5D47', phase: 1.65, thickness: 0.006 },
  ]

  ringDefs.forEach(({ baseR, color, phase, thickness }, i) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(baseR, baseR + thickness, 80),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
    ring.userData = { isRing: true, phase, index: i }
    g.add(ring)
  })

  g.scale.setScalar(0.85)
  return g
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 03 — THE NETWORK
// Abstract: 18 curated nodes breathing organically, connected by purposeful edges.
// Represents: Multi-channel marketing — each node is a channel, edges are synergies.
// Motion: Slow planetary rotation + gentle per-node breathing oscillation.
// ─────────────────────────────────────────────────────────────────────────────

const NETWORK_POSITIONS: [number, number, number][] = [
  [ 0.00,  0.00,  0.00],  // hub
  [ 1.20,  0.70,  0.20],
  [-1.00,  0.80, -0.30],
  [ 0.40,  1.60,  0.40],
  [-0.70, -1.00,  0.50],
  [ 1.50, -0.40, -0.20],
  [-1.50,  0.10,  0.60],
  [ 0.20, -1.70,  0.10],
  [ 0.80,  0.40,  1.30],
  [-0.20,  1.10, -1.10],
  [ 1.10, -1.00,  0.70],
  [-1.10, -0.40, -0.90],
  [ 0.40,  0.70, -1.60],
  [-0.50,  1.90,  0.00],
  [ 1.90,  0.10,  0.00],
  [-0.10, -0.20,  1.70],
  [ 0.70, -0.80, -1.30],
  [-0.90, -1.30,  1.00],
]

function buildNetwork(): { group: THREE.Group; nodes: THREE.Mesh[] } {
  const g = new THREE.Group()
  const nodes: THREE.Mesh[] = []

  NETWORK_POSITIONS.forEach(([x, y, z], i) => {
    const isHub = i === 0
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(isHub ? 0.13 : 0.062, 16, 16),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(isHub ? '#D4AF37' : '#0E5D47'),
        emissive: new THREE.Color(isHub ? '#D4AF37' : '#0E5D47'),
        emissiveIntensity: isHub ? 2.2 : 0.85,
        transparent: true,
        opacity: 0,
        roughness: 0.18,
        metalness: 0.0,
        depthWrite: false,
      })
    )
    node.position.set(x, y, z)
    node.userData = { bx: x, by: y, bz: z, phase: i * 0.68, isHub }
    nodes.push(node)
    g.add(node)
  })

  // Edges — connect nodes within distance threshold
  const vecs = NETWORK_POSITIONS.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  const edgePos: number[] = []
  for (let i = 0; i < vecs.length; i++) {
    for (let j = i + 1; j < vecs.length; j++) {
      if (vecs[i].distanceTo(vecs[j]) < 1.72) {
        edgePos.push(vecs[i].x, vecs[i].y, vecs[i].z, vecs[j].x, vecs[j].y, vecs[j].z)
      }
    }
  }
  const edgeGeo = new THREE.BufferGeometry()
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3))
  g.add(
    new THREE.LineSegments(
      edgeGeo,
      new THREE.LineBasicMaterial({ color: '#0E5D47', transparent: true, opacity: 0, depthWrite: false })
    )
  )

  g.scale.setScalar(0.85)
  return { group: g, nodes }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 04 — THE ARCHITECTURE
// Abstract: Two nested icosahedra counter-rotating — precision and systematic thinking.
// Represents: Web & Mobile Development — where every edge serves a purpose.
// Motion: Slow, meditative counter-rotation. Like gears in a perfect machine.
// ─────────────────────────────────────────────────────────────────────────────

function buildArchitecture(): { group: THREE.Group; inner: THREE.LineSegments } {
  const g = new THREE.Group()

  // Outer icosahedron wireframe
  const outerGeo = new THREE.IcosahedronGeometry(1.72, 0)
  const outerLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(outerGeo),
    new THREE.LineBasicMaterial({ color: '#0E5D47', transparent: true, opacity: 0, depthWrite: false })
  )
  g.add(outerLines)

  // Inner icosahedron — gold, counter-rotates
  const innerGeo = new THREE.IcosahedronGeometry(0.96, 0)
  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: '#D4AF37', transparent: true, opacity: 0, depthWrite: false })
  )
  inner.rotation.y = Math.PI / 4
  g.add(inner)

  // Vertex dots at icosahedron corners
  const posAttr = outerGeo.getAttribute('position')
  const seenVerts: THREE.Vector3[] = []
  for (let i = 0; i < posAttr.count; i++) {
    const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
    if (!seenVerts.some((u) => u.distanceTo(v) < 0.01)) {
      seenVerts.push(v)
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.044, 8, 8),
        new THREE.MeshStandardMaterial({
          color: '#0E5D47',
          emissive: '#0E5D47',
          emissiveIntensity: 0.75,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      )
      dot.position.copy(v)
      g.add(dot)
    }
  }

  // Central gold point
  const centerDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 12),
    new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      emissive: '#D4AF37',
      emissiveIntensity: 3.0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  )
  g.add(centerDot)

  g.scale.setScalar(0.85)
  return { group: g, inner }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 05 — THE INTELLIGENCE
// Abstract: Particles connected only to their nearest neighbor — sparse, purposeful.
// Represents: AI finding meaningful patterns in complex data. Order from chaos.
// Motion: Slow rotation + organic drift. Breathing intelligence.
// ─────────────────────────────────────────────────────────────────────────────

function buildIntelligence(): { group: THREE.Group; centralNode: THREE.Mesh } {
  const g = new THREE.Group()

  const COUNT = 68
  const ptPos: number[] = []
  const ptVecs: THREE.Vector3[] = []

  // Fibonacci sphere distribution — uniform, deterministic, beautiful
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < COUNT; i++) {
    const y  = 1 - (i / (COUNT - 1)) * 2
    const rr = Math.sqrt(Math.max(0, 1 - y * y))
    const θ  = goldenAngle * i
    // Vary radius slightly for depth
    const r  = 1.4 + (((i * 13 + 7) % 11) / 11) * 0.85
    const x  = Math.cos(θ) * rr * r
    const z  = Math.sin(θ) * rr * r
    const yy = y * r * 0.78  // slightly oblate — more elegant than a perfect sphere
    ptPos.push(x, yy, z)
    ptVecs.push(new THREE.Vector3(x, yy, z))
  }

  const ptGeo = new THREE.BufferGeometry()
  ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(ptPos, 3))
  g.add(
    new THREE.Points(
      ptGeo,
      new THREE.PointsMaterial({
        color: '#0E5D47',
        size: 0.062,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    )
  )

  // Sparse connections — only nearest neighbor per node
  const added = new Set<string>()
  const connPos: number[] = []
  ptVecs.forEach((v, i) => {
    let minDist = Infinity
    let minJ = -1
    ptVecs.forEach((u, j) => {
      if (j === i) return
      const d = v.distanceTo(u)
      if (d < minDist) { minDist = d; minJ = j }
    })
    if (minJ >= 0) {
      const key = `${Math.min(i, minJ)}-${Math.max(i, minJ)}`
      if (!added.has(key) && minDist < 1.1) {
        added.add(key)
        connPos.push(
          ptVecs[i].x, ptVecs[i].y, ptVecs[i].z,
          ptVecs[minJ].x, ptVecs[minJ].y, ptVecs[minJ].z
        )
      }
    }
  })

  const connGeo = new THREE.BufferGeometry()
  connGeo.setAttribute('position', new THREE.Float32BufferAttribute(connPos, 3))
  g.add(
    new THREE.LineSegments(
      connGeo,
      new THREE.LineBasicMaterial({ color: '#0E5D47', transparent: true, opacity: 0, depthWrite: false })
    )
  )

  // Central intelligence node
  const centralNode = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 20, 20),
    new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      emissive: '#D4AF37',
      emissiveIntensity: 2.2,
      transparent: true,
      opacity: 0,
      roughness: 0.08,
      metalness: 0.05,
      depthWrite: false,
    })
  )
  g.add(centralNode)

  g.scale.setScalar(0.85)
  return { group: g, centralNode }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function lerpOpacityAll(group: THREE.Group, target: number, delta: number, speed = 5.5) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m: THREE.Material) => {
        if ('opacity' in m) (m as THREE.MeshStandardMaterial).opacity =
          THREE.MathUtils.lerp((m as THREE.MeshStandardMaterial).opacity, target, delta * speed)
      })
    }
    if (child instanceof THREE.LineSegments) {
      ;(child.material as THREE.LineBasicMaterial).opacity =
        THREE.MathUtils.lerp((child.material as THREE.LineBasicMaterial).opacity, target * 0.5, delta * speed)
    }
    if (child instanceof THREE.Points) {
      ;(child.material as THREE.PointsMaterial).opacity =
        THREE.MathUtils.lerp((child.material as THREE.PointsMaterial).opacity, target, delta * speed)
    }
  })
  // Scale in/out with opacity
  const sTarget = target > 0.02 ? 1 : 0.86
  group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, sTarget, delta * 4))
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ThreeSceneCanvas({ currentScene }: { currentScene: SceneId }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const sceneIdRef = useRef<SceneId>(currentScene)
  const rafRef     = useRef(-1)

  useEffect(() => { sceneIdRef.current = currentScene }, [currentScene])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    // ── Camera ───────────────────────────────────────────────────────────
    const cam = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    cam.position.set(0, 0, 6.5)

    // ── Three.js scene ───────────────────────────────────────────────────
    const scene = new THREE.Scene()

    // ── Soft, premium lighting ───────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.30))

    const keyLight = new THREE.PointLight(0xffffff, 2.2, 22)
    keyLight.position.set(4, 5, 5)
    scene.add(keyLight)

    const greenLight = new THREE.PointLight(new THREE.Color('#0E5D47'), 3.0, 18)
    greenLight.position.set(-4, 2, 3)
    scene.add(greenLight)

    const goldRim = new THREE.PointLight(new THREE.Color('#D4AF37'), 1.2, 14)
    goldRim.position.set(3, -3, 2)
    scene.add(goldRim)

    // ── Build scene objects ───────────────────────────────────────────────
    const signalGroup                   = buildSignal()
    const { group: networkGroup, nodes } = buildNetwork()
    const { group: archGroup, inner }    = buildArchitecture()
    const { group: intelGroup, centralNode } = buildIntelligence()

    scene.add(signalGroup, networkGroup, archGroup, intelGroup)

    const clock = new THREE.Clock()

    // ── Animation loop ────────────────────────────────────────────────────
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      const delta   = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.getElapsedTime()
      const sc      = sceneIdRef.current

      // ══ SCENE 02: THE SIGNAL ════════════════════════════════════════════
      {
        const active = sc === 2
        const scaleT = active ? 1 : 0.86
        signalGroup.scale.setScalar(THREE.MathUtils.lerp(signalGroup.scale.x, scaleT, delta * 4))

        signalGroup.children.forEach((child) => {
          if (child.userData.id === 'origin') {
            // Central sphere fades in when active
            const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
            m.opacity = THREE.MathUtils.lerp(m.opacity, active ? 1 : 0, delta * 5.5)
          } else if (child.userData.isRing) {
            const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
            if (!active) {
              // Fade out quickly when scene changes
              m.opacity = THREE.MathUtils.lerp(m.opacity, 0, delta * 6)
            } else {
              // Wave animation: each ring expands and fades cyclically
              const { phase } = child.userData
              const t          = (elapsed * 0.36 + phase) % 2.5
              const ringScale  = 0.38 + t * 0.68
              const ringOpacity = Math.max(0, 0.62 - t * 0.25)
              child.scale.setScalar(ringScale)
              m.opacity = THREE.MathUtils.lerp(m.opacity, ringOpacity, delta * 3.5)
            }
          }
        })

        if (active) {
          signalGroup.rotation.z = Math.sin(elapsed * 0.18) * 0.04
        }
      }

      // ══ SCENE 03: THE NETWORK ═══════════════════════════════════════════
      {
        const active = sc === 3
        lerpOpacityAll(networkGroup, active ? 1 : 0, delta)

        if (active) {
          networkGroup.rotation.y = elapsed * 0.12 // slow drift
          nodes.forEach((node) => {
            const { bx, by, bz, phase } = node.userData
            // Each node breathes at its own frequency
            node.position.set(
              bx + Math.sin(elapsed * 0.48 + phase) * 0.055,
              by + Math.cos(elapsed * 0.38 + phase) * 0.055,
              bz + Math.sin(elapsed * 0.28 + phase * 1.4) * 0.038
            )
            // Pulse emissive
            const m = node.material as THREE.MeshStandardMaterial
            m.emissiveIntensity = (node.userData.isHub ? 1.8 : 0.65)
              + Math.sin(elapsed * 1.6 + phase) * 0.4
          })
        }
      }

      // ══ SCENE 04: THE ARCHITECTURE ══════════════════════════════════════
      {
        const active = sc === 4
        lerpOpacityAll(archGroup, active ? 1 : 0, delta)

        if (active) {
          archGroup.rotation.y  += delta * 0.20
          archGroup.rotation.x   = Math.sin(elapsed * 0.16) * 0.07
          // Inner icosahedron counter-rotates
          inner.rotation.y      -= delta * 0.35
          inner.rotation.x       = -archGroup.rotation.x * 0.5
        }
      }

      // ══ SCENE 05: THE INTELLIGENCE ══════════════════════════════════════
      {
        const active = sc === 5
        const opT    = active ? 1 : 0
        const scaleT = active ? 1 : 0.86

        intelGroup.scale.setScalar(THREE.MathUtils.lerp(intelGroup.scale.x, scaleT, delta * 4))

        // Points, Lines, Meshes all need individual handling
        intelGroup.traverse((child) => {
          if (child instanceof THREE.Points) {
            ;(child.material as THREE.PointsMaterial).opacity =
              THREE.MathUtils.lerp((child.material as THREE.PointsMaterial).opacity, opT, delta * 5.5)
          } else if (child instanceof THREE.LineSegments) {
            ;(child.material as THREE.LineBasicMaterial).opacity =
              THREE.MathUtils.lerp((child.material as THREE.LineBasicMaterial).opacity, opT * 0.22, delta * 5.5)
          } else if (child instanceof THREE.Mesh) {
            ;(child.material as THREE.MeshStandardMaterial).opacity =
              THREE.MathUtils.lerp((child.material as THREE.MeshStandardMaterial).opacity, opT, delta * 5.5)
          }
        })

        if (active) {
          intelGroup.rotation.y += delta * 0.22
          intelGroup.rotation.x  = Math.sin(elapsed * 0.20) * 0.09
          // Central node pulses
          ;(centralNode.material as THREE.MeshStandardMaterial).emissiveIntensity =
            1.9 + Math.sin(elapsed * 2.4) * 0.7
        }
      }

      renderer.render(scene, cam)
    }
    animate()

    // ── Resize handler ────────────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      cam.aspect = w / h
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      scene.clear()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  )
}
