"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  ArrowLeft, Save, ImagePlus, X, Loader2, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"

const editProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  discountPrice: z.coerce.number().positive().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  brandId: z.string().optional().or(z.literal("")),
  sellerId: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  weight: z.coerce.number().positive().optional().or(z.literal("")),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isFlashSale: z.boolean().default(false),
  flashSaleEnds: z.string().optional(),
})

type EditFormData = z.infer<typeof editProductSchema>

const categories = ["Prayer Mats", "Holy Qur'an", "Tasbih", "Abayas", "Hijabs", "Thobes", "Islamic Books", "Perfumes", "Home Decor", "Accessories", "Gift Boxes"]
const brands = ["Al-Qalam", "Makkah Collection", "Madinah Crafts", "Noor Prints", "Oud Royale"]
const sellers = ["Aisha's Store", "Fatima Fashion", "Islamic Treasures", "Quranic Gifts"]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [images, setImages] = useState<string[]>([
    "https://res.cloudinary.com/demo/image/upload/v1/products/img-1.jpg",
  ])
  const [uploading, setUploading] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<EditFormData>({
    resolver: zodResolver(editProductSchema) as any,
    defaultValues: {
      name: "Premium Prayer Mat - Velvet",
      description: "A beautiful premium quality prayer mat made from soft velvet material with intricate Islamic geometric patterns. Perfect for daily prayers and travel.",
      price: 24900,
      discountPrice: 19900,
      stock: 150,
      weight: 0.5,
      dimensions: "120 x 70 x 0.5 cm",
      isActive: true,
      isFeatured: true,
      isFlashSale: false,
      tags: ["prayer", "velvet", "premium"],
    },
  })

  const tags = watch("tags") || []
  const isFlashSale = watch("isFlashSale")

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setValue("tags", [...tags, t])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setValue("tags", tags.filter(t => t !== tag))
  }

  const handleImageUpload = async () => {
    setUploading(true)
    await new Promise(r => setTimeout(r, 1000))
    setImages(prev => [...prev, `https://res.cloudinary.com/demo/image/upload/v1/products/img-${Date.now()}.jpg`])
    setUploading(false)
    toast.success("Image uploaded")
  }

  const onSubmit = async (data: EditFormData) => {
    await new Promise(r => setTimeout(r, 1500))
    toast.success(`Product "${data.name}" updated successfully!`)
    router.push("/admin/products")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Edit Product</h1>
          <p className="text-muted-foreground">Product ID: {params.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Edit the product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Product Name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Textarea
                  label="Description"
                  rows={5}
                  error={errors.description?.message}
                  {...register("description")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (₦)"
                    type="number"
                    error={errors.price?.message}
                    {...register("price")}
                  />
                  <Input
                    label="Discount Price (₦)"
                    type="number"
                    error={errors.discountPrice?.message}
                    {...register("discountPrice")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Manage product images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg border bg-muted overflow-hidden group">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="h-6 w-6 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1 block">Upload</span>
                      </div>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Stock Quantity"
                    type="number"
                    error={errors.stock?.message}
                    {...register("stock")}
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    error={errors.weight?.message}
                    {...register("weight")}
                  />
                </div>
                <Input label="Dimensions" {...register("dimensions")} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category *</label>
                  <Select defaultValue="prayer-mats" onValueChange={(v) => setValue("categoryId", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Brand</label>
                  <Select defaultValue="al-qalam" onValueChange={(v) => setValue("brandId", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(b => (
                        <SelectItem key={b} value={b.toLowerCase()}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Seller *</label>
                  <Select defaultValue="aishas-store" onValueChange={(v) => setValue("sellerId", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sellers.map(s => (
                        <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Active</label>
                  <Switch defaultChecked onCheckedChange={(v) => setValue("isActive", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Featured</label>
                  <Switch defaultChecked onCheckedChange={(v) => setValue("isFeatured", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Flash Sale</label>
                  <Switch onCheckedChange={(v) => setValue("isFlashSale", v)} />
                </div>
                {isFlashSale && (
                  <Input type="datetime-local" label="Flash Sale Ends" {...register("flashSaleEnds")} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                  />
                  <Button type="button" size="icon" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
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
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
