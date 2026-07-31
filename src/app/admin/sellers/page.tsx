"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Store, Star, CheckCircle, XCircle, Mail, Phone, Eye, Search, ExternalLink } from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { PageHeader } from "@/components/admin/page-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDate } from "@/lib/utils"
import { getSellers, verifySeller } from "@/lib/actions/admin-actions"
import toast from "react-hot-toast"

interface Seller {
  id: string
  userId: string
  storeName: string
  storeSlug: string
  description: string | null
  logo: string | null
  banner: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  isVerified: boolean
  rating: string
  totalSales: string
  balance: string
  createdAt: Date
  ownerName: string | null
  ownerEmail: string | null
  productCount: number
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [viewSeller, setViewSeller] = useState<Seller | null>(null)

  const fetchSellers = useCallback(async () => {
    setLoading(true)
    const result = await getSellers({
      search: search || undefined,
      verified: verifiedFilter !== "all" ? (verifiedFilter as "verified" | "pending") : undefined,
      page,
      limit: 10,
    })
    setSellers(result.sellers as Seller[])
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [search, verifiedFilter, page])

  useEffect(() => {
    const t = setTimeout(() => fetchSellers(), search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchSellers, search])

  const handleVerify = async (s: Seller, verified: boolean) => {
    const result = await verifySeller(s.id, verified)
    if ("error" in result) {
      toast.error(result.error)
      return
    }
    setSellers((prev) => prev.map((x) => (x.id === s.id ? { ...x, isVerified: verified } : x)))
    toast.success(verified ? "Seller verified" : "Seller verification rejected")
  }

  const columns: Column<Seller>[] = [
    {
      key: "storeName",
      label: "Store",
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={s.logo ?? undefined} />
            <AvatarFallback className="rounded-lg bg-muted text-xs">{s.storeName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <button onClick={() => setViewSeller(s)} className="text-left font-medium hover:text-primary">
              {s.storeName}
            </button>
            <p className="text-xs text-muted-foreground">{s.ownerName ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "isVerified",
      label: "Verified",
      render: (s) =>
        s.isVerified ? (
          <Badge variant="success">
            <CheckCircle className="mr-1 h-3 w-3" /> Verified
          </Badge>
        ) : (
          <Badge variant="warning">
            <XCircle className="mr-1 h-3 w-3" /> Pending
          </Badge>
        ),
    },
    {
      key: "productCount",
      label: "Products",
      className: "text-right",
      render: (s) => <span>{s.productCount}</span>,
    },
    {
      key: "totalSales",
      label: "Revenue",
      sortable: true,
      className: "text-right",
      render: (s) => <span className="font-medium">{formatPrice(Number(s.totalSales))}</span>,
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (s) => (
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {Number(s.rating).toFixed(1)}
        </span>
      ),
    },
    {
      key: "city",
      label: "Location",
      render: (s) => <span className="text-xs text-muted-foreground">{[s.city, s.state].filter(Boolean).join(", ") || "—"}</span>,
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (s) => <span className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          {!s.isVerified && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary"
              onClick={() => handleVerify(s, true)}
              title="Approve"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewSeller(s)} title="View">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          {s.ownerEmail && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Email">
              <Link href={`mailto:${s.ownerEmail}`}>
                <Mail className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sellers"
        description="Manage marketplace sellers"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sellers</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-[250px] pl-9"
          />
        </div>
        <p className="ml-auto text-sm text-muted-foreground">{total} total sellers</p>
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
          data={sellers}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          searchable={false}
          emptyMessage="No sellers found"
        />
      )}

      <Sheet open={!!viewSeller} onOpenChange={(o) => { if (!o) setViewSeller(null) }}>
        <SheetContent className="w-full sm:max-w-md">
          {viewSeller && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-xl">
                    <AvatarImage src={viewSeller.logo ?? undefined} />
                    <AvatarFallback className="rounded-xl bg-muted text-lg">{viewSeller.storeName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{viewSeller.storeName}</SheetTitle>
                    <SheetDescription>/{viewSeller.storeSlug}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  {viewSeller.isVerified ? (
                    <Badge variant="success">
                      <CheckCircle className="mr-1 h-3 w-3" /> Verified Seller
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      <XCircle className="mr-1 h-3 w-3" /> Pending Verification
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                    {Number(viewSeller.rating).toFixed(1)}
                  </Badge>
                </div>
                {viewSeller.description && (
                  <p className="text-sm text-muted-foreground">{viewSeller.description}</p>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-semibold">{viewSeller.productCount}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-semibold">{formatPrice(Number(viewSeller.totalSales))}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-semibold">{formatPrice(Number(viewSeller.balance))}</p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-semibold">{formatDate(viewSeller.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">Joined</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{viewSeller.ownerEmail ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{viewSeller.phone ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span>{[viewSeller.city, viewSeller.state, viewSeller.country].filter(Boolean).join(", ") || "—"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!viewSeller.isVerified && (
                    <Button size="sm" className="flex-1" onClick={() => handleVerify(viewSeller, true)}>
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                  )}
                  {viewSeller.ownerEmail && (
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={`mailto:${viewSeller.ownerEmail}`}>
                        <Mail className="mr-1 h-4 w-4" /> Contact
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/shop?seller=${viewSeller.storeSlug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
