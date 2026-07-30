"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Search, Shield, Ban, CheckCircle, ExternalLink, Mail,
  ShoppingBag, DollarSign, Calendar, Trash2, Loader2
} from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, formatPrice } from "@/lib/utils"
import { getUsers, deleteUser, updateUserRole } from "@/lib/actions/admin-actions"
import toast from "react-hot-toast"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
}

const roleBadge = (role: string) => {
  const variants: Record<string, "default" | "secondary" | "premium" | "danger"> = {
    admin: "premium", seller: "default", user: "secondary", super_admin: "danger",
  }
  return <Badge variant={variants[role] || "secondary"}>{role}</Badge>
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewCustomer, setViewCustomer] = useState<AdminUser | null>(null)
  const [changeRoleId, setChangeRoleId] = useState<string | null>(null)
  const [newRole, setNewRole] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const result = await getUsers({
      search: search || undefined,
      role: roleFilter !== "all" ? roleFilter : undefined,
      page,
      limit: 10,
    })
    setUsers(result.users)
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [search, roleFilter, page])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = async () => {
    if (!changeRoleId || !newRole) return
    const result = await updateUserRole(changeRoleId, newRole)
    if ("error" in result) {
      toast.error(result.error!)
    } else {
      toast.success("User role updated")
      setChangeRoleId(null)
      setNewRole("")
      fetchUsers()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteUser(deleteId)
    if ("error" in result) {
      toast.error(result.error!)
    } else {
      toast.success("User deleted successfully")
      setDeleteId(null)
      setSelectedIds((prev) => prev.filter((id) => id !== deleteId))
      fetchUsers()
    }
    setDeleting(false)
  }

  const columns: Column<AdminUser>[] = [
    {
      key: "name", label: "User", sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={u.image ?? undefined} />
            <AvatarFallback className="text-xs">{u.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <button onClick={() => setViewCustomer(u)} className="font-medium hover:text-primary text-left">
              {u.name}
            </button>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", label: "Role", render: (u) => roleBadge(u.role) },
    {
      key: "emailVerified", label: "Verified",
      render: (u) => u.emailVerified
        ? <Badge variant="success">Verified</Badge>
        : <Badge variant="secondary">Unverified</Badge>,
    },
    {
      key: "createdAt", label: "Joined", sortable: true,
      render: (u) => <span className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>,
    },
    {
      key: "actions", label: "Actions",
      render: (u) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewCustomer(u)}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setChangeRoleId(u.id); setNewRole(u.role) }}>
            <Shield className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(u.id)}>
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
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Customers</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <p className="text-sm text-muted-foreground">{total} total users</p>
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          searchable={false}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          idField="id"
        />
      )}

      {/* View Customer Sheet */}
      <Sheet open={!!viewCustomer} onOpenChange={(o) => { if (!o) setViewCustomer(null) }}>
        <SheetContent className="w-full sm:max-w-md">
          {viewCustomer && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={viewCustomer.image ?? undefined} />
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
                  {viewCustomer.emailVerified
                    ? <Badge variant="success">Verified</Badge>
                    : <Badge variant="secondary">Unverified</Badge>}
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Joined</p>
                  <p className="text-sm text-muted-foreground">{formatDate(viewCustomer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(viewCustomer.updatedAt)}</p>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <a href={`mailto:${viewCustomer.email}`}>
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() => { setDeleteId(viewCustomer.id); setViewCustomer(null) }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
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

      {/* Delete User Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will anonymize the user account. The user&apos;s personal data will be cleared,
              and they will no longer be able to log in. Orders and content created by this user
              will remain intact. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Deleting...</> : "Yes, Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
