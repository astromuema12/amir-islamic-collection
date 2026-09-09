"use client"

import { useEffect, useRef, useState } from "react"

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Horizontal offset in px while hidden */
  x?: number
  /** Vertical offset in px while hidden */
  y?: number
  /** Scale while hidden */
  scale?: number
  /** Transition delay in seconds */
  delay?: number
  /** Transition duration in seconds */
  duration?: number
  /** IntersectionObserver root margin */
  margin?: string
  /** Whether to reveal only once (default true) */
  once?: boolean
}

export function Reveal({
  children,
  className,
  x = 0,
  y = 20,
  scale = 1,
  delay = 0,
  duration = 0.5,
  margin = "-50px",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true
    if (!("IntersectionObserver" in window)) return true
    return false
  })

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { rootMargin: margin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [margin, once, visible])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "none"
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}