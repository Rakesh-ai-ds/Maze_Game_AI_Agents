"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Sky, Environment, ContactShadows, Stars } from "@react-three/drei"
import Player from "./Player"
import MazeEnvironment from "./MazeEnvironment"
import PowerUps from "./PowerUps"
import ParticleSystem from "./ParticleSystem"
import SoundManager from "./SoundManager"
import PathVisualization from "./PathVisualization"
import { useGameStore } from "../store/gameStore"
import * as THREE from "three"

export default function GameScene() {
  const { camera, scene, gl } = useThree()
  const { gameState, currentLevel, mazeData } = useGameStore()
  const ambientRef = useRef()
  const directionalRef = useRef()
  const [showPathVisualization, setShowPathVisualization] = useState(false)

  useFrame((state, delta) => {
    if (gameState !== "playing") return

    // Professional dynamic lighting
    if (ambientRef.current) {
      const intensity = 0.4 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      ambientRef.current.intensity = intensity
    }

    if (directionalRef.current) {
      directionalRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 20
      directionalRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.1) * 20
    }
  })

  useEffect(() => {
    // Professional post-processing
    scene.fog = new THREE.Fog(0x1a1a2e, 30, 150)
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2
  }, [scene, gl])

  return (
    <>
      {/* Professional Lighting Setup */}
      <ambientLight ref={ambientRef} intensity={0.4} color="#e6f3ff" />

      <directionalLight
        ref={directionalRef}
        position={[20, 30, 20]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
        color="#ffffff"
      />

      {/* Rim lighting */}
      <directionalLight position={[-20, 20, -20]} intensity={0.8} color="#4a90e2" />

      {/* Professional Environment */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.1} azimuth={0.25} turbidity={10} rayleigh={2} />

      <Stars radius={300} depth={60} count={1000} factor={7} saturation={0.5} fade />

      <Environment preset="night" />

      {/* Professional Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={200}
        blur={2}
        far={20}
        resolution={512}
        color="#000000"
      />

      {/* Game Components - Only render when playing and maze data exists */}
      {gameState === "playing" && (
        <>
          <MazeEnvironment level={currentLevel} />
          {mazeData && (
            <>
              <Player />
              <PowerUps />
              {/* AI Pathfinding Visualization */}
              <PathVisualization showPath={showPathVisualization} pathColor="#00ff88" />
            </>
          )}
          <ParticleSystem />
        </>
      )}

      <SoundManager />
    </>
  )
}
