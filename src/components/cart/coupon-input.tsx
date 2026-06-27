"use client"

import { useState } from "react"
import { Tag, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

interface CouponInputProps {
  onApply: (code: string) => Promise<boolean>
  onRemove: () => void
  appliedCode?: string | null
  discount?: number
}

export function CouponInput({ onApply, onRemove, appliedCode, discount }: CouponInputProps) {
  const [code, setCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleApply() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError("Please enter a coupon code")
      return
    }

    setIsApplying(true)
    setError(null)

    try {
      const success = await onApply(trimmed)
      if (success) {
        toast.success("Coupon applied successfully!")
        setCode("")
      } else {
        setError("Invalid or expired coupon code")
      }
    } catch {
      setError("Failed to apply coupon")
    } finally {
      setIsApplying(false)
    }
  }

  if (appliedCode) {
    return (
      <div className="rounded-lg border bg-primary/5 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {appliedCode}
              </p>
              {discount !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {discount > 0
                    ? `Discount: -${discount.toLocaleString()}`
                    : "Coupon applied"}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 text-muted-foreground hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Tag className="h-4 w-4" />
          </div>
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            placeholder="Enter coupon code"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply()
            }}
            error={error ?? undefined}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleApply}
          isLoading={isApplying}
          disabled={isApplying || !code.trim()}
          className="shrink-0"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}
