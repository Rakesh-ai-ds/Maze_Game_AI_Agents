"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Text, Cylinder } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"

export default function Goals() {
  const goalRef = useRef()
  const netRef = useRef()

  useFrame((state) => {
    // Animated goal net
    if (netRef.current) {
      netRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group>
      {/* Main Goal - positioned at the end of the maze */}
      <group position={[0, 0, -30]}>
        {/* Goal posts */}
        <RigidBody type="fixed" position={[-4, 2.5, 0]}>
          <Cylinder args={[0.1, 0.1, 5]} castShadow>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          <CuboidCollider args={[0.1, 2.5, 0.1]} />
        </RigidBody>

        <RigidBody type="fixed" position={[4, 2.5, 0]}>
          <Cylinder args={[0.1, 0.1, 5]} castShadow>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          <CuboidCollider args={[0.1, 2.5, 0.1]} />
        </RigidBody>

        {/* Crossbar */}
        <RigidBody type="fixed" position={[0, 5, 0]}>
          <Cylinder args={[0.1, 0.1, 8.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          <CuboidCollider args={[4.1, 0.1, 0.1]} />
        </RigidBody>

        {/* Goal net */}
        <mesh ref={netRef} position={[0, 2.5, 0.5]}>
          <boxGeometry args={[8, 5, 1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} wireframe />
        </mesh>

        {/* Goal area marking */}
        <mesh position={[0, 0.1, 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial color="#ffd700" transparent opacity={0.4} />
        </mesh>

        {/* Goal detection area */}
        <mesh position={[0, 2.5, 1]} visible={false}>
          <boxGeometry args={[8, 5, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Goal text */}
        <Text
          position={[0, 6, 0]}
          fontSize={1.5}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          GOAL
        </Text>

        {/* Goal lights */}
        <pointLight position={[-5, 6, 2]} intensity={0.8} color="#ffd700" />
        <pointLight position={[5, 6, 2]} intensity={0.8} color="#ffd700" />
        <pointLight position={[0, 7, 2]} intensity={1.2} color="#ffd700" />
      </group>

      {/* Side bonus goals for extra points */}
      <group position={[12, 0, -15]}>
        <RigidBody type="fixed">
          <Box args={[1, 3, 3]} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.2} />
          </Box>
          <CuboidCollider args={[0.5, 1.5, 1.5]} />
        </RigidBody>

        <Text position={[0, 4, 0]} fontSize={0.8} color="#ff6b6b" anchorX="center" anchorY="middle">
          BONUS +50
        </Text>
      </group>

      <group position={[-12, 0, -15]}>
        <RigidBody type="fixed">
          <Box args={[1, 3, 3]} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color="#4ecdc4" emissive="#4ecdc4" emissiveIntensity={0.2} />
          </Box>
          <CuboidCollider args={[0.5, 1.5, 1.5]} />
        </RigidBody>

        <Text position={[0, 4, 0]} fontSize={0.8} color="#4ecdc4" anchorX="center" anchorY="middle">
          BONUS +50
        </Text>
      </group>
    </group>
  )
}
