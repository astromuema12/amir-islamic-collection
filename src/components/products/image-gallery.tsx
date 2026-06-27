"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showZoom, setShowZoom] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const allImages = images.length > 0 ? images : ["/placeholder.svg"]
  const selectedImage = allImages[selectedIndex]

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }, [])

  return (
    <div className="space-y-3">
      <div
        ref={imageRef}
        className="relative aspect-square cursor-crosshair overflow-hidden rounded-xl border bg-muted"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={selectedImage}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {showZoom && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === selectedIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-transparent hover:border-muted-foreground/30",
              )}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl border-0 bg-black/95 p-0">
          <DialogTitle className="sr-only">{productName} - Lightbox</DialogTitle>
          <div className="relative flex aspect-square max-h-[80vh] items-center justify-center">
            <Image
              src={selectedImage}
              alt={`${productName} full size`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "relative h-12 w-12 overflow-hidden rounded border-2 transition-all",
                    index === selectedIndex ? "border-primary" : "border-white/30",
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
