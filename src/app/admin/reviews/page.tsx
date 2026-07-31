"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { getReviews } from "@/lib/actions/admin-actions"
import { setReviewStatus, deleteReview } from "@/lib/actions/review-actions"
import {
  Star, ThumbsUp, ThumbsDown, Trash2, Search, MessageSquare
} from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface Review {
  id: string
  product: string
  user: string
  userImage: string
  rating: number
  title: string
  content: string
  isApproved: boolean
  createdAt: Date
}

const mockReviews: Review[] = []

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadReviews = useCallback(async (p: number, s: string, status: string) => {
    setLoading(true)
    const result = await getReviews({
      search: s || undefined,
      status: status === "all" ? undefined : (status as "approved" | "pending"),
      page: p,
      limit: 10,
    })
    setReviews(result.reviews.map(r => ({
      id: r.id,
      product: r.productName,
      user: r.userName,
      userImage: r.userImage || "",
      rating: r.rating,
      title: r.title || "",
      content: r.content || "",
      isApproved: r.isApproved,
      createdAt: r.createdAt,
    })))
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => loadReviews(page, search, statusFilter), 0)
    return () => clearTimeout(t)
  }, [loadReviews, page, search, statusFilter])

  const paginated = reviews

  const reload = () => loadReviews(page, search, statusFilter)

  const handleApprove = async (id: string) => {
    const result = await setReviewStatus(id, true)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success("Review approved")
    reload()
  }

  const handleReject = async (id: string) => {
    const result = await setReviewStatus(id, false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success("Review rejected")
    reload()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteReview(deleteId)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    setDeleteId(null)
    toast.success("Review deleted")
    reload()
  }

  const columns: Column<Review>[] = [
    {
      key: "content", label: "Review",
      render: (r) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{r.rating}/5</span>
          </div>
          <p className="text-sm font-medium">{r.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{r.content}</p>
        </div>
      ),
    },
    {
      key: "product", label: "Product",
      render: (r) => <span className="text-sm font-medium">{r.product}</span>,
    },
    {
      key: "user", label: "User",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{r.user.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{r.user}</span>
        </div>
      ),
    },
    {
      key: "isApproved", label: "Status",
      render: (r) => r.isApproved
        ? <Badge variant="success">Approved</Badge>
        : <Badge variant="warning">Pending</Badge>,
    },
    { key: "createdAt", label: "Date", render: (r) => <span className="text-xs text-muted-foreground">{formatDateTime(r.createdAt)}</span> },
    {
      key: "actions", label: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1">
          {!r.isApproved && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500" onClick={() => handleApprove(r.id)}>
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
          )}
          {r.isApproved && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => handleReject(r.id)}>
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(r.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Reviews</h1>
          <p className="text-muted-foreground">Manage product reviews and ratings</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {reviews.filter(r => !r.isApproved).length} pending
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reviews..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="pl-9 w-[250px]" />
        </div>
      </div>

      <DataTable columns={columns} data={paginated} total={total} page={page} totalPages={totalPages} onPageChange={setPage} searchable={false} isLoading={loading} />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The review will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
