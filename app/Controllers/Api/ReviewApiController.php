<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Models\Review;

class ReviewApiController
{
    public function index(Request $request, Response $response, string $productId): void
    {
        $reviews = Review::getApproved((int)$productId);
        $response->json(['success' => true, 'data' => array_map(fn($r) => [
            'id' => $r->id,
            'rating' => (int) $r->rating,
            'title' => $r->title,
            'comment' => $r->comment,
            'user' => ($r->first_name ?? '') . ' ' . ($r->last_name ?? ''),
            'created_at' => $r->created_at
        ], $reviews)]);
    }

    public function store(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $review = new Review([
            'product_id' => (int) ($data['product_id'] ?? 0),
            'user_id' => $_SESSION['user_id'],
            'order_id' => isset($data['order_id']) ? (int) $data['order_id'] : null,
            'rating' => (int) ($data['rating'] ?? 5),
            'title' => $data['title'] ?? '',
            'comment' => $data['comment'] ?? '',
            'status' => 'pending'
        ]);
        $review->save();

        $response->json(['success' => true, 'message' => 'Review submitted']);
    }
}
