<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Models\Wishlist;

class WishlistApiController
{
    public function index(Request $request, Response $response): void
    {
        $items = Wishlist::getUserWishlist($_SESSION['user_id']);
        $response->json(['success' => true, 'data' => $items]);
    }

    public function add(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $wishlist = new Wishlist([
            'user_id' => $_SESSION['user_id'],
            'product_id' => (int) ($data['product_id'] ?? 0)
        ]);
        $wishlist->save();

        $response->json(['success' => true, 'message' => 'Added to wishlist']);
    }

    public function remove(Request $request, Response $response): void
    {
        $data = $request->getJson();
        Wishlist::raw(
            "DELETE FROM wishlists WHERE user_id = ? AND product_id = ?",
            [$_SESSION['user_id'], (int) ($data['product_id'] ?? 0)]
        );
        $response->json(['success' => true, 'message' => 'Removed from wishlist']);
    }
}
