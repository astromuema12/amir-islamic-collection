import Link from "next/link"
import type { Metadata } from "next"
import { Frown, Home, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "404 - Page Not Found - Amir Islamic Collections",
  description: "The page you are looking for does not exist. Return to our homepage to continue shopping for premium Islamic products.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Frown className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-primary mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry, we could not find the page you are looking for. It might have
          been moved, deleted, or the link might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="default" size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>Try searching for what you need</span>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
