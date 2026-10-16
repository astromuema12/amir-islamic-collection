import { notFound } from "next/navigation"
import { getOrder } from "@/lib/actions/order-actions"
import { OrderDetailClient } from "./order-detail-client"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  return <OrderDetailClient order={order} />
}
