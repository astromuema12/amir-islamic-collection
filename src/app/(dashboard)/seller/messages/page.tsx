"use client"

import { MessageSquare, Inbox } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function SellerMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Communicate with customers about their orders
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Messages Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            When customers contact you about their orders, their messages will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
