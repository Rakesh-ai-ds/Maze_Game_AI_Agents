"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Sphere, Text } from "@react-three/drei"
import * as THREE from "three"
import { usePathfinding } from "../hooks/usePathfinding"

interface PathVisualizationProps {
  showPath: boolean
  pathColor?: string
}

export default function PathVisualization({ showPath, pathColor = "#00ff00" }: PathVisualizationProps) {
  const { pathResult, hasPath } = usePathfinding()
  const lineRef = useRef<THREE.Line>(null)
  const spheresRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    // Animate path line
    if (lineRef.current && hasPath) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }

    // Animate path spheres
    if (spheresRef.current && hasPath) {
      spheresRef.current.children.forEach((sphere, index) => {
        const offset = (state.clock.elapsedTime * 2 + index * 0.2) % (Math.PI * 2)
        sphere.position.y = 1 + Math.sin(offset) * 0.3
      })
    }
  })

  if (!showPath || !hasPath || !pathResult?.worldPath) {
    return null
  }

  // Convert path to THREE.js points
  const points = pathResult.worldPath.map((point) => new THREE.Vector3(point[0], point[1], point[2]))

  return (
    <group>
      {/* Path Line */}
      <Line ref={lineRef} points={points} color={pathColor} lineWidth={3} transparent opacity={0.8} />

      {/* Path Waypoints */}
      <group ref={spheresRef}>
        {pathResult.worldPath.map((point, index) => (
          <group key={index} position={[point[0], point[1], point[2]]}>
            <Sphere args={[0.2]} castShadow>
              <meshStandardMaterial
                color={pathColor}
                emissive={pathColor}
                emissiveIntensity={0.3}
                transparent
                opacity={0.8}
              />
            </Sphere>

            {/* Waypoint numbers */}
            {index % 5 === 0 && (
              <Text position={[0, 1, 0]} fontSize={0.3} color={pathColor} anchorX="center" anchorY="middle" billboard>
                {index}
              </Text>
            )}
          </group>
        ))}
      </group>

      {/* Path Info */}
      <Text position={[0, 8, 0]} fontSize={0.8} color={pathColor} anchorX="center" anchorY="middle" billboard>
        {`${pathResult.algorithm?.toUpperCase()} Path: ${pathResult.length} steps`}
      </Text>
    </group>
  )
}
