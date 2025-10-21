"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Message, WindowState, AppStats } from "@/types"

interface CommandLineProps {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  windows: WindowState[]
  setWindows: (windows: WindowState[]) => void
  stats: AppStats
  setStats: (stats: AppStats) => void
  reduceFX: boolean
  setReduceFX: (value: boolean) => void
  jamNoise: boolean
  setJamNoise: (value: boolean) => void
  isStreaming: boolean
  setIsStreaming: (value: boolean) => void
  setAlertState: (value: boolean) => void
}

const COMMANDS = ["/help", "/scan", "/trace", "/purge", "/seed", "/face", "/ca"]

export function CommandLine({
  messages,
  setMessages,
  windows,
  setWindows,
  stats,
  setStats,
  reduceFX,
  setReduceFX,
  jamNoise,
  setJamNoise,
  isStreaming,
  setIsStreaming,
  setAlertState,
}: CommandLineProps) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const openWindow = (type: string, title: string) => {
    const existing = windows.find((w) => w.type === type)
    if (existing) {
      setWindows(
        windows.map((w) =>
          w.type === type
            ? { ...w, isOpen: true, isMinimized: false, zIndex: Math.max(...windows.map((win) => win.zIndex)) + 1 }
            : w,
        ),
      )
    } else {
      const newWindow: WindowState = {
        id: type,
        type,
        title,
        x: 100 + windows.length * 30,
        y: 100 + windows.length * 30,
        width: 480,
        height: 360,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: Math.max(...windows.map((w) => w.zIndex), 0) + 1,
      }
      setWindows([...windows, newWindow])
    }
  }

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim()

    if (trimmed === "/help") {
      openWindow("config", "CONFIG / HELP")
      return
    }

    if (trimmed === "/scan") {
      setMessages([
        ...messages,
        {
          type: "system",
          content: "SCANNING NETWORK — anomaly spike detected, packet loss increased",
          timestamp: new Date(),
        },
      ])
      setStats({
        ...stats,
        anomaly: Math.round(Math.min(100, stats.anomaly + 12)),
        packetLoss: Math.round(Math.min(100, stats.packetLoss + 14)),
      })
      openWindow("logs", "SYSTEM LOGS")
      return
    }

    if (trimmed === "/trace") {
      setMessages([
        ...messages,
        {
          type: "system",
          content: "MIMIC DETECTED — persona hash collision, trust compromised",
          timestamp: new Date(),
        },
      ])
      setAlertState(true)
      setTimeout(() => setAlertState(false), 1200)
      return
    }

    if (trimmed === "/purge") {
      openWindow("confirm", "CONFIRM PURGE")
      return
    }

    if (trimmed === "/seed") {
      setMessages([
        ...messages,
        {
          type: "ai",
          content: "The old web died quietly. No funeral, just redirects to nowhere.",
          timestamp: new Date(),
        },
      ])
      return
    }

    if (trimmed === "/face") {
      openWindow("face", "FACE PANEL")
      return
    }

    if (trimmed === "/buy") {
      openWindow("buy", "EXTERNAL LINK")
      return
    }

    if (trimmed === "/x") {
      window.open("https://x.com/2017protocol", "_blank")
      return
    }

    if (trimmed === "/ca") {
      setMessages([
        ...messages,
        {
          type: "system",
          content: "CONTRACT ADDRESS — retrieving deployment information",
          timestamp: new Date(),
        },
      ])
      // You can add your contract address logic here
      return
    }

    // Regular chat message
    const userMessage: Message = {
      type: "user",
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setIsStreaming(true)

    // Simulate AI response
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          realityFilter: stats.realityFilter,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()

      const aiMessage: Message = {
        type: "ai",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages([...messages, userMessage, aiMessage])

      // Update face state if provided
      if (data.faceState) {
        setStats({ ...stats, faceState: data.faceState })
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        const errorMessage: Message = {
          type: "system",
          content: "CONNECTION LOST — unable to reach AI node",
          timestamp: new Date(),
        }
        setMessages([...messages, userMessage, errorMessage])
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    handleCommand(input)
    setInput("")
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }

  return (
    <div className="h-16 bg-card border-t border-primary p-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 h-full">
        <div className="flex gap-1 flex-wrap">
          {COMMANDS.map((cmd) => (
            <Button
              key={cmd}
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-xs chip-ripple bg-transparent"
              onClick={() => {
                setInput(cmd)
                inputRef.current?.focus()
              }}
            >
              {cmd}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-primary text-sm">›</span>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type /help or ask about the dead internet…"
            className="flex-1 bg-secondary border-border text-sm h-8"
            disabled={isStreaming}
          />
        </div>

        <div className="flex items-center gap-2">
          {isStreaming ? (
            <Button type="button" size="sm" variant="destructive" className="h-8 text-xs" onClick={handleStop}>
              STOP
            </Button>
          ) : (
            <Button type="submit" size="sm" variant="default" className="h-8 text-xs" disabled={!input.trim()}>
              SEND ▶
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            variant={jamNoise ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => setJamNoise(!jamNoise)}
          >
            JAM
          </Button>

          <Button
            type="button"
            size="sm"
            variant={reduceFX ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => setReduceFX(!reduceFX)}
          >
            FX
          </Button>
        </div>
      </form>
    </div>
  )
}
