<?php

namespace App\Controllers\Api;

use App\Config\Request;
use App\Config\Response;
use App\Services\OrderService;
use App\Models\Order;

class OrderApiController
{
    private OrderService $orderService;

    public function __construct()
    {
        $this->orderService = new OrderService();
    }

    public function create(Request $request, Response $response): void
    {
        $data = $request->getJson();
        $result = $this->orderService->createOrder($data);

        if (!$result['success']) {
            $response->json(['error' => $result['message']], 400);
            return;
        }

        $response->json([
            'success' => true,
            'order' => [
                'id' => $result['order']->id,
                'order_number' => $result['order']->order_number,
                'total' => (float) $result['order']->total,
                'status' => $result['order']->status
            ]
        ]);
    }

    public function index(Request $request, Response $response): void
    {
        $userId = $_SESSION['user_id'];
        $orders = $this->orderService->getUserOrders($userId);

        $response->json([
            'success' => true,
            'data' => array_map(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'total' => (float) $o->total,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
                'created_at' => $o->created_at
            ], $orders)
        ]);
    }

    public function show(Request $request, Response $response, string $id): void
    {
        $order = Order::find((int)$id);
        if (!$order || $order->user_id != $_SESSION['user_id']) {
            $response->json(['error' => 'Order not found'], 404);
            return;
        }

        $items = $order->items();

        $response->json([
            'success' => true,
            'data' => [
                'order' => $order->toArray(),
                'items' => array_map(fn($i) => $i->toArray(), $items)
            ]
        ]);
    }
}
