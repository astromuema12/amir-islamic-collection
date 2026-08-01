"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Search, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { csrfFetch } from "@/lib/csrf-client"
import toast from "react-hot-toast"

interface MediaItem {
  id: string
  url: string
  name: string
  size: number
  type: string
  createdAt: Date
}

const initialMedia: MediaItem[] = []

export default function AdminMediaPage() {
  const [media, setMedia] = useState(initialMedia)
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = media.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()))

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploading(true)
    const newItems: MediaItem[] = []
    for (const file of acceptedFiles) {
      try {
        const fd = new FormData()
        fd.append("file", file)
        const res = await csrfFetch("/api/upload", { method: "POST", body: fd })
        const data = await res.json()
        if (!res.ok || data.status === "error") throw new Error(data.message || "Upload failed")
        newItems.push({
          id: `media-${Date.now()}-${newItems.length}`,
          url: data.url,
          name: file.name,
          size: file.size,
          type: file.type,
          createdAt: new Date(),
        })
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }
    if (newItems.length > 0) {
      setMedia(prev => [...newItems, ...prev])
      toast.success(`${newItems.length} file(s) uploaded`)
    }
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] },
    maxSize: 10 * 1024 * 1024,
  })

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      toast.success("URL copied!")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    setMedia(prev => prev.filter(m => m.id !== deleteId))
    setDeleteId(null)
    toast.success("File deleted")
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight premium-heading">Media Library</h1>
        <p className="text-muted-foreground">Upload and manage your media files</p>
      </div>

      {/* Upload Dropzone */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm font-medium">
            {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, GIF, WebP, SVG up to 10MB</p>
        </div>
      </Card>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative aspect-square rounded-lg border overflow-hidden bg-muted cursor-pointer ${
              selectedId === item.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
          >
            <img
              src={item.url}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image" }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); copyUrl(item.url, item.id) }}
                className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                {copiedId === item.id ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                className="h-8 w-8 rounded-full bg-destructive/80 flex items-center justify-center hover:bg-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
            {selectedId === item.id && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 p-2 text-xs space-y-0.5">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-muted-foreground">{formatSize(item.size)}</p>
                <p className="text-muted-foreground">{formatDate(item.createdAt)}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No media files found</p>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete File</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently delete this file. Are you sure?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
