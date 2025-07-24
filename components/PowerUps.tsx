"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Box, Octahedron, Text } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import * as THREE from "three"
import { useGameStore } from "../store/gameStore"

const POWER_UPS = [
  {
    id: "speed",
    position: [8, 1, 8],
    color: "#ffeb3b",
    effect: "Speed Boost",
    duration: 10000,
    shape: "sphere",
  },
  {
    id: "jump",
    position: [-8, 1, 8],
    color: "#2196f3",
    effect: "Super Jump",
    duration: 15000,
    shape: "box",
  },
  {
    id: "magnet",
    position: [0, 1, -5],
    color: "#9c27b0",
    effect: "Ball Magnet",
    duration: 8000,
    shape: "octahedron",
  },
  {
    id: "time",
    position: [12, 1, -15],
    color: "#ff5722",
    effect: "Extra Time",
    duration: 0,
    shape: "sphere",
  },
  {
    id: "shield",
    position: [-12, 1, -15],
    color: "#4caf50",
    effect: "Shield",
    duration: 20000,
    shape: "box",
  },
]

function PowerUp({ powerUp, onCollect }) {
  const meshRef = useRef()
  const [collected, setCollected] = useState(false)
  const [respawnTimer, setRespawnTimer] = useState(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (!collected) {
      // Floating animation
      meshRef.current.position.y = powerUp.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3
      meshRef.current.rotation.y += delta * 2

      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      meshRef.current.scale.setScalar(scale)
    } else {
      // Respawn timer
      setRespawnTimer((prev) => {
        const newTimer = prev + delta * 1000
        if (newTimer >= 30000) {
          // Respawn after 30 seconds
          setCollected(false)
          return 0
        }
        return newTimer
      })
    }
  })

  const handleCollision = () => {
    if (!collected) {
      setCollected(true)
      onCollect(powerUp)
    }
  }

  if (collected) return null

  const renderShape = () => {
    const props = {
      ref: meshRef,
      args: [0.8],
      castShadow: true,
      receiveShadow: true,
    }

    const material = (
      <meshStandardMaterial
        color={powerUp.color}
        emissive={powerUp.color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.9}
      />
    )

    switch (powerUp.shape) {
      case "sphere":
        return <Sphere {...props}>{material}</Sphere>
      case "box":
        return <Box {...props}>{material}</Box>
      case "octahedron":
        return <Octahedron {...props}>{material}</Octahedron>
      default:
        return <Sphere {...props}>{material}</Sphere>
    }
  }

  return (
    <group position={powerUp.position}>
      <RigidBody type="kinematicPosition" sensor onIntersectionEnter={handleCollision}>
        {renderShape()}
        <CuboidCollider args={[1, 1, 1]} sensor />
      </RigidBody>

      {/* Power-up label */}
      <Text position={[0, 2, 0]} fontSize={0.4} color={powerUp.color} anchorX="center" anchorY="middle" billboard>
        {powerUp.effect}
      </Text>

      {/* Glow effect */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color={powerUp.color} distance={5} />
    </group>
  )
}

export default function PowerUps() {
  const { activePowerUps, addPowerUp, playSound, addParticleEffect } = useGameStore()

  const handlePowerUpCollect = (powerUp) => {
    addPowerUp(powerUp)
    playSound("powerup")

    addParticleEffect({
      position: new THREE.Vector3(...powerUp.position),
      type: "collect",
      color: powerUp.color,
      count: 20,
    })
  }

  return (
    <group>
      {POWER_UPS.map((powerUp) => (
        <PowerUp key={powerUp.id} powerUp={powerUp} onCollect={handlePowerUpCollect} />
      ))}
    </group>
  )
}
