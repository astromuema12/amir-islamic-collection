"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, Star, ToggleLeft, ToggleRight } from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { PageHeader } from "@/components/admin/page-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { formatPrice } from "@/lib/utils"
import {
  getAdminProducts, getAdminCategories,
} from "@/lib/actions/admin-actions"
import {
  deleteProduct, setProductStatus, toggleFeatured,
} from "@/lib/actions/product-actions"

interface AdminProduct {
  id: string
  name: string
  slug: string
  sku: string
  price: string
  discountPrice: string | null
  stock: number
  images: string[] | null
  isActive: boolean
  isFeatured: boolean
  salesCount: number
  averageRating: string
  categoryName: string | null
  createdAt: Date
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortKey, setSortKey] = useState("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pageSize = 10

  useEffect(() => {
    getAdminCategories().then((cats) => setCategories(cats))
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const result = await getAdminProducts({
      search: search || undefined,
      categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
      status: statusFilter !== "all" ? (statusFilter as "active" | "inactive") : undefined,
      featured: featuredFilter === "featured" ? true : featuredFilter === "not-featured" ? false : undefined,
      page,
      limit: pageSize,
    })
    setProducts(result.products as AdminProduct[])
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [search, categoryFilter, statusFilter, featuredFilter, page])

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchProducts, search])

  const sorted = useMemo(() => {
    if (!sortKey) return products
    return [...products].sort((a, b) => {
      const aVal = a[sortKey as keyof AdminProduct]
      const bVal = b[sortKey as keyof AdminProduct]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal)
    })
  }, [products, sortKey, sortDir])

  const handleSort = (key: string, dir: "asc" | "desc") => {
    setSortKey(key)
    setSortDir(dir)
  }

  const handleToggleActive = async (p: AdminProduct) => {
    const res = await setProductStatus(p.id, !p.isActive)
    if ("error" in res) {
      toast.error(res.error!)
      return
    }
    setProducts((prev) => prev.map((pr) => (pr.id === p.id ? { ...pr, isActive: !p.isActive } : pr)))
    toast.success(p.isActive ? "Product deactivated" : "Product activated")
  }

  const handleToggleFeatured = async (p: AdminProduct) => {
    const res = await toggleFeatured(p.id)
    if ("error" in res) {
      toast.error(res.error!)
      return
    }
    setProducts((prev) => prev.map((pr) => (pr.id === p.id ? { ...pr, isFeatured: !p.isFeatured } : pr)))
    toast.success(p.isFeatured ? "Removed from featured" : "Marked as featured")
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await deleteProduct(deleteId)
    if ("error" in res) {
      toast.error(res.error!)
    } else {
      toast.success("Product deleted")
    }
    setDeleteId(null)
    fetchProducts()
  }

  const handleExportCSV = () => {
    const headers = ["Name", "SKU", "Category", "Price", "Stock", "Status", "Featured", "Sales", "Rating"]
    const rows = products.map((p) => [
      p.name, p.sku, p.categoryName || "", p.price, String(p.stock),
      p.isActive ? "Active" : "Inactive", p.isFeatured ? "Yes" : "No",
      String(p.salesCount), p.averageRating,
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `products-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Products exported to CSV")
  }

  const columns: Column<AdminProduct>[] = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border bg-muted text-xs font-medium">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              p.name.charAt(0)
            )}
          </div>
          <div>
            <Link
              href={`/admin/products/${p.id}/edit`}
              className="font-medium transition-colors hover:text-primary"
            >
              {p.name}
            </Link>
            <p className="text-xs text-muted-foreground">{p.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "categoryName",
      label: "Category",
      render: (p) => (p.categoryName ? <Badge variant="secondary">{p.categoryName}</Badge> : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      className: "text-right",
      render: (p) => (
        <div className="text-right">
          <p className="font-medium">{formatPrice(Number(p.price))}</p>
          {p.discountPrice && (
            <p className="text-xs text-muted-foreground line-through">{formatPrice(Number(p.discountPrice))}</p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      className: "text-right",
      render: (p) => (
        <span className={p.stock <= 5 ? "font-medium text-destructive" : ""}>{p.stock}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (p) =>
        p.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>,
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (p) =>
        p.isFeatured ? <Badge variant="warning">Featured</Badge> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: "averageRating",
      label: "Rating",
      sortable: true,
      className: "text-right",
      render: (p) => (
        <span className="flex items-center justify-end gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {Number(p.averageRating).toFixed(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View on site">
            <Link href={`/products/${p.slug}`} target="_blank">
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit">
            <Link href={`/admin/products/${p.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleToggleActive(p)}
            title={p.isActive ? "Deactivate" : "Activate"}
          >
            {p.isActive ? (
              <ToggleRight className="h-3.5 w-3.5 text-primary" />
            ) : (
              <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteId(p.id)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={featuredFilter} onValueChange={(v) => { setFeaturedFilter(v); setPage(1) }}>
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
        data={sorted}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDir}
        searchable
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by name or SKU..."
        isLoading={loading}
        onExport={handleExportCSV}
        emptyMessage="No products found"
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
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
