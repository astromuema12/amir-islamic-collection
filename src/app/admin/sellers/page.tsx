"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Store, Star, CheckCircle, XCircle, Mail, ExternalLink,
  Search, Phone, DollarSign, Eye
} from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

interface Seller {
  id: string
  storeName: string
  storeSlug: string
  owner: string
  email: string
  phone: string
  logo: string
  description: string
  city: string
  state: string
  isVerified: boolean
  rating: number
  productCount: number
  totalSales: number
  balance: number
  createdAt: Date
}

const mockSellers: Seller[] = []

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState(mockSellers)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [viewSeller, setViewSeller] = useState<Seller | null>(null)

  const filtered = sellers.filter(s =>
    !search || s.storeName.toLowerCase().includes(search.toLowerCase()) ||
    s.owner.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / 10)
  const paginated = filtered.slice((page - 1) * 10, page * 10)

  const handleVerify = (id: string, verified: boolean) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, isVerified: verified } : s))
    toast.success(verified ? "Seller verified" : "Verification rejected")
  }

  const columns: Column<Seller>[] = [
    {
      key: "store", label: "Store",
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={s.logo} />
            <AvatarFallback className="rounded-lg text-xs bg-primary/10 text-primary">
              {s.storeName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <button onClick={() => setViewSeller(s)} className="font-medium hover:text-primary text-left">
              {s.storeName}
            </button>
            <p className="text-xs text-muted-foreground">{s.owner}</p>
          </div>
        </div>
      ),
    },
    {
      key: "isVerified", label: "Verified",
      render: (s) => s.isVerified
        ? <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>
        : <Badge variant="warning"><XCircle className="h-3 w-3 mr-1" /> Pending</Badge>,
    },
    { key: "productCount", label: "Products", className: "text-right" },
    {
      key: "totalSales", label: "Revenue", sortable: true,
      render: (s) => <span className="font-medium">{formatPrice(s.totalSales)}</span>,
      className: "text-right",
    },
    {
      key: "rating", label: "Rating", sortable: true,
      render: (s) => (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{s.rating}</span>
        </div>
      ),
    },
    { key: "city", label: "Location", render: (s) => <span className="text-xs text-muted-foreground">{s.city}, {s.state}</span> },
    {
      key: "actions", label: "Actions",
      render: (s) => (
        <div className="flex items-center gap-1">
          {!s.isVerified && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500" onClick={() => handleVerify(s.id, true)}>
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleVerify(s.id, false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewSeller(s)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`mailto:${s.email}`}>
              <Mail className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Sellers</h1>
          <p className="text-muted-foreground">Manage marketplace sellers</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search sellers..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchable={false}
      />

      <Sheet open={!!viewSeller} onOpenChange={(o) => { if (!o) setViewSeller(null) }}>
        <SheetContent className="w-full sm:max-w-md">
          {viewSeller && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-xl">
                    <AvatarFallback className="rounded-xl text-lg bg-primary/10 text-primary">
                      {viewSeller.storeName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{viewSeller.storeName}</SheetTitle>
                    <SheetDescription>/{viewSeller.storeSlug}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  {viewSeller.isVerified
                    ? <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Verified Seller</Badge>
                    : <Badge variant="warning"><XCircle className="h-3 w-3 mr-1" /> Pending Verification</Badge>
                  }
                  <Badge variant="secondary"><Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />{viewSeller.rating}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{viewSeller.description}</p>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{viewSeller.productCount}</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-bold">{formatPrice(viewSeller.totalSales)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-bold">{formatPrice(viewSeller.balance)}</p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-lg font-bold">{formatDate(viewSeller.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">Joined</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{viewSeller.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{viewSeller.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span>{viewSeller.city}, {viewSeller.state}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/shop?seller=${viewSeller.storeSlug}`}>
                      <ExternalLink className="h-4 w-4 mr-1" /> View Store
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`mailto:${viewSeller.email}`}>
                      <Mail className="h-4 w-4 mr-1" /> Contact
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
