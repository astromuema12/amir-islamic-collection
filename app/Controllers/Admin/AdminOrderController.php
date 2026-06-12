<?php

namespace App\Controllers\Admin;

use App\Config\Request;
use App\Config\Response;
use App\Models\Order;
use App\Services\OrderService;

class AdminOrderController
{
    private OrderService $orderService;

    public function __construct()
    {
        $this->orderService = new OrderService();
    }

    public function index(Request $request, Response $response): void
    {
        $status = $request->query('status', '');
        $page = (int)($request->query('page', 1));
        $limit = 20;
        $offset = ($page - 1) * $limit;

        $sql = "SELECT o.*, u.first_name, u.last_name FROM orders o LEFT JOIN users u ON o.user_id = u.id";
        $countSql = "SELECT COUNT(*) as total FROM orders o";
        $params = [];

        if ($status) {
            $sql .= " WHERE o.status = ?";
            $countSql .= " WHERE o.status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $orders = Order::query($sql, $params);
        $countStmt = Order::raw($countSql, $status ? [$status] : []);
        $total = (int) $countStmt->fetch()->total;

        $response->render('Admin/orders/index', [
            'page_title' => 'Orders - Admin',
            'orders' => $orders,
            'currentPage' => $page,
            'totalPages' => (int) ceil($total / $limit),
            'currentStatus' => $status
        ]);
    }

    public function show(Request $request, Response $response, string $id): void
    {
        $order = Order::find((int)$id);
        if (!$order) {
            $_SESSION['error'] = 'Order not found';
            $response->redirect(url('admin/'));
            return;
        }

        $items = $order->items();
        $statusHistory = $order->statusHistory();

        $response->render('Admin/orders/show', [
            'page_title' => 'Order #' . $order->order_number,
            'order' => $order,
            'items' => $items,
            'statusHistory' => $statusHistory
        ]);
    }

    public function updateStatus(Request $request, Response $response, string $id): void
    {
        $status = $request->input('status');
        $comment = $request->input('comment', '');

        $result = $this->orderService->updateOrderStatus((int)$id, $status, $comment);

        if ($result['success']) {
            $_SESSION['success'] = $result['message'];
        } else {
            $_SESSION['error'] = $result['message'];
        }

        $response->back();
    }
}

