<?php

namespace App\Models;

class OrderItem extends Model
{
    protected static string $table = 'order_items';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'order_id', 'product_id', 'product_name', 'product_sku',
        'variant_name', 'quantity', 'unit_price', 'total_price'
    ];

    public function order()
    {
        return Order::find($this->order_id);
    }

    public function product()
    {
        return Product::find($this->product_id);
    }
}
