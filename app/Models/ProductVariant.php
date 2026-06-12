<?php

namespace App\Models;

class ProductVariant extends Model
{
    protected static string $table = 'product_variants';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'product_id', 'name', 'sku', 'price', 'stock_quantity',
        'weight', 'is_default', 'sort_order'
    ];

    public function product()
    {
        return Product::find($this->product_id);
    }

    public function attributes()
    {
        return ProductVariantAttribute::where('variant_id', '=', $this->id);
    }
}
