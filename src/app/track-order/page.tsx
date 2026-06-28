"use client"

import { useState } from "react"
import { Search, Package, Truck } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Track Order" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Truck className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Track Your Order</h1>
              <p className="text-muted-foreground mt-1">Enter your order details to check the status</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <Card className="border-2">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                label="Order ID"
                placeholder="e.g. ORD-001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full gap-2">
                <Search className="h-4 w-4" />
                Track Order
              </Button>
            </form>

            {searched && (
              <div className="mt-8 p-6 rounded-xl bg-muted/50 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  To track your order, please log in to your account and visit the
                  orders section for real-time updates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
