"use client"

import { useEffect, useRef } from "react"
import { useGameStore } from "../store/gameStore"

export default function SoundManager() {
  const { soundQueue, clearSoundQueue, soundEnabled } = useGameStore()
  const audioContextRef = useRef(null)
  const soundsRef = useRef({})
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined" && soundEnabled && !isInitializedRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (AudioContext) {
          audioContextRef.current = new AudioContext()
          isInitializedRef.current = true

          const createSound = (frequency, duration, type = "sine", volume = 0.1) => {
            if (!audioContextRef.current || audioContextRef.current.state === "closed") return

            try {
              const oscillator = audioContextRef.current.createOscillator()
              const gainNode = audioContextRef.current.createGain()

              oscillator.connect(gainNode)
              gainNode.connect(audioContextRef.current.destination)

              oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
              oscillator.type = type

              gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

              oscillator.start(audioContextRef.current.currentTime)
              oscillator.stop(audioContextRef.current.currentTime + duration)
            } catch (error) {
              console.warn("Audio playback failed:", error)
            }
          }

          soundsRef.current = {
            victory: () => {
              // Epic victory fanfare
              createSound(523, 0.3, "square", 0.15) // C5
              setTimeout(() => createSound(659, 0.3, "square", 0.15), 150) // E5
              setTimeout(() => createSound(784, 0.3, "square", 0.15), 300) // G5
              setTimeout(() => createSound(1047, 0.5, "square", 0.15), 450) // C6
            },
            checkpoint: () => {
              // Checkpoint collection sound
              createSound(440, 0.15, "sine", 0.1) // A4
              setTimeout(() => createSound(554, 0.15, "sine", 0.1), 75) // C#5
              setTimeout(() => createSound(659, 0.2, "sine", 0.1), 150) // E5
            },
            jump: () => {
              createSound(330, 0.1, "triangle", 0.08) // E4
            },
            footstep: () => {
              createSound(120, 0.05, "sawtooth", 0.05)
            },
            powerup: () => {
              createSound(440, 0.1, "sine", 0.1)
              setTimeout(() => createSound(554, 0.1, "sine", 0.1), 50)
              setTimeout(() => createSound(659, 0.2, "sine", 0.1), 100)
            },
          }
        }
      } catch (error) {
        console.warn("Failed to initialize audio:", error)
      }
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close()
        } catch (error) {
          console.warn("Failed to close audio context:", error)
        }
      }
      isInitializedRef.current = false
    }
  }, [soundEnabled])

  useEffect(() => {
    if (soundQueue.length > 0 && soundEnabled && soundsRef.current) {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }

      soundQueue.forEach((sound) => {
        if (soundsRef.current[sound]) {
          try {
            soundsRef.current[sound]()
          } catch (error) {
            console.warn(`Failed to play sound ${sound}:`, error)
          }
        }
      })
      clearSoundQueue()
    }
  }, [soundQueue, soundEnabled, clearSoundQueue])

  return null
}
