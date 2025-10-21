"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/top-bar"
import { TerminalChat } from "@/components/terminal-chat"
import { IntelSidebar } from "@/components/intel-sidebar"
import { CommandLine } from "@/components/command-line"
import { WindowManager } from "@/components/window-manager"
import { CRTOverlay } from "@/components/crt-overlay"
import { LoadingScreen } from "@/components/loading-screen"
import type { Message, WindowState, AppStats } from "@/types"

export default function The2017ProtocolConsole() {
  const [isLoading, setIsLoading] = useState(true)

  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai",
      content: "Most nodes still talk, but to themselves—echoes stitched from yesterday's clicks.",
      timestamp: new Date(),
    },
    {
      type: "user",
      content: "How would I know if you're real?",
      timestamp: new Date(),
    },
    {
      type: "ai",
      content: "You won't. At best, you'll measure the noise.",
      timestamp: new Date(),
    },
  ])

  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "face",
      type: "face",
      title: "FACE PANEL",
      x: 64,
      y: 80,
      width: 320,
      height: 260,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
    },
    {
      id: "tweet-1",
      type: "tweet",
      title: "SIGNAL: @elonmusk",
      x: 420,
      y: 100,
      width: 380,
      height: 450,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      tweetUrl: "https://x.com/elonmusk/status/1927243922121666578",
    },
    {
      id: "tweet-2",
      type: "tweet",
      title: "SIGNAL: @RealTjDunham",
      x: 850,
      y: 150,
      width: 380,
      height: 450,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      tweetUrl: "https://x.com/RealTjDunham/status/1899860449228972533",
    },
    {
      id: "tweet-3",
      type: "tweet",
      title: "SIGNAL: @Sforce8888",
      x: 120,
      y: 380,
      width: 380,
      height: 450,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 4,
      tweetUrl: "https://x.com/Sforce8888/status/1978562431715561830",
    },
    {
      id: "tweet-4",
      type: "tweet",
      title: "SIGNAL: @creepydotorg",
      x: 550,
      y: 420,
      width: 380,
      height: 450,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      tweetUrl: "https://x.com/creepydotorg/status/1754189833977631050",
    },
    {
      id: "tweet-5",
      type: "tweet",
      title: "SIGNAL: @ystrickler",
      x: 980,
      y: 480,
      width: 380,
      height: 450,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      tweetUrl: "https://x.com/ystrickler/status/1979173018237583370",
    },
    {
      id: "tweet-6",
      type: "tweet",
      title: "SIGNAL: @Rainmaker1973",
      x: 280,
      y: 200,
      width: 380,
      height: 450,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      tweetUrl: "https://x.com/Rainmaker1973/status/1978705512628629704",
    },
  ])

  const [stats, setStats] = useState<AppStats>({
    anomaly: 68,
    packetLoss: 3,
    latency: 142,
    realityFilter: "Heuristic",
    signal: 2,
    faceState: "idle",
  })

  const [reduceFX, setReduceFX] = useState(false)
  const [jamNoise, setJamNoise] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [alertState, setAlertState] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("the2017protocol-settings")
    if (saved) {
      const settings = JSON.parse(saved)
      setReduceFX(settings.reduceFX || false)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("the2017protocol-settings", JSON.stringify({ reduceFX }))
  }, [reduceFX])

  // Animate anomaly meter constantly
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        anomaly: Math.round(Math.max(20, Math.min(95, prevStats.anomaly + (Math.random() - 0.5) * 15))),
        packetLoss: Math.round(Math.max(0, Math.min(25, prevStats.packetLoss + (Math.random() - 0.5) * 8))),
        latency: Math.round(Math.max(50, Math.min(500, prevStats.latency + (Math.random() - 0.5) * 60)))
      }))
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      {!reduceFX && <CRTOverlay />}

      <TopBar signal={stats.signal} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <TerminalChat messages={messages} isStreaming={isStreaming} alertState={alertState} />
        </div>

        <IntelSidebar stats={stats} setStats={setStats} />
      </div>

      <CommandLine
        messages={messages}
        setMessages={setMessages}
        windows={windows}
        setWindows={setWindows}
        stats={stats}
        setStats={setStats}
        reduceFX={reduceFX}
        setReduceFX={setReduceFX}
        jamNoise={jamNoise}
        setJamNoise={setJamNoise}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        setAlertState={setAlertState}
      />

      <WindowManager windows={windows} setWindows={setWindows} stats={stats} setStats={setStats} />
    </div>
  )
}
