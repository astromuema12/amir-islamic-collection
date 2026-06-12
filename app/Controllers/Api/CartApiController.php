<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Services\CartService;

class CartApiController
{
    private CartService $cartService;

    public function __construct()
    {
        $this->cartService = new CartService();
    }

    public function index(Request $request, Response $response): void
    {
        $items = $this->cartService->getCartItems();
        $cart = $this->cartService->getCart();

        $response->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'subtotal' => (float) $cart->subtotal,
                'discount' => (float) $cart->discount,
                'tax' => (float) $cart->tax,
                'shipping' => (float) $cart->shipping,
                'total' => (float) $cart->total,
                'count' => $cart->itemCount()
            ]
        ]);
    }

    public function add(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $result = $this->cartService->addItem(
            (int) ($data['product_id'] ?? 0),
            (int) ($data['quantity'] ?? 1),
            isset($data['variant_id']) ? (int) $data['variant_id'] : null
        );
        $response->json($result);
    }

    public function update(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $result = $this->cartService->updateQuantity(
            (int) ($data['item_id'] ?? 0),
            (int) ($data['quantity'] ?? 0)
        );
        $response->json($result);
    }

    public function remove(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $result = $this->cartService->removeItem((int) ($data['item_id'] ?? 0));
        $response->json($result);
    }
}
