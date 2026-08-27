"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Shield, Plus, Pencil, Trash2, Check, X, Users, Key
} from "lucide-react"
import {
  getRolesWithPermissions, manageRole, deleteRole,
  getUserRoleAssignments, assignUserRole
} from "@/lib/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import toast from "react-hot-toast"

interface Role {
  id: string
  name: string
  description: string | null
  userCount: number
  permissions: string[]
}

const allPermissions = [
  "view_products", "create_products", "edit_products", "delete_products",
  "view_orders", "create_orders", "edit_orders", "cancel_orders",
  "view_users", "create_users", "edit_users", "delete_users",
  "view_categories", "create_categories", "edit_categories", "delete_categories",
  "view_sellers", "approve_sellers", "reject_sellers",
  "view_coupons", "create_coupons", "edit_coupons", "delete_coupons",
  "view_reviews", "approve_reviews", "delete_reviews",
  "view_blogs", "create_blogs", "edit_blogs", "delete_blogs",
  "view_pages", "edit_pages",
  "view_media", "upload_media", "delete_media",
  "send_notifications",
  "view_settings", "edit_settings",
  "view_roles", "create_roles", "edit_roles", "delete_roles",
  "view_logs",
  "view_analytics", "export_reports",
  "view_seo", "edit_seo",
]

const permissionGroups = [
  { group: "Products", perms: allPermissions.filter(p => p.includes("product")) },
  { group: "Orders", perms: allPermissions.filter(p => p.includes("order")) },
  { group: "Users", perms: allPermissions.filter(p => p.includes("user")) },
  { group: "Categories", perms: allPermissions.filter(p => p.includes("categor")) },
  { group: "Sellers", perms: allPermissions.filter(p => p.includes("seller")) },
  { group: "Coupons", perms: allPermissions.filter(p => p.includes("coupon")) },
  { group: "Reviews", perms: allPermissions.filter(p => p.includes("review")) },
  { group: "Blogs", perms: allPermissions.filter(p => p.includes("blog")) },
  { group: "Pages", perms: allPermissions.filter(p => p.includes("page")) },
  { group: "Media", perms: allPermissions.filter(p => p.includes("media")) },
  { group: "Notifications", perms: allPermissions.filter(p => p.includes("notification")) },
  { group: "Settings & Roles", perms: allPermissions.filter(p => p.includes("settings") || p.includes("role") || p.includes("analytics") || p.includes("log") || p.includes("seo")) },
]

const permissionLabels: Record<string, string> = {
  view_products: "View Products", create_products: "Create Products", edit_products: "Edit Products", delete_products: "Delete Products",
  view_orders: "View Orders", create_orders: "Create Orders", edit_orders: "Edit Orders", cancel_orders: "Cancel Orders",
  view_users: "View Users", create_users: "Create Users", edit_users: "Edit Users", delete_users: "Delete Users",
  view_categories: "View Categories", create_categories: "Create Categories", edit_categories: "Edit Categories", delete_categories: "Delete Categories",
  view_sellers: "View Sellers", approve_sellers: "Approve Sellers", reject_sellers: "Reject Sellers",
  view_coupons: "View Coupons", create_coupons: "Create Coupons", edit_coupons: "Edit Coupons", delete_coupons: "Delete Coupons",
  view_reviews: "View Reviews", approve_reviews: "Approve Reviews", delete_reviews: "Delete Reviews",
  view_blogs: "View Blogs", create_blogs: "Create Blogs", edit_blogs: "Edit Blogs", delete_blogs: "Delete Blogs",
  view_pages: "View Pages", edit_pages: "Edit Pages",
  view_media: "View Media", upload_media: "Upload Media", delete_media: "Delete Media",
  send_notifications: "Send Notifications",
  view_settings: "View Settings", edit_settings: "Edit Settings",
  view_roles: "View Roles", create_roles: "Create Roles", edit_roles: "Edit Roles", delete_roles: "Delete Roles",
  view_logs: "View Logs",
  view_analytics: "View Analytics", export_reports: "Export Reports",
  view_seo: "View SEO", edit_seo: "Edit SEO",
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [formName, setFormName] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formPerms, setFormPerms] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("roles")
  const [assignments, setAssignments] = useState<{ id: string; name: string; email: string; roleId: string | null }[]>([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [savingAssignments, setSavingAssignments] = useState(false)

  const loadRoles = useCallback(async () => {
    setRoles(await getRolesWithPermissions())
  }, [])

  const loadAssignments = useCallback(async () => {
    setLoadingAssignments(true)
    const rows = await getUserRoleAssignments()
    setAssignments(rows.map(a => ({
      id: a.userId,
      name: a.name,
      email: a.email,
      roleId: a.assignedRoleId,
    })))
    setLoadingAssignments(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      loadRoles()
      loadAssignments()
    }, 0)
    return () => clearTimeout(t)
  }, [loadRoles, loadAssignments])

  const handleNew = () => {
    setEditing(null)
    setFormName(""); setFormDesc(""); setFormPerms([])
    setDialogOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditing(role)
    setFormName(role.name); setFormDesc(role.description || ""); setFormPerms([...role.permissions])
    setDialogOpen(true)
  }

  const togglePerm = (perm: string) => {
    setFormPerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    )
  }

  const handleSave = async () => {
    if (!formName.trim()) { toast.error("Role name is required"); return }
    const fd = new FormData()
    if (editing) fd.set("id", editing.id)
    fd.set("name", formName.trim())
    fd.set("description", formDesc)
    fd.set("permissions", JSON.stringify(formPerms))
    const result = await manageRole(fd)
    if (result?.error) { toast.error(result.error); return }
    setDialogOpen(false)
    await loadRoles()
    await loadAssignments()
    toast.success(editing ? "Role updated" : "Role created")
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteRole(deleteId)
    if (result?.error) { toast.error(result.error); return }
    setDeleteId(null)
    await loadRoles()
    await loadAssignments()
    toast.success("Role deleted")
  }

  const handleSaveAssignments = async () => {
    setSavingAssignments(true)
    const base = await getUserRoleAssignments()
    const baseMap = new Map(base.map(a => [a.userId, a.assignedRoleId ?? null]))
    const changed = assignments.filter(a => baseMap.get(a.id) !== a.roleId)
    for (const a of changed) {
      const result = await assignUserRole(a.id, a.roleId)
      if (result?.error) {
        setSavingAssignments(false)
        toast.error(result.error)
        return
      }
    }
    setSavingAssignments(false)
    await loadAssignments()
    toast.success(changed.length === 0 ? "No changes" : "Roles updated")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and access permissions</p>
        </div>
        <Button onClick={handleNew}><Plus className="mr-2 h-4 w-4" /> New Role</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles"><Shield className="h-4 w-4 mr-2" /> Roles</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" /> User Role Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 mt-6">
          {roles.map(role => (
            <Card key={role.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{role.userCount} users</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(role)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {role.id !== "super_admin" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(role.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 8).map(p => (
                    <Badge key={p} variant="outline" className="text-xs">
                      {permissionLabels[p] || p}
                    </Badge>
                  ))}
                  {role.permissions.length > 8 && (
                    <Badge variant="secondary" className="text-xs">+{role.permissions.length - 8} more</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Assign roles to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingAssignments ? (
                  <div className="p-4 text-sm text-muted-foreground">Loading users...</div>
                ) : assignments.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No users found</div>
                ) : assignments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{a.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                      </div>
                    </div>
                    <select
                      className="text-sm border rounded-lg px-2 py-1 bg-background"
                      value={a.roleId ?? ""}
                      onChange={e => setAssignments(prev => prev.map(x => x.id === a.id ? { ...x, roleId: e.target.value || null } : x))}
                    >
                      <option value="">No role</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <Button className="mt-4" size="sm" disabled={savingAssignments} onClick={handleSaveAssignments}>
                <Check className="mr-2 h-4 w-4" /> Save Assignments
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Role" : "New Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input label="Role Name" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Editor" />
            <Input label="Description" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Describe this role..." />
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-3">Permissions</h3>
              <div className="space-y-4">
                {permissionGroups.map(group => (
                  <div key={group.group}>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{group.group}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.perms.map(perm => (
                        <div key={perm} className="flex items-center gap-2">
                          <Switch
                            checked={formPerms.includes(perm)}
                            onCheckedChange={() => togglePerm(perm)}
                          />
                          <span className="text-sm">{permissionLabels[perm] || perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Role</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Users assigned to this role will lose their permissions.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
