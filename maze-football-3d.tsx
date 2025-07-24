"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Box, Sphere, Plane, KeyboardControls, useKeyboardControls, Sky, Text } from "@react-three/drei"
import { PointerLockControls } from "@react-three/drei"
import * as THREE from "three"
import { RigidBody, Physics, CuboidCollider } from "@react-three/rapier"

export default function Component() {
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <div className="w-full h-screen relative">
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Maze Football 3D</h1>
            <p className="text-lg mb-6">Navigate through the maze and score goals!</p>
            <p className="text-sm mb-4">Use WASD to move, Space to jump, Mouse to look around</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 text-white text-xl font-bold">Score: {score}</div>

      {gameStarted && (
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "w", "W"] },
            { name: "backward", keys: ["ArrowDown", "s", "S"] },
            { name: "left", keys: ["ArrowLeft", "a", "A"] },
            { name: "right", keys: ["ArrowRight", "d", "D"] },
            { name: "jump", keys: ["Space"] },
          ]}
        >
          <Game score={score} setScore={setScore} />
        </KeyboardControls>
      )}
    </div>
  )
}

function Player({ position, setPosition }) {
  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()
  const playerRef = useRef()
  const jumpVelocity = useRef(0)
  const isJumping = useRef(false)

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = getKeys()
    const speed = 8
    const direction = new THREE.Vector3()

    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const rightVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)

    if (forward) direction.add(forwardVector)
    if (backward) direction.sub(forwardVector)
    if (left) direction.sub(rightVector)
    if (right) direction.add(rightVector)

    direction.y = 0
    direction.normalize().multiplyScalar(speed * delta)

    const newPosition = position.clone().add(direction)

    if (jump && !isJumping.current && position.y <= 2) {
      jumpVelocity.current = 0.2
      isJumping.current = true
    }

    if (isJumping.current) {
      newPosition.y += jumpVelocity.current
      jumpVelocity.current -= 0.01

      if (newPosition.y <= 2) {
        newPosition.y = 2
        isJumping.current = false
      }
    }

    setPosition(newPosition)
    camera.position.copy(newPosition)
  })

  return (
    <RigidBody ref={playerRef} position={position.toArray()} type="kinematicPosition">
      <CuboidCollider args={[0.5, 1, 0.5]} />
    </RigidBody>
  )
}

function Football({ position, onGoalScore }) {
  const ballRef = useRef()
  const [ballPosition, setBallPosition] = useState(new THREE.Vector3(0, 1, 0))

  useFrame(() => {
    if (ballRef.current) {
      const ballPos = ballRef.current.translation()
      setBallPosition(new THREE.Vector3(ballPos.x, ballPos.y, ballPos.z))

      // Check if ball is in goal area
      if (ballPos.z < -18 && Math.abs(ballPos.x) < 3 && ballPos.y < 4) {
        onGoalScore()
        // Reset ball position
        ballRef.current.setTranslation({ x: 0, y: 2, z: 0 }, true)
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
    }
  })

  return (
    <RigidBody ref={ballRef} position={[0, 2, 0]} restitution={0.8} friction={0.3}>
      <Sphere args={[0.5]} castShadow>
        <meshStandardMaterial color="#ffffff" />
        <meshStandardMaterial color="#000000" transparent opacity={0.1} />
      </Sphere>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  )
}

function MazeWalls() {
  const walls = [
    // Outer walls
    { position: [0, 2, 10], size: [20, 4, 1] },
    { position: [0, 2, -20], size: [20, 4, 1] },
    { position: [10, 2, -5], size: [1, 4, 15] },
    { position: [-10, 2, -5], size: [1, 4, 15] },

    // Inner maze walls
    { position: [5, 2, 5], size: [1, 4, 8] },
    { position: [-5, 2, 5], size: [1, 4, 8] },
    { position: [0, 2, 0], size: [8, 4, 1] },
    { position: [7, 2, -5], size: [6, 4, 1] },
    { position: [-7, 2, -5], size: [6, 4, 1] },
    { position: [3, 2, -10], size: [1, 4, 6] },
    { position: [-3, 2, -10], size: [1, 4, 6] },
  ]

  return (
    <>
      {walls.map((wall, index) => (
        <RigidBody key={index} type="fixed" position={wall.position}>
          <Box args={wall.size} castShadow receiveShadow>
            <meshStandardMaterial color="#4a5568" />
          </Box>
          <CuboidCollider args={wall.size.map((s) => s / 2)} />
        </RigidBody>
      ))}
    </>
  )
}

function Goal() {
  return (
    <group position={[0, 0, -19]}>
      {/* Goal posts */}
      <RigidBody type="fixed" position={[-3, 2, 0]}>
        <Box args={[0.2, 4, 0.2]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <CuboidCollider args={[0.1, 2, 0.1]} />
      </RigidBody>

      <RigidBody type="fixed" position={[3, 2, 0]}>
        <Box args={[0.2, 4, 0.2]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <CuboidCollider args={[0.1, 2, 0.1]} />
      </RigidBody>

      <RigidBody type="fixed" position={[0, 4, 0]}>
        <Box args={[6.4, 0.2, 0.2]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <CuboidCollider args={[3.2, 0.1, 0.1]} />
      </RigidBody>

      {/* Goal area indicator */}
      <mesh position={[0, 0.1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 2]} />
        <meshStandardMaterial color="#22c55e" transparent opacity={0.3} />
      </mesh>

      <Text position={[0, 5, 0]} fontSize={1} color="#ffffff" anchorX="center" anchorY="middle">
        GOAL
      </Text>
    </group>
  )
}

function Game({ score, setScore }) {
  const [position, setPosition] = useState(new THREE.Vector3(0, 2, 8))

  const handleGoalScore = () => {
    setScore((prev) => prev + 1)
  }

  return (
    <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
      <Physics gravity={[0, -20, 0]}>
        <PointerLockControls />

        <Sky sunPosition={[100, 20, 100]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Ground */}
        <RigidBody type="fixed" position={[0, 0, -5]}>
          <Plane args={[40, 40]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <meshStandardMaterial color="#22c55e" />
          </Plane>
          <CuboidCollider args={[20, 0.1, 20]} />
        </RigidBody>

        <Player position={position} setPosition={setPosition} />
        <Football onGoalScore={handleGoalScore} />
        <MazeWalls />
        <Goal />

        {/* Start area marker */}
        <mesh position={[0, 0.2, 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>

        <Text position={[0, 3, 8]} fontSize={0.8} color="#ffffff" anchorX="center" anchorY="middle">
          START
        </Text>
      </Physics>
    </Canvas>
  )
}
