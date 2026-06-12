<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;

class ShopController
{
    public function index(Request $request, Response $response): void
    {
        $page = (int)($request->query('page', 1));
        $limit = 12;
        $offset = ($page - 1) * $limit;
        $sort = $request->query('sort', 'newest');

        $filters = [
            'sort' => $sort,
            'min_price' => $request->query('min_price'),
            'max_price' => $request->query('max_price'),
            'category_id' => $request->query('category'),
            'brand_id' => $request->query('brand'),
        ];

        $query = $request->query('q', '');
        $products = [];
        $total = 0;

        if ($query) {
            $searchResults = Product::search($query, $filters, $limit, $offset);
            $products = $searchResults;
            $totalStmt = Product::raw(
                "SELECT COUNT(*) as total FROM products WHERE status = 'active' AND (name LIKE ? OR short_description LIKE ?)",
                ["%{$query}%", "%{$query}%"]
            );
            $total = (int) $totalStmt->fetch()->total;
        } else {
            $totalStmt = Product::raw("SELECT COUNT(*) as total FROM products WHERE status = 'active'");
            $total = (int) $totalStmt->fetch()->total;

            $sql = "SELECT * FROM products WHERE status = 'active'";
            $params = [];

            if ($filters['category_id']) {
                $sql .= " AND category_id = ?";
                $params[] = (int)$filters['category_id'];
            }
            if ($filters['brand_id']) {
                $sql .= " AND brand_id = ?";
                $params[] = (int)$filters['brand_id'];
            }

            $sortMap = [
                'price_low' => " ORDER BY COALESCE(sale_price, price) ASC",
                'price_high' => " ORDER BY COALESCE(sale_price, price) DESC",
                'popular' => " ORDER BY sales_count DESC",
                'rating' => " ORDER BY avg_rating DESC",
                'newest' => " ORDER BY created_at DESC"
            ];
            $sql .= $sortMap[$sort] ?? " ORDER BY created_at DESC";
            $sql .= " LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            $products = Product::query($sql, $params);
        }

        $categories = Category::getWithProductCount();
        $brands = Brand::query("SELECT * FROM brands WHERE status = 'active' ORDER BY name ASC");

        $response->render('Frontend/shop', [
            'page_title' => 'Shop - ' . SITE_NAME,
            'meta_description' => 'Browse our collection of Islamic products',
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'currentPage' => $page,
            'totalPages' => (int) ceil($total / $limit),
            'total' => $total,
            'sort' => $sort,
            'query' => $query
        ]);
    }

    public function category(Request $request, Response $response, string $category): void
    {
        $cat = Category::findBy('slug', $category);
        if (!$cat) {
            $response->setStatusCode(404);
            $response->render('Frontend/404');
            return;
        }

        $page = (int)($request->query('page', 1));
        $limit = 12;
        $offset = ($page - 1) * $limit;
        $sort = $request->query('sort', 'newest');

        $sortMap = [
            'price_low' => " ORDER BY COALESCE(sale_price, price) ASC",
            'price_high' => " ORDER BY COALESCE(sale_price, price) DESC",
            'popular' => " ORDER BY sales_count DESC",
            'rating' => " ORDER BY avg_rating DESC",
            'newest' => " ORDER BY created_at DESC"
        ];

        $sql = "SELECT * FROM products WHERE status = 'active' AND category_id = ?";
        $sql .= $sortMap[$sort] ?? " ORDER BY created_at DESC";
        $sql .= " LIMIT ? OFFSET ?";
        $products = Product::query($sql, [(int)$cat->id, $limit, $offset]);

        $countStmt = Product::raw("SELECT COUNT(*) as total FROM products WHERE status = 'active' AND category_id = ?", [$cat->id]);
        $total = (int) $countStmt->fetch()->total;

        $response->render('Frontend/shop', [
            'page_title' => $cat->name . ' - ' . SITE_NAME,
            'meta_description' => $cat->meta_description ?: 'Browse ' . $cat->name,
            'products' => $products,
            'categories' => Category::getWithProductCount(),
            'currentCategory' => $cat,
            'currentPage' => $page,
            'totalPages' => (int) ceil($total / $limit),
            'total' => $total,
            'sort' => $sort
        ]);
    }

    public function deals(Request $request, Response $response): void
    {
        $page = (int)($request->query('page', 1));
        $perPage = 12;
        $offset = ($page - 1) * $perPage;

        $products = Product::query(
            "SELECT * FROM products WHERE status = 'active' AND sale_price IS NOT NULL AND sale_price < price ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [$perPage, $offset]
        );
        $total = Product::raw("SELECT COUNT(*) as count FROM products WHERE status = 'active' AND sale_price IS NOT NULL AND sale_price < price")->fetch()->count ?? 0;

        $categories = Category::where('status', 'active');
        $brands = Brand::where('status', 'active');

        $response->render('Frontend/shop', [
            'page_title' => 'Deals & Discounts - ' . SITE_NAME,
            'meta_description' => 'Shop amazing deals and discounts on Islamic products',
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'currentPage' => $page,
            'totalPages' => (int)ceil($total / $perPage),
            'totalProducts' => $total,
            'currentCategory' => null,
            'sortBy' => 'newest',
            'minPrice' => 0,
            'maxPrice' => 999999
        ]);
    }

    public function search(Request $request, Response $response): void
    {
        $query = $request->query('q', '');
        if (!$query) {
            $response->redirect('/shop');
            return;
        }

        $page = (int)($request->query('page', 1));
        $perPage = 12;
        $offset = ($page - 1) * $perPage;

        $products = Product::query(
            "SELECT * FROM products WHERE status = 'active' AND (name LIKE ? OR description LIKE ? OR short_description LIKE ?) ORDER BY created_at DESC LIMIT ? OFFSET ?",
            ["%$query%", "%$query%", "%$query%", $perPage, $offset]
        );
        $total = Product::raw(
            "SELECT COUNT(*) as count FROM products WHERE status = 'active' AND (name LIKE ? OR description LIKE ? OR short_description LIKE ?)",
            ["%$query%", "%$query%", "%$query%"]
        )->fetch()->count ?? 0;

        $categories = Category::where('status', 'active');
        $brands = Brand::where('status', 'active');

        $response->render('Frontend/shop', [
            'page_title' => "Search: $query - " . SITE_NAME,
            'meta_description' => "Search results for $query",
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'currentPage' => $page,
            'totalPages' => (int)ceil($total / $perPage),
            'totalProducts' => $total,
            'currentCategory' => null,
            'sortBy' => 'newest',
            'minPrice' => 0,
            'maxPrice' => 999999,
            'searchQuery' => $query
        ]);
    }
}
