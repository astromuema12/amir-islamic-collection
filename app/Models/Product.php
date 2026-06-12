<?php

namespace App\Models;

class Product extends Model
{
    protected static string $table = 'products';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'category_id', 'brand_id', 'name', 'slug', 'sku', 'barcode',
        'short_description', 'description', 'price', 'sale_price', 'cost_price',
        'discount_percent', 'stock_quantity', 'low_stock_threshold',
        'weight', 'length', 'width', 'height',
        'meta_title', 'meta_description',
        'is_featured', 'is_bestseller', 'is_trending', 'is_new', 'is_digital',
        'status', 'views_count', 'sales_count', 'avg_rating', 'review_count',
        'sort_order', 'published_at'
    ];

    public function images()
    {
        return ProductImage::where('product_id', '=', $this->id);
    }

    public function primaryImage()
    {
        return ProductImage::findBy('product_id', $this->id);
    }

    public function variants()
    {
        return ProductVariant::where('product_id', '=', $this->id);
    }

    public function category()
    {
        return Category::find($this->category_id);
    }

    public function brand()
    {
        return Brand::find($this->brand_id);
    }

    public function reviews()
    {
        return Review::where('product_id', '=', $this->id);
    }

    public function getEffectivePrice(): float
    {
        return $this->sale_price ?? $this->price;
    }

    public function getDiscountPercent(): int
    {
        if ($this->sale_price && $this->price > 0) {
            return (int) round((($this->price - $this->sale_price) / $this->price) * 100);
        }
        return $this->discount_percent;
    }

    public function hasDiscount(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    public function inStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->low_stock_threshold && $this->stock_quantity > 0;
    }

    public static function getFeatured(int $limit = 8): array
    {
        return self::query(
            "SELECT * FROM products WHERE status = 'active' AND is_featured = 1 ORDER BY sort_order ASC LIMIT ?",
            [$limit]
        );
    }

    public static function getBestsellers(int $limit = 8): array
    {
        return self::query(
            "SELECT * FROM products WHERE status = 'active' AND is_bestseller = 1 ORDER BY sales_count DESC LIMIT ?",
            [$limit]
        );
    }

    public static function getTrending(int $limit = 8): array
    {
        return self::query(
            "SELECT * FROM products WHERE status = 'active' AND is_trending = 1 ORDER BY views_count DESC LIMIT ?",
            [$limit]
        );
    }

    public static function getNewArrivals(int $limit = 8): array
    {
        return self::query(
            "SELECT * FROM products WHERE status = 'active' AND is_new = 1 ORDER BY created_at DESC LIMIT ?",
            [$limit]
        );
    }

    public static function search(string $query, array $filters = [], int $limit = 20, int $offset = 0): array
    {
        $sql = "SELECT * FROM products WHERE status = 'active' AND (name LIKE ? OR short_description LIKE ? OR sku LIKE ?)";
        $params = ["%{$query}%", "%{$query}%", "%{$query}%"];

        if (!empty($filters['category_id'])) {
            $sql .= " AND category_id = ?";
            $params[] = $filters['category_id'];
        }

        if (!empty($filters['brand_id'])) {
            $sql .= " AND brand_id = ?";
            $params[] = $filters['brand_id'];
        }

        if (!empty($filters['min_price'])) {
            $sql .= " AND (sale_price IS NOT NULL AND sale_price >= ? OR sale_price IS NULL AND price >= ?)";
            $params[] = $filters['min_price'];
            $params[] = $filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $sql .= " AND (sale_price IS NOT NULL AND sale_price <= ? OR sale_price IS NULL AND price <= ?)";
            $params[] = $filters['max_price'];
            $params[] = $filters['max_price'];
        }

        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'price_low':
                $sql .= " ORDER BY COALESCE(sale_price, price) ASC";
                break;
            case 'price_high':
                $sql .= " ORDER BY COALESCE(sale_price, price) DESC";
                break;
            case 'popular':
                $sql .= " ORDER BY sales_count DESC";
                break;
            case 'rating':
                $sql .= " ORDER BY avg_rating DESC";
                break;
            default:
                $sql .= " ORDER BY created_at DESC";
        }

        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        return self::query($sql, $params);
    }
}
