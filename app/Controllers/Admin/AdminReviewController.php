<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Review;

class AdminReviewController
{
    public function index(Request $request, Response $response): void
    {
        $reviews = Review::query("
            SELECT r.*, p.name as product_name, u.first_name, u.last_name
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        ");
        $response->render('Admin/reviews/index', [
            'page_title' => 'Reviews - Admin',
            'reviews' => $reviews
        ]);
    }

    public function approve(Request $request, Response $response, string $id): void
    {
        $review = Review::find((int)$id);
        if ($review) {
            $review->status = 'approved';
            $review->save();
            $_SESSION['success'] = 'Review approved';
        }
        $response->back();
    }

    public function reject(Request $request, Response $response, string $id): void
    {
        $review = Review::find((int)$id);
        if ($review) {
            $review->status = 'rejected';
            $review->save();
            $_SESSION['success'] = 'Review rejected';
        }
        $response->back();
    }

    public function delete(Request $request, Response $response, string $id): void
    {
        $review = Review::find((int)$id);
        if ($review) {
            $review->delete();
            $_SESSION['success'] = 'Review deleted';
        }
        $response->back();
    }
}
