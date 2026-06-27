"use client"

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = {
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  currentIndex: number
  totalSlides: number
}

interface CarouselContextValue {
  api: CarouselApi
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, orientation = "horizontal", children, setApi, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalSlides, setTotalSlides] = useState(0)
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(true)

    const scrollPrev = useCallback(() => {
      setCurrentIndex((prev) => {
        const next = Math.max(0, prev - 1)
        setCanScrollPrev(next > 0)
        setCanScrollNext(true)
        return next
      })
    }, [])

    const scrollNext = useCallback(() => {
      setCurrentIndex((prev) => {
        const next = Math.min(totalSlides - 1, prev + 1)
        setCanScrollPrev(true)
        setCanScrollNext(next < totalSlides - 1)
        return next
      })
    }, [totalSlides])

    const api: CarouselApi = {
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      currentIndex,
      totalSlides,
    }

    return (
      <CarouselContext.Provider value={{ api }}>
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel()

    return (
      <div ref={ref} className="overflow-hidden">
        <div
          className={cn("flex", className)}
          style={{
            transform: `translateX(-${api.currentIndex * 100}%)`,
            transition: "transform 300ms ease-in-out",
          }}
          {...props}
        />
      </div>
    )
  }
)
CarouselContent.displayName = "CarouselContent"

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useCarousel()

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full",
        className
      )}
      disabled={!api.canScrollPrev}
      onClick={api.scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useCarousel()

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full",
        className
      )}
      disabled={!api.canScrollNext}
      onClick={api.scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselDots = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel()

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-2 py-2", className)}
        {...props}
      >
        {Array.from({ length: api.totalSlides }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === api.currentIndex
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            onClick={() => {
              const diff = index - api.currentIndex
              if (diff > 0) {
                for (let i = 0; i < diff; i++) api.scrollNext()
              } else {
                for (let i = 0; i < Math.abs(diff); i++) api.scrollPrev()
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )
  }
)
CarouselDots.displayName = "CarouselDots"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  type CarouselApi,
}
