<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Models\Product;

class ProductApiController
{
    public function index(Request $request, Response $response): void
    {
        $page = (int)($request->query('page', 1));
        $limit = (int)($request->query('limit', 12));
        $offset = ($page - 1) * $limit;

        $products = Product::query(
            "SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [$limit, $offset]
        );

        $count = Product::count();

        $data = array_map(function($p) {
            $img = $p->primaryImage();
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => (float) $p->price,
                'sale_price' => $p->sale_price ? (float) $p->sale_price : null,
                'image' => $img ? $img->getUrl() : null,
                'rating' => (float) $p->avg_rating,
                'reviews_count' => (int) $p->review_count,
                'in_stock' => $p->stock_quantity > 0
            ];
        }, $products);

        $response->json([
            'success' => true,
            'data' => $data,
            'total' => $count,
            'page' => $page,
            'per_page' => $limit
        ]);
    }

    public function show(Request $request, Response $response, string $id): void
    {
        $product = Product::find((int)$id);
        if (!$product || $product->status !== 'active') {
            $response->json(['error' => 'Product not found'], 404);
            return;
        }

        $images = $product->images();
        $variants = $product->variants();

        $response->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'price' => (float) $product->price,
                'sale_price' => $product->sale_price ? (float) $product->sale_price : null,
                'stock' => (int) $product->stock_quantity,
                'images' => array_map(fn($img) => $img->getUrl(), $images),
                'variants' => array_map(fn($v) => ['id' => $v->id, 'name' => $v->name, 'price' => $v->price, 'stock' => $v->stock_quantity], $variants),
                'rating' => (float) $product->avg_rating,
                'reviews_count' => (int) $product->review_count
            ]
        ]);
    }

    public function search(Request $request, Response $response): void
    {
        $query = $request->query('q', '');
        $products = Product::search($query, [], 20, 0);

        $response->json(['success' => true, 'data' => array_map(fn($p) => [
            'id' => $p->id, 'name' => $p->name, 'slug' => $p->slug, 'price' => (float) $p->price, 'sale_price' => $p->sale_price ? (float) $p->sale_price : null
        ], $products)]);
    }

    public function featured(Request $request, Response $response): void
    {
        $products = Product::getFeatured(8);
        $response->json(['success' => true, 'data' => array_map(fn($p) => [
            'id' => $p->id, 'name' => $p->name, 'slug' => $p->slug, 'price' => (float) $p->price, 'sale_price' => $p->sale_price ? (float) $p->sale_price : null
        ], $products)]);
    }

    public function bestsellers(Request $request, Response $response): void
    {
        $products = Product::getBestsellers(8);
        $response->json(['success' => true, 'data' => array_map(fn($p) => [
            'id' => $p->id, 'name' => $p->name, 'slug' => $p->slug, 'price' => (float) $p->price, 'sale_price' => $p->sale_price ? (float) $p->sale_price : null
        ], $products)]);
    }
}
