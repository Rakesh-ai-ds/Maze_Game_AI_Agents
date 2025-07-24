"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as THREE from "three"

interface PowerUp {
  id: string
  effect: string
  duration: number
  color: string
}

interface ParticleEffect {
  id: string
  position: THREE.Vector3
  type: "explosion" | "spark" | "collect"
  color?: string
  count: number
  duration?: number
}

interface PlayerStats {
  gamesPlayed: number
  totalScore: number
  bestScore: number
  totalTime: number
  powerUpsCollected: number
  mazesCompleted: number
}

interface MazeData {
  level: number
  walls: Array<{
    position: [number, number, number]
    size: [number, number, number]
    color: string
    type: string
  }>
  startPoint: { x: number; y: number; z: number }
  endPoint: { x: number; y: number; z: number }
  checkpoints: Array<{ x: number; y: number; z: number; id: number }>
  mapLayout: number[][]
}

interface GameState {
  // Game state
  gameState: "menu" | "playing" | "paused" | "gameOver" | "victory"
  score: number
  timeLeft: number
  currentLevel: number

  // Player and Maze
  playerPosition: THREE.Vector3
  playerStats: PlayerStats
  checkpoints: number[]
  mazeData: MazeData | null

  // Power-ups and effects
  activePowerUps: PowerUp[]
  particleEffects: ParticleEffect[]

  // Audio
  soundEnabled: boolean
  soundQueue: string[]

  // Actions
  setGameState: (state: string) => void
  addScore: (points: number) => void
  setTimeLeft: (time: number) => void
  setCurrentLevel: (level: number) => void
  setPlayerPosition: (position: THREE.Vector3) => void
  setMazeData: (data: MazeData) => void
  updatePlayerStats: (stats: Partial<PlayerStats>) => void
  addCheckpoint: (id: number) => void
  addPowerUp: (powerUp: PowerUp) => void
  removePowerUp: (id: string) => void
  addParticleEffect: (effect: Omit<ParticleEffect, "id">) => void
  removeParticleEffect: (id: string) => void
  playSound: (sound: string) => void
  clearSoundQueue: () => void
  toggleSound: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: "menu",
      score: 0,
      timeLeft: 300, // 5 minutes
      currentLevel: 1,

      playerPosition: new THREE.Vector3(0, 2, 12),
      checkpoints: [],
      mazeData: null,
      playerStats: {
        gamesPlayed: 0,
        totalScore: 0,
        bestScore: 0,
        totalTime: 0,
        powerUpsCollected: 0,
        mazesCompleted: 0,
      },

      activePowerUps: [],
      particleEffects: [],

      soundEnabled: true,
      soundQueue: [],

      // Actions
      setGameState: (gameState) => {
        console.log("Game state changed to:", gameState)
        set({ gameState })
      },

      addScore: (points) =>
        set((state) => {
          const newScore = state.score + points
          const newStats = {
            ...state.playerStats,
            totalScore: state.playerStats.totalScore + points,
            bestScore: Math.max(state.playerStats.bestScore, newScore),
          }
          return { score: newScore, playerStats: newStats }
        }),

      setTimeLeft: (timeLeft) => set({ timeLeft }),

      setCurrentLevel: (currentLevel) => set({ currentLevel }),

      setPlayerPosition: (playerPosition) => {
        // Create a new Vector3 to ensure reactivity
        const newPosition = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z)
        set({ playerPosition: newPosition })
      },

      setMazeData: (mazeData) => set({ mazeData }),

      updatePlayerStats: (stats) =>
        set((state) => ({
          playerStats: { ...state.playerStats, ...stats },
        })),

      addCheckpoint: (id) =>
        set((state) => ({
          checkpoints: [...state.checkpoints, id],
        })),

      addPowerUp: (powerUp) =>
        set((state) => {
          const filtered = state.activePowerUps.filter((p) => p.id !== powerUp.id)
          const newStats = {
            ...state.playerStats,
            powerUpsCollected: state.playerStats.powerUpsCollected + 1,
          }

          if (powerUp.duration > 0) {
            setTimeout(() => {
              get().removePowerUp(powerUp.id)
            }, powerUp.duration)
          }

          return {
            activePowerUps: [...filtered, powerUp],
            playerStats: newStats,
          }
        }),

      removePowerUp: (id) =>
        set((state) => ({
          activePowerUps: state.activePowerUps.filter((p) => p.id !== id),
        })),

      addParticleEffect: (effect) =>
        set((state) => {
          const newEffect = {
            ...effect,
            id: Math.random().toString(36).substr(2, 9),
          }
          return { particleEffects: [...state.particleEffects, newEffect] }
        }),

      removeParticleEffect: (id) =>
        set((state) => ({
          particleEffects: state.particleEffects.filter((e) => e.id !== id),
        })),

      playSound: (sound) =>
        set((state) => ({
          soundQueue: [...state.soundQueue, sound],
        })),

      clearSoundQueue: () => set({ soundQueue: [] }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      resetGame: () =>
        set((state) => {
          const wasVictory = state.gameState === "victory"
          const newStats = {
            ...state.playerStats,
            gamesPlayed: state.playerStats.gamesPlayed + 1,
            totalTime: state.playerStats.totalTime + (300 - state.timeLeft),
            mazesCompleted: wasVictory ? state.playerStats.mazesCompleted + 1 : state.playerStats.mazesCompleted,
          }

          return {
            gameState: "menu",
            score: 0,
            timeLeft: 300,
            currentLevel: 1,
            playerPosition: new THREE.Vector3(0, 2, 12),
            checkpoints: [],
            mazeData: null, // Reset maze data to generate new maze
            activePowerUps: [],
            particleEffects: [],
            soundQueue: [],
            playerStats: newStats,
          }
        }),
    }),
    {
      name: "maze-planet-game-storage",
      partialize: (state) => ({
        playerStats: state.playerStats,
        soundEnabled: state.soundEnabled,
      }),
    },
  ),
)
