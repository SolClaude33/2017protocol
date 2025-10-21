export interface Message {
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
}

export interface WindowState {
  id: string
  type: string
  title: string
  x: number
  y: number
  width: number
  height: number
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  tweetUrl?: string
}

export interface AppStats {
  anomaly: number
  packetLoss: number
  latency: number
  realityFilter: "Off" | "Heuristic" | "Strict"
  signal: number
  faceState: string
}
