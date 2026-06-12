<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Product;
use App\Models\Review;
use App\Models\Wishlist;

class ProductController
{
    public function show(Request $request, Response $response, string $slug): void
    {
        $product = Product::findBy('slug', $slug);
        if (!$product || $product->status !== 'active') {
            $response->setStatusCode(404);
            $response->render('Frontend/404');
            return;
        }

        $product->views_count = ($product->views_count ?? 0) + 1;
        $product->save();

        $images = $product->images();
        $variants = $product->variants();
        $category = $product->category();
        $brand = $product->brand();
        $reviews = Review::getApproved($product->id);
        $ratingStats = Review::getProductRating($product->id);

        $relatedProducts = [];
        if ($category) {
            $relatedProducts = Product::query(
                "SELECT * FROM products WHERE status = 'active' AND category_id = ? AND id != ? ORDER BY RAND() LIMIT 4",
                [(int)$category->id, (int)$product->id]
            );
        }

        $isInWishlist = false;
        if (isset($_SESSION['user_id'])) {
            $isInWishlist = Wishlist::isInWishlist($_SESSION['user_id'], $product->id);
        }

        if (isset($_SESSION['user_id'])) {
            $db = \App\Config\Database::getInstance()->getConnection();
            $driver = \App\Config\Database::getInstance()->getDriver();
            if ($driver === 'pgsql') {
                $stmt = $db->prepare(
                    "INSERT INTO recently_viewed (user_id, product_id, viewed_at) VALUES (?, ?, CURRENT_TIMESTAMP)
                     ON CONFLICT DO NOTHING"
                );
            } else {
                $stmt = $db->prepare(
                    "INSERT INTO recently_viewed (user_id, product_id, viewed_at) VALUES (?, ?, NOW())
                     ON DUPLICATE KEY UPDATE viewed_at = NOW()"
                );
            }
            $stmt->execute([$_SESSION['user_id'], $product->id]);
        }

        $response->render('Frontend/product-detail', [
            'page_title' => $product->name . ' - ' . SITE_NAME,
            'meta_description' => $product->meta_description ?: $product->short_description,
            'product' => $product,
            'images' => $images,
            'variants' => $variants,
            'category' => $category,
            'brand' => $brand,
            'reviews' => $reviews,
            'ratingStats' => $ratingStats,
            'relatedProducts' => $relatedProducts,
            'isInWishlist' => $isInWishlist
        ]);
    }
}
