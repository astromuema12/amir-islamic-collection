<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Coupon;

class CartService
{
    public function getCart(): ?Cart
    {
        $cart = null;
        if (isset($_SESSION['user_id'])) {
            $cart = Cart::getOrCreate($_SESSION['user_id']);
        } elseif (isset($_SESSION['session_id'])) {
            $cart = Cart::getOrCreate(null, $_SESSION['session_id']);
        } else {
            $_SESSION['session_id'] = bin2hex(random_bytes(16));
            $cart = Cart::getOrCreate(null, $_SESSION['session_id']);
        }
        return $cart;
    }

    public function addItem(int $productId, int $quantity = 1, ?int $variantId = null): array
    {
        $product = Product::find($productId);
        if (!$product || $product->status !== 'active') {
            return ['success' => false, 'message' => 'Product not found'];
        }

        if ($product->stock_quantity < $quantity) {
            return ['success' => false, 'message' => 'Insufficient stock'];
        }

        $cart = $this->getCart();
        $price = $product->getEffectivePrice();

        $existingItem = null;
        foreach ($cart->items() as $item) {
            if ($item->product_id === $productId && $item->variant_id === $variantId) {
                $existingItem = $item;
                break;
            }
        }

        if ($existingItem) {
            $newQty = $existingItem->quantity + $quantity;
            if ($product->stock_quantity < $newQty) {
                return ['success' => false, 'message' => 'Insufficient stock'];
            }
            $existingItem->quantity = $newQty;
            $existingItem->total_price = $price * $newQty;
            $existingItem->save();
        } else {
            $cartItem = new CartItem([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'variant_id' => $variantId,
                'quantity' => $quantity,
                'unit_price' => $price,
                'total_price' => $price * $quantity
            ]);
            $cartItem->save();
        }

        $cart->recalculate();

        return ['success' => true, 'message' => 'Product added to cart', 'cart_count' => $cart->itemCount()];
    }

    public function updateQuantity(int $itemId, int $quantity): array
    {
        $cartItem = CartItem::find($itemId);
        if (!$cartItem) {
            return ['success' => false, 'message' => 'Item not found'];
        }

        $product = Product::find($cartItem->product_id);
        if ($product && $product->stock_quantity < $quantity) {
            return ['success' => false, 'message' => 'Insufficient stock'];
        }

        if ($quantity <= 0) {
            $cartItem->delete();
        } else {
            $price = $product ? $product->getEffectivePrice() : $cartItem->unit_price;
            $cartItem->quantity = $quantity;
            $cartItem->total_price = $price * $quantity;
            $cartItem->save();
        }

        $cart = Cart::find($cartItem->cart_id);
        if ($cart) {
            $cart->recalculate();
        }

        return ['success' => true, 'message' => 'Cart updated'];
    }

    public function removeItem(int $itemId): array
    {
        $cartItem = CartItem::find($itemId);
        if (!$cartItem) {
            return ['success' => false, 'message' => 'Item not found'];
        }

        $cartId = $cartItem->cart_id;
        $cartItem->delete();

        $cart = Cart::find($cartId);
        if ($cart) {
            $cart->recalculate();
        }

        return ['success' => true, 'message' => 'Item removed from cart'];
    }

    public function applyCoupon(string $code): array
    {
        $coupon = Coupon::findByCode($code);
        if (!$coupon) {
            return ['success' => false, 'message' => 'Invalid coupon code'];
        }

        $cart = $this->getCart();
        if (!$coupon->isValid($cart->subtotal)) {
            return ['success' => false, 'message' => 'Coupon is expired or invalid'];
        }

        if (isset($_SESSION['user_id']) && !$coupon->canUseByUser($_SESSION['user_id'])) {
            return ['success' => false, 'message' => 'Coupon usage limit reached'];
        }

        $discount = $coupon->calculateDiscount($cart->subtotal);
        $cart->coupon_id = $coupon->id;
        $cart->discount = $discount;
        $cart->recalculate();
        $cart->save();

        return ['success' => true, 'message' => 'Coupon applied', 'discount' => $discount];
    }

    public function removeCoupon(): array
    {
        $cart = $this->getCart();
        $cart->coupon_id = null;
        $cart->discount = 0;
        $cart->recalculate();
        $cart->save();

        return ['success' => true, 'message' => 'Coupon removed'];
    }

    public function clearCart(): void
    {
        $cart = $this->getCart();
        if ($cart) {
            foreach ($cart->items() as $item) {
                $item->delete();
            }
            $cart->subtotal = 0;
            $cart->discount = 0;
            $cart->tax = 0;
            $cart->shipping = 0;
            $cart->total = 0;
            $cart->coupon_id = null;
            $cart->save();
        }
    }

    public function getCartItems(): array
    {
        $cart = $this->getCart();
        $items = [];

        foreach ($cart->items() as $item) {
            $product = Product::find($item->product_id);
            $image = null;
            if ($product) {
                $primaryImg = $product->primaryImage();
                $image = $primaryImg ? $primaryImg->getUrl() : asset('images/no-image.jpg');
            }

            $items[] = [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'variant_id' => $item->variant_id,
                'name' => $product ? $product->name : 'Unknown',
                'slug' => $product ? $product->slug : '#',
                'image' => $image,
                'unit_price' => (float) $item->unit_price,
                'quantity' => (int) $item->quantity,
                'total_price' => (float) $item->total_price,
                'stock' => $product ? $product->stock_quantity : 0
            ];
        }

        return $items;
    }
}
