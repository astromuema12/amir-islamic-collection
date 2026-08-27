"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Toaster } from "react-hot-toast"
import { SellerSidebar } from "@/components/dashboard/seller-sidebar"
import { csrfFetch } from "@/lib/csrf-client"
import { APP_NAME } from "@/lib/constants"

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [storeName] = useState("Amir Store")
  const [isVerified] = useState(false)

  const handleLogout = async () => {
    try {
      const res = await csrfFetch("/api/auth/logout", { method: "POST" })
      if (res.ok) router.push("/login")
    } catch {
      router.push("/login")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar
        storeName={storeName}
        isVerified={isVerified}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between border-b bg-card pl-14 pr-4 py-3 lg:px-8">
          <div className="flex items-center gap-2">
            {!isVerified && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                Your store is not yet verified. Complete your profile to get verified.
              </motion.div>
            )}
            {isVerified && (
              <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Store Verified
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {APP_NAME} Seller Dashboard
          </p>
        </div>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-background)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
          },
        }}
      />
    </div>
  )
}
