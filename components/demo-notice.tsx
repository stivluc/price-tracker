"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const STORAGE_KEY = "pt-demo-notice"

export function DemoNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) === "1"
    } catch {
      // Storage unavailable (private mode, blocked cookies): show the notice anyway.
    }
    if (!seen) setOpen(true)
  }, [])

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1")
      } catch {
        // Ignore: the notice will simply show again next time.
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="outline-none sm:max-w-md"
        // Focus the dialog itself rather than the button, to avoid a focus ring on load
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          ;(event.currentTarget as HTMLElement | null)?.focus()
        }}
      >
        <DialogHeader className="text-left">
          <DialogTitle>Prototype : suivi des écarts de prix</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p>
                Ce tableau de bord a été conçu comme prototype pour un projet
                mené auprès de Castorama. Il permet de repérer et de traiter
                efficacement les écarts de prix entre différents flux, et
                d&apos;alerter lorsqu&apos;un seuil est dépassé.
              </p>
              <p>Toutes les données sont fictives et générées automatiquement.</p>
              <p>Cette démo n&apos;est pas affiliée à Castorama.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Voir la démo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
