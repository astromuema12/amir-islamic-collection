"use client"

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.97]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.97] shadow-sm",
        link:
          "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-premium-foreground hover:from-amber-600 hover:via-yellow-600 hover:to-amber-500 active:scale-[0.97] shadow-md shadow-amber-500/25",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-xs gap-1.5",
        md: "h-10 px-4 py-2 gap-2",
        lg: "h-11 rounded-lg px-8 gap-2",
        xl: "h-12 rounded-lg px-10 text-base gap-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
  children?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, asChild, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
