"use client"

import { useState, useCallback, type ReactNode } from "react"
import {
  ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight,
  Search, Trash2, Download, Columns3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  hidden?: boolean
  render?: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onSort?: (key: string, direction: "asc" | "desc") => void
  sortKey?: string
  sortDirection?: "asc" | "desc"
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  idField?: string
  bulkActions?: { label: string; icon?: ReactNode; onClick: (ids: string[]) => void; variant?: "default" | "danger" | "outline" }[]
  onExport?: () => void
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<T>({
  columns, data, total, page, totalPages, onPageChange,
  onSort, sortKey, sortDirection, searchable, searchPlaceholder = "Search...",
  searchValue, onSearch, selectable, selectedIds = [], onSelectionChange,
  idField = "id", bulkActions, onExport, isLoading, emptyMessage = "No data found"
}: DataTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(c => c.key))

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange(data.map(item => String((item as Record<string, unknown>)[idField])))
    } else {
      onSelectionChange([])
    }
  }, [data, idField, onSelectionChange])

  const handleSelect = useCallback((id: string, checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    }
  }, [selectedIds, onSelectionChange])

  const visibleCols = columns.filter(col => visibleColumns.includes(col.key) && !col.hidden)

  return (
    <div className="space-y-4">
      {(searchable || bulkActions || onExport) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable && onSearch && (
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue || ""}
                onChange={e => onSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {bulkActions && selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {selectedIds.length} selected
                </span>
                {bulkActions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => action.onClick(selectedIds)}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columns.map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {visibleCols.map(col => (
                <TableHead
                  key={col.key}
                  className={cn(
                    col.sortable && "cursor-pointer select-none",
                    col.className
                  )}
                  onClick={() => {
                    if (!col.sortable || !onSort) return
                    const newDir = sortKey === col.key && sortDirection === "asc" ? "desc" : "asc"
                    onSort(col.key, newDir)
                  }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-muted-foreground">
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {selectable && <TableCell><div className="h-4 w-4 animate-pulse rounded bg-muted" /></TableCell>}
                  {visibleCols.map(col => (
                    <TableCell key={col.key}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleCols.length + (selectable ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : data.map((item) => {
                const rowId = String((item as Record<string, unknown>)[idField])
                return (
                <TableRow key={rowId}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(rowId)}
                        onCheckedChange={(checked) => handleSelect(rowId, !!checked)}
                        aria-label={`Select row ${rowId}`}
                      />
                    </TableCell>
                  )}
                  {visibleCols.map(col => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={i}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    className="w-9 p-0"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
