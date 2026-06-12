<?php

namespace App\Models;

class Category extends Model
{
    protected static string $table = 'categories';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'parent_id', 'name', 'slug', 'description', 'icon', 'image',
        'meta_title', 'meta_description', 'sort_order', 'status'
    ];

    public function children()
    {
        return static::where('parent_id', '=', $this->id);
    }

    public function parent()
    {
        return static::find($this->parent_id);
    }

    public function products()
    {
        return Product::where('category_id', '=', $this->id);
    }

    public function productCount(): int
    {
        $stmt = self::db()->prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ? AND status = 'active'");
        $stmt->execute([$this->id]);
        return (int) $stmt->fetch()->count;
    }

    public static function getActive(): array
    {
        return self::query("SELECT * FROM categories WHERE status = 'active' ORDER BY sort_order ASC");
    }

    public static function getParentCategories(): array
    {
        return self::query("SELECT * FROM categories WHERE parent_id IS NULL AND status = 'active' ORDER BY sort_order ASC");
    }

    public static function getWithProductCount(): array
    {
        return self::query("
            SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'active') as product_count
            FROM categories c
            WHERE c.status = 'active'
            ORDER BY c.sort_order ASC
        ");
    }
}
