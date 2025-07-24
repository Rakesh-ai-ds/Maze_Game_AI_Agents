"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { KeyboardControls } from "@react-three/drei"
import GameScene from "./GameScene"
import GameUI from "./GameUI"
import { useGameStore } from "../store/gameStore"

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action", keys: ["KeyE"] },
]

export default function MazePlanet3D() {
  const { gameState } = useGameStore()

  return (
    <div className="relative w-full h-full min-h-screen min-w-full bg-gradient-to-b from-blue-900 to-purple-900 overflow-hidden">
      {/* UI Layer - overlays the canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <GameUI />
      </div>

      {/* 3D Game Layer fills parent */}
      <div className="absolute inset-0 z-0">
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{
              fov: 75,
              near: 0.1,
              far: 1000,
              position: [0, 5, 10],
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
            }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <Physics gravity={[0, -30, 0]} debug={false}>
                <GameScene />
              </Physics>
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </div>
    </div>
  )
}
