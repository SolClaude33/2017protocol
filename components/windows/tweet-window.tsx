"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface TweetWindowProps {
  tweetUrl: string
}

interface TweetData {
  username: string
  tweetId: string
  loading: boolean
  error: boolean
}

export function TweetWindow({ tweetUrl }: TweetWindowProps) {
  const [tweetData, setTweetData] = useState<TweetData>({
    username: "",
    tweetId: "",
    loading: true,
    error: false,
  })

  useEffect(() => {
    try {
      const url = new URL(tweetUrl)
      const pathParts = url.pathname.split("/")
      const username = pathParts[1]
      const tweetId = pathParts[3]

      setTweetData({
        username,
        tweetId,
        loading: false,
        error: false,
      })
    } catch (error) {
      console.error("[v0] Failed to parse tweet URL:", error)
      setTweetData((prev) => ({ ...prev, loading: false, error: true }))
    }
  }, [tweetUrl])

  if (tweetData.loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-mono text-sm">LOADING SIGNAL...</span>
        </div>
      </div>
    )
  }

  if (tweetData.error) {
    return (
      <div className="flex items-center justify-center h-full bg-background p-4">
        <div className="text-center space-y-2">
          <p className="text-primary font-mono text-sm">SIGNAL CORRUPTED</p>
          <p className="text-primary/60 font-mono text-xs">Unable to decode transmission</p>
        </div>
      </div>
    )
  }

  const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${tweetData.tweetId}&theme=dark&dnt=true`

  return (
    <div className="h-full bg-background overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        title={`Tweet from @${tweetData.username}`}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}
