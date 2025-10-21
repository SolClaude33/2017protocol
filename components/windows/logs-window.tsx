"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LogsWindow() {
  const [activeTab, setActiveTab] = useState<"system" | "network" | "model">("system")

  const logs = {
    system: [
      "[18:42:11] ARCHIVE MODE initialized",
      "[18:42:15] Cache integrity: 68%",
      "[18:42:23] SCAN initiated — anomaly spike +12%",
      "[18:42:31] Packet loss increased to 17%",
    ],
    network: [
      "[18:41:58] Latency: 142ms",
      "[18:42:05] Node mirror.conflicted/thread-8821 — trust: conflicted",
      "[18:42:18] Connection to archive.ghost/2024-11-03 established",
    ],
    model: ["[18:42:02] Model: gpt-4o-mini", "[18:42:08] Reality filter: Heuristic", "[18:42:14] Temperature: 0.7"],
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border">
        {(["system", "network", "model"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="sm"
            className="rounded-none text-xs uppercase tracking-wider"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      <div className="flex-1 p-4 space-y-1 overflow-y-auto font-mono text-xs">
        {logs[activeTab].map((log, i) => (
          <div key={i} className="text-foreground/80">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
