"use client"

import { Button } from "@/components/ui/button"
import type { AppStats } from "@/types"

interface IntelSidebarProps {
  stats: AppStats
  setStats: (stats: AppStats) => void
}

export function IntelSidebar({ stats, setStats }: IntelSidebarProps) {
  const sources = [
    { url: "archive.ghost/2024-11-03", trust: "ghost" },
    { url: "mirror.conflicted/thread-8821", trust: "conflicted" },
    { url: "cache.residual/snapshot-4a2", trust: "unknown" },
  ]

  return (
    <div className="w-80 bg-card border-l border-primary p-4 space-y-4 overflow-y-auto hidden lg:block">
      <div className="text-xs font-bold tracking-wider text-primary border-b border-primary pb-2">INTEL SIDEBAR</div>

      {/* Reality Filter */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">REALITY FILTER</div>
        <div className="flex gap-1">
          {(["Off", "Heuristic", "Strict"] as const).map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={stats.realityFilter === filter ? "default" : "outline"}
              className="flex-1 text-xs h-7"
              onClick={() => setStats({ ...stats, realityFilter: filter })}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Anomaly Meter */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">ANOMALY METER</span>
          <span className="text-primary">{stats.anomaly}%</span>
        </div>
        <div className="h-2 bg-muted relative overflow-hidden">
          <div className="h-full bg-destructive transition-all duration-500" style={{ width: `${stats.anomaly}%` }} />
        </div>
      </div>

      {/* Crawl Cache */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">CRAWL CACHE</div>
        <div className="space-y-1.5">
          {sources.map((source, i) => (
            <div key={i} className="bg-secondary p-2 text-xs border border-border/50">
              <div className="text-foreground/80 truncate">{source.url}</div>
              <div className="flex items-center gap-1 mt-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    source.trust === "ghost" ? "bg-muted" : source.trust === "conflicted" ? "bg-accent" : "bg-primary"
                  }`}
                />
                <span className="text-muted-foreground text-[10px] uppercase">{source.trust}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Stats */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">NETWORK</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Packet Loss</span>
            <span className="text-foreground">{stats.packetLoss}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency</span>
            <span className="text-foreground">{stats.latency}ms</span>
          </div>
        </div>
      </div>

      {/* World Grid */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">WORLD GRID</div>
        <div className="aspect-square bg-secondary border border-border/50 p-2">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Hex grid pattern */}
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                {Array.from({ length: 6 }).map((_, j) => {
                  const x = 15 + j * 15 + (i % 2) * 7.5
                  const y = 15 + i * 13
                  return (
                    <polygon
                      key={`${i}-${j}`}
                      points={`${x},${y - 5} ${x + 4},${y - 2.5} ${x + 4},${y + 2.5} ${x},${y + 5} ${x - 4},${y + 2.5} ${x - 4},${y - 2.5}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-primary/30"
                    />
                  )
                })}
              </g>
            ))}
            {/* Active nodes */}
            <circle cx="30" cy="28" r="1.5" fill="currentColor" className="text-primary" />
            <circle cx="52" cy="54" r="1.5" fill="currentColor" className="text-accent" />
            <circle cx="75" cy="41" r="1.5" fill="currentColor" className="text-primary" />
          </svg>
        </div>
      </div>
    </div>
  )
}
