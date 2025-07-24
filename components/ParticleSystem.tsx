"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"
import { useGameStore } from "../store/gameStore"

export default function ParticleSystem() {
  const { particleEffects, removeParticleEffect } = useGameStore()

  return (
    <group>
      {particleEffects.map((effect) => (
        <ParticleEffect key={effect.id} effect={effect} onComplete={() => removeParticleEffect(effect.id)} />
      ))}
    </group>
  )
}

function ParticleEffect({ effect, onComplete }) {
  const pointsRef = useRef()
  const timeRef = useRef(0)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(effect.count * 3)
    const colors = new Float32Array(effect.count * 3)
    const sizes = new Float32Array(effect.count)

    const color = new THREE.Color(effect.color || "#ffffff")

    for (let i = 0; i < effect.count; i++) {
      const i3 = i * 3

      // Random positions around the effect center
      positions[i3] = effect.position.x + (Math.random() - 0.5) * 2
      positions[i3 + 1] = effect.position.y + (Math.random() - 0.5) * 2
      positions[i3 + 2] = effect.position.z + (Math.random() - 0.5) * 2

      // Colors
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Sizes
      sizes[i] = Math.random() * 0.3 + 0.1 // Reduced particle size
    }

    return { positions, colors, sizes }
  }, [effect])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    timeRef.current += delta

    const positions = pointsRef.current.geometry.attributes.position.array
    const colors = pointsRef.current.geometry.attributes.color.array

    for (let i = 0; i < effect.count; i++) {
      const i3 = i * 3

      switch (effect.type) {
        case "explosion":
          // Expand outward
          positions[i3] += (Math.random() - 0.5) * delta * 8 // Reduced speed
          positions[i3 + 1] += (Math.random() - 0.5) * delta * 8
          positions[i3 + 2] += (Math.random() - 0.5) * delta * 8

          // Fade out
          colors[i3] *= 0.98
          colors[i3 + 1] *= 0.98
          colors[i3 + 2] *= 0.98
          break

        case "spark":
          // Move upward with gravity
          positions[i3 + 1] += delta * 3 - timeRef.current * 1.5 // Reduced speed
          positions[i3] += (Math.random() - 0.5) * delta * 1.5
          positions[i3 + 2] += (Math.random() - 0.5) * delta * 1.5
          break

        case "collect":
          // Move toward center and up
          positions[i3] *= 0.95
          positions[i3 + 1] += delta * 2 // Reduced speed
          positions[i3 + 2] *= 0.95

          // Brighten
          colors[i3] = Math.min(1, colors[i3] * 1.02)
          colors[i3 + 1] = Math.min(1, colors[i3 + 1] * 1.02)
          colors[i3 + 2] = Math.min(1, colors[i3 + 2] * 1.02)
          break
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true

    // Remove effect after duration
    if (timeRef.current > (effect.duration || 1.5)) {
      onComplete()
    }
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={effect.count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={effect.count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={effect.count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <PointMaterial
        size={0.05} // Reduced size
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6} // Reduced opacity
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
