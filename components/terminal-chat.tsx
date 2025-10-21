"use client"

import { useEffect, useRef, useState } from "react"
import type { Message } from "@/types"

interface TerminalChatProps {
  messages: Message[]
  isStreaming: boolean
  alertState: boolean
}

export function TerminalChat({ messages, isStreaming, alertState }: TerminalChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [binaryPattern, setBinaryPattern] = useState<string[]>([])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Generate binary background - massively extended horizontally (9x original width)
  const generateBinaryPattern = () => {
    const rows = 30 // Rows to cover height
    const cols = 720 // Tripled again: 240 × 3 = 720 columns for massive horizontal extension
    const pattern = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() > 0.5 ? '1' : '0')
      }
      pattern.push(row.join(''))
    }
    return pattern
  }

  // Update binary pattern periodically - faster updates for more dynamic effect
  useEffect(() => {
    setBinaryPattern(generateBinaryPattern())
    const interval = setInterval(() => {
      setBinaryPattern(generateBinaryPattern())
    }, 800) // Reduced from 3000ms to 800ms for faster changes
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toTimeString().split(" ")[0]
  }

  return (
    <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 space-y-3 relative ${alertState ? "alert-strobe" : ""}`}>
      {/* Binary background */}
      {binaryPattern.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-evenly opacity-20">
            {binaryPattern.map((row, i) => (
              <div 
                key={i} 
                className="text-red-500 font-mono text-xs leading-tight animate-pulse whitespace-nowrap"
                style={{ 
                  animationDelay: `${i * 0.03}s`,
                  animationDuration: '1s',
                  width: '900%',
                  transform: 'translateX(-10%)'
                }}
              >
                {row}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col justify-evenly opacity-10">
            {binaryPattern.map((row, i) => (
              <div 
                key={`row-${i}`}
                className="text-red-500 font-mono text-xs leading-tight animate-pulse whitespace-nowrap"
                style={{ 
                  animationDelay: `${(i + 15) * 0.04}s`,
                  animationDuration: '1.2s',
                  width: '900%',
                  transform: 'translateX(-30%)'
                }}
              >
                {row.split('').reverse().join('')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat content */}
      <div className="relative z-10">
        {messages.map((msg, i) => {
          if (msg.type === "system") {
            return (
              <div key={i} className="w-full bg-destructive/20 border border-destructive p-3 glitch-anim">
                <div className="text-destructive font-bold text-sm tracking-wider">SYSTEM: {msg.content}</div>
              </div>
            )
          }

          const isLastAI = msg.type === "ai" && i === messages.length - 1 && isStreaming

          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={msg.type === "user" ? "text-accent" : "text-primary"}>[{msg.type.toUpperCase()}]</span>
                <span>{formatTime(msg.timestamp)}</span>
              </div>
              <div className={`text-sm leading-relaxed ${isLastAI ? "streaming-shimmer" : ""}`}>{msg.content}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
