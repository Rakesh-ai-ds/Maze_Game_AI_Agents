"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Trail } from "@react-three/drei"
import { RigidBody, BallCollider } from "@react-three/rapier"
import * as THREE from "three"
import { useGameStore } from "../store/gameStore"

export default function Football() {
  const ballRef = useRef()
  const [ballPosition, setBallPosition] = useState(new THREE.Vector3(0, 2, 0))
  const [isMoving, setIsMoving] = useState(false)
  const [goalCooldown, setGoalCooldown] = useState(0)
  const [kickCooldown, setKickCooldown] = useState(0)

  const { playerPosition, addScore, playSound, addParticleEffect, setGameState, gameState } = useGameStore()

  let speed = 0 // Declare speed variable

  useFrame((state, delta) => {
    if (!ballRef.current || gameState !== "playing") return

    const ballPos = ballRef.current.translation()
    const ballVel = ballRef.current.linvel()

    setBallPosition(new THREE.Vector3(ballPos.x, ballPos.y, ballPos.z))

    speed = Math.sqrt(ballVel.x ** 2 + ballVel.y ** 2 + ballVel.z ** 2) // Assign speed value
    setIsMoving(speed > 0.5)

    // Reduce cooldowns
    if (goalCooldown > 0) {
      setGoalCooldown(goalCooldown - delta)
    }
    if (kickCooldown > 0) {
      setKickCooldown(kickCooldown - delta)
    }

    // Ball glow effect when moving fast
    if (speed > 5) {
      addParticleEffect({
        position: new THREE.Vector3(ballPos.x, ballPos.y, ballPos.z),
        type: "spark",
        count: 2,
      })
    }

    // FIXED GOAL DETECTION - More precise boundaries
    if (
      ballPos.z < -28 && // Goal Z position
      ballPos.z > -32 && // Goal depth
      Math.abs(ballPos.x) < 4 && // Goal width
      ballPos.y < 5 && // Goal height
      ballPos.y > 0 && // Above ground
      goalCooldown <= 0 // Prevent multiple triggers
    ) {
      handleGoal()
    }

    // Reset ball if it falls off the world
    if (ballPos.y < -10) {
      resetBall()
    }

    // IMPROVED Player interaction with ball - more responsive
    const distanceToPlayer = playerPosition.distanceTo(new THREE.Vector3(ballPos.x, ballPos.y, ballPos.z))

    if (distanceToPlayer < 1.5 && kickCooldown <= 0) {
      // Apply force when player is near - reduced force for better control
      const direction = new THREE.Vector3(ballPos.x, ballPos.y, ballPos.z)
        .sub(playerPosition)
        .normalize()
        .multiplyScalar(3) // Reduced from 5

      ballRef.current.applyImpulse(direction, true)

      // Play kick sound with cooldown to prevent spam
      playSound("kick")
      setKickCooldown(0.2) // 200ms cooldown
    }
  })

  const handleGoal = () => {
    console.log("GOAL SCORED!") // Debug log
    addScore(100)
    playSound("goal")
    addParticleEffect({
      position: ballPosition,
      type: "explosion",
      count: 50,
    })

    // Set cooldown to prevent multiple triggers
    setGoalCooldown(2)

    // TRIGGER GAME COMPLETION
    setTimeout(() => {
      setGameState("gameOver")
    }, 2000) // 2 second delay for celebration

    resetBall()
  }

  const resetBall = () => {
    if (ballRef.current) {
      ballRef.current.setTranslation({ x: 0, y: 3, z: 5 }, true)
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      ballRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }
  }

  return (
    <group>
      <RigidBody
        ref={ballRef}
        position={[0, 3, 5]}
        type="dynamic"
        colliders={false}
        mass={0.3} // Reduced mass for easier control
        restitution={0.6} // Reduced bounce
        friction={0.8} // Increased friction
        linearDamping={0.3} // Increased damping for better control
        angularDamping={0.3}
      >
        <BallCollider args={[0.5]} />

        <Sphere args={[0.5]} castShadow receiveShadow>
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.1}
            emissive={isMoving ? "#ffffff" : "#000000"}
            emissiveIntensity={isMoving ? 0.05 : 0} // Reduced intensity
          />
        </Sphere>

        {/* Soccer ball pattern */}
        <Sphere args={[0.51]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.2} wireframe />
        </Sphere>
      </RigidBody>

      {/* Ball trail effect - reduced intensity */}
      {isMoving && speed > 3 && (
        <Trail width={0.2} length={3} color="#ffffff" attenuation={(t) => t * t}>
          <mesh position={ballPosition.toArray()}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </Trail>
      )}
    </group>
  )
}
