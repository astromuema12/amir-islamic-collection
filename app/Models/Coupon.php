<?php

namespace App\Models;

class Coupon extends Model
{
    protected static string $table = 'coupons';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'code', 'type', 'value', 'min_order_amount', 'max_discount',
        'usage_limit', 'used_count', 'per_user_limit',
        'applies_to', 'applies_to_id', 'starts_at', 'expires_at', 'is_active'
    ];

    public function isValid(float $orderTotal = 0): bool
    {
        if (!$this->is_active) return false;

        $now = date('Y-m-d H:i:s');
        if ($this->starts_at && $now < $this->starts_at) return false;
        if ($this->expires_at && $now > $this->expires_at) return false;
        if ($this->usage_limit > 0 && $this->used_count >= $this->usage_limit) return false;
        if ($this->min_order_amount > 0 && $orderTotal < $this->min_order_amount) return false;

        return true;
    }

    public function calculateDiscount(float $amount): float
    {
        if ($this->type === 'percentage') {
            $discount = $amount * ($this->value / 100);
            if ($this->max_discount && $discount > $this->max_discount) {
                return $this->max_discount;
            }
            return $discount;
        }
        return min($this->value, $amount);
    }

    public static function findByCode(string $code): ?self
    {
        return self::findBy('code', $code);
    }

    public function canUseByUser(int $userId): bool
    {
        if ($this->per_user_limit <= 0) return true;
        $stmt = self::db()->prepare("SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?");
        $stmt->execute([$this->id, $userId]);
        return (int) $stmt->fetch()->count < $this->per_user_limit;
    }
}
