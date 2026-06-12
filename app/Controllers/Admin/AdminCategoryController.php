<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Category;

class AdminCategoryController
{
    public function index(Request $request, Response $response): void
    {
        $categories = Category::query("
            SELECT c.*, p.name as parent_name,
                   (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
            FROM categories c
            LEFT JOIN categories p ON c.parent_id = p.id
            ORDER BY c.sort_order ASC
        ");

        $parentCategories = Category::getParentCategories();

        $response->render('Admin/categories/index', [
            'page_title' => 'Categories - Admin',
            'categories' => $categories,
            'parentCategories' => $parentCategories
        ]);
    }

    public function create(Request $request, Response $response): void
    {
        $parentCategories = Category::getParentCategories();
        $response->render('Admin/categories/form', [
            'page_title' => 'Create Category - Admin',
            'category' => null,
            'parentCategories' => $parentCategories
        ]);
    }

    public function store(Request $request, Response $response): void
    {
        $category = new Category([
            'parent_id' => $request->input('parent_id') ? (int) $request->input('parent_id') : null,
            'name' => $request->input('name'),
            'slug' => slugify($request->input('name')),
            'description' => $request->input('description'),
            'meta_title' => $request->input('meta_title'),
            'meta_description' => $request->input('meta_description'),
            'sort_order' => (int) $request->input('sort_order', 0),
            'status' => $request->input('status', 'active')
        ]);
        $category->save();

        $_SESSION['success'] = 'Category created successfully';
        $response->redirect(url('admin/'));
    }

    public function edit(Request $request, Response $response, string $id): void
    {
        $category = Category::find((int)$id);
        if (!$category) {
            $response->redirect(url('admin/'));
            return;
        }
        $parentCategories = Category::getParentCategories();
        $response->render('Admin/categories/form', [
            'page_title' => 'Edit Category - Admin',
            'category' => $category,
            'parentCategories' => $parentCategories
        ]);
    }

    public function update(Request $request, Response $response, string $id): void
    {
        $category = Category::find((int)$id);
        if (!$category) {
            $response->redirect(url('admin/'));
            return;
        }

        $category->parent_id = $request->input('parent_id') ? (int) $request->input('parent_id') : null;
        $category->name = $request->input('name');
        $category->slug = slugify($request->input('name'));
        $category->description = $request->input('description');
        $category->meta_title = $request->input('meta_title');
        $category->meta_description = $request->input('meta_description');
        $category->sort_order = (int) $request->input('sort_order', 0);
        $category->status = $request->input('status', 'active');
        $category->save();

        $_SESSION['success'] = 'Category updated successfully';
        $response->redirect(url('admin/'));
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $category = Category::find((int)$id);
        if ($category) {
            $category->delete();
            $_SESSION['success'] = 'Category deleted';
        }
        $response->back();
    }
}

