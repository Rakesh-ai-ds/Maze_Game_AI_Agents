"use client"

import { useState, useCallback } from "react"
import { useGameStore } from "../store/gameStore"

interface PathfindingResult {
  algorithm: string
  path?: number[][]
  worldPath?: number[][]
  gridPath?: number[][]
  length?: number
  success: boolean
  cost?: number
  error?: string
}

export function usePathfinding() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [pathResult, setPathResult] = useState<PathfindingResult | null>(null)
  const { mazeData, playerPosition } = useGameStore()

  const findPath = useCallback(
    async (algorithm: "bfs" | "astar" | "dijkstra" = "astar"): Promise<PathfindingResult | null> => {
      if (!mazeData || !playerPosition) {
        console.error("Maze data or player position not available")
        return null
      }

      setIsCalculating(true)

      try {
        // Prepare data for Python script
        const inputData = {
          maze: mazeData.mapLayout,
          start: [playerPosition.x, playerPosition.z],
          end: [mazeData.endPoint.x, mazeData.endPoint.z],
          algorithm: algorithm,
        }

        // Call Python pathfinding script
        const response = await fetch("/api/pathfinding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: PathfindingResult = await response.json()
        setPathResult(result)

        return result
      } catch (error) {
        console.error("Pathfinding error:", error)
        const errorResult: PathfindingResult = {
          algorithm,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
        setPathResult(errorResult)
        return errorResult
      } finally {
        setIsCalculating(false)
      }
    },
    [mazeData, playerPosition],
  )

  const clearPath = useCallback(() => {
    setPathResult(null)
  }, [])

  return {
    findPath,
    clearPath,
    isCalculating,
    pathResult,
    hasPath: pathResult?.success && pathResult?.worldPath,
  }
}
