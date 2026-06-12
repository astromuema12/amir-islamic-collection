<?php

namespace App\Models;

class ShippingMethod extends Model
{
    protected static string $table = 'shipping_methods';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'name', 'description', 'price', 'free_shipping_min', 'estimated_days',
        'status', 'sort_order'
    ];

    public static function getActive(): array
    {
        return self::query(
            "SELECT * FROM shipping_methods WHERE status = 'active' ORDER BY sort_order ASC"
        );
    }

    public function calculateCost(float $subtotal): float
    {
        if ($this->free_shipping_min > 0 && $subtotal >= $this->free_shipping_min) {
            return 0;
        }
        return (float) $this->price;
    }
}
