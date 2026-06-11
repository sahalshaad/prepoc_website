"use client"

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const BRAND_COLORS = ["#0E5D47", "#D4AF37", "#1F2937", "#F5F5F5"]

interface LoadingCubeProps {
  progressRef: React.MutableRefObject<number> // 0 to 1
}

export default function LoadingCube({ progressRef }: LoadingCubeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const cubesRef = useRef<THREE.Mesh[]>([])
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([])
  const platesRef = useRef<THREE.MeshBasicMaterial[]>([])
  

  // Pre-calculate the 27 cubes
  const cubesData = useMemo(() => {
    const temp = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Generate scrambled target rotations and colors
          const randomRot = new THREE.Euler(
            (Math.floor(Math.random() * 4) * Math.PI) / 2,
            (Math.floor(Math.random() * 4) * Math.PI) / 2,
            (Math.floor(Math.random() * 4) * Math.PI) / 2
          )
          
          temp.push({
            basePosition: new THREE.Vector3(x, y, z),
            scrambledRotation: new THREE.Quaternion().setFromEuler(randomRot),
            solvedRotation: new THREE.Quaternion().identity(),
            faces: Array(6).fill(null).map(() => BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)])
          })
        }
      }
    }
    return temp
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const p = Math.min(1, Math.max(0, progressRef.current)) // 0 to 1

    // Group Rotation Logic
    // Starts spinning fast and crazy, ends up exactly at [0,0,0] when p=1
    // At p=1, HeroCube will pick up from [0,0,0] as its time starts from 0.
    const time = state.clock.getElapsedTime()
    
    // As p goes to 1, spin speed goes to 0, and target approaches [0,0,0]
    const spinMultiplier = (1 - p) * 5
    const targetRotX = Math.sin(time * 0.5) * spinMultiplier
    const targetRotY = time * 0.5 * spinMultiplier
    
    const currentEuler = new THREE.Euler(targetRotX, targetRotY, 0)
    const currentQ = new THREE.Quaternion().setFromEuler(currentEuler)
    
    // Smoothly lock to [0,0,0] at the end
    const identityQ = new THREE.Quaternion().identity()
    groupRef.current.quaternion.slerpQuaternions(currentQ, identityQ, p)

    cubesRef.current.forEach((mesh, i) => {
      if (!mesh) return
      const data = cubesData[i]
      
      // Interpolate rotation
      mesh.quaternion.slerpQuaternions(data.scrambledRotation, data.solvedRotation, p)

      // The cubes spacing
      // Starts a bit expanded, locks into tight 1.05 spacing at p=1
      const spacing = THREE.MathUtils.lerp(1.2, 1.05, p)
      const targetPos = new THREE.Vector3(
        data.basePosition.x * spacing, 
        data.basePosition.y * spacing, 
        data.basePosition.z * spacing
      )
      mesh.position.copy(targetPos)

      const mat = materialsRef.current[i]
      if (mat) {
        mat.emissiveIntensity = 0
      }
    })

    // Animate face colors from mismatched to solved
    let plateIndex = 0
    cubesData.forEach((cube) => {
      const facesData = [
        { normal: [0, 0, 1], color: "#D4AF37" }, // Front
        { normal: [0, 0, -1], color: "#0E5D47" }, // Back
        { normal: [1, 0, 0], color: "#00f3ff" }, // Right
        { normal: [-1, 0, 0], color: "#ff00aa" }, // Left
        { normal: [0, 1, 0], color: "#ff5e00" }, // Top
        { normal: [0, -1, 0], color: "#9d00ff" } // Bottom
      ]

      facesData.forEach((face, fIdx) => {
        const [nx, ny, nz] = face.normal
        const isCubeOnFace = (nx * cube.basePosition.x + ny * cube.basePosition.y + nz * cube.basePosition.z) > 0.5
        if (!isCubeOnFace) return

        const mat = platesRef.current[plateIndex]
        if (mat) {
          const scrambledColor = new THREE.Color(cube.faces[fIdx])
          const solvedColor = new THREE.Color(face.color) // Solved color for this face
          mat.color.copy(scrambledColor).lerp(solvedColor, p)
          mat.opacity = 1
          mat.transparent = true
        }
        plateIndex++
      })
    })
  })

  // Re-clear refs
  platesRef.current = []

  return (
    <group ref={groupRef}>

      {cubesData.map((cube, i) => (
        <RoundedBox
          key={i}
          ref={(el) => { cubesRef.current[i] = el as THREE.Mesh }}
          args={[1, 1, 1]} 
          radius={0.12} 
          smoothness={4}
        >
          <meshPhysicalMaterial 
            ref={(el) => { materialsRef.current[i] = el as THREE.MeshPhysicalMaterial }}
            color="#050505"
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />

          {/* Fake faces for color solving */}
          {[
            { normal: [0, 0, 1], rot: [0, 0, 0] },
            { normal: [0, 0, -1], rot: [0, Math.PI, 0] },
            { normal: [1, 0, 0], rot: [0, Math.PI / 2, 0] },
            { normal: [-1, 0, 0], rot: [0, -Math.PI / 2, 0] },
            { normal: [0, 1, 0], rot: [-Math.PI / 2, 0, 0] },
            { normal: [0, -1, 0], rot: [Math.PI / 2, 0, 0] }
          ].map((face, fIdx) => {
            const [nx, ny, nz] = face.normal
            const isCubeOnFace = (nx * cube.basePosition.x + ny * cube.basePosition.y + nz * cube.basePosition.z) > 0.5
            if (!isCubeOnFace) return null

            return (
              <group 
                key={fIdx} 
                position={[nx * 0.505, ny * 0.505, nz * 0.505]} 
                rotation={face.rot as [number, number, number]}
              >
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[0.85, 0.85]} />
                  <meshBasicMaterial 
                    ref={(el) => { if(el) platesRef.current.push(el) }}
                    color="#ffffff" 
                  />
                </mesh>
              </group>
            )
          })}
        </RoundedBox>
      ))}
    </group>
  )
}
