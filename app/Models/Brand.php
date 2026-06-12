<?php

namespace App\Models;

class Brand extends Model
{
    protected static string $table = 'brands';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'name', 'slug', 'description', 'logo', 'website',
        'status', 'sort_order'
    ];

    public function products()
    {
        return Product::where('brand_id', '=', $this->id);
    }

    public function productCount(): int
    {
        $stmt = self::db()->prepare("SELECT COUNT(*) as count FROM products WHERE brand_id = ? AND status = 'active'");
        $stmt->execute([$this->id]);
        return (int) $stmt->fetch()->count;
    }
}
