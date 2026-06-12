<?php

namespace App\Models;

class Order extends Model
{
    protected static string $table = 'orders';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'order_number', 'user_id', 'email', 'phone',
        'subtotal', 'discount', 'tax', 'shipping_cost', 'total',
        'paid_amount', 'coupon_code', 'discount_type', 'discount_value',
        'shipping_method_id', 'shipping_address_id', 'billing_address_id',
        'notes', 'status', 'payment_status', 'payment_method',
        'tracking_number', 'estimated_delivery', 'delivered_at',
        'invoice_number', 'invoice_url', 'ip_address', 'user_agent'
    ];

    public function items()
    {
        return OrderItem::where('order_id', '=', $this->id);
    }

    public function user()
    {
        return User::find($this->user_id);
    }

    public function payment()
    {
        return Payment::findBy('order_id', $this->id);
    }

    public function shippingAddress()
    {
        return Address::find($this->shipping_address_id);
    }

    public function billingAddress()
    {
        return Address::find($this->billing_address_id);
    }

    public function statusHistory()
    {
        return OrderStatusHistory::where('order_id', '=', $this->id);
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'completed';
    }

    public function isShipped(): bool
    {
        return in_array($this->status, ['shipped', 'delivered']);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'paid', 'processing']);
    }

    public static function getByUser(int $userId, int $limit = 10, int $offset = 0): array
    {
        return self::query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [$userId, $limit, $offset]
        );
    }

    public static function getByStatus(string $status): array
    {
        return self::where('status', '=', $status);
    }

    public static function generateOrderNumber(): string
    {
        return 'AIC-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('Ymd');
    }
}
