import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")

    if (!idsParam) {
      return NextResponse.json({ products: [] })
    }

    const ids = idsParam.split(",").filter(Boolean)

    if (ids.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const result = await db
      .select()
      .from(products)
      .where(inArray(products.id, ids))

    return NextResponse.json({ products: result })
  } catch (error) {
    console.error("Failed to fetch products by IDs:", error)
    return NextResponse.json(
      { status: "error", message: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
