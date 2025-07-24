"use client"

import { useEffect } from "react"
import { Box, Plane, Cylinder, Text } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { MazeGenerator } from "../utils/MazeGenerator"
import { useGameStore } from "../store/gameStore"

export default function MazeEnvironment({ level = 1 }) {
  const { mazeData, setMazeData, gameState } = useGameStore()

  // Generate maze data when level changes or when starting a new game
  useEffect(() => {
    if (gameState === "playing" && (!mazeData || mazeData.level !== level)) {
      const generator = new MazeGenerator(15, 15)
      generator.generateMaze()

      const newMazeData = {
        level,
        walls: generator.generateWalls(),
        startPoint: generator.getStartPosition(),
        endPoint: generator.getEndPosition(),
        checkpoints: generator.getCheckpoints(),
        mapLayout: generator.getMapLayout(),
      }

      setMazeData(newMazeData)
    }
  }, [level, gameState, mazeData, setMazeData])

  // Don't render anything until maze data is available
  if (!mazeData) {
    return null
  }

  return (
    <group>
      {/* ENHANCED GROUND with better textures */}
      <RigidBody type="fixed" name="ground" position={[0, 0, 0]}>
        <Plane args={[120, 120]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#0f4c3a" roughness={0.9} metalness={0.1} transparent={false} opacity={1} />
        </Plane>
        <CuboidCollider args={[60, 0.1, 60]} />
      </RigidBody>

      {/* DYNAMIC START POINT */}
      <group position={[mazeData.startPoint.x, mazeData.startPoint.y, mazeData.startPoint.z]}>
        <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.4} transparent opacity={0.8} />
        </mesh>

        {/* Animated start portal */}
        <Cylinder args={[2.5, 2.5, 0.2]} position={[0, -1.7, 0]}>
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} transparent opacity={0.7} />
        </Cylinder>

        <Text position={[0, 2.5, 0]} fontSize={1.2} color="#22c55e" anchorX="center" anchorY="middle" billboard>
          START
        </Text>

        <pointLight position={[0, 4, 0]} intensity={1.5} color="#22c55e" distance={12} />
      </group>

      {/* DYNAMIC END POINT with victory portal */}
      <group position={[mazeData.endPoint.x, mazeData.endPoint.y, mazeData.endPoint.z]}>
        <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} transparent opacity={0.9} />
        </mesh>

        {/* Epic victory portal with multiple layers */}
        <Cylinder args={[3.5, 3.5, 0.3]} position={[0, -1.6, 0]}>
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.8} transparent opacity={0.8} />
        </Cylinder>

        <Cylinder args={[3, 3, 0.4]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#ffed4e" emissive="#ffed4e" emissiveIntensity={0.6} transparent opacity={0.6} />
        </Cylinder>

        <Text position={[0, 3.5, 0]} fontSize={1.8} color="#ffd700" anchorX="center" anchorY="middle" billboard>
          FINISH
        </Text>

        {/* Multiple victory lights */}
        <pointLight position={[0, 6, 0]} intensity={2.5} color="#ffd700" distance={20} />
        <pointLight position={[4, 4, 0]} intensity={1.2} color="#ffd700" distance={10} />
        <pointLight position={[-4, 4, 0]} intensity={1.2} color="#ffd700" distance={10} />
        <pointLight position={[0, 4, 4]} intensity={1.2} color="#ffd700" distance={10} />
        <pointLight position={[0, 4, -4]} intensity={1.2} color="#ffd700" distance={10} />
      </group>

      {/* DYNAMIC CHECKPOINTS */}
      {mazeData.checkpoints.map((checkpoint, index) => (
        <group key={checkpoint.id} position={[checkpoint.x, checkpoint.y, checkpoint.z]}>
          <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>

          <Cylinder args={[1.8, 1.8, 0.1]} position={[0, -1.75, 0]}>
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </Cylinder>

          <Text position={[0, 1.5, 0]} fontSize={0.8} color="#3b82f6" anchorX="center" anchorY="middle" billboard>
            CHECKPOINT {checkpoint.id}
          </Text>

          <pointLight position={[0, 3, 0]} intensity={1} color="#3b82f6" distance={8} />
        </group>
      ))}

      {/* PROCEDURAL MAZE WALLS */}
      {mazeData.walls.map((wall, index) => (
        <RigidBody key={index} type="fixed" position={wall.position}>
          <Box args={wall.size} castShadow receiveShadow>
            <meshStandardMaterial color={wall.color} roughness={0.8} metalness={0.2} transparent={false} />
          </Box>
          <CuboidCollider args={wall.size.map((s) => s / 2)} />
        </RigidBody>
      ))}

      {/* ENHANCED DECORATIVE ELEMENTS */}
      <group position={[20, 1, 20]}>
        <Cylinder args={[0.4, 0.4, 5]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
        <mesh position={[0, 6, 0]}>
          <sphereGeometry args={[2]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>

      <group position={[-20, 1, 20]}>
        <Cylinder args={[0.4, 0.4, 5]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
        <mesh position={[0, 6, 0]}>
          <sphereGeometry args={[2]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>

      {/* AMBIENT MAZE LIGHTING */}
      <pointLight position={[0, 12, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[15, 8, -15]} intensity={0.4} color="#ffaa88" />
      <pointLight position={[-15, 8, -15]} intensity={0.4} color="#88aaff" />
      <pointLight position={[15, 8, 15]} intensity={0.4} color="#aaffaa" />
      <pointLight position={[-15, 8, 15]} intensity={0.4} color="#ffaaff" />
    </group>
  )
}
