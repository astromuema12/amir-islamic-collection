<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Services\CartService;

class CartController
{
    private CartService $cartService;

    public function __construct()
    {
        $this->cartService = new CartService();
    }

    public function index(Request $request, Response $response): void
    {
        $cartItems = $this->cartService->getCartItems();
        $cart = $this->cartService->getCart();

        $response->render('Frontend/cart', [
            'page_title' => 'Shopping Cart - ' . SITE_NAME,
            'cartItems' => $cartItems,
            'cart' => $cart
        ]);
    }

    public function add(Request $request, Response $response): void
    {
        $productId = (int) $request->input('product_id');
        $quantity = (int) ($request->input('quantity', 1));
        $variantId = $request->input('variant_id') ? (int) $request->input('variant_id') : null;

        $result = $this->cartService->addItem($productId, $quantity, $variantId);

        if ($request->isAjax()) {
            $response->json($result);
        }

        if ($result['success']) {
            $_SESSION['success'] = $result['message'];
        } else {
            $_SESSION['error'] = $result['message'];
        }

        $response->back();
    }

    public function update(Request $request, Response $response): void
    {
        $itemId = (int) $request->input('item_id');
        $quantity = (int) $request->input('quantity');

        $result = $this->cartService->updateQuantity($itemId, $quantity);

        if ($request->isAjax()) {
            $response->json($result);
        }

        $response->back();
    }

    public function remove(Request $request, Response $response): void
    {
        $itemId = (int) $request->input('item_id');

        $result = $this->cartService->removeItem($itemId);

        if ($request->isAjax()) {
            $response->json($result);
        }

        $response->back();
    }

    public function applyCoupon(Request $request, Response $response): void
    {
        $code = $request->input('code');
        $result = $this->cartService->applyCoupon($code);

        if ($request->isAjax()) {
            $response->json($result);
        }

        if ($result['success']) {
            $_SESSION['success'] = $result['message'];
        } else {
            $_SESSION['error'] = $result['message'];
        }

        $response->back();
    }

    public function removeCoupon(Request $request, Response $response): void
    {
        $result = $this->cartService->removeCoupon();

        if ($request->isAjax()) {
            $response->json($result);
        }

        $_SESSION['success'] = $result['message'];
        $response->back();
    }
}
