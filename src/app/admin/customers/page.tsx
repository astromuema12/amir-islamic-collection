"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, Shield, Trash2, Mail, ExternalLink } from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { PageHeader } from "@/components/admin/page-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
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

const ROLES = ["user", "seller", "admin", "super_admin"]

const roleBadge = (role: string) => {
  const variants: Record<string, "default" | "secondary" | "success" | "danger"> = {
    admin: "default",
    seller: "success",
    user: "secondary",
    super_admin: "danger",
  }
  return <Badge variant={variants[role] || "secondary"}>{role}</Badge>
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
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
    setUsers(result.users as AdminUser[])
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [search, roleFilter, page])

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(), search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchUsers, search])

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
      fetchUsers()
    }
    setDeleting(false)
  }

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={u.image ?? undefined} />
            <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
          </Avatar>
          <div>
            <button onClick={() => setViewCustomer(u)} className="text-left font-medium hover:text-primary">
              {u.name}
            </button>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", label: "Role", render: (u) => roleBadge(u.role) },
    {
      key: "emailVerified",
      label: "Verified",
      render: (u) =>
        u.emailVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="secondary">Unverified</Badge>,
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (u) => <span className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewCustomer(u)} title="View">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => { setChangeRoleId(u.id); setNewRole(u.role) }}
            title="Change role"
          >
            <Shield className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteId(u.id)}
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
        title="Customers"
        description="Manage all registered users"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-[250px] pl-9"
          />
        </div>
        <p className="ml-auto text-sm text-muted-foreground">{total} total users</p>
      </div>

      {loading ? (
        <div className="space-y-2 rounded-lg border p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
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
          emptyMessage="No users found"
        />
      )}

      <Sheet open={!!viewCustomer} onOpenChange={(o) => { if (!o) setViewCustomer(null) }}>
        <SheetContent className="w-full sm:max-w-md">
          {viewCustomer && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={viewCustomer.image ?? undefined} />
                    <AvatarFallback className="text-sm">{getInitials(viewCustomer.name)}</AvatarFallback>
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
                  <p className="mb-1 text-sm font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">{formatDate(viewCustomer.createdAt)}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium">Last updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(viewCustomer.updatedAt)}</p>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <a href={`mailto:${viewCustomer.email}`}>
                      <Mail className="mr-1 h-4 w-4" /> Email
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() => { setDeleteId(viewCustomer.id); setViewCustomer(null) }}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!changeRoleId} onOpenChange={() => setChangeRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>This user&apos;s permissions will change immediately.</DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleId(null)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={!newRole}>Save Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will anonymize the user account. Personal data is cleared, they can no longer
              log in, and their orders remain intact. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Yes, Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
