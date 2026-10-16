"use server"

import { getPricingConfig } from "@/lib/pricing-config"
import type { PricingConfig } from "@/lib/pricing"

/** Public pricing config (tax + shipping) for client components. */
export async function fetchPricingConfig(): Promise<PricingConfig> {
  return getPricingConfig()
}
