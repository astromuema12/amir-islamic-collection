"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, ImagePlus, X, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import toast from "react-hot-toast"
import { createProduct, updateProduct, setProductImages } from "@/lib/actions/product-actions"
import { csrfFetch } from "@/lib/csrf-client"

export interface ProductFormCategory {
  id: string
  name: string
}

export interface ProductFormBrand {
  id: string
  name: string
}

export interface ProductFormInitial {
  id: string
  name: string
  description: string
  price: string
  discountPrice: string | null
  categoryId: string
  brandId: string | null
  stock: number
  weight: string | null
  dimensions: string | null
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  isFlashSale: boolean
  flashSaleEnds: Date | null
  images: string[]
}

interface ProductFormProps {
  mode: "create" | "edit"
  initial?: ProductFormInitial
  categories: ProductFormCategory[]
  brands: ProductFormBrand[]
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function ProductForm({ mode, initial, categories, brands }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [price, setPrice] = useState(initial?.price ?? "")
  const [discountPrice, setDiscountPrice] = useState(initial?.discountPrice ?? "")
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "")
  const [brandId, setBrandId] = useState(initial?.brandId ?? "")
  const [stock, setStock] = useState(initial?.stock ?? "")
  const [weight, setWeight] = useState(initial?.weight ?? "")
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? "")
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [tagInput, setTagInput] = useState("")
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false)
  const [isFlashSale, setIsFlashSale] = useState(initial?.isFlashSale ?? false)
  const [flashSaleEnds, setFlashSaleEnds] = useState(
    initial?.flashSaleEnds ? toDatetimeLocal(new Date(initial.flashSaleEnds)) : ""
  )
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const uploadFiles = async (files: FileList) => {
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append("file", file)
        const res = await csrfFetch("/api/upload", { method: "POST", body: fd })
        const data = await res.json()
        if (data.url) urls.push(data.url)
        else toast.error(data.message || "Upload failed")
      }
      if (urls.length > 0) {
        setImages((prev) => [...prev, ...urls])
        toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`)
      }
    } catch {
      toast.error("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (name.trim().length < 3) next.name = "Name must be at least 3 characters"
    if (description.trim().length < 10) next.description = "Description must be at least 10 characters"
    if (!price || Number(price) <= 0) next.price = "Price must be positive"
    if (!categoryId) next.categoryId = "Select a category"
    if (stock === "" || Number(stock) < 0) next.stock = "Stock cannot be negative"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields")
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", name.trim())
      fd.append("description", description.trim())
      fd.append("price", String(Number(price)))
      if (discountPrice) fd.append("discountPrice", String(Number(discountPrice)))
      fd.append("categoryId", categoryId)
      if (brandId) fd.append("brandId", brandId)
      fd.append("stock", String(Number(stock)))
      if (weight) fd.append("weight", String(Number(weight)))
      if (dimensions) fd.append("dimensions", dimensions.trim())
      fd.append("tags", JSON.stringify(tags))
      fd.append("isActive", String(isActive))
      fd.append("isFeatured", String(isFeatured))
      fd.append("isFlashSale", String(isFlashSale))
      if (flashSaleEnds) fd.append("flashSaleEnds", new Date(flashSaleEnds).toISOString())

      const result =
        mode === "create" ? await createProduct(fd) : await updateProduct(initial!.id, fd)

      if ("error" in result) {
        toast.error(typeof result.error === "string" ? result.error : "Please check the form fields")
        return
      }

      const productId = "productId" in result && typeof result.productId === "string" ? result.productId : initial!.id
      if (images.length > 0) {
        await setProductImages(productId, images)
      }

      toast.success(mode === "create" ? "Product created" : "Product updated")
      router.push("/admin/products")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "New Product" : "Edit Product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create" ? "Add a new product to your catalog" : `Editing ${initial?.name}`}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
                <CardDescription>Product name, description and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="e.g. Premium Prayer Mat — Velvet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
                <Textarea
                  label="Description"
                  placeholder="Describe the product in detail..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={errors.description}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (KES)"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={errors.price}
                  />
                  <Input
                    label="Discount Price (KES)"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Images</CardTitle>
                <CardDescription>Upload product photos</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) uploadFiles(e.target.files)
                    e.target.value = ""
                  }}
                />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {images.map((img, i) => (
                    <div
                      key={img}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/90 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="mx-auto h-6 w-6 text-muted-foreground" />
                        <span className="mt-1 block text-xs text-muted-foreground">Upload</span>
                      </div>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Inventory</CardTitle>
                <CardDescription>Stock and shipping details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Stock Quantity"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    error={errors.stock}
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <Input
                  label="Dimensions"
                  placeholder="e.g. 30 x 20 x 5 cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Category *</label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-destructive">{errors.categoryId}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Brand</label>
                  <Select value={brandId || undefined} onValueChange={setBrandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="No brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Active</label>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Featured</label>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Flash Sale</label>
                  <Switch checked={isFlashSale} onCheckedChange={setIsFlashSale} />
                </div>
                {isFlashSale && (
                  <Input
                    type="datetime-local"
                    label="Flash Sale Ends"
                    value={flashSaleEnds}
                    onChange={(e) => setFlashSaleEnds(e.target.value)}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" size="icon" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
