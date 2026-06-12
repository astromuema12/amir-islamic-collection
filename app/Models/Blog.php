<?php

namespace App\Models;

class Blog extends Model
{
    protected static string $table = 'blogs';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'category_id', 'author_id', 'title', 'slug', 'excerpt', 'content',
        'featured_image', 'tags', 'meta_title', 'meta_description',
        'status', 'is_featured', 'views_count', 'published_at'
    ];

    public function category()
    {
        return BlogCategory::find($this->category_id);
    }

    public function author()
    {
        return Admin::find($this->author_id);
    }

    public static function getPublished(int $limit = 10, int $offset = 0): array
    {
        return self::query(
            "SELECT b.*, bc.name as category_name, a.name as author_name
             FROM blogs b
             LEFT JOIN blog_categories bc ON b.category_id = bc.id
             LEFT JOIN admins a ON b.author_id = a.id
             WHERE b.status = 'published'
             ORDER BY b.published_at DESC
             LIMIT ? OFFSET ?",
            [$limit, $offset]
        );
    }

    public static function getByCategory(int $categoryId): array
    {
        return self::query(
            "SELECT * FROM blogs WHERE category_id = ? AND status = 'published' ORDER BY published_at DESC",
            [$categoryId]
        );
    }

    public static function getFeatured(): array
    {
        return self::query(
            "SELECT * FROM blogs WHERE status = 'published' AND is_featured = 1 ORDER BY published_at DESC LIMIT 3"
        );
    }

    public static function recent(int $limit = 5): array
    {
        return self::query(
            "SELECT * FROM blogs WHERE status = 'published' ORDER BY published_at DESC LIMIT ?",
            [$limit]
        );
    }
}
