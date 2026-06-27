"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Plus, Pencil, Trash2, Copy, Search, ToggleLeft, ToggleRight
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

const mockCoupons: Coupon[] = [
  { id: "1", code: "WELCOME10", type: "percentage", value: 10, minOrderAmount: 5000, maxDiscount: 5000, usageLimit: 100, usedCount: 45, expiresAt: new Date("2026-12-31"), isActive: true },
  { id: "2", code: "RAMADAN20", type: "percentage", value: 20, minOrderAmount: 10000, maxDiscount: 10000, usageLimit: null, usedCount: 234, expiresAt: new Date("2026-04-30"), isActive: true },
  { id: "3", code: "FLAT2000", type: "fixed", value: 2000, minOrderAmount: 15000, maxDiscount: null, usageLimit: 50, usedCount: 12, expiresAt: new Date("2026-06-30"), isActive: true },
  { id: "4", code: "NEWUSER", type: "percentage", value: 15, minOrderAmount: null, maxDiscount: 3000, usageLimit: 500, usedCount: 378, expiresAt: null, isActive: true },
  { id: "5", code: "EID50", type: "fixed", value: 5000, minOrderAmount: 25000, maxDiscount: null, usageLimit: 200, usedCount: 67, expiresAt: new Date("2026-07-15"), isActive: false },
  { id: "6", code: "FREESHIP", type: "fixed", value: 2500, minOrderAmount: 30000, maxDiscount: null, usageLimit: null, usedCount: 89, expiresAt: null, isActive: true },
]

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(mockCoupons)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
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

  const filtered = coupons.filter(c => !search || c.code.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / 10)
  const paginated = filtered.slice((page - 1) * 10, page * 10)

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

  const handleSave = () => {
    if (!formCode || !formValue) { toast.error("Code and value are required"); return }
    const couponData: Coupon = {
      id: editing?.id || `coupon-${Date.now()}`,
      code: formCode.toUpperCase(),
      type: formType,
      value: Number(formValue),
      minOrderAmount: formMinOrder ? Number(formMinOrder) : null,
      maxDiscount: formMaxDiscount ? Number(formMaxDiscount) : null,
      usageLimit: formUsageLimit ? Number(formUsageLimit) : null,
      usedCount: editing?.usedCount || 0,
      expiresAt: formExpiresAt ? new Date(formExpiresAt) : null,
      isActive: editing?.isActive ?? true,
    }

    if (editing) {
      setCoupons(prev => prev.map(c => c.id === editing.id ? couponData : c))
      toast.success("Coupon updated")
    } else {
      setCoupons(prev => [...prev, couponData])
      toast.success("Coupon created")
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setCoupons(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
    toast.success("Coupon deleted")
  }

  const handleToggle = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
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

      <DataTable columns={columns} data={paginated} total={filtered.length} page={page} totalPages={totalPages} onPageChange={setPage} searchable={false} />

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
