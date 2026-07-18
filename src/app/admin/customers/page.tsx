"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search, Shield, Ban, CheckCircle, ExternalLink, Mail,
  ShoppingBag, DollarSign, Calendar
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
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

interface Customer {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "banned"
  image?: string
  ordersCount: number
  totalSpent: number
  joinedAt: Date
}

const mockCustomers: Customer[] = []

const roleBadge = (role: string) => {
  const variants: Record<string, "default" | "secondary" | "premium" | "danger"> = {
    admin: "premium", seller: "default", user: "secondary", super_admin: "danger",
  }
  return <Badge variant={variants[role] || "secondary"}>{role}</Badge>
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [changeRoleId, setChangeRoleId] = useState<string | null>(null)
  const [newRole, setNewRole] = useState("")
  const [banId, setBanId] = useState<string | null>(null)

  const filtered = customers.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== "all" && c.role !== roleFilter) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / 10)
  const paginated = filtered.slice((page - 1) * 10, page * 10)

  const handleBanToggle = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "banned" ? "active" : "banned" } : c))
    setBanId(null)
    toast.success("User status updated")
  }

  const handleRoleChange = () => {
    if (!changeRoleId || !newRole) return
    setCustomers(prev => prev.map(c => c.id === changeRoleId ? { ...c, role: newRole } : c))
    setChangeRoleId(null)
    setNewRole("")
    toast.success("User role updated")
  }

  const columns: Column<Customer>[] = [
    {
      key: "name", label: "User", sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={c.image} />
            <AvatarFallback className="text-xs">{c.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <button onClick={() => setViewCustomer(c)} className="font-medium hover:text-primary text-left">
              {c.name}
            </button>
            <p className="text-xs text-muted-foreground">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", label: "Role", render: (c) => roleBadge(c.role) },
    {
      key: "status", label: "Status",
      render: (c) => (
        c.status === "active"
          ? <Badge variant="success">Active</Badge>
          : <Badge variant="danger">Banned</Badge>
      ),
    },
    { key: "ordersCount", label: "Orders", className: "text-right" },
    {
      key: "totalSpent", label: "Total Spent", sortable: true,
      render: (c) => <span className="font-medium">{formatPrice(c.totalSpent)}</span>,
      className: "text-right",
    },
    { key: "joinedAt", label: "Joined", sortable: true,
      render: (c) => <span className="text-xs text-muted-foreground">{formatDate(c.joinedAt)}</span>,
    },
    {
      key: "actions", label: "Actions",
      render: (c) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewCustomer(c)}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setChangeRoleId(c.id); setNewRole(c.role) }}>
            <Shield className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setBanId(c.id)}>
            {c.status === "banned" ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Ban className="h-3.5 w-3.5 text-destructive" />
            )}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Customers</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="seller">Seller</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 w-[250px]"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchable={false}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        idField="id"
      />

      {/* View Customer Sheet */}
      <Sheet open={!!viewCustomer} onOpenChange={(o) => { if (!o) setViewCustomer(null) }}>
        <SheetContent className="w-full sm:max-w-md">
          {viewCustomer && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-sm">{viewCustomer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{viewCustomer.name}</SheetTitle>
                    <SheetDescription>{viewCustomer.email}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  {roleBadge(viewCustomer.role)}
                  {viewCustomer.status === "banned" && <Badge variant="danger">Banned</Badge>}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <ShoppingBag className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-2xl font-bold">{viewCustomer.ordersCount}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <DollarSign className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-2xl font-bold">{formatPrice(viewCustomer.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Joined</p>
                  <p className="text-sm text-muted-foreground">{formatDate(viewCustomer.joinedAt)}</p>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`mailto:${viewCustomer.email}`}>
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant={viewCustomer.status === "banned" ? "outline" : "danger"}
                    className="flex-1"
                    onClick={() => { handleBanToggle(viewCustomer.id); setViewCustomer(null) }}
                  >
                    {viewCustomer.status === "banned" ? (
                      <><CheckCircle className="h-4 w-4 mr-1" /> Unban</>
                    ) : (
                      <><Ban className="h-4 w-4 mr-1" /> Ban</>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Change Role Dialog */}
      <Dialog open={!!changeRoleId} onOpenChange={() => setChangeRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleId(null)}>Cancel</Button>
            <Button onClick={handleRoleChange}>Save Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Confirm Dialog */}
      <Dialog open={!!banId} onOpenChange={() => setBanId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {customers.find(c => c.id === banId)?.status === "banned"
              ? "Unban this user? They will regain access to their account."
              : "Ban this user? They will lose access to their account."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleBanToggle(banId!)}>
              {customers.find(c => c.id === banId)?.status === "banned" ? "Unban" : "Ban"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
