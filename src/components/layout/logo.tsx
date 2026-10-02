import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  /** Height of the logo mark in pixels. */
  markSize?: number
  /** Hide the text wordmark and show the mark only. */
  markOnly?: boolean
  /** Set only on the above-the-fold instance (the header). */
  priority?: boolean
  className?: string
}

/**
 * Site logo: the mark from `/logo-mark.png` alongside the wordmark.
 *
 * The mark is dark green on transparency, so it always sits on a light plate.
 * That plate is invisible against the light background and keeps the logo
 * legible in dark mode.
 */
export function Logo({
  markSize = 36,
  markOnly = false,
  priority = false,
  className,
}: LogoProps) {
  const sm = markSize <= 28
  const lg = markSize >= 48

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white"
        style={{ width: markSize, height: markSize }}
      >
        <Image
          src="/logo-mark.png"
          alt=""
          width={markSize}
          height={markSize}
          priority={priority}
          className="object-contain"
        />
      </span>
      {!markOnly && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-bold tracking-tight premium-heading whitespace-nowrap text-foreground",
              sm ? "text-base" : lg ? "text-2xl" : "text-lg lg:text-xl"
            )}
          >
            <span className="text-primary">Amir</span>{" "}
            <span className="text-premium">Islamic</span>
          </span>
          <span
            className={cn(
              "mt-0.5 font-semibold text-muted-foreground",
              sm ? "text-[0.65rem]" : lg ? "text-base" : "text-xs sm:text-sm"
            )}
          >
            Collections
          </span>
        </span>
      )}
    </span>
  )
}
