<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Payment;
use App\Models\Cart;
use App\Models\Notification;
use App\Models\Coupon;

class OrderService
{
    private CartService $cartService;

    public function __construct()
    {
        $this->cartService = new CartService();
    }

    public function createOrder(array $data): array
    {
        $cart = $this->cartService->getCart();
        $items = $this->cartService->getCartItems();

        if (empty($items)) {
            return ['success' => false, 'message' => 'Cart is empty'];
        }

        $order = new Order();
        $order->order_number = Order::generateOrderNumber();
        $order->user_id = $_SESSION['user_id'] ?? null;
        $order->email = $data['email'] ?? '';
        $order->phone = $data['phone'] ?? '';
        $order->subtotal = $cart->subtotal;
        $order->discount = $cart->discount;
        $order->tax = $cart->tax;
        $order->shipping_cost = $cart->shipping;
        $order->total = $cart->total;
        $order->payment_method = $data['payment_method'] ?? 'mpesa';
        $order->coupon_code = $cart->coupon ? $cart->coupon->code : null;
        $order->shipping_method_id = $data['shipping_method_id'] ?? null;
        $order->shipping_address_id = $data['shipping_address_id'] ?? null;
        $order->billing_address_id = $data['billing_address_id'] ?? $data['shipping_address_id'] ?? null;
        $order->notes = $data['notes'] ?? '';
        $order->status = 'pending';
        $order->payment_status = 'pending';
        $order->ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $order->user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        if (!$order->save()) {
            return ['success' => false, 'message' => 'Failed to create order'];
        }

        foreach ($items as $item) {
            $orderItem = new OrderItem([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'product_name' => $item['name'],
                'product_sku' => '',
                'variant_name' => '',
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['total_price']
            ]);
            $orderItem->save();
        }

        if ($cart->coupon_id) {
            $usage = new \App\Models\CouponUsage([
                'coupon_id' => $cart->coupon_id,
                'user_id' => $_SESSION['user_id'] ?? 0,
                'order_id' => $order->id,
                'discount_amount' => $cart->discount
            ]);
            $usage->save();

            $coupon = Coupon::find($cart->coupon_id);
            if ($coupon) {
                $coupon->used_count = ($coupon->used_count ?? 0) + 1;
                $coupon->save();
            }
        }

        $this->cartService->clearCart();

        if (isset($_SESSION['user_id'])) {
            $notification = new Notification([
                'user_id' => $_SESSION['user_id'],
                'type' => 'order',
                'title' => 'Order Placed Successfully',
                'message' => "Your order #{$order->order_number} has been placed successfully.",
                'link' => url('orders/' . $order->id),
                'is_read' => 0
            ]);
            $notification->save();
        }

        return [
            'success' => true,
            'message' => 'Order created successfully',
            'order' => $order
        ];
    }

    public function updateOrderStatus(int $orderId, string $status, string $comment = ''): array
    {
        $order = Order::find($orderId);
        if (!$order) {
            return ['success' => false, 'message' => 'Order not found'];
        }

        $oldStatus = $order->status;
        $order->status = $status;
        $order->save();

        $history = new \App\Models\OrderStatusHistory([
            'order_id' => $order->id,
            'status' => $status,
            'comment' => $comment,
            'changed_by' => $_SESSION['admin_id'] ?? null
        ]);
        $history->save();

        if ($status === 'delivered') {
            $order->delivered_at = date('Y-m-d H:i:s');
            $order->save();
        }

        if ($order->user_id) {
            $notification = new Notification([
                'user_id' => $order->user_id,
                'type' => 'order_status',
                'title' => 'Order Status Updated',
                'message' => "Your order #{$order->order_number} is now {$status}.",
                'link' => url('orders/' . $order->id),
                'is_read' => 0
            ]);
            $notification->save();
        }

        return ['success' => true, 'message' => 'Order status updated'];
    }

    public function cancelOrder(int $orderId, string $reason = ''): array
    {
        $order = Order::find($orderId);
        if (!$order) {
            return ['success' => false, 'message' => 'Order not found'];
        }

        if (!$order->canBeCancelled()) {
            return ['success' => false, 'message' => 'Order cannot be cancelled'];
        }

        return $this->updateOrderStatus($orderId, 'cancelled', $reason);
    }

    public function getUserOrders(int $userId): array
    {
        return Order::getByUser($userId);
    }

    public function getOrderDetails(int $orderId): ?Order
    {
        return Order::find($orderId);
    }
}
