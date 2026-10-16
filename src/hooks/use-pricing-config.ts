"use client"

import { useEffect, useState } from "react"
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from "@/lib/pricing"
import { fetchPricingConfig } from "@/lib/actions/pricing-actions"

let cached: PricingConfig | null = null
let inflight: Promise<PricingConfig> | null = null

/**
 * Returns the effective pricing config, starting from the env/constant
 * defaults and upgrading to the database-backed values once they load. The
 * result is cached at module scope so multiple components share one request.
 */
export function usePricingConfig(): PricingConfig {
  const [config, setConfig] = useState<PricingConfig>(
    () => cached ?? DEFAULT_PRICING_CONFIG,
  )

  useEffect(() => {
    if (cached) {
      return
    }
    if (!inflight) {
      inflight = fetchPricingConfig().catch(() => DEFAULT_PRICING_CONFIG)
    }
    let active = true
    inflight.then((resolved) => {
      cached = resolved
      if (active) setConfig(resolved)
    })
    return () => {
      active = false
    }
  }, [])

  return config
}
