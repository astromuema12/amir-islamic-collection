"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Plus, Pencil, Trash2, Copy, Eye, Check, X,
  Search, Filter, ArrowUpDown, Loader2, Star, ToggleLeft, ToggleRight
} from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { formatPrice, formatDate } from "@/lib/utils"
import { getProducts } from "@/lib/actions/product-actions"

interface Product {
  id: string
  name: string
  slug: string
  images: string[]
  price: number
  discountPrice?: number
  stock: number
  category?: { name: string }
  isActive: boolean
  isFeatured: boolean
  salesCount: number
  averageRating: number
  createdAt: Date
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await getProducts()
        setProducts(result.products.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          name: p.name as string,
          slug: p.slug as string,
          images: p.images as string[],
          price: Number(p.price),
          discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
          stock: p.stock as number,
          category: p.category as { name: string } | undefined,
          isActive: p.isActive as boolean,
          isFeatured: p.isFeatured as boolean,
          salesCount: p.salesCount as number,
          averageRating: Number(p.averageRating),
          createdAt: p.createdAt as Date,
        })))
      } catch {
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<string>("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pageSize = 10

  const filtered = products
    .filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== "all" && p.category?.name !== categoryFilter) return false
      if (statusFilter === "active" && !p.isActive) return false
      if (statusFilter === "inactive" && p.isActive) return false
      if (featuredFilter === "featured" && !p.isFeatured) return false
      if (featuredFilter === "not-featured" && p.isFeatured) return false
      return true
    })
    .sort((a, b) => {
      if (!sortKey) return 0
      const aVal = a[sortKey as keyof Product]
      const bVal = b[sortKey as keyof Product]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal)
    })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key: string, dir: "asc" | "desc") => {
    setSortKey(key)
    setSortDir(dir)
  }

  const handleBulkDelete = useCallback((ids: string[]) => {
    setProducts(prev => prev.filter(p => !ids.includes(p.id)))
    setSelectedIds([])
    toast.success(`${ids.length} products deleted`)
  }, [])

  const handleBulkActivate = useCallback((ids: string[]) => {
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, isActive: true } : p))
    setSelectedIds([])
    toast.success(`${ids.length} products activated`)
  }, [])

  const handleBulkDeactivate = useCallback((ids: string[]) => {
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, isActive: false } : p))
    setSelectedIds([])
    toast.success(`${ids.length} products deactivated`)
  }, [])

  const handleBulkFeatured = useCallback((ids: string[]) => {
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, isFeatured: true } : p))
    setSelectedIds([])
    toast.success(`${ids.length} products marked as featured`)
  }, [])

  const handleExportCSV = () => {
    const headers = ["Name", "Category", "Price", "Stock", "Status", "Sales", "Rating"]
    const rows = filtered.map(p => [
      p.name, p.category?.name || "", String(p.price), String(p.stock),
      p.isActive ? "Active" : "Inactive", String(p.salesCount), String(p.averageRating)
    ])
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `products-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Products exported to CSV")
  }

  const columns: Column<Product>[] = [
    {
      key: "name", label: "Product", sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium border">
            {p.images[0] ? (
              <img src={p.images[0]} alt="" className="h-full w-full object-cover rounded-lg" />
            ) : (
              p.name.charAt(0)
            )}
          </div>
          <div>
            <Link href={`/admin/products/${p.id}/edit`} className="font-medium hover:text-primary transition-colors">
              {p.name}
            </Link>
            <p className="text-xs text-muted-foreground">{p.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category", label: "Category", sortable: true,
      render: (p) => (
        <Badge variant="secondary">{p.category?.name}</Badge>
      ),
    },
    {
      key: "price", label: "Price", sortable: true,
      className: "text-right",
      render: (p) => (
        <div className="text-right">
          <p className="font-medium">{formatPrice(p.price)}</p>
          {p.discountPrice && (
            <p className="text-xs text-muted-foreground line-through">{formatPrice(p.discountPrice)}</p>
          )}
        </div>
      ),
    },
    {
      key: "stock", label: "Stock", sortable: true,
      className: "text-right",
      render: (p) => (
        <span className={p.stock <= 5 ? "text-destructive font-medium" : ""}>
          {p.stock}
        </span>
      ),
    },
    {
      key: "isActive", label: "Status", sortable: true,
      render: (p) => (
        p.isActive
          ? <Badge variant="success">Active</Badge>
          : <Badge variant="danger">Inactive</Badge>
      ),
    },
    {
      key: "salesCount", label: "Sales", sortable: true,
      className: "text-right",
    },
    {
      key: "averageRating", label: "Rating", sortable: true,
      className: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{p.averageRating}</span>
        </div>
      ),
    },
    {
      key: "actions", label: "Actions",
      className: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/admin/products/${p.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setProducts(prev => prev.map(pr => pr.id === p.id ? { ...pr, isActive: !pr.isActive } : pr))}
          >
            {p.isActive ? <ToggleRight className="h-3.5 w-3.5 text-emerald-500" /> : <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteId(p.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Prayer Mats">Prayer Mats</SelectItem>
            <SelectItem value="Holy Qur'an">Holy Qur&apos;an</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Home Decor">Home Decor</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="not-featured">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDir}
        searchable
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search products..."
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        idField="id"
        bulkActions={[
          { label: "Delete", icon: <Trash2 className="h-4 w-4 mr-1" />, variant: "danger", onClick: handleBulkDelete },
          { label: "Activate", onClick: handleBulkActivate },
          { label: "Deactivate", onClick: handleBulkDeactivate },
          { label: "Featured", onClick: handleBulkFeatured },
        ]}
        onExport={handleExportCSV}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setProducts(prev => prev.filter(p => p.id !== deleteId))
                setDeleteId(null)
                toast.success("Product deleted")
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
