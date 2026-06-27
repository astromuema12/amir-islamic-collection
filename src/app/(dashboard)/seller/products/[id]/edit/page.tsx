"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Tag,
  Ruler,
  Weight,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  brandId: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  discountPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  weight: z.coerce.number().positive().optional().or(z.literal("")),
  dimensions: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isFlashSale: z.boolean().default(false),
  flashSaleEnds: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

const categories = [
  { id: "1", name: "Prayer Mats" },
  { id: "2", name: "Holy Qur'an" },
  { id: "3", name: "Hijabs" },
  { id: "4", name: "Perfumes" },
  { id: "5", name: "Wall Art" },
  { id: "6", name: "Tasbih" },
  { id: "7", name: "Islamic Clothing" },
  { id: "8", name: "Home Decor" },
  { id: "9", name: "Kids Collection" },
  { id: "10", name: "Accessories" },
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [tags, setTags] = useState<string[]>(["prayer", "velvet", "islamic"])
  const [tagInput, setTagInput] = useState("")
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "Material", value: "Velvet" },
    { key: "Size", value: "120 x 80 cm" },
  ])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
      price: undefined,
      discountPrice: undefined,
      stock: 0,
      weight: undefined,
      dimensions: "",
      isFeatured: false,
      isFlashSale: false,
      flashSaleEnds: "",
    },
  })

  const isFlashSale = watch("isFlashSale")

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        reset({
          name: "Premium Velvet Prayer Mat",
          description:
            "Beautiful handcrafted premium velvet prayer mat with intricate gold embroidery. Perfect for daily prayers and special occasions.",
          categoryId: "1",
          brandId: "1",
          price: 15000,
          discountPrice: 12000,
          stock: 45,
          weight: 0.5,
          dimensions: "120 x 80 x 0.5 cm",
          isFeatured: true,
          isFlashSale: true,
          flashSaleEnds: "2026-07-15T23:59",
        })
      } catch {
        toast.error("Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [reset])

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }])
  }

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const copy = [...specs]
    copy[index][field] = val
    setSpecs(copy)
  }

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("Product updated successfully!")
      router.push("/seller/products")
    } catch {
      toast.error("Failed to update product")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-sm text-muted-foreground">
            Update your product information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="e.g. Premium Velvet Prayer Mat"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <Textarea
                  label="Description"
                  placeholder="Describe your product in detail..."
                  className="min-h-[120px]"
                  error={errors.description?.message}
                  {...register("description")}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      defaultValue={watch("categoryId")}
                      onValueChange={(v) => setValue("categoryId", v)}
                    >
                      <SelectTrigger>
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
                      <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Brand (optional)</Label>
                    <Select
                      defaultValue={watch("brandId")}
                      onValueChange={(v) => setValue("brandId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Al Amir</SelectItem>
                        <SelectItem value="2">Noor Collections</SelectItem>
                        <SelectItem value="3">Islamic Heritage</SelectItem>
                        <SelectItem value="4">Barakah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Price (KES)"
                    type="number"
                    placeholder="15000"
                    error={errors.price?.message}
                    {...register("price")}
                  />
                  <Input
                    label="Discount Price (optional)"
                    type="number"
                    placeholder="12000"
                    error={errors.discountPrice?.message}
                    {...register("discountPrice")}
                  />
                </div>

                <Input
                  label="Stock Quantity"
                  type="number"
                  placeholder="0"
                  error={errors.stock?.message}
                  {...register("stock")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  maxFiles={5}
                  value={["/placeholder.svg", "/placeholder.svg"]}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Upload up to 5 images. First image will be the cover.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    step="0.01"
                    placeholder="0.5"
                    icon={<Weight className="h-4 w-4" />}
                    error={errors.weight?.message}
                    {...register("weight")}
                  />
                  <Input
                    label="Dimensions"
                    placeholder="30 x 20 x 5 cm"
                    icon={<Ruler className="h-4 w-4" />}
                    {...register("dimensions")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag and press Enter"
                    icon={<Tag className="h-4 w-4" />}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Input
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) => updateSpec(index, "key", e.target.value)}
                      wrapperClassName="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, "value", e.target.value)}
                      wrapperClassName="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => removeSpec(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpec}
                >
                  <Plus className="h-4 w-4" />
                  Add Specification
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <Label>Featured Product</Label>
                  </div>
                  <Switch
                    checked={watch("isFeatured")}
                    onCheckedChange={(v) => setValue("isFeatured", v)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-warning" />
                    <Label>Flash Sale</Label>
                  </div>
                  <Switch
                    checked={watch("isFlashSale")}
                    onCheckedChange={(v) => setValue("isFlashSale", v)}
                  />
                </div>
                {isFlashSale && (
                  <Input
                    type="datetime-local"
                    label="Flash Sale Ends"
                    {...register("flashSaleEnds")}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Product Image</p>
                </div>
                <div>
                  <p className="font-medium">
                    {watch("name") || "Product Name"}
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    {watch("price")
                      ? watch("discountPrice")
                        ? formatPrice(Number(watch("discountPrice")))
                        : formatPrice(Number(watch("price")))
                      : "₦0.00"}
                  </p>
                  {watch("discountPrice") && watch("price") && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(Number(watch("price")))}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Stock: {watch("stock") || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              variant="premium"
              size="lg"
              className="w-full"
              isLoading={submitting}
            >
              <Save className="h-4 w-4" />
              Update Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
