"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWAInstall } from "@/hooks/use-pwa-install"

export function InstallAppPrompt() {
  const { isInstallable, isInstalled, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const wasDismissed = sessionStorage.getItem("pwa-install-dismissed")
    if (wasDismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(true)
      return
    }
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  const handleInstall = async () => {
    await install()
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowPrompt(false)
    sessionStorage.setItem("pwa-install-dismissed", "true")
  }

  if (isInstalled || dismissed || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-300 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm">
        <div className="rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl p-5">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Install Amir Islamic</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Add to your home screen for faster access and offline browsing.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleInstall} className="h-8 text-xs">
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="h-8 text-xs"
                >
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
