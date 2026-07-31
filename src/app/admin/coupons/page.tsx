"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Plus, Pencil, Trash2, Copy, Search, ToggleLeft, ToggleRight
} from "lucide-react"
import { getCoupons, manageCoupon, deleteCoupon, toggleCouponActive } from "@/lib/actions/admin-actions"
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
import { Switch } from "@/components/ui/switch"
import { formatPrice, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderAmount: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  expiresAt: Date | null
  isActive: boolean
}

const mockCoupons: Coupon[] = []

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [formCode, setFormCode] = useState("")
  const [formType, setFormType] = useState<"percentage" | "fixed">("percentage")
  const [formValue, setFormValue] = useState("")
  const [formMinOrder, setFormMinOrder] = useState("")
  const [formMaxDiscount, setFormMaxDiscount] = useState("")
  const [formUsageLimit, setFormUsageLimit] = useState("")
  const [formExpiresAt, setFormExpiresAt] = useState("")

  const loadCoupons = useCallback(async (p: number, s: string) => {
    setLoading(true)
    const result = await getCoupons({ search: s || undefined, page: p, limit: 10 })
    setCoupons(result.coupons)
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => loadCoupons(page, search), 0)
    return () => clearTimeout(t)
  }, [loadCoupons, page, search])

  const paginated = coupons

  const handleEdit = (coupon: Coupon) => {
    setEditing(coupon)
    setFormCode(coupon.code)
    setFormType(coupon.type)
    setFormValue(String(coupon.value))
    setFormMinOrder(coupon.minOrderAmount ? String(coupon.minOrderAmount) : "")
    setFormMaxDiscount(coupon.maxDiscount ? String(coupon.maxDiscount) : "")
    setFormUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : "")
    setFormExpiresAt(coupon.expiresAt ? coupon.expiresAt.toISOString().split("T")[0] : "")
    setDialogOpen(true)
  }

  const handleNew = () => {
    setEditing(null)
    setFormCode("")
    setFormType("percentage")
    setFormValue("")
    setFormMinOrder("")
    setFormMaxDiscount("")
    setFormUsageLimit("")
    setFormExpiresAt("")
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formCode || !formValue) { toast.error("Code and value are required"); return }
    const fd = new FormData()
    if (editing) fd.set("id", editing.id)
    fd.set("code", formCode)
    fd.set("type", formType)
    fd.set("value", formValue)
    if (formMinOrder) fd.set("minOrderAmount", formMinOrder)
    if (formMaxDiscount) fd.set("maxDiscount", formMaxDiscount)
    if (formUsageLimit) fd.set("usageLimit", formUsageLimit)
    if (formExpiresAt) fd.set("expiresAt", formExpiresAt)
    fd.set("isActive", String(editing?.isActive ?? true))

    const result = await manageCoupon(fd)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success(editing ? "Coupon updated" : "Coupon created")
    setDialogOpen(false)
    setPage(1)
    loadCoupons(1, search)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteCoupon(deleteId)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    setDeleteId(null)
    toast.success("Coupon deleted")
    loadCoupons(page, search)
  }

  const handleToggle = async (id: string) => {
    const target = coupons.find(c => c.id === id)
    if (!target) return
    const result = await toggleCouponActive(id, !target.isActive)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    loadCoupons(page, search)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied!")
  }

  const columns: Column<Coupon>[] = [
    {
      key: "code", label: "Code",
      render: (c) => (
        <div className="flex items-center gap-2">
          <code className="rounded bg-muted px-2 py-0.5 text-sm font-mono font-bold">{c.code}</code>
          <button onClick={() => copyCode(c.code)} className="text-muted-foreground hover:text-foreground">
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
    { key: "type", label: "Type", render: (c) => <Badge variant="secondary">{c.type}</Badge> },
    { key: "value", label: "Value", render: (c) => c.type === "percentage" ? `${c.value}%` : formatPrice(c.value) },
    { key: "usedCount", label: "Usage", render: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` },
    { key: "minOrderAmount", label: "Min Order", render: (c) => c.minOrderAmount ? formatPrice(c.minOrderAmount) : "-" },
    {
      key: "expiresAt", label: "Expires",
      render: (c) => c.expiresAt
        ? <span className={new Date(c.expiresAt) < new Date() ? "text-destructive" : ""}>{formatDate(c.expiresAt)}</span>
        : <span className="text-muted-foreground">Never</span>,
    },
    {
      key: "isActive", label: "Status",
      render: (c) => c.isActive
        ? <Badge variant="success">Active</Badge>
        : <Badge variant="danger">Inactive</Badge>,
    },
    {
      key: "actions", label: "Actions",
      render: (c) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(c)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(c.id)}>
            {c.isActive ? <ToggleRight className="h-3.5 w-3.5 text-emerald-500" /> : <ToggleLeft className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(c.id)}>
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
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Coupons</h1>
          <p className="text-muted-foreground">Manage discount coupons</p>
        </div>
        <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4" /> New Coupon</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search coupons..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
      </div>

      <DataTable columns={columns} data={paginated} total={total} page={page} totalPages={totalPages} onPageChange={setPage} searchable={false} isLoading={loading} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Coupon" : "New Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Coupon Code" value={formCode} onChange={e => setFormCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" />
              <div>
                <label className="text-sm font-medium mb-1.5 block">Type</label>
                <Select value={formType} onValueChange={(v: "percentage" | "fixed") => setFormType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input label={formType === "percentage" ? "Discount (%)" : "Discount Amount (KES)"} type="number" value={formValue} onChange={e => setFormValue(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Order Amount" type="number" value={formMinOrder} onChange={e => setFormMinOrder(e.target.value)} placeholder="Optional" />
              <Input label="Max Discount" type="number" value={formMaxDiscount} onChange={e => setFormMaxDiscount(e.target.value)} placeholder="Optional" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Usage Limit" type="number" value={formUsageLimit} onChange={e => setFormUsageLimit(e.target.value)} placeholder="Unlimited" />
              <Input label="Expires At" type="date" value={formExpiresAt} onChange={e => setFormExpiresAt(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Coupon"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this coupon?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
