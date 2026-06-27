"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, Filter, FileSpreadsheet } from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface AuditLog {
  id: string
  user: string
  action: string
  entity: string
  entityId: string
  metadata: Record<string, unknown>
  ipAddress: string
  createdAt: Date
}

const mockLogs: AuditLog[] = Array.from({ length: 100 }, (_, i) => ({
  id: `log-${i + 1}`,
  user: ["Admin User", "Aisha Bello", "System", "Fatima Usman"][Math.floor(Math.random() * 4)],
  action: ["create", "update", "delete", "view", "login", "logout", "update_status", "approve", "reject"][Math.floor(Math.random() * 9)],
  entity: ["product", "order", "user", "category", "coupon", "blog", "review", "seller"][Math.floor(Math.random() * 8)],
  entityId: `ent-${Math.random().toString(36).slice(2, 8)}`,
  metadata: {},
  ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
}))

  const actionBadge = (action: string) => {
  const variants: Record<string, "default" | "success" | "warning" | "danger" | "secondary"> = {
    create: "success", update: "default", delete: "danger", view: "secondary",
    login: "default", logout: "secondary", update_status: "warning", approve: "success", reject: "danger",
  }
  return <Badge variant={variants[action] || "default"}>{action}</Badge>
}

export default function AdminLogsPage() {
  const [logs] = useState(mockLogs)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = logs.filter(l => {
    if (search && !l.user.toLowerCase().includes(search.toLowerCase()) && !l.entityId.toLowerCase().includes(search.toLowerCase())) return false
    if (actionFilter !== "all" && l.action !== actionFilter) return false
    if (entityFilter !== "all" && l.entity !== entityFilter) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / 15)
  const paginated = filtered.slice((page - 1) * 15, page * 15)

  const handleExport = () => {
    const headers = ["User", "Action", "Entity", "Entity ID", "IP Address", "Timestamp"]
    const rows = filtered.map(l => [l.user, l.action, l.entity, l.entityId, l.ipAddress, l.createdAt.toISOString()])
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `audit-logs-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success("Logs exported")
  }

  const columns: Column<AuditLog>[] = [
    { key: "user", label: "User", sortable: true },
    { key: "action", label: "Action", render: (l) => actionBadge(l.action) },
    { key: "entity", label: "Entity", render: (l) => <Badge variant="outline">{l.entity}</Badge> },
    { key: "entityId", label: "Entity ID", render: (l) => <code className="text-xs text-muted-foreground">{l.entityId}</code> },
    { key: "ipAddress", label: "IP Address", render: (l) => <span className="text-xs font-mono text-muted-foreground">{l.ipAddress}</span> },
    { key: "createdAt", label: "Timestamp", sortable: true, render: (l) => <span className="text-xs text-muted-foreground">{formatDateTime(l.createdAt)}</span> },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Audit Logs</h1>
          <p className="text-muted-foreground">View system activity and audit trail</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">{logs.length} total entries</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by user or entity..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
            </div>
            <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="coupon">Coupon</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchable={false}
      />
    </motion.div>
  )
}
