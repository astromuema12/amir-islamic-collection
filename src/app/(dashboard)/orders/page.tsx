import type { Metadata } from "next"
import { getOrders } from "@/lib/actions/order-actions"
import { OrdersClient } from "./orders-client"

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage your orders",
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return <OrdersClient orders={orders} />
}
