<?php

namespace App\Models;

class Cart extends Model
{
    protected static string $table = 'carts';
    protected static string $primaryKey = 'id';

    protected array $fillable = [
        'user_id', 'session_id', 'coupon_id',
        'subtotal', 'discount', 'tax', 'shipping', 'total'
    ];

    public function items()
    {
        return CartItem::where('cart_id', '=', $this->id);
    }

    public function coupon()
    {
        return Coupon::find($this->coupon_id);
    }

    public function itemCount(): int
    {
        $stmt = self::db()->prepare("SELECT SUM(quantity) as count FROM cart_items WHERE cart_id = ?");
        $stmt->execute([$this->id]);
        return (int) ($stmt->fetch()->count ?? 0);
    }

    public function recalculate(): void
    {
        $stmt = self::db()->prepare("
            SELECT SUM(ci.total_price) as subtotal
            FROM cart_items ci
            WHERE ci.cart_id = ?
        ");
        $stmt->execute([$this->id]);
        $result = $stmt->fetch();

        $this->subtotal = (float) ($result->subtotal ?? 0);
        $this->tax = $this->subtotal * (SITE_TAX / 100);
        $this->total = $this->subtotal + $this->tax + $this->shipping - $this->discount;
        $this->save();
    }

    public static function getOrCreate(int $userId = null, string $sessionId = null): self
    {
        if ($userId) {
            $cart = self::findBy('user_id', $userId);
            if (!$cart) {
                $cart = new self(['user_id' => $userId, 'session_id' => $sessionId]);
                $cart->save();
            }
        } elseif ($sessionId) {
            $cart = self::findBy('session_id', $sessionId);
            if (!$cart) {
                $cart = new self(['session_id' => $sessionId]);
                $cart->save();
            }
        } else {
            $cart = new self();
            $cart->save();
        }

        return $cart;
    }
}
