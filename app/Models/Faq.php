<?php

namespace App\Models;

class Faq extends Model
{
    protected static string $table = 'faqs';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'question', 'answer', 'category', 'sort_order', 'is_active'
    ];

    public static function getActive(): array
    {
        return self::query(
            "SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC"
        );
    }

    public static function getByCategory(): array
    {
        $results = self::db()->query(
            "SELECT * FROM faqs WHERE is_active = 1 ORDER BY category, sort_order ASC"
        )->fetchAll();

        $grouped = [];
        foreach ($results as $row) {
            $grouped[$row['category']][] = new static($row);
        }
        return $grouped;
    }
}
