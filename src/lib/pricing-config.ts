import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from "@/lib/pricing"

const STANDARD_METHOD = "Standard Shipping"
const EXPRESS_METHOD = "Express Shipping"

/**
 * Resolves the effective pricing configuration by merging database settings
 * (set by admins in `/admin/settings`) on top of the env/constant defaults.
 * Falls back to the defaults if the settings row is missing or unreadable.
 */
export async function getPricingConfig(): Promise<PricingConfig> {
  try {
    const [row] = await db
      .select({ shippingSettings: settings.shippingSettings })
      .from(settings)
      .where(eq(settings.id, 1))
      .limit(1)

    const shippingSettings = row?.shippingSettings ?? {}
    const base = DEFAULT_PRICING_CONFIG

    const methods = base.shipping.methods.map((method) => {
      if (method.name === STANDARD_METHOD && shippingSettings.standardRate != null) {
        return { ...method, price: shippingSettings.standardRate }
      }
      if (method.name === EXPRESS_METHOD && shippingSettings.expressRate != null) {
        return { ...method, price: shippingSettings.expressRate }
      }
      return method
    })

    return {
      tax: base.tax,
      shipping: {
        freeThreshold:
          shippingSettings.freeShippingThreshold ?? base.shipping.freeThreshold,
        methods,
      },
    }
  } catch {
    return DEFAULT_PRICING_CONFIG
  }
}
