"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls, PointerLockControls, Box, Plane } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import * as THREE from "three"
import { useGameStore } from "../store/gameStore"

export default function Player() {
  const { camera } = useThree()
  const playerRef = useRef()
  const controlsRef = useRef()
  const staminaBarRef = useRef()
  const [subscribeKeys, getKeys] = useKeyboardControls()

  const {
    gameState,
    activePowerUps,
    playSound,
    setGameState,
    addScore,
    addParticleEffect,
    checkpoints,
    addCheckpoint,
    mazeData,
    setPlayerPosition,
  } = useGameStore()

  const [isGrounded, setIsGrounded] = useState(false)
  const [stamina, setStamina] = useState(100)
  const [jumpCooldown, setJumpCooldown] = useState(0)
  const [footstepCooldown, setFootstepCooldown] = useState(0)

  // Use refs to track position without causing re-renders
  const lastPositionRef = useRef(new THREE.Vector3(0, 2, 12))
  const finishCheckedRef = useRef(false)
  const checkpointCheckedRef = useRef(new Set())

  // Reset flags when game starts
  useEffect(() => {
    if (gameState === "playing") {
      finishCheckedRef.current = false
      checkpointCheckedRef.current = new Set()
    }
  }, [gameState])

  // Reset player position when maze data changes
  useEffect(() => {
    if (mazeData && playerRef.current) {
      playerRef.current.setTranslation(
        {
          x: mazeData.startPoint.x,
          y: mazeData.startPoint.y + 3,
          z: mazeData.startPoint.z,
        },
        true,
      )
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  }, [mazeData])

  // Smooth professional player movement
  useFrame((state, delta) => {
    if (gameState !== "playing" || !playerRef.current || !mazeData) return

    const { forward, backward, leftward, rightward, jump, run } = getKeys()

    // Reduce cooldowns
    if (jumpCooldown > 0) setJumpCooldown(jumpCooldown - delta)
    if (footstepCooldown > 0) setFootstepCooldown(footstepCooldown - delta)

    // Enhanced movement speeds
    const baseSpeed = 6
    const runSpeed = 10
    const speed = run && stamina > 0 ? runSpeed : baseSpeed
    const jumpForce = 12

    // Enhanced stamina system
    if (run && (forward || backward || leftward || rightward)) {
      setStamina((prev) => Math.max(0, prev - delta * 15))
    } else {
      setStamina((prev) => Math.min(100, prev + delta * 20))
    }

    // Get current state
    const currentPos = playerRef.current.translation()
    const currentVel = playerRef.current.linvel()

    // Update position reference and store with more precision
    lastPositionRef.current.set(currentPos.x, currentPos.y, currentPos.z)

    // Update store position for map tracking - throttle updates to avoid performance issues
    if (state.clock.elapsedTime % 0.1 < delta) {
      setPlayerPosition(lastPositionRef.current.clone())
    }

    // Enhanced movement calculation
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, -1)
    const sideVector = new THREE.Vector3(-1, 0, 0)

    frontVector.applyQuaternion(camera.quaternion)
    sideVector.applyQuaternion(camera.quaternion)

    frontVector.y = 0
    sideVector.y = 0
    frontVector.normalize()
    sideVector.normalize()

    if (forward) direction.add(frontVector)
    if (backward) direction.sub(frontVector)
    if (leftward) direction.add(sideVector)
    if (rightward) direction.sub(sideVector)

    // Apply power-up effects
    let finalSpeed = speed
    activePowerUps.forEach((powerUp) => {
      if (powerUp.id === "speed") finalSpeed *= 2
    })

    direction.normalize().multiplyScalar(finalSpeed)

    // Enhanced movement application with better physics
    playerRef.current.setLinvel(
      {
        x: direction.x,
        y: currentVel.y,
        z: direction.z,
      },
      true,
    )

    // Enhanced footstep sounds
    if ((forward || backward || leftward || rightward) && isGrounded && footstepCooldown <= 0) {
      playSound("footstep")
      setFootstepCooldown(run ? 0.25 : 0.4)
    }

    // Enhanced jumping
    if (jump && isGrounded && jumpCooldown <= 0) {
      playerRef.current.setLinvel(
        {
          x: currentVel.x,
          y: jumpForce,
          z: currentVel.z,
        },
        true,
      )
      setIsGrounded(false)
      setJumpCooldown(0.5)
      playSound("jump")
    }

    // Professional camera following with smooth interpolation
    const targetCameraPos = new THREE.Vector3(currentPos.x, currentPos.y + 1.8, currentPos.z)
    camera.position.lerp(targetCameraPos, 0.2)

    // Dynamic finish line detection based on generated maze
    if (!finishCheckedRef.current && mazeData.endPoint) {
      const finishDistance = lastPositionRef.current.distanceTo(
        new THREE.Vector3(mazeData.endPoint.x, mazeData.endPoint.y, mazeData.endPoint.z),
      )
      if (finishDistance < 4) {
        finishCheckedRef.current = true
        console.log("FINISH LINE REACHED!")
        playSound("victory")
        addScore(1000 + stamina * 10) // Bonus for remaining stamina
        addParticleEffect({
          position: lastPositionRef.current.clone(),
          type: "explosion",
          count: 150,
          color: "#ffd700",
        })

        setTimeout(() => {
          setGameState("victory")
        }, 1000)
      }
    }

    // Dynamic checkpoint detection based on generated maze
    if (mazeData.checkpoints) {
      mazeData.checkpoints.forEach((checkpoint) => {
        if (!checkpointCheckedRef.current.has(checkpoint.id)) {
          const checkpointDistance = lastPositionRef.current.distanceTo(
            new THREE.Vector3(checkpoint.x, checkpoint.y, checkpoint.z),
          )
          if (checkpointDistance < 2.5) {
            checkpointCheckedRef.current.add(checkpoint.id)
            addCheckpoint(checkpoint.id)
            playSound("checkpoint")
            addScore(150)
            addParticleEffect({
              position: new THREE.Vector3(checkpoint.x, checkpoint.y, checkpoint.z),
              type: "collect",
              count: 50,
              color: "#3b82f6",
            })
          }
        }
      })
    }

    // Update stamina bar
    if (staminaBarRef.current && stamina < 100) {
      staminaBarRef.current.scale.x = stamina / 100
      staminaBarRef.current.material.color.setHex(stamina > 30 ? 0x22c55e : 0xef4444)
    }
  })

  const handleCollision = (event) => {
    if (event.other.rigidBodyObject?.name === "ground") {
      setIsGrounded(true)
    }
  }

  // Don't render player until maze data is available
  if (!mazeData) {
    return null
  }

  return (
    <group>
      <PointerLockControls ref={controlsRef} />

      <RigidBody
        ref={playerRef}
        position={[mazeData.startPoint.x, mazeData.startPoint.y + 3, mazeData.startPoint.z]}
        type="dynamic"
        colliders={false}
        mass={1}
        linearDamping={4}
        angularDamping={4}
        onCollisionEnter={handleCollision}
      >
        <CuboidCollider args={[0.4, 0.9, 0.4]} />
        <Box args={[0.8, 1.8, 0.8]} visible={false}>
          <meshStandardMaterial color="#4299e1" />
        </Box>
      </RigidBody>

      {/* Enhanced stamina bar */}
      {stamina < 100 && (
        <group position={[0, -0.4, -1.2]}>
          <Plane ref={staminaBarRef} args={[2, 0.1]}>
            <meshBasicMaterial color={stamina > 30 ? "#22c55e" : "#ef4444"} transparent opacity={0.9} />
          </Plane>
          <Plane args={[2, 0.1]} position={[0, 0, -0.01]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.3} />
          </Plane>
        </group>
      )}
    </group>
  )
}
