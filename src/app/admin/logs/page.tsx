"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Download, Filter, FileSpreadsheet } from "lucide-react"
import { getAuditLogs } from "@/lib/actions/admin-actions"
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

const mockLogs: AuditLog[] = []

  const actionBadge = (action: string) => {
  const variants: Record<string, "default" | "success" | "warning" | "danger" | "secondary"> = {
    create: "success", update: "default", delete: "danger", view: "secondary",
    login: "default", logout: "secondary", update_status: "warning", approve: "success", reject: "danger",
  }
  return <Badge variant={variants[action] || "default"}>{action}</Badge>
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const loadLogs = useCallback(async (p: number, s: string, action: string, entity: string) => {
    setLoading(true)
    const result = await getAuditLogs({
      search: s || undefined,
      action: action === "all" ? undefined : action,
      entity: entity === "all" ? undefined : entity,
      page: p,
      limit: 15,
    })
    setLogs(result.logs.map(l => ({
      id: l.id,
      user: l.userName || "System",
      action: l.action,
      entity: l.entity,
      entityId: l.entityId,
      metadata: l.metadata || {},
      ipAddress: l.ipAddress || "",
      createdAt: l.createdAt,
    })))
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => loadLogs(page, search, actionFilter, entityFilter), 0)
    return () => clearTimeout(t)
  }, [loadLogs, page, search, actionFilter, entityFilter])

  const paginated = logs

  const handleExport = () => {
    const headers = ["User", "Action", "Entity", "Entity ID", "IP Address", "Timestamp"]
    const rows = logs.map(l => [l.user, l.action, l.entity, l.entityId, l.ipAddress, l.createdAt.toISOString()])
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
        <Badge variant="secondary" className="text-sm px-3 py-1">{total} total entries</Badge>
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
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchable={false}
        isLoading={loading}
      />
    </motion.div>
  )
}
