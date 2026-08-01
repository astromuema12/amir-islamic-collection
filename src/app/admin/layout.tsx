import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SidebarProvider } from "@/components/admin/sidebar-context"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }
  if (user.role !== "admin" && user.role !== "super_admin") {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/40">
        <AdminSidebar />
        <div className="flex min-h-screen flex-col lg:pl-64">
          <AdminHeader />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
