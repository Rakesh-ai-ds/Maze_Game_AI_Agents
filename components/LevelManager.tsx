"use client"

import { useEffect } from "react"
import { useGameStore } from "../store/gameStore"

export default function LevelManager() {
  const { score, currentLevel, setCurrentLevel, playSound, addParticleEffect, playerPosition } = useGameStore()

  useEffect(() => {
    // Level progression based on score
    const newLevel = Math.floor(score / 500) + 1

    if (newLevel > currentLevel && newLevel <= 5) {
      setCurrentLevel(newLevel)
      playSound("levelUp")

      // Level up particle effect
      addParticleEffect({
        position: playerPosition,
        type: "explosion",
        color: "#ffd700",
        count: 100,
        duration: 3,
      })
    }
  }, [score, currentLevel, setCurrentLevel, playSound, addParticleEffect, playerPosition])

  return null
}
