"use client"

import { useState, useRef, useEffect } from "react"
import { useGameStore } from "../store/gameStore"

export default function MiniMap() {
  const { mazeData, playerPosition, checkpoints } = useGameStore()
  const canvasRef = useRef(null)
  const [mapScale, setMapScale] = useState(1)
  const animationFrameRef = useRef()

  // Real-time map updates using requestAnimationFrame instead of useFrame
  useEffect(() => {
    const updateMap = () => {
      if (mazeData && playerPosition && canvasRef.current) {
        drawMap()
      }
      animationFrameRef.current = requestAnimationFrame(updateMap)
    }

    if (mazeData && playerPosition) {
      animationFrameRef.current = requestAnimationFrame(updateMap)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mazeData, playerPosition, checkpoints, mapScale])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas || !mazeData) return

    const ctx = canvas.getContext("2d")
    const mapSize = 240
    const padding = 10

    // Clear canvas with dark background
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, mapSize, mapSize)

    // Get maze dimensions
    const worldSize = 60 // Total world size (maze spans -30 to +30)
    const cellSize = (mapSize - padding * 2) / worldSize

    // Helper function to convert world coordinates to map coordinates
    const worldToMap = (worldX, worldZ) => {
      const mapX = ((worldX + worldSize / 2) / worldSize) * (mapSize - padding * 2) + padding
      const mapY = ((worldZ + worldSize / 2) / worldSize) * (mapSize - padding * 2) + padding
      return { x: mapX, y: mapY }
    }

    // Draw maze walls based on actual wall data
    if (mazeData.walls) {
      mazeData.walls.forEach((wall) => {
        const worldX = wall.position[0]
        const worldZ = wall.position[2]
        const sizeX = wall.size[0]
        const sizeZ = wall.size[2]

        const mapPos = worldToMap(worldX - sizeX / 2, worldZ - sizeZ / 2)
        const mapSize2 = worldToMap(worldX + sizeX / 2, worldZ + sizeZ / 2)

        // Different colors for different wall types
        if (wall.type === "outer") {
          ctx.fillStyle = "#4a5568"
        } else {
          ctx.fillStyle = "#2d3748"
        }

        ctx.fillRect(mapPos.x, mapPos.y, mapSize2.x - mapPos.x, mapSize2.y - mapPos.y)
      })
    }

    // Draw ground/path areas (areas without walls)
    ctx.fillStyle = "#0f4c3a"
    for (let x = padding; x < mapSize - padding; x += 2) {
      for (let y = padding; y < mapSize - padding; y += 2) {
        // Convert map coordinates back to world coordinates to check if it's a path
        const worldX = ((x - padding) / (mapSize - padding * 2)) * worldSize - worldSize / 2
        const worldZ = ((y - padding) / (mapSize - padding * 2)) * worldSize - worldSize / 2

        // Check if this position is not inside a wall
        let isWall = false
        if (mazeData.walls) {
          for (const wall of mazeData.walls) {
            const wallX = wall.position[0]
            const wallZ = wall.position[2]
            const sizeX = wall.size[0]
            const sizeZ = wall.size[2]

            if (
              worldX >= wallX - sizeX / 2 &&
              worldX <= wallX + sizeX / 2 &&
              worldZ >= wallZ - sizeZ / 2 &&
              worldZ <= wallZ + sizeZ / 2
            ) {
              isWall = true
              break
            }
          }
        }

        if (!isWall) {
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }

    // Draw start point
    if (mazeData.startPoint) {
      const startPos = worldToMap(mazeData.startPoint.x, mazeData.startPoint.z)
      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(startPos.x, startPos.y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Start label
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("S", startPos.x, startPos.y + 3)
    }

    // Draw end point
    if (mazeData.endPoint) {
      const endPos = worldToMap(mazeData.endPoint.x, mazeData.endPoint.z)
      ctx.fillStyle = "#ffd700"
      ctx.beginPath()
      ctx.arc(endPos.x, endPos.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      // End label
      ctx.fillStyle = "#000000"
      ctx.font = "bold 10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("F", endPos.x, endPos.y + 3)
    }

    // Draw checkpoints
    if (mazeData.checkpoints) {
      mazeData.checkpoints.forEach((checkpoint, index) => {
        const checkPos = worldToMap(checkpoint.x, checkpoint.z)

        // Check if checkpoint is collected
        const isCollected = checkpoints.includes(checkpoint.id)
        ctx.fillStyle = isCollected ? "#10b981" : "#3b82f6"

        ctx.beginPath()
        ctx.arc(checkPos.x, checkPos.y, 4, 0, 2 * Math.PI)
        ctx.fill()

        // Checkpoint number
        ctx.fillStyle = "#ffffff"
        ctx.font = "8px Arial"
        ctx.textAlign = "center"
        ctx.fillText(checkpoint.id.toString(), checkPos.x, checkPos.y + 2)
      })
    }

    // Draw player position with enhanced visualization
    if (playerPosition) {
      const playerPos = worldToMap(playerPosition.x, playerPosition.z)

      // Player shadow/glow
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      ctx.beginPath()
      ctx.arc(playerPos.x, playerPos.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Player dot
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(playerPos.x, playerPos.y, 5, 0, 2 * Math.PI)
      ctx.fill()

      // Player center
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(playerPos.x, playerPos.y, 2, 0, 2 * Math.PI)
      ctx.fill()

      // Player direction indicator (simple arrow pointing up)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(playerPos.x, playerPos.y - 2)
      ctx.lineTo(playerPos.x, playerPos.y - 8)
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(playerPos.x - 2, playerPos.y - 6)
      ctx.lineTo(playerPos.x, playerPos.y - 8)
      ctx.lineTo(playerPos.x + 2, playerPos.y - 6)
      ctx.stroke()
    }

    // Draw border
    ctx.strokeStyle = "#4a5568"
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, mapSize - 2, mapSize - 2)
  }

  if (!mazeData) {
    return (
      <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 w-72 border border-white/20 shadow-2xl">
        <div className="text-white text-sm font-bold mb-3 text-center">LOADING MAP...</div>
        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Generating Maze...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 w-72 border border-white/20 shadow-2xl">
      <div className="text-white text-sm font-bold mb-3 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        ENHANCED MAZE MAP
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={240}
          height={240}
          className="w-full h-60 border border-gray-500 bg-gray-900 rounded-lg"
        />

        {/* Map controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={() => setMapScale((prev) => Math.min(prev + 0.2, 2))}
            className="bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
          >
            +
          </button>
          <button
            onClick={() => setMapScale((prev) => Math.max(prev - 0.2, 0.5))}
            className="bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
          >
            -
          </button>
        </div>

        {/* Level indicator */}
        <div className="absolute top-2 left-2 text-xs text-white bg-black/60 rounded px-2 py-1">
          Level {mazeData.level}
        </div>
      </div>

      {/* Enhanced legend */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
          <span>You</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Finish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span>Checkpoint</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-800 rounded"></div>
          <span>Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span>Wall</span>
        </div>
      </div>

      {/* Real-time coordinates */}
      <div className="mt-2 text-xs text-gray-400 text-center font-mono">
        Position: ({playerPosition?.x?.toFixed(1) || 0}, {playerPosition?.z?.toFixed(1) || 0})
      </div>

      {/* Progress indicator */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Checkpoints: {checkpoints.length}/{mazeData.checkpoints?.length || 0}
      </div>
    </div>
  )
}
