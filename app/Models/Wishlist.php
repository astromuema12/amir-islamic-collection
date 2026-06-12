<?php

namespace App\Models;

class Wishlist extends Model
{
    protected static string $table = 'wishlists';
    protected static string $primaryKey = 'id';

    protected array $fillable = ['user_id', 'product_id'];

    public function product()
    {
        return Product::find($this->product_id);
    }

    public static function getUserWishlist(int $userId): array
    {
        return self::query(
            "SELECT w.*, p.name, p.slug, p.price, p.sale_price, p.stock_quantity,
                    pi.image_path as primary_image
             FROM wishlists w
             JOIN products p ON w.product_id = p.id
             LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
             WHERE w.user_id = ?
             ORDER BY w.created_at DESC",
            [$userId]
        );
    }

    public static function isInWishlist(int $userId, int $productId): bool
    {
        $wishlist = self::findBy('user_id', $userId);
        if (!$wishlist) return false;
        $item = self::raw(
            "SELECT id FROM wishlists WHERE user_id = ? AND product_id = ? LIMIT 1",
            [$userId, $productId]
        );
        return $item->fetch() !== false;
    }
}
