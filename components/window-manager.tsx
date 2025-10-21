"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Minus, Square } from "lucide-react"
import type { WindowState, AppStats } from "@/types"
import { FacePanel } from "@/components/windows/face-panel"
import { LogsWindow } from "@/components/windows/logs-window"
import { ConfigWindow } from "@/components/windows/config-window"
import { ConfirmWindow } from "@/components/windows/confirm-window"
import { BuyWindow } from "@/components/windows/buy-window"
import { TweetWindow } from "@/components/windows/tweet-window"

interface WindowManagerProps {
  windows: WindowState[]
  setWindows: (windows: WindowState[]) => void
  stats: AppStats
  setStats: (stats: AppStats) => void
}

export function WindowManager({ windows, setWindows, stats, setStats }: WindowManagerProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number } | null>(null)
  const originalDimensions = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({})

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const focused = windows.find((w) => w.isOpen && !w.isMinimized)
        if (focused) {
          closeWindow(focused.id)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [windows])

  const closeWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, isOpen: false, isMinimized: false } : w)))
  }

  const minimizeWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)))
  }

  const maximizeWindow = (id: string) => {
    setWindows(
      windows.map((w) => {
        if (w.id === id) {
          if (!w.isMaximized) {
            // Save current dimensions before maximizing
            originalDimensions.current[id] = { x: w.x, y: w.y, width: w.width, height: w.height }
            return {
              ...w,
              isMaximized: true,
              x: 0,
              y: 48,
              width: globalThis.innerWidth,
              height: globalThis.innerHeight - 48 - 64,
            }
          } else {
            // Restore original dimensions
            const original = originalDimensions.current[id]
            return {
              ...w,
              isMaximized: false,
              x: original?.x ?? w.x,
              y: original?.y ?? w.y,
              width: original?.width ?? w.width,
              height: original?.height ?? w.height,
            }
          }
        }
        return w
      }),
    )
  }

  const focusWindow = (id: string) => {
    const maxZ = Math.max(...windows.map((w) => w.zIndex))
    setWindows(windows.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w)))
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const window = windows.find((w) => w.id === id)
    if (!window || window.isMaximized) return

    setDragging(id)
    dragRef.current = { startX: e.clientX, startY: e.clientY }
    setDragOffset({ x: e.clientX - window.x, y: e.clientY - window.y })
    focusWindow(id)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !dragRef.current) return

      const window = windows.find((w) => w.id === dragging)
      if (!window) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      setWindows(
        windows.map((w) =>
          w.id === dragging
            ? {
                ...w,
                x: Math.max(0, Math.min(newX, globalThis.innerWidth - w.width)),
                y: Math.max(48, Math.min(newY, globalThis.innerHeight - 64 - w.height)),
              }
            : w,
        ),
      )
    }

    const handleMouseUp = () => {
      setDragging(null)
      dragRef.current = null
    }

    if (dragging) {
      globalThis.addEventListener("mousemove", handleMouseMove)
      globalThis.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove)
      globalThis.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging, dragOffset, windows])

  const renderWindowContent = (window: WindowState) => {
    switch (window.type) {
      case "face":
        return <FacePanel faceState={stats.faceState} />
      case "logs":
        return <LogsWindow />
      case "config":
        return <ConfigWindow />
      case "confirm":
        return <ConfirmWindow onClose={() => closeWindow(window.id)} />
      case "buy":
        return <BuyWindow onClose={() => closeWindow(window.id)} />
      case "tweet":
        return <TweetWindow tweetUrl={window.tweetUrl || ""} />
      default:
        return <div className="p-4 text-sm">Window content</div>
    }
  }

  return (
    <>
      {windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <div
            key={window.id}
            className={`fixed bg-card border-2 border-primary flex flex-col ${
              window.zIndex === Math.max(...windows.map((w) => w.zIndex)) ? "window-focus" : ""
            }`}
            style={{
              left: window.x,
              top: window.y,
              width: window.width,
              height: window.height,
              zIndex: window.zIndex + 100,
            }}
            onClick={() => focusWindow(window.id)}
          >
            {/* Title Bar */}
            <div
              className="h-8 bg-primary text-primary-foreground flex items-center justify-between px-2 cursor-move select-none"
              onMouseDown={(e) => handleMouseDown(e, window.id)}
            >
              <span className="text-xs font-bold tracking-wider">{window.title}</span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 hover:bg-primary-foreground/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    minimizeWindow(window.id)
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 hover:bg-primary-foreground/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    maximizeWindow(window.id)
                  }}
                >
                  <Square className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-5 w-5 p-0 hover:bg-primary-foreground/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeWindow(window.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">{renderWindowContent(window)}</div>
          </div>
        ))}
    </>
  )
}
