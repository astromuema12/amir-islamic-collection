<?php

namespace App\Models;

class ProductImage extends Model
{
    protected static string $table = 'product_images';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'product_id', 'image_path', 'alt_text', 'sort_order', 'is_primary'
    ];

    public function product()
    {
        return Product::find($this->product_id);
    }

    public function getUrl(): string
    {
        return upload_url('products/' . $this->image_path);
    }
}
