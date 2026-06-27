"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
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
    </ThemeProvider>
  )
}
