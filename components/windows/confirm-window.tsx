"use client"

import { Button } from "@/components/ui/button"

interface ConfirmWindowProps {
  onClose: () => void
}

export function ConfirmWindow({ onClose }: ConfirmWindowProps) {
  const handleConfirm = () => {
    // Purge logic would go here
    onClose()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="text-sm">
        <p className="text-destructive font-bold mb-2">WARNING</p>
        <p className="text-foreground/80">
          This will permanently delete the last 10 messages from the terminal. This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          CANCEL
        </Button>
        <Button variant="destructive" size="sm" onClick={handleConfirm}>
          CONFIRM PURGE
        </Button>
      </div>
    </div>
  )
}
