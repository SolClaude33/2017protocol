"use client"

import { Button } from "@/components/ui/button"

interface BuyWindowProps {
  onClose: () => void
}

const AXIOM_URL = "https://axiom.xyz"

export function BuyWindow({ onClose }: BuyWindowProps) {
  const handleConfirm = () => {
    window.open(AXIOM_URL, "_blank")
    onClose()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="text-sm">
        <p className="text-primary font-bold mb-2">EXTERNAL LINK</p>
        <p className="text-foreground/80 mb-2">You are about to leave The 2017 Protocol Console and open an external link:</p>
        <code className="text-accent text-xs">{AXIOM_URL}</code>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          CANCEL
        </Button>
        <Button variant="default" size="sm" onClick={handleConfirm}>
          OPEN LINK
        </Button>
      </div>
    </div>
  )
}
