<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Blog;
use App\Models\BlogCategory;

class AdminBlogController
{
    public function index(Request $request, Response $response): void
    {
        $blogs = Blog::query("
            SELECT b.*, bc.name as category_name, a.name as author_name
            FROM blogs b
            LEFT JOIN blog_categories bc ON b.category_id = bc.id
            LEFT JOIN admins a ON b.author_id = a.id
            ORDER BY b.created_at DESC
        ");
        $response->render('Admin/blogs/index', [
            'page_title' => 'Blogs - Admin',
            'blogs' => $blogs
        ]);
    }

    public function create(Request $request, Response $response): void
    {
        $categories = BlogCategory::query("SELECT * FROM blog_categories WHERE status = 'active'");
        $response->render('Admin/blogs/form', [
            'page_title' => 'Create Blog - Admin',
            'blog' => null,
            'categories' => $categories
        ]);
    }

    public function store(Request $request, Response $response): void
    {
        $blog = new Blog([
            'category_id' => $request->input('category_id') ? (int) $request->input('category_id') : null,
            'author_id' => $_SESSION['admin_id'],
            'title' => $request->input('title'),
            'slug' => slugify($request->input('title')),
            'excerpt' => $request->input('excerpt'),
            'content' => $request->input('content'),
            'tags' => $request->input('tags'),
            'meta_title' => $request->input('meta_title'),
            'meta_description' => $request->input('meta_description'),
            'status' => $request->input('status', 'draft'),
            'is_featured' => $request->input('is_featured') ? 1 : 0,
            'published_at' => $request->input('status') === 'published' ? date('Y-m-d H:i:s') : null
        ]);
        $blog->save();

        if ($request->hasFile('featured_image')) {
            $file = $request->file('featured_image');
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'blog_' . $blog->id . '_' . time() . '.' . $ext;
            move_uploaded_file($file['tmp_name'], PUBLIC_PATH . '/uploads/blogs/' . $filename);
            $blog->featured_image = $filename;
            $blog->save();
        }

        $_SESSION['success'] = 'Blog created';
        $response->redirect(url('admin/'));
    }

    public function edit(Request $request, Response $response, string $id): void
    {
        $blog = Blog::find((int)$id);
        if (!$blog) {
            $response->redirect(url('admin/'));
            return;
        }
        $categories = BlogCategory::query("SELECT * FROM blog_categories WHERE status = 'active'");
        $response->render('Admin/blogs/form', [
            'page_title' => 'Edit Blog - Admin',
            'blog' => $blog,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Response $response, string $id): void
    {
        $blog = Blog::find((int)$id);
        if (!$blog) {
            $response->redirect(url('admin/'));
            return;
        }

        $blog->category_id = $request->input('category_id') ? (int) $request->input('category_id') : null;
        $blog->title = $request->input('title');
        $blog->slug = slugify($request->input('title'));
        $blog->excerpt = $request->input('excerpt');
        $blog->content = $request->input('content');
        $blog->tags = $request->input('tags');
        $blog->meta_title = $request->input('meta_title');
        $blog->meta_description = $request->input('meta_description');
        $blog->status = $request->input('status', 'draft');
        $blog->is_featured = $request->input('is_featured') ? 1 : 0;

        if ($blog->status === 'published' && !$blog->published_at) {
            $blog->published_at = date('Y-m-d H:i:s');
        }

        $blog->save();

        if ($request->hasFile('featured_image')) {
            $file = $request->file('featured_image');
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'blog_' . $blog->id . '_' . time() . '.' . $ext;
            move_uploaded_file($file['tmp_name'], PUBLIC_PATH . '/uploads/blogs/' . $filename);
            $blog->featured_image = $filename;
            $blog->save();
        }

        $_SESSION['success'] = 'Blog updated';
        $response->redirect(url('admin/'));
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $blog = Blog::find((int)$id);
        if ($blog) {
            $blog->delete();
            $_SESSION['success'] = 'Blog deleted';
        }
        $response->back();
    }
}

