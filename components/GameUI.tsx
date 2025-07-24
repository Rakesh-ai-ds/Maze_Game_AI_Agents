"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Trophy, Target, Clock, Map, Route } from "lucide-react"
import { useGameStore } from "../store/gameStore"
import MiniMap from "./MiniMap"
import PathfindingUI from "./PathfindingUI"

export default function GameUI() {
  const {
    gameState,
    score,
    timeLeft,
    currentLevel,
    activePowerUps,
    checkpoints,
    setGameState,
    resetGame,
    toggleSound,
    soundEnabled,
    setTimeLeft,
    mazeData,
  } = useGameStore()

  const [showInstructions, setShowInstructions] = useState(false)
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [showPathfinding, setShowPathfinding] = useState(false)
  const [pathVisualizationVisible, setPathVisualizationVisible] = useState(false)

  // Professional game timer
  useEffect(() => {
    let interval
    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft <= 0 && gameState === "playing") {
      setGameState("gameOver")
    }

    return () => clearInterval(interval)
  }, [gameState, timeLeft, setTimeLeft, setGameState])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft < 60) return "text-red-400"
    if (timeLeft < 120) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Professional Main Menu */}
      <AnimatePresence>
        {gameState === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white max-w-lg mx-auto p-8">
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="mb-8"
              >
                <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  MAZE PLANET
                </h1>
                <div className="text-2xl font-light text-gray-300">3D AI-POWERED NAVIGATION</div>
              </motion.div>

              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl mb-8 text-gray-300 leading-relaxed"
              >
                Navigate through mysterious 3D mazes with AI-powered pathfinding assistance!
              </motion.p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setGameState("playing")}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Play size={28} />
                  START AI ADVENTURE
                </button>

                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  HOW TO PLAY
                </button>

                <button
                  onClick={toggleSound}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105"
                >
                  {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  {soundEnabled ? "SOUND ON" : "SOUND OFF"}
                </button>
              </motion.div>

              <AnimatePresence>
                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    className="mt-8 p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <h3 className="font-bold mb-4 text-cyan-400 text-lg">CONTROLS & AI FEATURES</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                      <div>• WASD - Move</div>
                      <div>• Mouse - Look Around</div>
                      <div>• Space - Jump</div>
                      <div>• Shift - Sprint</div>
                    </div>
                    <h3 className="font-bold mb-3 text-cyan-400 text-lg">AI PATHFINDING</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Use the AI Pathfinding panel to find the optimal route through the maze using advanced algorithms
                      like A*, Dijkstra, or BFS.
                    </p>
                    <h3 className="font-bold mb-3 text-cyan-400 text-lg">OBJECTIVE</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Navigate from the green START area through the maze to reach the golden FINISH area. Use AI
                      assistance to find the shortest path!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Game HUD */}
      {gameState === "playing" && (
        <>
          {/* Top Professional HUD */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-auto">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-3">
                <Trophy className="text-yellow-400" size={24} />
                <div className="text-3xl font-bold text-yellow-400">{score.toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <Target className="text-blue-400" size={20} />
                <div className="text-lg">Level {currentLevel}</div>
              </div>

              <div className="flex items-center gap-4">
                <Clock className={getTimeColor()} size={20} />
                <div className={`text-lg font-mono ${getTimeColor()}`}>{formatTime(timeLeft)}</div>
              </div>

              <div className="mt-3 text-sm text-gray-400">
                Checkpoints: {checkpoints.length}/{mazeData?.checkpoints?.length || 0}
              </div>
            </motion.div>

            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex gap-3">
              <button
                onClick={() => setShowPathfinding(!showPathfinding)}
                className={`${showPathfinding ? "bg-green-600/60" : "bg-black/60"} backdrop-blur-lg hover:bg-black/80 text-white p-4 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <Route size={24} />
              </button>

              <button
                onClick={() => setShowMiniMap(!showMiniMap)}
                className={`${showMiniMap ? "bg-blue-600/60" : "bg-black/60"} backdrop-blur-lg hover:bg-black/80 text-white p-4 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <Map size={24} />
              </button>

              <button
                onClick={() => setGameState("paused")}
                className="bg-black/60 backdrop-blur-lg hover:bg-black/80 text-white p-4 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Pause size={24} />
              </button>

              <button
                onClick={resetGame}
                className="bg-black/60 backdrop-blur-lg hover:bg-black/80 text-white p-4 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RotateCcw size={24} />
              </button>
            </motion.div>
          </div>

          {/* AI Pathfinding Panel */}
          {showPathfinding && <PathfindingUI onPathVisibilityChange={setPathVisualizationVisible} />}

          {/* Professional Power-ups Display */}
          {activePowerUps.length > 0 && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-auto"
            >
              <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
                <div className="text-white text-sm font-semibold mb-3 text-center">ACTIVE POWERS</div>
                <div className="flex gap-3">
                  {activePowerUps.map((powerUp) => (
                    <div
                      key={powerUp.id}
                      className="text-white px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-lg"
                      style={{
                        backgroundColor: powerUp.color + "40",
                        borderColor: powerUp.color,
                        boxShadow: `0 0 20px ${powerUp.color}40`,
                      }}
                    >
                      {powerUp.effect}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Professional Crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-6 h-6 border-2 border-white rounded-full opacity-60 shadow-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-80"></div>
          </div>

          {/* Enhanced Mini-map with toggle */}
          {showMiniMap && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="absolute bottom-6 right-6 pointer-events-auto"
            >
              <MiniMap />
            </motion.div>
          )}

          {/* Professional Objective Display */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 pointer-events-auto"
          >
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 text-white border border-white/20 shadow-2xl max-w-xs">
              <div className="font-bold mb-2 text-cyan-400">OBJECTIVE</div>
              <div className="text-sm leading-relaxed">
                Navigate to the <span className="text-yellow-400 font-semibold">golden finish area</span> to complete
                the maze!
              </div>
              <div className="mt-3 text-xs text-gray-400">Use AI pathfinding for optimal routes</div>
            </div>
          </motion.div>
        </>
      )}

      {/* Rest of the game states remain the same... */}
      <AnimatePresence>
        {gameState === "victory" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-yellow-900/90 via-orange-900/90 to-red-900/90 flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white max-w-lg mx-auto p-8">
              <motion.div
                initial={{ y: -100, rotate: -180 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Trophy size={120} className="text-yellow-400 mx-auto mb-6" />
              </motion.div>

              <motion.h2
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-7xl font-bold mb-6 text-yellow-400"
              >
                VICTORY!
              </motion.h2>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                <div className="text-3xl font-bold text-green-400">Score: {score.toLocaleString()}</div>
                <div className="text-xl text-gray-300">Level {currentLevel} Completed</div>
                <div className="text-xl text-gray-300">Time: {formatTime(300 - timeLeft)}</div>
                <div className="text-lg text-blue-400">
                  Checkpoints: {checkpoints.length}/{mazeData?.checkpoints?.length || 0}
                </div>
                <div className="text-lg text-cyan-400">AI-Assisted Navigation Complete!</div>
              </motion.div>

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  PLAY AGAIN
                </button>

                <button
                  onClick={() => setGameState("menu")}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  MAIN MENU
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "paused" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white">
              <h2 className="text-5xl font-bold mb-8">GAME PAUSED</h2>
              <div className="space-y-4">
                <button
                  onClick={() => setGameState("playing")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Play size={24} />
                  RESUME
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300"
                >
                  MAIN MENU
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "gameOver" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-red-900/90 to-gray-900/90 flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white max-w-md mx-auto p-8">
              <h2 className="text-6xl font-bold mb-6 text-red-400">TIME'S UP!</h2>
              <p className="text-2xl mb-4">Final Score: {score.toLocaleString()}</p>
              <p className="text-lg mb-8 text-gray-300">Try using AI pathfinding next time!</p>
              <div className="space-y-4">
                <button
                  onClick={resetGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300"
                >
                  TRY AGAIN
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300"
                >
                  MAIN MENU
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
