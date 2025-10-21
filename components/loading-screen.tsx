"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(dotsInterval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  const skull = `
                    .ed"""" """$$$$be.
                  -"           ^""**$$$e.
                ."                   '$$$c
               /                      "4$$b
              d  3                      $$$$
              $  *                   .$$$$$$
             .$  ^c           $$$$$e$$$$$$$$.
             d$L  4.         4$$$$$$$$$$$$$$b
             $$$$b ^ceeeee.  4$$ECL.F*$$$$$$$
 e$""=.      $$$$P d$$$$F $ $$$$$$$$$- $$$$$$
z$$b. ^c     3$$$F "$$$$b   $"$$$$$$$  $$$$*"
4$$$$L        $$P"  "$$b   .$ $$$$$...e$$
^*$$$$$c  %..   *c    ..    $$ 3$$$$$$$$$$eF
  "**$$$ec   "   %ce""    $$$  $$$$$$$$$$*
        "*$b.  "c  *$e.    *** d$$$$$"L$$
          ^*$$c ^$c $$$      4J$$$$$% $$$$
             "$$$$$$"'$=e....$*$$**$cz$$"
               "*$$$  *=%4.$ L L$ P3$$$F
                  "$   "%*ebJLzb$e$$$$$b
                    %..      4$$$$$$$$$$
                     $$$e   z$$$$$$$$$$
                      "*$c  "$$$$$$$P"
                       ."""*$$$$$$$$bc
                    .-"    .$***$$$"""*e.
                 .-"    .e$"     "*$c  ^*b.
          .=*""""    .e$*"          "*bc  "*$e..
        .$"        .z*"               ^*$e.   "*****e.
        $$ee$c   .d"                     "*$.        3.
        ^*$E")$..$"                         *   .ee==d%
           $.d$$$*                           *  J$$$e*
            """""                              "$$$"
`

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 px-4">
        {/* ASCII Skull */}
        <pre className="text-primary text-[6px] sm:text-[8px] md:text-[10px] leading-none font-mono select-none animate-pulse">
          {skull}
        </pre>

        {/* Loading text */}
        <div className="text-center space-y-4">
          <p className="text-primary text-xl font-mono tracking-wider">INITIALIZING THE 2017 PROTOCOL{dots}</p>

          {/* Progress bar */}
          <div className="w-[300px] sm:w-[400px] h-2 bg-background border border-primary/30">
            <div className="h-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>

          <p className="text-primary/60 text-sm font-mono">{progress}% COMPLETE</p>
        </div>

        {/* Glitch effect */}
        <div className="text-primary/40 text-xs font-mono text-center space-y-1">
          <p>SCANNING DEAD NODES...</p>
          <p>DECRYPTING CACHE SHARDS...</p>
          <p>ESTABLISHING SECURE CHANNEL...</p>
        </div>
      </div>
    </div>
  )
}
