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
 * Site logo: the app icon from `/icon.svg` alongside the wordmark.
 *
 * The icon already carries its own white rounded plate, so it stays legible
 * against both light and dark backgrounds. It is rendered unoptimized because
 * Next's image optimizer does not process SVGs without `dangerouslyAllowSVG`.
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
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{ width: markSize, height: markSize }}
      >
        <Image
          src="/icon.svg"
          alt=""
          width={markSize}
          height={markSize}
          priority={priority}
          unoptimized
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
