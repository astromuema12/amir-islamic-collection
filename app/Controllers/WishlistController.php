<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Wishlist;

class WishlistController
{
    public function index(Request $request, Response $response): void
    {
        $userId = $_SESSION['user_id'];
        $items = Wishlist::getUserWishlist($userId);

        $response->render('Frontend/wishlist', [
            'page_title' => 'My Wishlist - ' . SITE_NAME,
            'wishlistItems' => $items
        ]);
    }

    public function add(Request $request, Response $response): void
    {
        $productId = (int) $request->input('product_id');
        $userId = $_SESSION['user_id'];

        $existing = Wishlist::raw(
            "SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?",
            [$userId, $productId]
        );

        if (!$existing->fetch()) {
            $wishlist = new Wishlist(['user_id' => $userId, 'product_id' => $productId]);
            $wishlist->save();
            $result = ['success' => true, 'message' => 'Added to wishlist'];
        } else {
            $result = ['success' => true, 'message' => 'Already in wishlist'];
        }

        if ($request->isAjax()) {
            $response->json($result);
        }

        $_SESSION['success'] = $result['message'];
        $response->back();
    }

    public function remove(Request $request, Response $response): void
    {
        $productId = (int) $request->input('product_id');
        $userId = $_SESSION['user_id'];

        $stmt = Wishlist::raw(
            "DELETE FROM wishlists WHERE user_id = ? AND product_id = ?",
            [$userId, $productId]
        );

        $result = ['success' => true, 'message' => 'Removed from wishlist'];

        if ($request->isAjax()) {
            $response->json($result);
        }

        $_SESSION['success'] = $result['message'];
        $response->back();
    }
}
