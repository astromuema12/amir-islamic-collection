"use client"

import { cn } from "@/lib/utils"
import { Check, Package, Truck, X, Clock, Ban } from "lucide-react"

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
]

const cancelledStep = { key: "cancelled", label: "Cancelled", icon: Ban }

interface OrderTimelineProps {
  currentStatus: string
  createdAt: string
  updatedAt?: string
}

export function OrderTimeline({
  currentStatus,
  createdAt,
  updatedAt,
}: OrderTimelineProps) {
  const isCancelled = currentStatus === "cancelled"
  const steps = isCancelled ? [...statusSteps.slice(0, 2), cancelledStep] : statusSteps

  const getCurrentStepIndex = () => {
    if (isCancelled) return steps.length - 1
    return steps.findIndex((s) => s.key === currentStatus)
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = index <= currentIndex && !isCancelled
        const isCurrent = index === currentIndex
        const isPast = index < currentIndex || (isCancelled && index === 2)

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && !isCancelled
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCancelled
                      ? index === steps.length - 1
                        ? "border-destructive bg-destructive text-destructive-foreground"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground/50"
                      : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground/50"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-full w-0.5 transition-colors duration-300",
                    (isCompleted || isPast) && !isCancelled
                      ? "bg-primary"
                      : isPast
                        ? "bg-destructive"
                        : "bg-border"
                  )}
                />
              )}
            </div>
            <div className={cn("pb-8", index === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && !isCancelled && "text-primary",
                  isCancelled && index === steps.length - 1 && "text-destructive"
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {index === 0
                  ? new Date(createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : updatedAt && index <= currentIndex
                    ? new Date(updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Pending"}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
