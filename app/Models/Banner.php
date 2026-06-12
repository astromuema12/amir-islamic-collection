<?php

namespace App\Models;

class Banner extends Model
{
    protected static string $table = 'banners';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'title', 'subtitle', 'description', 'image', 'link',
        'btn_text', 'sort_order', 'placement', 'status'
    ];

    public static function getActive(string $placement = 'hero'): array
    {
        return self::query(
            "SELECT * FROM banners WHERE status = 'active' AND placement = ? ORDER BY sort_order ASC",
            [$placement]
        );
    }
}
