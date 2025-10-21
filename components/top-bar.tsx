"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"

interface TopBarProps {
  signal: number
}

export function TopBar({ signal }: TopBarProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toISOString().split("T")[1].split(".")[0] + " UTC")
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const signalBars = Array.from({ length: 5 }, (_, i) => i < signal)

  return (
    <div className="h-12 bg-card border-b border-primary flex items-center justify-between px-4 text-xs tracking-tight">
      <div className="text-primary font-bold">THE_2017_PROTOCOL_CONSOLE v1.4</div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">SIGNAL</span>
        <div className="flex gap-0.5">
          {signalBars.map((active, i) => (
            <div
              key={i}
              className={`w-1 h-3 ${active ? "bg-primary" : "bg-muted"}`}
              style={{ height: `${(i + 1) * 3}px` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">{time}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-destructive">REC</span>
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </div>
        
        {/* External links */}
        <div className="flex items-center gap-3">
          {/* Pump.fun icon */}
          <button
            onClick={() => window.open('https://pump.fun', '_blank')}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            title="Pump.fun"
          >
            <span className="text-xs font-mono">PUMP</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          
          {/* X/Twitter icon */}
          <button
            onClick={() => window.open('https://x.com/2017protocol', '_blank')}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            title="X (Twitter)"
          >
            <span className="text-xs font-mono">X</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
