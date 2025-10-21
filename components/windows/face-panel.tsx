"use client"

import { useEffect, useState } from "react"

interface FacePanelProps {
  faceState: string
}

const FACE_STATES = {
  idle: "/abstract-red-digital-face-idle-state.jpg",
  scan: "/abstract-red-digital-face-scanning.jpg",
  alert: "/abstract-red-digital-face-alert.jpg",
  glitch: "/abstract-red-digital-face-glitching.jpg",
  calm: "/abstract-red-digital-face-calm.jpg",
}

export function FacePanel({ faceState }: FacePanelProps) {
  const [currentFace, setCurrentFace] = useState(faceState)
  const [jitter, setJitter] = useState(0)

  useEffect(() => {
    setCurrentFace(faceState)
  }, [faceState])

  useEffect(() => {
    const interval = setInterval(() => {
      setJitter(Math.random() * 2 - 1)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary/50 p-4">
      <div className="relative transition-opacity duration-300" style={{ transform: `translateX(${jitter}px)` }}>
        <img
          src={FACE_STATES[currentFace as keyof typeof FACE_STATES] || FACE_STATES.idle}
          alt="AI Face State"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
