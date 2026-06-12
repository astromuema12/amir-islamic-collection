<?php

namespace App\Models;

class Review extends Model
{
    protected static string $table = 'reviews';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'product_id', 'user_id', 'order_id', 'rating', 'title',
        'comment', 'images', 'status', 'is_featured', 'helpful_count'
    ];

    public function product()
    {
        return Product::find($this->product_id);
    }

    public function user()
    {
        return User::find($this->user_id);
    }

    public static function getApproved(int $productId): array
    {
        return self::query(
            "SELECT r.*, u.first_name, u.last_name, u.avatar
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = ? AND r.status = 'approved'
             ORDER BY r.created_at DESC",
            [$productId]
        );
    }

    public static function getProductRating(int $productId): object
    {
        $stmt = self::db()->prepare("
            SELECT
                ROUND(AVG(rating), 2) as average,
                COUNT(*) as total,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            FROM reviews
            WHERE product_id = ? AND status = 'approved'
        ");
        $stmt->execute([$productId]);
        return $stmt->fetch();
    }
}
