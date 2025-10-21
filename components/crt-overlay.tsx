"use client"

export function CRTOverlay() {
  return (
    <div className="crt-overlay">
      <div className="crt-scanlines w-full h-full" />
      <div className="crt-vignette w-full h-full absolute top-0 left-0" />
      <div className="crt-grain w-full h-full absolute top-0 left-0" />
    </div>
  )
}
