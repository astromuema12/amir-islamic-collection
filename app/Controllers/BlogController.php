<?php

namespace App\Controllers;

use App\Config\Request;
use App\Config\Response;
use App\Models\Blog;
use App\Models\BlogCategory;

class BlogController
{
    public function index(Request $request, Response $response): void
    {
        $page = (int)($request->query('page', 1));
        $limit = 9;
        $offset = ($page - 1) * $limit;

        $blogs = Blog::getPublished($limit, $offset);
        $categories = BlogCategory::query("SELECT * FROM blog_categories WHERE status = 'active'");
        $recentBlogs = Blog::recent(5);

        $countStmt = Blog::raw("SELECT COUNT(*) as total FROM blogs WHERE status = 'published'");
        $total = (int) $countStmt->fetch()->total;

        $response->render('Frontend/blog', [
            'page_title' => 'Blog - ' . SITE_NAME,
            'meta_description' => 'Read our latest articles about Islamic products and knowledge',
            'blogs' => $blogs,
            'categories' => $categories,
            'recentBlogs' => $recentBlogs,
            'currentPage' => $page,
            'totalPages' => (int) ceil($total / $limit)
        ]);
    }

    public function show(Request $request, Response $response, string $slug): void
    {
        $blog = Blog::findBy('slug', $slug);
        if (!$blog || $blog->status !== 'published') {
            $response->setStatusCode(404);
            $response->render('Frontend/404');
            return;
        }

        $blog->views_count = ($blog->views_count ?? 0) + 1;
        $blog->save();

        $categories = BlogCategory::query("SELECT * FROM blog_categories WHERE status = 'active'");
        $recentBlogs = Blog::recent(5);

        $response->render('Frontend/blog-detail', [
            'page_title' => $blog->title . ' - ' . SITE_NAME,
            'meta_description' => $blog->meta_description ?: strip_tags(substr($blog->excerpt, 0, 160)),
            'blog' => $blog,
            'categories' => $categories,
            'recentBlogs' => $recentBlogs
        ]);
    }

    public function category(Request $request, Response $response, string $slug): void
    {
        $cat = BlogCategory::findBy('slug', $slug);
        if (!$cat) {
            $response->setStatusCode(404);
            $response->render('Frontend/404');
            return;
        }

        $blogs = Blog::getByCategory($cat->id);
        $categories = BlogCategory::query("SELECT * FROM blog_categories WHERE status = 'active'");
        $recentBlogs = Blog::recent(5);

        $response->render('Frontend/blog', [
            'page_title' => $cat->name . ' - Blog - ' . SITE_NAME,
            'meta_description' => $cat->description ?: 'Articles about ' . $cat->name,
            'blogs' => $blogs,
            'categories' => $categories,
            'recentBlogs' => $recentBlogs,
            'currentCategory' => $cat
        ]);
    }
}
