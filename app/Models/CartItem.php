<?php

namespace App\Models;

class CartItem extends Model
{
    protected static string $table = 'cart_items';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'cart_id', 'product_id', 'variant_id', 'quantity', 'unit_price', 'total_price'
    ];

    public function product()
    {
        return Product::find($this->product_id);
    }

    public function variant()
    {
        return $this->variant_id ? ProductVariant::find($this->variant_id) : null;
    }
}
