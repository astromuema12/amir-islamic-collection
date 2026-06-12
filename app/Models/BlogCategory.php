<?php

namespace App\Models;

class BlogCategory extends Model
{
    protected static string $table = 'blog_categories';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'name', 'slug', 'description', 'status'
    ];

    public function blogs()
    {
        return Blog::where('category_id', '=', $this->id);
    }

    public function blogCount(): int
    {
        $stmt = self::db()->prepare("SELECT COUNT(*) as count FROM blogs WHERE category_id = ? AND status = 'published'");
        $stmt->execute([$this->id]);
        return (int) $stmt->fetch()->count;
    }
}
