<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\ProductImage;

class AdminProductController
{
    public function index(Request $request, Response $response): void
    {
        $page = (int)($request->query('page', 1));
        $limit = 20;
        $offset = ($page - 1) * $limit;

        $products = Product::query("
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        ", [$limit, $offset]);

        $total = Product::count();

        $response->render('Admin/products/index', [
            'page_title' => 'Products - Admin',
            'products' => $products,
            'currentPage' => $page,
            'totalPages' => (int) ceil($total / $limit)
        ]);
    }

    public function create(Request $request, Response $response): void
    {
        $categories = Category::getActive();
        $brands = Brand::query("SELECT * FROM brands WHERE status = 'active' ORDER BY name");

        $response->render('Admin/products/form', [
            'page_title' => 'Create Product - Admin',
            'product' => null,
            'categories' => $categories,
            'brands' => $brands
        ]);
    }

    public function store(Request $request, Response $response): void
    {
        $product = new Product([
            'category_id' => $request->input('category_id') ? (int) $request->input('category_id') : null,
            'brand_id' => $request->input('brand_id') ? (int) $request->input('brand_id') : null,
            'name' => $request->input('name'),
            'slug' => slugify($request->input('name')),
            'sku' => $request->input('sku'),
            'price' => (float) $request->input('price'),
            'sale_price' => $request->input('sale_price') ? (float) $request->input('sale_price') : null,
            'cost_price' => $request->input('cost_price') ? (float) $request->input('cost_price') : null,
            'short_description' => $request->input('short_description'),
            'description' => $request->input('description'),
            'stock_quantity' => (int) $request->input('stock_quantity', 0),
            'low_stock_threshold' => (int) ($request->input('low_stock_threshold', 5)),
            'is_featured' => $request->input('is_featured') ? 1 : 0,
            'is_bestseller' => $request->input('is_bestseller') ? 1 : 0,
            'is_trending' => $request->input('is_trending') ? 1 : 0,
            'is_new' => $request->input('is_new') ? 1 : 0,
            'is_digital' => $request->input('is_digital') ? 1 : 0,
            'meta_title' => $request->input('meta_title'),
            'meta_description' => $request->input('meta_description'),
            'weight' => $request->input('weight') ? (float) $request->input('weight') : null,
            'status' => $request->input('status', 'active'),
            'published_at' => $request->input('status') === 'active' ? date('Y-m-d H:i:s') : null
        ]);
        $product->save();

        if ($request->hasFile('images')) {
            $this->uploadImages($request, $product->id);
        }

        $_SESSION['success'] = 'Product created successfully';
        $response->redirect(url('admin/'));
    }

    public function edit(Request $request, Response $response, string $id): void
    {
        $product = Product::find((int)$id);
        if (!$product) {
            $_SESSION['error'] = 'Product not found';
            $response->redirect(url('admin/'));
            return;
        }

        $categories = Category::getActive();
        $brands = Brand::query("SELECT * FROM brands WHERE status = 'active' ORDER BY name");
        $images = $product->images();

        $response->render('Admin/products/form', [
            'page_title' => 'Edit Product - Admin',
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
            'images' => $images
        ]);
    }

    public function update(Request $request, Response $response, string $id): void
    {
        $product = Product::find((int)$id);
        if (!$product) {
            $_SESSION['error'] = 'Product not found';
            $response->redirect(url('admin/'));
            return;
        }

        $product->category_id = $request->input('category_id') ? (int) $request->input('category_id') : null;
        $product->brand_id = $request->input('brand_id') ? (int) $request->input('brand_id') : null;
        $product->name = $request->input('name');
        $product->slug = slugify($request->input('name'));
        $product->sku = $request->input('sku');
        $product->price = (float) $request->input('price');
        $product->sale_price = $request->input('sale_price') ? (float) $request->input('sale_price') : null;
        $product->cost_price = $request->input('cost_price') ? (float) $request->input('cost_price') : null;
        $product->short_description = $request->input('short_description');
        $product->description = $request->input('description');
        $product->stock_quantity = (int) $request->input('stock_quantity', 0);
        $product->low_stock_threshold = (int) ($request->input('low_stock_threshold', 5));
        $product->is_featured = $request->input('is_featured') ? 1 : 0;
        $product->is_bestseller = $request->input('is_bestseller') ? 1 : 0;
        $product->is_trending = $request->input('is_trending') ? 1 : 0;
        $product->is_new = $request->input('is_new') ? 1 : 0;
        $product->is_digital = $request->input('is_digital') ? 1 : 0;
        $product->meta_title = $request->input('meta_title');
        $product->meta_description = $request->input('meta_description');
        $product->weight = $request->input('weight') ? (float) $request->input('weight') : null;
        $product->status = $request->input('status', 'active');
        if ($product->status === 'active' && !$product->published_at) {
            $product->published_at = date('Y-m-d H:i:s');
        }
        $product->save();

        if ($request->hasFile('images')) {
            $this->uploadImages($request, $product->id);
        }

        $_SESSION['success'] = 'Product updated successfully';
        $response->redirect(url('admin/'));
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $product = Product::find((int)$id);
        if ($product) {
            $product->delete();
            $_SESSION['success'] = 'Product deleted';
        }
        $response->back();
    }

    private function uploadImages(Request $request, int $productId): void
    {
        $files = $request->file('images');
        if (!$files) return;

        if (is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($files['error'][$i] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                    $filename = $productId . '_' . time() . '_' . $i . '.' . $ext;
                    $dest = PUBLIC_PATH . '/uploads/products/' . $filename;
                    move_uploaded_file($files['tmp_name'][$i], $dest);

                    $image = new ProductImage([
                        'product_id' => $productId,
                        'image_path' => $filename,
                        'is_primary' => $i === 0 ? 1 : 0,
                        'sort_order' => $i
                    ]);
                    $image->save();
                }
            }
        }
    }
}

