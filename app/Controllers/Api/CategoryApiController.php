<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Models\Category;

class CategoryApiController
{
    public function index(Request $request, Response $response): void
    {
        $categories = Category::getWithProductCount();
        $response->json(['success' => true, 'data' => array_map(fn($c) => [
            'id' => $c->id, 'name' => $c->name, 'slug' => $c->slug, 'product_count' => (int) $c->product_count
        ], $categories)]);
    }

    public function products(Request $request, Response $response, string $id): void
    {
        $category = Category::find((int)$id);
        if (!$category) {
            $response->json(['error' => 'Category not found'], 404);
            return;
        }

        $products = $category->products();
        $response->json(['success' => true, 'data' => array_map(fn($p) => [
            'id' => $p->id, 'name' => $p->name, 'slug' => $p->slug, 'price' => (float) $p->price
        ], $products)]);
    }
}
