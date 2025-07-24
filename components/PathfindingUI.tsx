"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Route, Zap, Target, AlertCircle } from "lucide-react"
import { usePathfinding } from "../hooks/usePathfinding"

interface PathfindingUIProps {
  onPathVisibilityChange: (visible: boolean) => void
}

export default function PathfindingUI({ onPathVisibilityChange }: PathfindingUIProps) {
  const { findPath, clearPath, isCalculating, pathResult, hasPath } = usePathfinding()
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"bfs" | "astar" | "dijkstra">("astar")
  const [showPath, setShowPath] = useState(false)

  const handleFindPath = async () => {
    const result = await findPath(selectedAlgorithm)
    if (result?.success) {
      setShowPath(true)
      onPathVisibilityChange(true)
    }
  }

  const handleClearPath = () => {
    clearPath()
    setShowPath(false)
    onPathVisibilityChange(false)
  }

  const togglePathVisibility = () => {
    const newVisibility = !showPath
    setShowPath(newVisibility)
    onPathVisibilityChange(newVisibility)
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-32 left-6 pointer-events-auto"
    >
      <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 text-white border border-white/20 shadow-2xl max-w-xs">
        <div className="flex items-center gap-2 mb-4">
          <Route className="text-cyan-400" size={20} />
          <h3 className="font-bold text-cyan-400">AI PATHFINDING</h3>
        </div>

        {/* Algorithm Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Algorithm:</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
            disabled={isCalculating}
          >
            <option value="astar">A* (Optimal & Fast)</option>
            <option value="dijkstra">Dijkstra (Guaranteed Optimal)</option>
            <option value="bfs">BFS (Simple & Reliable)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-4">
          <button
            onClick={handleFindPath}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Target size={16} />
                Find Shortest Path
              </>
            )}
          </button>

          {hasPath && (
            <div className="flex gap-2">
              <button
                onClick={togglePathVisibility}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                {showPath ? "Hide Path" : "Show Path"}
              </button>

              <button
                onClick={handleClearPath}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                Clear Path
              </button>
            </div>
          )}
        </div>

        {/* Path Results */}
        <AnimatePresence>
          {pathResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-600 pt-3"
            >
              {pathResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <Zap size={16} />
                    <span className="font-semibold">Path Found!</span>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Algorithm:</span>
                      <span className="font-mono">{pathResult.algorithm}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Steps:</span>
                      <span className="font-mono">{pathResult.length}</span>
                    </div>

                    {pathResult.cost !== undefined && (
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-mono">{pathResult.cost.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle size={16} />
                  <span className="text-sm">{pathResult.error || "No path found"}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Algorithm Info */}
        <div className="mt-4 text-xs text-gray-400">
          <div className="font-semibold mb-1">Algorithm Info:</div>
          {selectedAlgorithm === "astar" && (
            <div>A*: Uses heuristics for optimal pathfinding with good performance.</div>
          )}
          {selectedAlgorithm === "dijkstra" && <div>Dijkstra: Guarantees shortest path but slower than A*.</div>}
          {selectedAlgorithm === "bfs" && <div>BFS: Simple breadth-first search, good for unweighted graphs.</div>}
        </div>
      </div>
    </motion.div>
  )
}
