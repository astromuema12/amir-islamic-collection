"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Moon, Star, Sparkles } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-sm font-bold shadow-sm shadow-emerald-500/20">
              A
            </span>
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.2) 0%, transparent 50%)
              `,
            }}
          />
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M30 0 L60 30 L30 60 L0 30 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
                <circle cx="30" cy="30" r="8" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>

        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/30">
                  <Moon className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                Amir Islamic Collections
              </span>
            </h2>
            <p className="mt-4 max-w-md text-lg text-emerald-100/80 leading-relaxed">
              Discover premium Islamic products — prayer mats, Qur'an, hijabs, perfumes, and more.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { icon: Star, label: "Quality Products" },
                { icon: Sparkles, label: "Best Prices" },
                { icon: Moon, label: "Islamic Values" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <item.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-emerald-100/80">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm italic text-emerald-100/60">
                "The best among you are those who are best to others."
              </p>
              <p className="mt-2 text-xs text-emerald-100/40">— Prophet Muhammad (PBUH)</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
