"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"

interface ProvidersProps {
  children: React.ReactNode
  nonce?: string
}

export function Providers({ children, nonce }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      nonce={nonce}
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
