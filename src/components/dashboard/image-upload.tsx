"use client"

import { useState, useCallback, type FC } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, GripVertical, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageFile {
  file: File
  preview: string
  id: string
}

interface ImageUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number
  className?: string
}

export const ImageUpload: FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  className,
}) => {
  const [images, setImages] = useState<ImageFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - images.length - value.length
      const filesToAdd = acceptedFiles.slice(0, remaining)

      const newImages = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }))

      setImages((prev) => [...prev, ...newImages])
    },
    [images.length, value.length, maxFiles]
  )

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const removeExisting = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index)
    onChange?.(newUrls)
  }

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const copy = [...prev]
      const [moved] = copy.splice(from, 1)
      copy.splice(to, 0, moved)
      return copy
    })
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return value
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const img of images) {
        const formData = new FormData()
        formData.append("file", img.file)
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (data.url) uploaded.push(data.url)
      }
      return [...value, ...uploaded]
    } finally {
      setUploading(false)
    }
  }

  const allImages = [
    ...value.map((url, i) => ({ url, id: `existing-${i}`, isExisting: true as const })),
    ...images.map((img) => ({ url: img.preview, id: img.id, isExisting: false as const })),
  ]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxSize,
    disabled: images.length + value.length >= maxFiles,
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          images.length + value.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium">
            {isDragActive ? "Drop images here" : "Drag & drop images here"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG or WebP up to {maxSize / 1024 / 1024}MB
          </p>
          <p className="text-xs text-muted-foreground">
            {maxFiles - images.length - value.length} slots remaining
          </p>
        </div>
      </div>

      {allImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {allImages.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                <img
                  src={item.url}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-1 left-1">
                  <button
                    type="button"
                    className="cursor-grab rounded-md bg-background/80 p-1 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={() => moveImage(index, Math.max(0, index - 1))}
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    item.isExisting
                      ? removeExisting(value.indexOf(item.url))
                      : removeImage(item.id)
                  }
                  className="absolute top-1 right-1 rounded-md bg-destructive/90 p-1 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {item.isExisting && (
                  <div className="absolute bottom-1 left-1 rounded bg-primary/80 px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    Uploaded
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {images.length > 0 && (
        <Button
          type="button"
          variant="default"
          size="sm"
          isLoading={uploading}
          onClick={uploadImages}
        >
          <ImageIcon className="h-4 w-4" />
          Upload {images.length} image{images.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  )
}
